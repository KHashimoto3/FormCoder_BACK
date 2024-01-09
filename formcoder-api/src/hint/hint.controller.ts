import { HttpService } from '@nestjs/axios';
import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { HintService } from './hint.service';
import { HintData } from 'src/type/hintData';

@Controller('hint')
export class HintController {
  constructor(
    private readonly httpService: HttpService,
    private readonly hintService: HintService,
  ) {}

  //cloud storageからヒントデータをpullする
  @Get('/')
  pullHintData(): Promise<{ hintData: HintData[] }> {
    return this.hintService.pullHintData();
  }
}
