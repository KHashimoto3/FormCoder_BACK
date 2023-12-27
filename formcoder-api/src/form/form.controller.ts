import { HttpService } from '@nestjs/axios';
import { Controller, Put, Query } from '@nestjs/common';
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

  //cloud storageにフォームデータをpushする
  @Put('/')
  pushFormData(): Promise<{ message: string }> {
    return this.formService.pushFormData();
  }

  //cloud storageからフォームデータをpullする
  @Get('/')
  pullFormData(
    @Query('formName') formName: string,
  ): Promise<{ formData: FormData[] | string }> {
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
