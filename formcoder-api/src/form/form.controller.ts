import { HttpService } from '@nestjs/axios';
import { Controller, Put, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { FormService } from './form.service';

import { CodingFormData } from '../type/formData';
import { FormList } from 'src/type/formList';

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
  ): Promise<{ formData: CodingFormData[] }> {
    return this.formService.pullFormData(formName);
  }

  //cloud firestoreからフォームリストをpullする
  @Get('/list')
  pullFormList(): Promise<{ formList: FormList[] }> {
    return this.formService.pullFormList();
  }

  @Get('hello')
  getHello(): { message: string } {
    return this.formService.getHello();
  }

  //ここから下はテスト用のAPI--------------------------------------------------------------
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

  //cloud firestoreにテストデータをpushする
  @Get('firestore-push-test')
  firestorePushTest(): any {
    return this.formService.firestorePushTest();
  }
}
