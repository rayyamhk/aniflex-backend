import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateExistencePipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException('Validation failed (Something is missing)');
    }
    return value;
  }
}
