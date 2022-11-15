import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }
    value = Number(value);
    if (!Number.isInteger(value) || value <= 0) {
      throw new BadRequestException(
        'Validation failed (positive integer is expected)',
      );
    }
    return value;
  }
}
