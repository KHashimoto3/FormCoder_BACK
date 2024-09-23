import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeFormatterService {
  getHello(): { message: string } {
    return { message: 'Hello code-formatter-service!' };
  }
}
