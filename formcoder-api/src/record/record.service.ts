import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

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
}
