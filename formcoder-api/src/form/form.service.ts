import * as dotenv from 'dotenv';
import { HttpException, Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Firestore } from '@google-cloud/firestore';

import { CodingFormData } from '../type/formData';
import { FormList } from 'src/type/formList';
import { Question } from 'src/type/question';

dotenv.config();

@Injectable()
export class FormService {
  private storage: Storage;
  private firestore: Firestore;
  constructor() {
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
    this.firestore = new Firestore({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      databaseId: 'form-hint-db',
    });
  }
  private bucketName = process.env.BUCKET_NAME;
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
  pullFormData(formName: string): Promise<{ formData: CodingFormData[] }> {
    if (formName === undefined) {
      const errMessage = 'パラメータformNameは必須です。';
      throw new HttpException(errMessage, 400);
    }
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file('form/' + formName + '.json');
      return new Promise<{ formData: CodingFormData[] }>((resolve, reject) => {
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
            const formData: CodingFormData[] = recievedData.formData;
            resolve({ formData: formData });
          }
        });
      });
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。';
      console.log(error.message);
      throw new HttpException(errMessage, 500);
    }
  }

  //cloud firestoreからフォームリストをpullする
  pullFormList(): Promise<{ formList: FormList[] }> {
    try {
      const docRef = this.firestore.collection('form-list').orderBy('id');
      return new Promise<{ formList: FormList[] }>((resolve, reject) => {
        docRef
          .get()
          .then((snapshot) => {
            const formList: FormList[] = [];
            snapshot.forEach((doc) => {
              const form = {
                id: doc.id,
                title: doc.data().title,
                description: doc.data().description,
                url: doc.data().url,
                explanation: doc.data().explanation,
                inputExample: doc.data().inputExample,
                outputExample: doc.data().outputExample,
              };
              formList.push(form);
            });
            if (formList.length === 0) {
              const errMessage = 'フォームリストが空です。';
              reject(new HttpException(errMessage, 404));
            }
            resolve({ formList: formList });
          })
          .catch((err) => {
            const errMessage = 'プル時にエラーが発生しました！';
            console.log(err.message);
            reject(new HttpException(errMessage, 500));
          });
      });
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。';
      console.log(error.message);
      throw new HttpException(errMessage, 500);
    }
  }

  //cloud firestoreから指定されたフォームIDの問題データをpullする
  pullQuestionData(formId: string): Promise<{ questionData: Question }> {
    try {
      const docRef = this.firestore.collection('form-list').doc(formId);
      return new Promise<{ questionData: Question }>((resolve, reject) => {
        docRef
          .get()
          .then((doc) => {
            if (!doc.exists) {
              const errMessage =
                '指定されたフォームIDのデータが見つかりません。';
              reject(new HttpException(errMessage, 404));
            }
            const questionData: Question = {
              id: doc.id,
              title: doc.data().title,
              explanation: doc.data().explanation,
              inputExample: doc.data().inputExample,
              outputExample: doc.data().outputExample,
            };
            resolve({ questionData: questionData });
          })
          .catch((err) => {
            const errMessage = 'プル時にエラーが発生しました！';
            console.log(err.message);
            reject(new HttpException(errMessage, 500));
          });
      });
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。';
      console.log(error.message);
      throw new HttpException(errMessage, 500);
    }
  }

  //ここから下はテスト用の関数----------------------------------------------
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

  //Firesotreにテストデータをpushする
  firestorePushTest(): Promise<{ message: string }> {
    try {
      const docRef = this.firestore.collection('test').doc('test2');

      const data = {
        name: 'test',
        text: 'これはテストです',
      };

      return new Promise<{ message: string }>((resolve, reject) => {
        docRef
          .set(data)
          .then(() => {
            resolve({ message: 'プッシュに成功しました！' });
          })
          .catch((err) => {
            console.log('詳細なエラー: ' + err);
            const errMessage =
              'プッシュ時にエラーが発生しました！' + err.message;
            reject(new Error(errMessage));
          });
      });
    } catch (error) {
      console.log('詳細なエラー: ' + error);
      const errMessage = '何らかのエラーが発生しました。' + error.message;
      return Promise.reject<{ message: string }>({ message: errMessage });
    }
  }
}
