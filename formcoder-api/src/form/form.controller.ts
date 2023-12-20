import { HttpService } from '@nestjs/axios';
import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';

@Controller('form')
export class FormController {
  constructor(private readonly httpService: HttpService) {}

  @Get('hello')
  getHello(): { message: string } {
    return { message: 'Hello World!' };
  }
}
