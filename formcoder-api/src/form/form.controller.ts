import { HttpService } from '@nestjs/axios';
import { Controller, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { FormService } from './form.service';

type FormData = {
  id: number;
  partType: string;
  explanation: string;
  childrenPart: string | FormData[];
  inputIdx: number;
};

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

  //cloud storageにフォームデータをpushする
  @Get('push-form-data')
  pushFormData(): Promise<{ message: string }> {
    return this.formService.pushFormData();
  }

  //cloud storageからフォームデータをpullする
  @Get('pull-form-data')
  pullFormData(
    @Query('formName') formName: string,
  ): Promise<{ formData: FormData[] | string }> {
    return this.formService.pullFormData(formName);
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
