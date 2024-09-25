import { HttpException, Injectable } from '@nestjs/common';

import * as fs from 'fs';
import { exec } from 'child_process';

@Injectable()
export class CodeFormatterService {
  getHello(): { message: string } {
    return { message: 'Hello code-formatter-service!' };
  }

  async formatCode(code: string): Promise<{ result: string }> {
    const tempFilePath = 'temp.c';
    fs.writeFileSync(tempFilePath, code);

    //clang-formatを使ってコードを整形する
    const formatCommand = `clang-format -style=LLVM ${tempFilePath}`;
    return new Promise((resolve, reject) => {
      exec(formatCommand, (error, stdout, stderr) => {
        if (error) {
          reject(
            new HttpException(
              {
                status: 500,
                error: 'Internal Server Error',
                message: stderr,
              },
              500,
            ),
          );
        }
        //fs.unlinkSync(tempFilePath);
        resolve({ result: stdout });
      });
    });
  }
}
