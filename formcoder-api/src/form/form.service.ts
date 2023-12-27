import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

import { CodingFormData } from '../type/formData';

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

  //フォームデータをcloud storageにpushする
  pushFormData(): Promise<{ message: string }> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file('form/sample-form-data.json');
      const formData: CodingFormData[] = [
        {
          id: 1,
          partType: 'STATIC',
          explanation: '#include <stdio.h>\n#include <string.h>',
          childrenPart: 'none',
          inputIdx: 0,
        },
        {
          id: 2,
          partType: 'MAIN',
          explanation: 'パートの解説',
          childrenPart: [
            {
              id: 21,
              partType: 'STATIC',
              explanation: 'char str1[MAXSIZE], str2[MAXSIZE];',
              childrenPart: 'none',
              inputIdx: 2,
            },
          ],
          inputIdx: 0,
        },
      ];
      const data = {
        formData: formData,
      };
      return new Promise<{ message: string }>((resolve, reject) => {
        file.save(JSON.stringify(data), (err) => {
          if (err) {
            const errMessage =
              'プッシュ時にエラーが発生しました！' + err.message;
            reject(new Error(errMessage));
          } else {
            resolve({ message: 'プッシュに成功しました！' });
          }
        });
      });
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。' + error.message;
      return Promise.reject<{ message: string }>({ message: errMessage });
    }
  }

  //cloud storageから、指定された名前のフォームデータをpullする
  pullFormData(
    formName: string,
  ): Promise<{ formData: CodingFormData[] | string }> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file('form/' + formName + '.json');
      return new Promise<{ formData: CodingFormData[]; error: string }>(
        (resolve, reject) => {
          file.download((err, contents) => {
            if (err) {
              const errMessage = 'プル時にエラーが発生しました！' + err.message;
              reject(new Error(errMessage));
            } else {
              const recievedData = JSON.parse(contents.toString());
              const formData: CodingFormData[] = recievedData.formData;
              resolve({ formData: formData, error: null });
            }
          });
        },
      );
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。' + error.message;
      return Promise.reject<{ formData: CodingFormData[] }>({
        formData: null,
        error: errMessage,
      });
    }
  }

  //cloud storageにテストデータをpushする
  dataPushTest(): Promise<{ message: string }> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file('push-test/push-test.json');
      const data = {
        name: 'test',
      };
      return new Promise<{ message: string }>((resolve, reject) => {
        file.save(JSON.stringify(data), (err) => {
          if (err) {
            const errMessage =
              'プッシュ時にエラーが発生しました！' + err.message;
            reject(new Error(errMessage));
          } else {
            resolve({ message: 'プッシュに成功しました！' });
          }
        });
      });
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。' + error.message;
      return Promise.reject<{ message: string }>({ message: errMessage });
    }
  }

  //cloud storageからテストデータをpullする
  dataPullTest(): Promise<{ message: string }> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file('push-test/push-test.json');
      return new Promise<{ message: string }>((resolve, reject) => {
        file.download((err, contents) => {
          if (err) {
            const errMessage = 'プル時にエラーが発生しました！' + err.message;
            reject(new Error(errMessage));
          } else {
            console.log('ダウンロードしたコンテンツ：' + contents.toString());
            resolve({ message: 'プルに成功しました！' });
          }
        });
      });
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。' + error.message;
      return Promise.reject<{ message: string }>({ message: errMessage });
    }
  }
}
