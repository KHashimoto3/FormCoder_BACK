import * as dotenv from 'dotenv';
import { HttpException, Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { TmpData } from 'src/type/tmpData';
import { RecordInputDto } from 'src/dto/recordInput.dto';

dotenv.config();

@Injectable()
export class RecordService {
  private storage: Storage;
  constructor() {
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
  }

  private backetName = process.env.BUCKET_NAME;

  //cloud storageから、解答用のテンプレートをpullする
  pullAnswerTemplate(formName: string): Promise<{ tmpData: TmpData[] }> {
    if (formName === undefined) {
      const errMessage = 'パラメータformNameは必須です。';
      throw new HttpException(errMessage, 400);
    }
    try {
      const bucket = this.storage.bucket(this.backetName);
      const file = bucket.file('record/template/' + formName + '_tmp.json');
      return new Promise<{ tmpData: TmpData[] }>((resolve, reject) => {
        file.download((err, contents) => {
          if (err) {
            //ファイルが見つからなかった場合
            if (err.message.includes('No such object')) {
              const errMessage =
                '指定されたフォーム名の回答テンプレートが見つかりません。';
              console.log(err.message);
              reject(new HttpException(errMessage, 404));
            }
            const errMessage = 'プル時にエラーが発生しました！';
            console.log(err.message);
            reject(new HttpException(errMessage, 500));
          } else {
            const recievedData = JSON.parse(contents.toString());
            const tmpData: TmpData[] = recievedData.tmpData;
            resolve({ tmpData: tmpData });
          }
        });
      });
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。';
      console.log(error.message);
      throw new HttpException(errMessage, 500);
    }
  }

  //cloud storageに、解答データをpushする
  pushAnswerData(recordInputDto: RecordInputDto): Promise<{ message: string }> {
    if (recordInputDto === undefined) {
      const errMessage = '必要なデータが渡されていません。';
      throw new HttpException(errMessage, 400);
    }
    try {
      const bucket = this.storage.bucket(this.backetName);
      const file = bucket.file(
        'record/anyone/' +
          recordInputDto.userId +
          '_' +
          recordInputDto.formId +
          '.json',
      );
      const data = {
        recordData: {
          fbData: recordInputDto.fbData,
          inputData: recordInputDto.inputData,
          connectedCode: recordInputDto.connectedCode,
        },
      };
      return new Promise<{ message: string }>((resolve, reject) => {
        file.save(JSON.stringify(data), (err) => {
          if (err) {
            const errMessage = 'アップロード中にエラーが発生しました！';
            console.log(err.message);
            reject(new HttpException(errMessage, 500));
          } else {
            resolve({ message: 'アップロードに成功しました。' });
          }
        });
      });
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。';
      console.log(error.message);
      throw new HttpException(errMessage, 500);
    }
  }
}
