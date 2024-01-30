import { Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Controller } from '@nestjs/common';
import { ProgrammService } from './programm.service';

@Controller('programm')
export class ProgrammController {
  constructor(
    private readonly httpService: HttpService,
    private readonly programmService: ProgrammService,
  ) {}

  @Get('hello')
  hello(): { message: string } {
    return this.programmService.hello();
  }
}
