import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { IMAGE_KEY_REGEX } from '../../../constants';

@Injectable()
export class ValidateKeyPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('Image key is required.');
    }
    if (!IMAGE_KEY_REGEX.test(value)) {
      throw new BadRequestException('Image key must be a hex with length 16.');
    }
    return value;
  }
}