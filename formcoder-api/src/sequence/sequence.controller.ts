import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import { AnalyzeSeqIntervalInputDto } from 'src/dto/analyzeSeqIntervalInput.dto';
import { AnalyzeSeqIntervalResult } from 'src/type/analyzeSeqIntervalResult';

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

  @Post('/analyze/interval')
  analyzeWithInterval(
    @Body() analyzeSeqIntInputDto: AnalyzeSeqIntervalInputDto,
  ): { analyzeResultList: AnalyzeSeqIntervalResult[] } {
    const analyzeResultList = this.sequenceService.analyzeWithInterval(
      analyzeSeqIntInputDto.intervalTime,
      analyzeSeqIntInputDto.sequence,
    );
    return { analyzeResultList: analyzeResultList };
  }
}
