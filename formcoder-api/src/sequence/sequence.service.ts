import { Injectable } from '@nestjs/common';

@Injectable()
export class SequenceService {
  hello(): { message: string } {
    return { message: 'Hello sequence service!' };
  }
}
