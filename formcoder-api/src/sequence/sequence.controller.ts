import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post } from '@nestjs/common';
import { SequenceService } from './sequence.service';

@Controller('sequence')
export class SequenceController {
  constructor(
    private readonly httpService: HttpService,
    private readonly sequenceService: SequenceService,
  ) {}

  @Get('/hello')
  hello(): { message: string } {
    return this.sequenceService.hello();
  }
}
