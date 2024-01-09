import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
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
      return new Promise<{ hintData: HintData[]; error: null }>(
        (resolve, reject) => {
          file.download((err, contents) => {
            if (err) {
              const errMessage = 'プル時にエラーが発生しました！' + err.message;
              reject(new Error(errMessage));
            } else {
              const recievedData = JSON.parse(contents.toString());
              const hintData: HintData[] = recievedData.hintData;
              resolve({ hintData: hintData, error: null });
            }
          });
        },
      );
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。' + error.message;
      return Promise.reject<{ hintData: null; error: string }>({
        hintData: null,
        error: errMessage,
      });
    }
  }
}
