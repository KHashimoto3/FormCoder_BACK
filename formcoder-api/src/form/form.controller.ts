import { HttpService } from '@nestjs/axios';
import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(
    private readonly httpService: HttpService,
    private readonly formService: FormService,
  ) {}

  @Get('hello')
  getHello(): { message: string } {
    return this.formService.getHello();
  }

  @Get('data-push-test')
  dataPushTest() {
    try {
      const result = this.formService.dataPushTest();
      return result;
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。' + error.message;
      return { message: errMessage };
    }
  }
}
