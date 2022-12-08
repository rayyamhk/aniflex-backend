import { Inject, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  ObjectIdentifier,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BUCKET_NAME } from '../../constants';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly REGION = process.env.REGION || 'us-east-2';

  constructor(@Inject(BUCKET_NAME) private readonly bucketName: string) {
    this.s3Client = new S3Client({ region: this.REGION });
  }

  async get(key: string) {
    try {
      const res = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
      return res.Body as any;
    } catch (err) {
      return null;
    }
  }

  async put(key: string, buffer: Buffer, mimeType: string) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );
  }

  async delete(key: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  async deleteDir(dirName: string) {
    const deletedObjects: ObjectIdentifier[] = [];
    let res: ListObjectsV2CommandOutput;

    // List operations at most retrieve 1000 objects.
    do {
      res = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: `${dirName}/`,
          ContinuationToken: res?.NextContinuationToken,
        }),
      );
      if (!res.Contents || res.Contents.length === 0) break;
      res.Contents.forEach((content) => {
        deletedObjects.push({ Key: content.Key });
      });
    } while (res.IsTruncated);

    if (deletedObjects.length === 0) return;
    await this.s3Client.send(
      new DeleteObjectsCommand({
        Bucket: this.bucketName,
        Delete: {
          Objects: deletedObjects,
        },
      }),
    );
  }
}
