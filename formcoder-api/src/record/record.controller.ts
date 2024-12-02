import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RecordService } from './record.service';
import { TmpData } from 'src/type/tmpData';
import { RecordInputDto } from '../dto/recordInput.dto';
import { RecordData } from 'src/type/recordData';

@Controller('record')
export class RecordController {
  constructor(
    private readonly httpService: HttpService,
    private readonly recordService: RecordService,
  ) {}

  @Get('/')
  getAnswerData(
    @Query('recordId') recordId: string,
  ): Promise<{ recordData: RecordData }> {
    return this.recordService.pullAnswerData(recordId);
  }

  @Post('/')
  pushAnswerData(
    @Body() recordInputDto: RecordInputDto,
  ): Promise<{ message: string; recordId: string }> {
    return this.recordService.pushAnswerData(recordInputDto);
  }

  @Get('/hello')
  hello(): { message: string } {
    return this.recordService.hello();
  }

  @Get('/tmp')
  pullAnswerTemplate(
    @Query('formName') formName: string,
  ): Promise<{ tmpData: TmpData[] }> {
    return this.recordService.pullAnswerTemplate(formName);
  }
}
