import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class FormService {
  private storage: Storage;
  constructor() {
    this.storage = new Storage({
      projectId: 'formcoder-314006',
      keyFilename: './formcoder-77286-6a6bb007cb25.json',
    });
  }
  private bucketName = 'formcoder-77286.appspot.com';
  getHello(): { message: string } {
    return { message: 'Hello World!' };
  }

  //cloud storageにテストデータをpushする
  dataPushTest(): Promise<{ message: string }> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file('push-test.json');
      const data = {
        name: 'test',
      };
      return new Promise<{ message: string }>((resolve, reject) => {
        file.save(JSON.stringify(data), (err) => {
          console.log('テストデータの保存を実行します');
          if (err) {
            console.log('テストデータの保存に失敗しました');
            const errMessage =
              'プッシュ時にエラーが発生しました！' + err.message;
            reject(new Error(errMessage));
          } else {
            console.log('テストデータの保存に成功しました');
            resolve({ message: 'プッシュに成功しました！' });
          }
        });
      });
    } catch (error) {
      console.log('何らかのエラーが発生しました。');
      const errMessage = '何らかのエラーが発生しました。' + error.message;
      return Promise.reject<{ message: string }>({ message: errMessage });
    }
  }
}
