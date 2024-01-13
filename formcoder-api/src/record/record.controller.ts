import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query } from '@nestjs/common';
import { RecordService } from './record.service';
import { TmpData } from 'src/type/tmpData';

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

  @Get('/tmp')
  pullAnswerTemplate(
    @Query('formName') formName: string,
  ): Promise<{ tmpData: TmpData[] }> {
    return this.recordService.pullAnswerTemplate(formName);
  }
}
