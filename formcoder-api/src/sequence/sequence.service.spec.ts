import { Test, TestingModule } from '@nestjs/testing';
import { SequenceService } from './sequence.service';
import { AnalyzeSeqIntervalResult } from 'src/type/analyzeSeqIntervalResult';
import { SequenceData } from 'src/type/sequenceData';

//import testSequenceData1 from './testData/test-sequence1.json';

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

//パートごとの分割に使う型
type DividedKeyDataWithPart = {
  partType: string;
  keyDataList: KeyData[];
};

//dio.hの入力テストデータ（stdio.hの途中）
const testSequenceData1: SequenceData[] = [
  {
    id: 1,
    partType: 'INC',
    timestamp: 9184,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['d'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 1,
    partType: 'INC',
    timestamp: 9319,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['i'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 1,
    partType: 'INC',
    timestamp: 9472,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['o'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 1,
    partType: 'INC',
    timestamp: 9864,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: [',.'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 1,
    partType: 'INC',
    timestamp: 10545,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: [''],
      removed: ['.'],
      origin: '+delete',
    },
  },
  {
    id: 1,
    partType: 'INC',
    timestamp: 10895,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: [''],
      removed: [','],
      origin: '+delete',
    },
  },
  {
    id: 1,
    partType: 'INC',
    timestamp: 11330,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['.'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 1,
    partType: 'INC',
    timestamp: 11889,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['h'],
      removed: [''],
      origin: '+input',
    },
  },
];

const testSequenceData2: SequenceData[] = [
  {
    id: 1,
    partType: 'INC',
    timestamp: 10726,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['g'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 1,
    partType: 'INC',
    timestamp: 11272,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: [''],
      removed: ['g'],
      origin: '+delete',
    },
  },
  {
    id: 1,
    partType: 'INC',
    timestamp: 11792,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['h'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 1,
    partType: 'INC',
    timestamp: 12239,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['>'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 21,
    partType: 'DAT',
    timestamp: 13677,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['i'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 21,
    partType: 'DAT',
    timestamp: 13819,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['n'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 21,
    partType: 'DAT',
    timestamp: 13930,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: ['t'],
      removed: [''],
      origin: '+input',
    },
  },
  {
    id: 21,
    partType: 'DAT',
    timestamp: 14041,
    changeData: {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 0 },
      text: [' '],
      removed: [''],
      origin: '+input',
    },
  },
];

describe('SequenceServiceのテスト', () => {
  let service: SequenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SequenceService],
    }).compile();

    service = module.get<SequenceService>(SequenceService);
  });

  /*test('testSequenceData1', () => {
    expect(testSequenceData1).toBeDefined();
  });*/

  describe('必要するものが存在するかの確認', () => {
    it('SequenceServiceが存在する。', () => {
      expect(service).toBeDefined();
    });

    it('testSequenceData1が存在する。', () => {
      expect(testSequenceData1).toBeDefined();
    });
  });

  describe('到達確認のテスト', () => {
    it('helloが、正しくあいさつメッセージを返す。', () => {
      expect(service.hello()).toEqual({ message: 'Hello sequence service!' });
    });
  });

  describe('カウント関係の関数をテスト', () => {
    describe('countInputSize関数のテスト', () => {
      it('入力文字が2文字の時、文字数を正しく返す。', () => {
        const testInput = ['ab'];
        expect(service.countInputSize(testInput)).toBe(2);
      });

      it('入力文字が1文字の時、文字数を正しく返す。', () => {
        const testInput = ['a'];
        expect(service.countInputSize(testInput)).toBe(1);
      });

      it('入力文字が0文字の時、文字数を正しく返す。', () => {
        const testInput = [];
        expect(service.countInputSize(testInput)).toBe(0);
      });
    });

    describe('countRemovedSize関数のテスト', () => {
      it('削除文字数が2文字の時、文字数を正しく返す', () => {
        const testRemoved = ['ab'];
        expect(service.countRemovedSize(testRemoved)).toBe(2);
      });

      it('削除文字数が1文字の時、文字数を正しく返す', () => {
        const testRemoved = ['a'];
        expect(service.countRemovedSize(testRemoved)).toBe(1);
      });

      it('削除文字数が0文字の時、文字数を正しく返す', () => {
        const testRemoved = [];
        expect(service.countRemovedSize(testRemoved)).toBe(0);
      });
    });
  });

  describe('シーケンスデータを解析に使える形に変換する関数のテスト', () => {
    describe('getKeyDatas関数のテスト', () => {
      it('getKeyDatas関数が存在する。', () => {
        expect(service.getKeyDatas).toBeDefined();
      });

      it('シーケンスデータを解析に使える形に変換できる。', () => {
        const expectedKeyData = [
          {
            timestamp: 9184,
            input: ['d'],
            inputSize: 1,
            removed: [''],
            removedSize: 0,
          },
          {
            timestamp: 9319,
            input: ['i'],
            inputSize: 1,
            removed: [''],
            removedSize: 0,
          },
          {
            timestamp: 9472,
            input: ['o'],
            inputSize: 1,
            removed: [''],
            removedSize: 0,
          },
          {
            timestamp: 9864,
            input: [',.'],
            inputSize: 2,
            removed: [''],
            removedSize: 0,
          },
          {
            timestamp: 10545,
            input: [''],
            inputSize: 0,
            removed: ['.'],
            removedSize: 1,
          },
          {
            timestamp: 10895,
            input: [''],
            inputSize: 0,
            removed: [','],
            removedSize: 1,
          },
          {
            timestamp: 11330,
            input: ['.'],
            inputSize: 1,
            removed: [''],
            removedSize: 0,
          },
          {
            timestamp: 11889,
            input: ['h'],
            inputSize: 1,
            removed: [''],
            removedSize: 0,
          },
        ];

        const result = service.getKeyDatas(testSequenceData1);
        expect(result).toEqual(expectedKeyData);
      });
    });
  });

  describe('シーケンスデータを一定の時間間隔で分割する関数のテスト', () => {
    describe('divideKeyDatas関数のテスト', () => {
      it('divideKeyDatas関数が存在する。', () => {
        expect(service.divideKeyDatas).toBeDefined();
      });

      it('渡したkeyDataListを10秒間隔で分割できる。', () => {
        const keyDataList = service.getKeyDatas(testSequenceData1);
        const intervalTime = 10000;
        const expectedDividedKeyDataList: DividedKeyData[] = [
          {
            startTimestamp: 0,
            endTimestamp: 10000,
            keyDataList: [
              {
                timestamp: 9184,
                input: ['d'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 9319,
                input: ['i'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 9472,
                input: ['o'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 9864,
                input: [',.'],
                inputSize: 2,
                removed: [''],
                removedSize: 0,
              },
            ],
          },
          {
            startTimestamp: 10000,
            endTimestamp: 20000,
            keyDataList: [
              {
                timestamp: 10545,
                input: [''],
                inputSize: 0,
                removed: ['.'],
                removedSize: 1,
              },
              {
                timestamp: 10895,
                input: [''],
                inputSize: 0,
                removed: [','],
                removedSize: 1,
              },
              {
                timestamp: 11330,
                input: ['.'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 11889,
                input: ['h'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
            ],
          },
        ];

        const result = service.divideKeyDatas(keyDataList, intervalTime);
        expect(result).toEqual(expectedDividedKeyDataList);
      });

      it('intervalが1秒以下の場合、分割せずエラーコードを返す。', () => {
        const keyDataList = service.getKeyDatas(testSequenceData1);
        const intervalTime = 1000;
        const expectedStatus = 400;

        try {
          service.divideKeyDatas(keyDataList, intervalTime);
        } catch (error) {
          expect(error.getStatus()).toBe(expectedStatus);
        }
      });
    });
  });

  describe('シーケンスデータを一定間隔で分析する関数のテスト', () => {
    describe('analyze関数のテスト', () => {
      it('analyze関数が存在する。', () => {
        expect(service.analyze).toBeDefined();
      });

      const sampleDividedKeyDataList: DividedKeyData[] = [
        {
          startTimestamp: 0,
          endTimestamp: 10000,
          keyDataList: [
            {
              timestamp: 9184,
              input: ['d'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
            {
              timestamp: 9319,
              input: ['i'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
            {
              timestamp: 9472,
              input: ['o'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
            {
              timestamp: 9864,
              input: [',.'],
              inputSize: 2,
              removed: [''],
              removedSize: 0,
            },
          ],
        },
        {
          startTimestamp: 10000,
          endTimestamp: 20000,
          keyDataList: [
            {
              timestamp: 10545,
              input: [''],
              inputSize: 0,
              removed: ['.'],
              removedSize: 1,
            },
            {
              timestamp: 10895,
              input: [''],
              inputSize: 0,
              removed: [','],
              removedSize: 1,
            },
            {
              timestamp: 11330,
              input: ['.'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
            {
              timestamp: 11889,
              input: ['h'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
          ],
        },
      ];

      it('削除操作のないシーケンスデータを分析できる。', () => {
        const expectedAnalyzeResult: AnalyzeSeqIntervalResult = {
          startTimestamp: 0,
          endTimestamp: 10000,
          datasCount: 4,
          inputCharLength: 5,
          removedCharLength: 0,
          inputDataCount: 4,
          removedDataCount: 0,
          missTypeRate: 0,
          totalTime: 10,
          typePerSec: 0.4,
          totalReInputCnt: 0,
          totalReInputTime: 0,
          reInputRate: 0,
          averageReInputTime: 0,
        };

        const result = service.analyze(sampleDividedKeyDataList[0]);
        expect(result).toEqual(expectedAnalyzeResult);
      });

      it('削除操作のあるシーケンスデータを分析できる。', () => {
        const expectedAnalyzeResult: AnalyzeSeqIntervalResult = {
          startTimestamp: 10000,
          endTimestamp: 20000,
          datasCount: 4,
          inputCharLength: 2,
          removedCharLength: 2,
          inputDataCount: 2,
          removedDataCount: 2,
          missTypeRate: 50,
          totalTime: 10,
          typePerSec: 0.4,
          totalReInputCnt: 1,
          totalReInputTime: 1.3,
          reInputRate: 13.4,
          averageReInputTime: 1.3,
        };

        const result = service.analyze(sampleDividedKeyDataList[1]);
        expect(result).toEqual(expectedAnalyzeResult);
      });
    });

    describe('callAnalyzeWithInterval関数のテスト', () => {
      it('callAnalyzeWithInterval関数が存在する。', () => {
        expect(service.callAnalyzeWithInterval).toBeDefined();
      });

      it('渡した分割済みのシーケンスデータを、analyze関数を使って分析できる。', () => {
        const sampleDividedKeyDataList: DividedKeyData[] = [
          {
            startTimestamp: 0,
            endTimestamp: 10000,
            keyDataList: [
              {
                timestamp: 9184,
                input: ['d'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 9319,
                input: ['i'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 9472,
                input: ['o'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 9864,
                input: [',.'],
                inputSize: 2,
                removed: [''],
                removedSize: 0,
              },
            ],
          },
          {
            startTimestamp: 10000,
            endTimestamp: 20000,
            keyDataList: [
              {
                timestamp: 10545,
                input: [''],
                inputSize: 0,
                removed: ['.'],
                removedSize: 1,
              },
              {
                timestamp: 10895,
                input: [''],
                inputSize: 0,
                removed: [','],
                removedSize: 1,
              },
              {
                timestamp: 11330,
                input: ['.'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 11889,
                input: ['h'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
            ],
          },
        ];

        const expectedAnalyzeResultList: AnalyzeSeqIntervalResult[] = [
          {
            startTimestamp: 0,
            endTimestamp: 10000,
            datasCount: 4,
            inputCharLength: 5,
            removedCharLength: 0,
            inputDataCount: 4,
            removedDataCount: 0,
            missTypeRate: 0,
            totalTime: 10,
            typePerSec: 0.4,
            totalReInputCnt: 0,
            totalReInputTime: 0,
            reInputRate: 0,
            averageReInputTime: 0,
          },
          {
            startTimestamp: 10000,
            endTimestamp: 20000,
            datasCount: 4,
            inputCharLength: 2,
            removedCharLength: 2,
            inputDataCount: 2,
            removedDataCount: 2,
            missTypeRate: 50,
            totalTime: 10,
            typePerSec: 0.4,
            totalReInputCnt: 1,
            totalReInputTime: 1.3,
            reInputRate: 13.4,
            averageReInputTime: 1.3,
          },
        ];

        const result = service.callAnalyzeWithInterval(
          sampleDividedKeyDataList,
        );
        expect(result).toEqual(expectedAnalyzeResultList);
      });
    });

    describe('analyzeWithInterval関数のテスト', () => {
      it('analyzeWithInterval関数が存在する。', () => {
        expect(service.analyzeWithInterval).toBeDefined();
      });

      it('渡されたシーケンスデータを、10秒間隔で分析してその結果を返せる。', () => {
        const expectedAnalyzeResultList: AnalyzeSeqIntervalResult[] = [
          {
            startTimestamp: 0,
            endTimestamp: 10000,
            datasCount: 4,
            inputCharLength: 5,
            removedCharLength: 0,
            inputDataCount: 4,
            removedDataCount: 0,
            missTypeRate: 0,
            totalTime: 10,
            typePerSec: 0.4,
            totalReInputCnt: 0,
            totalReInputTime: 0,
            reInputRate: 0,
            averageReInputTime: 0,
          },
          {
            startTimestamp: 10000,
            endTimestamp: 20000,
            datasCount: 4,
            inputCharLength: 2,
            removedCharLength: 2,
            inputDataCount: 2,
            removedDataCount: 2,
            missTypeRate: 50,
            totalTime: 10,
            typePerSec: 0.4,
            totalReInputCnt: 1,
            totalReInputTime: 1.3,
            reInputRate: 13.4,
            averageReInputTime: 1.3,
          },
        ];

        const result = service.analyzeWithInterval(10000, testSequenceData1);
        expect(result).toEqual(expectedAnalyzeResultList);
      });

      it('パラメータが足りない時、エラーコードを返す', () => {
        const expectedStatus = 400;

        try {
          service.analyzeWithInterval(0, []);
        } catch (error) {
          expect(error.getStatus()).toBe(expectedStatus);
        }
      });
    });
  });

  describe('渡されたシーケンスデータから、開始と終了のtimestampを返す関数のテスト', () => {
    describe('getPartTimestamps関数のテスト', () => {
      it('getPartTimestamps関数が存在する。', () => {
        expect(service.getPartTimestamps).toBeDefined();
      });

      it('渡されたシーケンスデータから、開始と終了のtimestampを正しく返す。', () => {
        const sampleDividedKeyData: DividedKeyDataWithPart = {
          partType: 'INC',
          keyDataList: [
            {
              timestamp: 10726,
              input: ['g'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
            {
              timestamp: 11272,
              input: [''],
              inputSize: 0,
              removed: ['g'],
              removedSize: 1,
            },
            {
              timestamp: 11792,
              input: ['h'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
            {
              timestamp: 12239,
              input: ['>'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
          ],
        };

        const expectedTimestamps = {
          startTimestamp: 10726,
          endTimestamp: 12239,
        };

        const result = service.getPartTimestamps(
          sampleDividedKeyData.keyDataList,
        );
        expect(result).toEqual(expectedTimestamps);
      });

      it('シーケンスデータが１件しかない時、開始と終了のtimestampとして同じ値を返す。', () => {
        const sampleDividedKeyData: DividedKeyDataWithPart = {
          partType: 'INC',
          keyDataList: [
            {
              timestamp: 10726,
              input: ['g'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
          ],
        };

        const expectedTimestamps = {
          startTimestamp: 10726,
          endTimestamp: 10726,
        };

        const result = service.getPartTimestamps(
          sampleDividedKeyData.keyDataList,
        );
        expect(result).toEqual(expectedTimestamps);
      });
    });
  });

  describe('フォームの入力欄ごとにシーケンスの分析を行う関数のテスト', () => {
    describe('callAnalyzeByPart関数のテスト', () => {
      it('callAnalyzeByPart関数が存在する。', () => {
        expect(service.callAnalyzeByPart).toBeDefined();
      });

      it('渡された分割済みのシーケンスデータを、analyze関数を使って正しく分析できる。', () => {
        const sampleDividedKeyDataList: DividedKeyDataWithPart[] = [
          {
            partType: 'INC',
            keyDataList: [
              {
                timestamp: 10726,
                input: ['g'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 11272,
                input: [''],
                inputSize: 0,
                removed: ['g'],
                removedSize: 1,
              },
              {
                timestamp: 11792,
                input: ['h'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 12239,
                input: ['>'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
            ],
          },
          {
            partType: 'DAT',
            keyDataList: [
              {
                timestamp: 13677,
                input: ['i'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 13819,
                input: ['n'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 13930,
                input: ['t'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 14041,
                input: [' '],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
            ],
          },
        ];

        const expectedAnalyzeSeqPartResult = [
          {
            partType: 'INC',
            analyzeResult: {
              startTimestamp: 10726,
              endTimestamp: 12239,
              datasCount: 4,
              inputCharLength: 3,
              removedCharLength: 1,
              inputDataCount: 3,
              removedDataCount: 1,
              missTypeRate: 25,
              totalTime: 1.5,
              typePerSec: 2.6,
              totalReInputCnt: 1,
              totalReInputTime: 0.5,
              reInputRate: 34.4,
              averageReInputTime: 0.5,
            },
          },
          {
            partType: 'DAT',
            analyzeResult: {
              startTimestamp: 13677,
              endTimestamp: 14041,
              datasCount: 4,
              inputCharLength: 4,
              removedCharLength: 0,
              inputDataCount: 4,
              removedDataCount: 0,
              missTypeRate: 0,
              totalTime: 0.4,
              typePerSec: 11,
              totalReInputCnt: 0,
              totalReInputTime: 0,
              reInputRate: 0,
              averageReInputTime: 0,
            },
          },
        ];

        const result = service.callAnalyzeByPart(sampleDividedKeyDataList);
        expect(result).toEqual(expectedAnalyzeSeqPartResult);
      });
    });

    describe('divideKeyDatasByPart関数のテスト', () => {
      it('divideKeyDatasByPart関数が存在する。', () => {
        expect(service.divideKeyDatasByPart).toBeDefined();
      });

      it('渡されたシーケンスデータを、partTypeごとに分割できる。', () => {
        const sampleKeyDatasWithPart: KeyDatasWithPart[] = [
          {
            partType: 'INC',
            keyData: {
              timestamp: 10726,
              input: ['g'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
          },
          {
            partType: 'INC',
            keyData: {
              timestamp: 11272,
              input: [''],
              inputSize: 0,
              removed: ['g'],
              removedSize: 1,
            },
          },
          {
            partType: 'INC',
            keyData: {
              timestamp: 11792,
              input: ['h'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
          },
          {
            partType: 'INC',
            keyData: {
              timestamp: 12239,
              input: ['>'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
          },
          {
            partType: 'DAT',
            keyData: {
              timestamp: 13677,
              input: ['i'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
          },
          {
            partType: 'DAT',
            keyData: {
              timestamp: 13819,
              input: ['n'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
          },
          {
            partType: 'DAT',
            keyData: {
              timestamp: 13930,
              input: ['t'],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
          },
          {
            partType: 'DAT',
            keyData: {
              timestamp: 14041,
              input: [' '],
              inputSize: 1,
              removed: [''],
              removedSize: 0,
            },
          },
        ];

        const expectedDividedKeyDataList: DividedKeyDataWithPart[] = [
          {
            partType: 'INC',
            keyDataList: [
              {
                timestamp: 10726,
                input: ['g'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 11272,
                input: [''],
                inputSize: 0,
                removed: ['g'],
                removedSize: 1,
              },
              {
                timestamp: 11792,
                input: ['h'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 12239,
                input: ['>'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
            ],
          },
          {
            partType: 'DAT',
            keyDataList: [
              {
                timestamp: 13677,
                input: ['i'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 13819,
                input: ['n'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 13930,
                input: ['t'],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
              {
                timestamp: 14041,
                input: [' '],
                inputSize: 1,
                removed: [''],
                removedSize: 0,
              },
            ],
          },
        ];

        const result = service.divideKeyDatasByPart(sampleKeyDatasWithPart);
        expect(result).toEqual(expectedDividedKeyDataList);
      });
    });

    describe('getAnalyticsByPart関数のテスト', () => {
      it('getAnalyticsByPart関数が存在する。', () => {
        expect(service.getAnalyticsByPart).toBeDefined();
      });

      it('渡されたシーケンスデータを、partTypeごとに分析し、分析結果を正しく返せる。', () => {
        const expectedAnalyzeSeqPartResult = [
          {
            partType: 'INC',
            analyzeResult: {
              startTimestamp: 10726,
              endTimestamp: 12239,
              datasCount: 4,
              inputCharLength: 3,
              removedCharLength: 1,
              inputDataCount: 3,
              removedDataCount: 1,
              missTypeRate: 25,
              totalTime: 1.5,
              typePerSec: 2.6,
              totalReInputCnt: 1,
              totalReInputTime: 0.5,
              reInputRate: 34.4,
              averageReInputTime: 0.5,
            },
          },
          {
            partType: 'DAT',
            analyzeResult: {
              startTimestamp: 13677,
              endTimestamp: 14041,
              datasCount: 4,
              inputCharLength: 4,
              removedCharLength: 0,
              inputDataCount: 4,
              removedDataCount: 0,
              missTypeRate: 0,
              totalTime: 0.4,
              typePerSec: 11,
              totalReInputCnt: 0,
              totalReInputTime: 0,
              reInputRate: 0,
              averageReInputTime: 0,
            },
          },
        ];

        const result = service.getAnalyticsByPart(testSequenceData2);
        expect(result).toEqual(expectedAnalyzeSeqPartResult);
      });

      it('パラメータが足りない時、エラーコードを返す', () => {
        const expectedStatus = 400;

        try {
          service.getAnalyticsByPart([]);
        } catch (error) {
          expect(error.getStatus()).toBe(expectedStatus);
        }
      });
    });
  });
});
