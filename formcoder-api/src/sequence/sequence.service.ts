import { HttpException, Injectable } from '@nestjs/common';
import { AnalyzeSeqIntervalResult } from 'src/type/analyzeSeqIntervalResult';
import { AnalyzeSeqPartResult } from 'src/type/analyzeSeqPartResult';
import { SequenceData } from 'src/type/sequenceData';

type KeyData = {
  timestamp: number;
  input: string[];
  inputSize: number;
  removed: string[];
  removedSize: number;
};

type DividedKeyData = {
  startTimestamp: number;
  endTimestamp: number;
  keyDataList: KeyData[];
};

type KeyDatasWithPart = {
  partType: string;
  keyData: KeyData;
};

type DividedKeyDataWithPart = {
  partType: string;
  keyDataList: KeyData[];
};

@Injectable()
export class SequenceService {
  hello(): { message: string } {
    return { message: 'Hello sequence service!' };
  }

  //[A]時間ごとにシーケンスの分析を行う
  analyzeWithInterval(
    intervalTime: number,
    sequence: SequenceData[],
  ): AnalyzeSeqIntervalResult[] {
    if (intervalTime === undefined || intervalTime === undefined) {
      throw new HttpException('必要なデータが渡されていません。', 400);
    }
    //シーケンスデータを、解析に使える形に変換する
    const keyDataList = this.getKeyDatas(sequence);
    const dividedKeyDataList = this.divideKeyDatas(keyDataList, intervalTime);
    const analyzeResultList = this.callAnalyzeWithInterval(dividedKeyDataList);
    return analyzeResultList;
  }

  //[B]フォームの入力欄ごとにシーケンスの分析を行う
  getAnalyticsByPart(sequence: SequenceData[]): AnalyzeSeqPartResult[] {
    if (sequence === undefined) {
      throw new HttpException('必要なデータが渡されていません。', 400);
    }
    const keyDatasWithPartList: KeyDatasWithPart[] = [];
    sequence.map((value) => {
      const values = [value];
      const keyDatas = this.getKeyDatas(values);
      const keyDatasByPart: KeyDatasWithPart = {
        partType: value.partType,
        keyData: {
          timestamp: keyDatas[0].timestamp,
          input: keyDatas[0].input,
          inputSize: keyDatas[0].inputSize,
          removed: keyDatas[0].removed,
          removedSize: keyDatas[0].removedSize,
        },
      };
      keyDatasWithPartList.push(keyDatasByPart);
    });

    //keyDatasByPartを、partごとに分割する
    const dividedKeyDataList = this.divideKeyDatasByPart(keyDatasWithPartList);
    const analyzeResultList = this.callAnalyzeByPart(dividedKeyDataList);

    return analyzeResultList;
  }

  //[A-1]シーケンスデータを解析に使える形に変換する
  getKeyDatas(values: SequenceData[]): KeyData[] {
    const keyDatas = [];
    values.map((value) => {
      const timestamp = value.timestamp;
      const input = value.changeData.text;
      const inputSize = this.countInputSize(input);
      const removed = value.changeData.removed;
      const removedSize = this.countRemovedSize(removed);
      const keyData = {
        timestamp: timestamp,
        input: input,
        inputSize: inputSize,
        removed: removed,
        removedSize: removedSize,
      };
      keyDatas.push(keyData);
    });
    return keyDatas;
  }

  //入力文字数のカウント
  countInputSize(input) {
    let size = 0;
    input.map((t) => {
      size += t.length;
    });
    return size;
  }

  //削除文字数のカウント
  countRemovedSize(removed) {
    let size = 0;
    removed.map((t) => {
      size += t.length;
    });
    return size;
  }

  //[A-2]一定の時間間隔で、keyDataListを分割する
  divideKeyDatas(keyDatas: KeyData[], intervalTime: number): DividedKeyData[] {
    if (intervalTime < 1000) {
      throw new HttpException(
        'intervalTimeは1000ms以上で指定してください',
        400,
      );
    }
    let analyzeTargetFrom = 0;
    let analyzeTargetTo = intervalTime; //与えられた秒間隔で、分析する
    const dividedKeyDataList: DividedKeyData[] = [];
    //keyDatasを、intervalTimeごとに分割する
    let keyDatasIdx = 0;
    while (keyDatasIdx < keyDatas.length) {
      const dividedKeyData: DividedKeyData = {
        startTimestamp: analyzeTargetFrom,
        endTimestamp: analyzeTargetTo,
        keyDataList: [],
      };
      while (keyDatasIdx < keyDatas.length) {
        const keyData = keyDatas[keyDatasIdx];
        if (keyData.timestamp >= analyzeTargetTo) {
          break;
        }
        dividedKeyData.keyDataList.push(keyData);
        keyDatasIdx++;
      }
      dividedKeyDataList.push(dividedKeyData);
      analyzeTargetFrom = analyzeTargetTo;
      analyzeTargetTo = analyzeTargetTo + intervalTime;
    }

    return dividedKeyDataList;
  }

  //[A-3]dividedKeyDataListを元に、時間ごとにシーケンスの分析を行う
  callAnalyzeWithInterval(
    dividedKeyDataList: DividedKeyData[],
  ): AnalyzeSeqIntervalResult[] {
    const analyzeResultList: AnalyzeSeqIntervalResult[] = [];
    dividedKeyDataList.map((dividedKeyData) => {
      const result = this.analyze(dividedKeyData);
      analyzeResultList.push(result);
    });
    return analyzeResultList;
  }

  //[B-1]パートごとにシーケンスデータを振り分ける
  divideKeyDatasByPart(
    keyDatasWithPart: KeyDatasWithPart[],
  ): DividedKeyDataWithPart[] {
    const dividedKeyDatasByPartList: DividedKeyDataWithPart[] = [];

    //keyDatasを、partごとに分割する
    keyDatasWithPart.forEach((dividedKeyData) => {
      const partType = dividedKeyData.partType;
      const keyData = dividedKeyData.keyData;

      const existingPart = dividedKeyDatasByPartList.find(
        (keyDataByPart) => keyDataByPart.partType === partType,
      );

      if (existingPart) {
        existingPart.keyDataList.push(keyData);
      } else {
        const dividedKeyDataByPart: DividedKeyDataWithPart = {
          partType: partType,
          keyDataList: [keyData],
        };
        dividedKeyDatasByPartList.push(dividedKeyDataByPart);
      }
    });

    return dividedKeyDatasByPartList;
  }

  //keyDatasByPart内に、渡されたpartが存在するかどうか
  /*isExistPart(keyDatasByPart: any, part: string) {
    return keyDatasByPart.some((keyDataByPart) => keyDataByPart.part === part);
  }*/

  //[B-2]パートごとにanalyzeを読んで、分析を行う
  callAnalyzeByPart(
    dividedKeyDataList: DividedKeyDataWithPart[],
  ): AnalyzeSeqPartResult[] {
    const analyzeResultList: AnalyzeSeqPartResult[] = [];

    dividedKeyDataList.map((dividedKeyData) => {
      const { startTimestamp, endTimestamp } = this.getPartTimestamps(
        dividedKeyData.keyDataList,
      );
      const analyzeInput = {
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
        keyDataList: dividedKeyData.keyDataList,
      };
      const analyzeResult = this.analyze(analyzeInput);
      const analyzeResultByPart = {
        partType: dividedKeyData.partType,
        analyzeResult: analyzeResult,
      };
      analyzeResultList.push(analyzeResultByPart);
    });

    return analyzeResultList;
  }

  //渡されたパートのstartTimestampとendTimestampを取得
  getPartTimestamps(keyDataList: KeyData[]): {
    startTimestamp: number;
    endTimestamp: number;
  } {
    const startTimestamp = keyDataList[0].timestamp;
    const endTimestamp = keyDataList[keyDataList.length - 1].timestamp;
    const timestamp = {
      startTimestamp: startTimestamp,
      endTimestamp: endTimestamp,
    };
    return timestamp;
  }

  //[A, B]与えられた範囲で、分析を行う
  analyze(dividedKeyDataList: DividedKeyData): AnalyzeSeqIntervalResult {
    const startTimestamp = dividedKeyDataList.startTimestamp;
    const endTimestamp = dividedKeyDataList.endTimestamp;
    const totalTime = endTimestamp - startTimestamp; //ms
    const keyDatas = dividedKeyDataList.keyDataList;

    const valueCount = keyDatas.length;
    let inputCount = 0; //入力文字数
    let removedCount = 0; //削除文字数
    let inputDataCount = 0; //入力データ数
    let removedDataCount = 0; //削除データ数

    //削除して、同じ文字数入力し直す場合の情報
    let middleRemovedStart = 0;
    let reInputEnd = 0;
    let middleRemoveLevel = 0; //書き直しのレベル
    let totalReInputCnt = 0; //書き直しの回数
    let totalReInputTime = 0; //書き直しにかかった時間

    keyDatas.map((keyData) => {
      if (middleRemoveLevel > 0) {
        if (keyData.inputSize > 0) {
          inputCount = inputCount + keyData.inputSize;
          inputDataCount++;
          middleRemoveLevel--; //１つ書き直した
        }
        if (keyData.removedSize > 0) {
          removedCount = removedCount + keyData.removedSize;
          removedDataCount++;
          middleRemoveLevel++; //書き直しのレベルをカウント
        }

        if (middleRemoveLevel <= 0) {
          //書き直しにかかった時間を計算
          reInputEnd = keyData.timestamp; //書き直しの終了時間
          const reInputTime = reInputEnd - middleRemovedStart;
          totalReInputTime += reInputTime;
          totalReInputCnt++;
          middleRemovedStart = 0;
          reInputEnd = 0;
        }
      } else {
        if (keyData.inputSize > 0) {
          inputCount = inputCount + keyData.inputSize;
          inputDataCount++;
        }
        if (keyData.removedSize > 0) {
          removedCount = removedCount + keyData.removedSize;
          removedDataCount++;
          middleRemoveLevel++; //書き直しのレベルをカウント
          middleRemovedStart = keyData.timestamp; //書き直しの開始時間
        }
      }
    });
    const typePerSec = valueCount / (totalTime / 1000);
    //typePerSecを小数点第3位まで表示
    const typePerSecFixed = Number(
      parseFloat(typePerSec.toString()).toFixed(1),
    );
    /* TODO: 以下の情報を、直接printではなく、objectとして返すように変更 */
    /*console.log("\n=======集計結果=======");
  console.log("データ数: ", keyDatas.length);
  console.log("入力文字数: ", inputCount);
  console.log("削除文字数: ", removedCout);
  console.log("入力データ数: ", inputDataCount);
  console.log("削除データ数: ", removedDataCount);
  console.log("合計時間: ", totalTime, "ms");
  console.log("打鍵速度: ", Number.parseFloat(typePerSec).toFixed(3), "個/秒");*/

    //分析項目：入力ミス率
    let missTypeRate = 0;
    let missTypeRateFixed = 0;
    let reInputRate = 0;
    let reInputRateFixed = 0;
    let averageReInputTime = 0;
    let averageReInputTimeFixed = 0;
    if (removedCount > 0) {
      missTypeRate = (removedCount / (inputCount + removedCount)) * 100; //%
      missTypeRateFixed = Number(
        parseFloat(missTypeRate.toString()).toFixed(1),
      );
      //分析項目：書き直した時間の割合
      reInputRate = (totalReInputTime / totalTime) * 100; //%
      //reInputRateを小数点第3位まで表示
      reInputRateFixed = Number(parseFloat(reInputRate.toString()).toFixed(1));
      //分析項目：平均書き直しの時間
      averageReInputTime = totalReInputTime / totalReInputCnt / 1000; //秒
      averageReInputTimeFixed = Number(
        parseFloat(averageReInputTime.toString()).toFixed(1),
      );
    }

    //単位換算
    const totalReInputTimeSec = totalReInputTime / 1000;
    const totalReInputTimeFixed = Number(
      parseFloat(totalReInputTimeSec.toString()).toFixed(1),
    );
    const totalTimeSec = totalTime / 1000;
    const totalTimeFixed = Number(
      parseFloat(totalTimeSec.toString()).toFixed(1),
    );

    //集計結果を返す
    const result = {
      startTimestamp: startTimestamp,
      endTimestamp: endTimestamp,
      datasCount: keyDatas.length,
      inputCharLength: inputCount,
      removedCharLength: removedCount,
      inputDataCount: inputDataCount,
      removedDataCount: removedDataCount,
      missTypeRate: missTypeRateFixed, //入力ミス率
      totalTime: totalTimeFixed, //秒
      typePerSec: typePerSecFixed, //個/秒
      totalReInputCnt: totalReInputCnt, //書き直しの回数
      totalReInputTime: totalReInputTimeFixed, //書き直しにかかった時間
      reInputRate: reInputRateFixed, //書き直した時間の割合
      averageReInputTime: averageReInputTimeFixed, //平均書き直しの時間
    };
    return result;
  }
}
