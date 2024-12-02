import * as dotenv from 'dotenv';
import { HttpException, Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import { TmpData } from 'src/type/tmpData';
import { RecordInputDto } from '../dto/recordInput.dto';
import { RecordData } from 'src/type/recordData';

dotenv.config();

@Injectable()
export class RecordService {
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

  private backetName = process.env.BUCKET_NAME;

  hello(): { message: string } {
    return { message: 'Hello record service!' };
  }

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
  pushAnswerData(
    recordInputDto: RecordInputDto,
  ): Promise<{ message: string; recordId: string }> {
    if (recordInputDto === undefined) {
      const errMessage = '必要なデータが渡されていません。';
      throw new HttpException(errMessage, 400);
    }
    try {
      const bucket = this.storage.bucket(this.backetName);
      //現在の日時を取得
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const timestamp = `${year}-${month}-${date}_${hours}:${minutes}:${seconds}`;
      const fileName =
        recordInputDto.userId +
        '_' +
        recordInputDto.formId +
        '_' +
        timestamp +
        '.json';
      const file = bucket.file('record/anyone/' + fileName);
      const data = {
        recordData: {
          userId: recordInputDto.userId,
          formId: recordInputDto.formId,
          fbData: recordInputDto.fbData,
          inputData: recordInputDto.inputData,
          connectedCode: recordInputDto.connectedCode,
          sequence: recordInputDto.sequence,
          seqAnalyze: recordInputDto.seqAnalyze,
        },
      };
      //firestoreに、記録データを保存
      const recordRef = this.firestore.collection('learn-record').doc();
      const generateId = recordRef.id;
      const learnRecordData = {
        userId: recordInputDto.userId,
        recordFileName: fileName,
        createdAt: timestamp,
        memo: '',
      };
      return new Promise<{ message: string; recordId: string }>(
        (resolve, reject) => {
          file.save(JSON.stringify(data), (err) => {
            if (err) {
              const errMessage = 'アップロード中にエラーが発生しました！';
              console.log(err.message);
              reject(new HttpException(errMessage, 500));
            } else {
              recordRef
                .set(learnRecordData)
                .then(() => {
                  resolve({
                    message: 'アップロードに成功しました。',
                    recordId: generateId,
                  });
                })
                .catch((error) => {
                  console.log(error.message);
                  reject(
                    new HttpException('記録データの保存に失敗しました。', 500),
                  );
                });
            }
          });
        },
      );
    } catch (error) {
      const errMessage = '何らかのエラーが発生しました。';
      console.log(error.message);
      throw new HttpException(errMessage, 500);
    }
  }

  //cloud storageから、指定されたIDの解答データをpullする
  pullAnswerData(recordId: string): Promise<{ recordData: RecordData }> {
    if (recordId === undefined) {
      const errMessage = 'パラメータrecordIdは必須です。';
      throw new HttpException(errMessage, 400);
    }

    try {
      //firestoreから、指定されたIDのデータを取得
      const recordRef = this.firestore.collection('learn-record').doc(recordId);
      return new Promise<{ recordData: RecordData }>((resolve, reject) => {
        recordRef.get().then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            const bucket = this.storage.bucket(this.backetName);
            const file = bucket.file('record/anyone/' + data.recordFileName);
            file.download((err, contents) => {
              if (err) {
                //ファイルが見つからなかった場合
                if (err.message.includes('No such object')) {
                  const errMessage =
                    '指定されたIDの記録データ(JSON)が見つかりません。';
                  console.log(err.message);
                  reject(new HttpException(errMessage, 404));
                }
                const errMessage = 'プル時にエラーが発生しました！';
                console.log(err.message);
                reject(new HttpException(errMessage, 500));
              } else {
                const recievedData = JSON.parse(contents.toString());
                const recordData = recievedData.recordData;
                resolve({ recordData: recordData });
              }
            });
          } else {
            //cloud firestoreにデータが見つからなかった場合
            const errMessage = '指定されたIDの記録データが見つかりません。';
            console.log(errMessage);
            reject(new HttpException(errMessage, 404));
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
