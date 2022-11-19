import { Inject, Injectable } from '@nestjs/common';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly REGION = process.env.REGION || 'us-east-2';

  constructor(@Inject('BUCKET_NAME') private readonly bucketName: string) {
    this.s3Client = new S3Client({ region: this.REGION });
  }

  async get(key: string) {
    try {
      const res = await this.s3Client.send(new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }));
      return res.Body as any;
    } catch (err) {
      return null;
    }
  }

  async put(key: string, obj: Express.Multer.File, cacheControl?: string) {
    try {
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: obj.buffer,
        ContentType: obj.mimetype,
        CacheControl: cacheControl,
      }));
    } catch (err) {
    }
  }

  async delete(key: string) {
    try {
      await this.s3Client.send(new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }));
    } catch (err) {
    }
  }
}