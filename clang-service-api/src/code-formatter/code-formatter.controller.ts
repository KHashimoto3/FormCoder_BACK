import { Body, Controller, Get, Post } from '@nestjs/common';
import { CodeFormatterService } from './code-formatter.service';

@Controller('code-formatter')
export class CodeFormatterController {
  constructor(private readonly codeFormatterService: CodeFormatterService) {}

  @Get()
  getHello(): { message: string } {
    return this.codeFormatterService.getHello();
  }

  @Post()
  formatCode(@Body() body: { code: string }): Promise<{ result: string }> {
    return this.codeFormatterService.formatCode(body.code);
  }
}
