import { Test, TestingModule } from '@nestjs/testing';
import { SequenceService } from './sequence.service';

//import testSequenceData1 from './testData/test-sequence1.json';

const testSequenceData1 = [
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
    describe('countInputSize', () => {
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

    describe('countRemovedSize', () => {
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
});
