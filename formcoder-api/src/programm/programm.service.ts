import { Injectable } from '@nestjs/common';
import { ErrorResulveMethod } from 'src/type/errorResulveMethod';
import { ErrorResulveTable } from 'src/type/errorResulveTable';

@Injectable()
export class ProgrammService {
  hello(): { message: string } {
    return { message: 'hello programm api!' };
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
            console.log('エラーを発見しました');
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

    console.log('nameListは: ' + nameList);

    //全てを置き換える。それぞれのnameを、replaceListが持っている場所に置き換える
    nameList.map((name) => {
      const replaceName = '{' + replaceList[nameList.indexOf(name)] + '}';
      console.log(replaceName + 'を' + name + 'に置き換えます');
      description = description.replace(replaceName, name);
      method = method.replace(replaceName, name);
      console.log(
        '置き換え後の説明文と解決方法文: ' + description + ' ' + method,
      );
    });
    return [error, description, method];
  }
}
