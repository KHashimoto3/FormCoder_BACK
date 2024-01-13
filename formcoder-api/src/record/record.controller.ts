import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
  constructor(
    private readonly httpService: HttpService,
    private readonly recordService: RecordService,
  ) {}

  @Get('/hello')
  getHello(): { message: string } {
    return this.recordService.hello();
  }
}
