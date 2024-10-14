import { Body, Get, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Controller } from '@nestjs/common';
import { ProgrammService } from './programm.service';
import { ErrorResulveMethod } from 'src/type/errorResulveMethod';
import { ErrorResulveInputDto } from '../dto/errorResulveInput.dto';
import { ExecResult } from 'src/type/execResult';
import { ExecError } from 'src/type/execError';
import { execInputDto } from '../dto/execInput.dto';
import { ConnectCodeInputDto } from '../dto/connectCodeInput.dto';
import { ConnectedCode } from 'src/type/connectedCode';

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

  @Post('exec-result')
  async execProgramm(
    @Body() execInputDto: execInputDto,
  ): Promise<ExecResult | ExecError> {
    const code = execInputDto.code;
    const input = execInputDto.input;
    return this.programmService.execProgramm(code, input);
  }

  @Post('error/resolve')
  getErrorResolve(
    @Body() errorResulveInputDto: ErrorResulveInputDto,
  ): ErrorResulveMethod[] {
    return this.programmService.getErrorResolve(errorResulveInputDto.errors);
  }
  @Post('connected-code')
  getConnectedCode(
    @Body() connectCodeInputDto: ConnectCodeInputDto,
  ): ConnectedCode {
    return this.programmService.getConnectedCode(
      connectCodeInputDto.formData,
      connectCodeInputDto.inputData,
    );
  }
}
