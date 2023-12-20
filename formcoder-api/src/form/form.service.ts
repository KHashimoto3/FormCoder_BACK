import { Injectable } from '@nestjs/common';

@Injectable()
export class FormService {
  getHello(): string {
    return 'Hello World!';
  }
}
