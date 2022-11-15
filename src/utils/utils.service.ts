import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  formatResponse(message: any, data?: any) {
    return {
      status: 'success',
      message,
      data: data || {},
    };
  }
}
