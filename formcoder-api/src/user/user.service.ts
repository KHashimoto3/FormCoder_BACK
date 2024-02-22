import { Firestore } from '@google-cloud/firestore';
import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/type/user';
import { createHash } from 'crypto';

@Injectable()
export class UserService {
  private firestore: Firestore;
  constructor() {
    this.firestore = new Firestore({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      databaseId: 'form-hint-db',
    });
  }

  //ユーザー情報をcloud firestoreにpushする
  registUser(): Promise<{ message: string }> {
    const pass = 'test151';
    const hash = createHash('sha256');
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const finalLoginAt = new Date().toISOString();
    hash.update(pass);
    try {
      const data: User = {
        userId: 'test',
        name: 'test',
        password: hash.digest('hex'),
        icon: 'test',
        email: 'test@sample.com',
        createdAt: createdAt,
        updatedAt: updatedAt,
        finalLoginAt: finalLoginAt,
        deleteFlag: false,
      };

      const userRef = this.firestore.collection('user').doc(data.userId);
      return new Promise<{ message: string }>((resolve, reject) => {
        userRef
          .set(data)
          .then(() => {
            resolve({ message: 'ユーザー情報を登録しました。' });
          })
          .catch((error) => {
            console.log(error.message);
            reject(new HttpException('登録時にエラーが発生しました。', 500));
          });
      });
    } catch (error) {
      console.log(error.message);
      throw new HttpException('何らかのエラーが発生しました。', 500);
    }
  }
}
