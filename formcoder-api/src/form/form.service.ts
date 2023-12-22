import { Injectable } from '@nestjs/common';

@Injectable()
export class FormService {
  getHello(): { message: string } {
    return { message: 'Hello World!' };
  }
}
