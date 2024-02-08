import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { ErrorResulveMethod } from 'src/type/errorResulveMethod';
import { ErrorResulveTable } from 'src/type/errorResulveTable';
import { WandboxOutput } from 'src/type/wandboxOutput';
import { ExecResult } from 'src/type/execResult';
import { ExecError } from 'src/type/execError';
import { CodingFormData } from 'src/type/formData';
import { InputData } from 'src/type/inputData';
import { ConnectTemplate } from 'src/type/connectTemplate';

@Injectable()
export class ProgrammService {
  constructor(private readonly httpService: HttpService) {}
  hello(): { message: string } {
    return { message: 'hello programm api!' };
  }

  async execProgramm(
    code: string,
    input: string,
  ): Promise<ExecResult | ExecError> {
    let bodyData;
    if (input == 'none') {
      bodyData = {
        code: code,
        options: 'warning,gnu++1y',
        compiler: 'gcc-13.2.0-c',
        'compiler-option-raw': '-Dx=hogefuga\n-O3',
      };
    } else {
      bodyData = {
        code: code,
        stdin: input,
        options: 'warning,gnu++1y',
        compiler: 'gcc-13.2.0-c',
        'compiler-option-raw': '-Dx=hogefuga\n-O3',
      };
    }

    const url = 'https://wandbox.org/api/compile.json';
    const bodyObj = JSON.stringify(bodyData);
    let result: WandboxOutput;

    try {
      result = await lastValueFrom(
        this.httpService
          .post(url, bodyObj)
          .pipe(map((response) => response.data)),
      );
    } catch (e) {
      console.log(e.response);
      const errMessage = '何らかのエラーが発生しました。';
      throw new HttpException(errMessage, 500);
    }

    //結果によって返すものを変える
    if (result.status == '0') {
      const execResult: ExecResult = {
        status: 'success',
        output: result.program_output,
      };
      return execResult;
    } else {
      //エラーごとに分割して配列に格納
      let errors: string[] = [];
      result.compiler_error.split('prog.c:').forEach((value, index) => {
        if (value.match(/\d+:\d+:/)) {
          errors.push(value);
        }
      });
      const execError: ExecError = {
        status: 'error',
        errors: errors,
      };
      return execError;
    }
  }

  getErrorResolve(errors: string[]): ErrorResulveMethod[] {
    let resolveMethods: ErrorResulveMethod[] = [];
    //変更場所: エラーのパターンや説明を追加するにはここを編集する
    const errorTable: ErrorResulveTable[] = [
      {
        pattern: /expected '\S+' before '\S+'/,
        description:
          '{position}の前に、{name}があるはずですが、忘れているようです。',
        resolveMethod: '{position}の前に、{name}を追加してください。',
        replaceList: ['name', 'position'],
      },
      {
        pattern: /expected declaration or statement at end of input/,
        description: '閉じの中カッコの数が足りません。',
        resolveMethod:
          '開きカッコと閉じカッpコの対応が取れているか確認してください。',
        replaceList: [],
      },
      {
        pattern: /implicit declaration of function '\S+'; did you mean '\S+'? /,
        description:
          '宣言されていない関数{name1}を使おうとしています。{name2}の間違いですか？',
        resolveMethod:
          '関数{name1}を宣言するか、正しい関数名{name2}に直してください。',
        replaceList: ['name1', 'name2'],
      },
      {
        pattern: /implicit declaration of function '\S+' /,
        description: '宣言されていない関数{name}を使おうとしています。',
        resolveMethod: '関数{name}を宣言するか、正しい関数名に直してください。',
        replaceList: ['name'],
      },
      {
        pattern: /\S+: No such file or directory/,
        description: '{name}は存在しないファイルです。',
        resolveMethod:
          '{name}というファイルを作成するか、正しいファイル名（パス）に直してください',
        replaceList: ['name'],
      },
      {
        pattern: /incompatible implicit declaration of built-in function '\S+'/,
        description: '{name}は存在しないファイルです。',
        resolveMethod:
          '{name}というファイルを作成するか、正しいファイル名（パス）に直してください',
        replaceList: ['name'],
      },
      {
        pattern: /undeclared/,
        description: '宣言されていない変数{name}を使おうとしています。',
        resolveMethod: '変数{name}を宣言するか、正しい変数名に直してください。',
        replaceList: ['name'],
      },
      {
        pattern: /suggest parentheses around assignment used as truth value/,
        description: '真理値として使用される代入を括弧で囲むことを提案します',
        resolveMethod: '等しいかの比較には=ではなく、==を使用します。',
        replaceList: [],
      },
      {
        pattern: /'\S+' is used uninitialized/,
        description: '{name}が初期化されずに使用されています。',
        resolveMethod:
          '{name}を初期化してから加算やインクリメントをしてください。',
        replaceList: ['name'],
      },
      {
        pattern:
          /format '\S+' expects argument of type '\S+', but argument 2 has type '\S' /,
        description:
          'フォーマットの{type1}は{type2}型の値を出すためのものですが、実際に渡されているものは{type3}型です。',
        resolveMethod: '扱う方を揃えてください。。',
        replaceList: ['type1', 'type2', 'type3'],
      },
      {
        pattern: /too few arguments to function '\S+'/,
        description: '関数{name}に渡す引数が足りません。',
        resolveMethod:
          '関数{name}に渡す必要がある引数を確認して、それを追加してください。',
        replaceList: ['name'],
      },
      {
        pattern: /too many arguments to function '\S+'/,
        description: '関数{name}に渡す引数が多すぎます。',
        resolveMethod:
          '関数{name}に渡す必要がある引数を確認して、必要のない引数を消してください。',
        replaceList: ['name'],
      },
      {
        pattern:
          /format '\S+' expects argument of type '\S+', but argument 2 has type '\S+'/,
        description:
          'フォーマットの{type1}は{type2}型の値を出すためのものですが、実際に渡されているものは{type3}型です。',
        resolveMethod:
          '{type2}の値を出すつもりでない場合は、渡す変数の型{type3}に合わせて、フォーマットの{type1}を変更してください。',
        replaceList: ['type1', 'type2', 'type3'],
      },
    ];

    //全てのエラーに対して、errorTableに該当するものがあるかを確認する
    const placeTmp = /:/; //行と列の場所を取り出すためのテンプレ
    errors.map((errorStr) => {
      if (
        errorStr != '' &&
        (errorStr.match(/error/) || errorStr.match(/warning/))
      ) {
        const place = errorStr.split(placeTmp);
        let findFlag: boolean = false;
        //パターンに一致するかどうか見る
        errorTable.map((checkError) => {
          if (errorStr.match(checkError.pattern)) {
            //エラー文と説明文、解決方法の文をreplaceNameに渡し、{name}を置き換える
            const [newErrorStr, newDescription, newMethod] = this.replaceName(
              errorStr,
              checkError.description,
              checkError.resolveMethod,
              checkError.replaceList,
            );
            const method: ErrorResulveMethod = {
              error: newErrorStr,
              row: Number(place[0]),
              column: Number(place[1]),
              description: newDescription,
              method: newMethod,
            };
            resolveMethods.push(method);

            findFlag = true;
          }
        });
      }
    });
    return resolveMethods;
  }

  //エラー文と説明文、解決方法の文を受け取って、{name}を置き換える
  replaceName(
    error: string,
    description: string,
    method: string,
    replaceList: string[],
  ): string[] {
    if (replaceList.length == 0) {
      return [error, description, method];
    }
    //受け取ったerrorから、''で囲まれた文字列をすべて取り出す
    const nameTmp = /'\S+'/g;
    const nameList = error.match(nameTmp);
    if (nameList == null) {
      return [error, description, method];
    }

    //全てを置き換える。それぞれのnameを、replaceListが持っている場所に置き換える
    nameList.map((name) => {
      const replaceName = '{' + replaceList[nameList.indexOf(name)] + '}';
      description = description.replace(replaceName, name);
      method = method.replace(replaceName, name);
    });
    return [error, description, method];
  }

  getConnectedCode(): string {
    const sampleFormData: CodingFormData[] = [
      {
        id: 1,
        partType: 'MAIN',
        explanation: 'main関数',
        childrenPart: [
          {
            id: 2,
            partType: 'FOR',
            explanation: '繰り返し文',
            childrenPart: [
              {
                id: 3,
                partType: 'OUT',
                explanation: '出力',
                childrenPart: 'none',
                inputIdx: 1,
              },
            ],
            inputIdx: 0,
          },
        ],
        inputIdx: -1,
      },
    ];

    const sampleInputData: InputData[] = [
      {
        id: 0,
        partType: 'FOR',
        inputArray: ['int i = 0; i < 10; i++'],
      },
      {
        id: 1,
        partType: 'OUT',
        inputArray: ['printf("Hello, World!\\n");'],
      },
    ];

    const sampleConnectTemplate: ConnectTemplate[] = [
      {
        partType: 'MAIN',
        haveChildren: true,
        beforeElement: ['int main() {\\n'],
        afterElement: ['return 0;\\n}'],
      },
      {
        partType: 'FOR',
        haveChildren: true,
        beforeElement: ['for(', '{input}', ') {\\n'],
        afterElement: ['\\n}'],
      },
      {
        partType: 'OUT',
        haveChildren: false,
        beforeElement: ['printf("'],
        afterElement: ['");\\n'],
      },
    ];

    const result = this.callConnectCode(
      sampleFormData,
      sampleInputData,
      sampleConnectTemplate,
    );

    return '接続されたコードは以下の通りです。' + result;
  }

  callConnectCode(
    formData: CodingFormData[],
    inputData: InputData[],
    connectTemplate: ConnectTemplate[],
  ): string {
    let result: string = '';
    formData.map((form) => {
      result += this.connectCode(form, inputData, connectTemplate);
    });
    return result;
  }

  connectCode(
    form: CodingFormData,
    inputDataList: InputData[],
    connectTemplateList: ConnectTemplate[],
  ): string {
    let result: string = '';
    //inputのidxを0にする
    let inputIdx = 0;
    //formのpartTypeに対応するconnectTemplateを取り出す
    const connectTmp = connectTemplateList.find(
      (tmp) => tmp.partType == form.partType,
    );
    if (connectTmp == undefined) {
      throw new HttpException('何らかのエラーが発生しました。', 500);
    }
    connectTmp.beforeElement.map((element) => {
      if (element == '{input}') {
        result += inputDataList[form.inputIdx].inputArray[inputIdx];
        inputIdx++;
      }
      result += element;
    });
    if (connectTmp.haveChildren && typeof form.childrenPart != 'string') {
      result += this.callConnectCode(
        form.childrenPart,
        inputDataList,
        connectTemplateList,
      );
      result += '\n' + connectTmp.afterElement[0];
    }
    return result;
  }
}
