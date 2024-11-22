import { Test, TestingModule } from '@nestjs/testing';
import { SequenceService } from './sequence.service';

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

const testSequenceData1 = [
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
    });
  });
});
