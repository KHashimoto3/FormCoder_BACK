import * as dotenv from 'dotenv';
import { HttpException, Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { HintData } from 'src/type/hintData';

dotenv.config();

@Injectable()
export class HintService {
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

  private bucketName = process.env.BUCKET_NAME;

  //cloud storageからヒントデータをpullする
  pullHintData(): Promise<{ hintData: HintData[] }> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file('hint/hintData.json');
      return new Promise<{ hintData: HintData[] }>((resolve, reject) => {
        file.download((err, contents) => {
          if (err) {
            //ファイルが見つからなかった場合
            if (err.message.includes('No such object')) {
              const errMessage = 'ヒントデータが見つかりません。';
              console.log(errMessage);
              reject(new HttpException(errMessage, 404));
            }
            const errMessage = 'プル時にエラーが発生しました！';
            console.log(err.message);
            reject(new HttpException(errMessage, 500));
          } else {
            const recievedData = JSON.parse(contents.toString());
            const hintData: HintData[] = recievedData.hintData;
            resolve({ hintData: hintData });
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
