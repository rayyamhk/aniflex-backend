import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { VIDEO_CHUNK_NAME } from '../../../constants';

@Injectable()
export class ValidateChunkNamePipe implements PipeTransform {
  transform(value: any) {
    if (
      typeof value !== 'string' ||
      value === '' ||
      !VIDEO_CHUNK_NAME.test(value)
    ) {
      throw new BadRequestException(
        'Validation failed (invalid chunk file name)',
      );
    }
    return value;
  }
}
