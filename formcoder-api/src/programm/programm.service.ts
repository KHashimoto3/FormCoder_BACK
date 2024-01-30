import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgrammService {
  hello(): { message: string } {
    return { message: 'hello programm api!' };
  }
}
