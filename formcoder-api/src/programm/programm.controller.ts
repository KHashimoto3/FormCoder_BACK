import { Body, Get, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Controller } from '@nestjs/common';
import { ProgrammService } from './programm.service';
import { ErrorResulveMethod } from 'src/type/errorResulveMethod';
import { ErrorResulveInputDto } from 'src/dto/errorResulveInput.dto';

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

  @Post('error/resolve')
  getErrorResolve(
    @Body() errorResulveInputDto: ErrorResulveInputDto,
  ): ErrorResulveMethod[] {
    return this.programmService.getErrorResolve(errorResulveInputDto.errors);
  }
}
