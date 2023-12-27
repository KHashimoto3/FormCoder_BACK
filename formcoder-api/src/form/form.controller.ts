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

  //cloud storageにテストデータをpushする
  @Get('data-push-test')
  dataPushTest(): any {
    return this.formService.dataPushTest();
  }

  //cloud storageからテストデータをpullする
  @Get('data-pull-test')
  dataPullTest(): any {
    return this.formService.dataPullTest();
  }
}
