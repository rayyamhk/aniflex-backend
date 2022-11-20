import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MEDIA_KEY_REGEX } from '../constants';

@Injectable()
export class ValidateKeyPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('Media key is required.');
    }
    if (!MEDIA_KEY_REGEX.test(value)) {
      throw new BadRequestException('Media key must be a hex with length 16.');
    }
    return value;
  }
}
