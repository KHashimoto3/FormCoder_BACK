import * as dotenv from 'dotenv';
import { HttpException, Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { TmpData } from 'src/type/tmpData';

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

  //テスト用のhello関数
  hello(): { message: string } {
    return { message: 'Hello World!' };
  }

  //cloud storageから、解答用のテンプレートをpullする
  pullAnswerTemplate(formName: string): Promise<{ tmpData: TmpData[] }> {
    if (formName === undefined) {
      const errMessage = 'パラメータformNameは必須です。';
      throw new HttpException(errMessage, 400);
    }
    try {
      const bucket = this.storage.bucket(this.backetName);
      const file = bucket.file('form/' + formName + '_tmp.json');
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
}
