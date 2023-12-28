import { HttpService } from '@nestjs/axios';
import { Controller, Put, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { FormService } from './form.service';

import { CodingFormData } from '../type/formData';

@Controller('form')
export class FormController {
  constructor(
    private readonly httpService: HttpService,
    private readonly formService: FormService,
  ) {}

  //cloud storageにフォームデータをpushする(TODO: まだ自由なフォームデータをpushできないため、実装する必要がある)
  @Put('/')
  pushFormData(): Promise<{ message: string }> {
    return this.formService.pushFormData();
  }

  //cloud storageからフォームデータをpullする
  @Get('/')
  pullFormData(
    @Query('formName') formName: string,
  ): Promise<{ formData: CodingFormData[] | string }> {
    return this.formService.pullFormData(formName);
  }

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
