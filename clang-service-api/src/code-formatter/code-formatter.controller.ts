import { Controller, Get } from '@nestjs/common';
import { CodeFormatterService } from './code-formatter.service';

@Controller('code-formatter')
export class CodeFormatterController {
  constructor(private readonly codeFormatterService: CodeFormatterService) {}

  @Get()
  getHello(): { message: string } {
    return this.codeFormatterService.getHello();
  }
}
