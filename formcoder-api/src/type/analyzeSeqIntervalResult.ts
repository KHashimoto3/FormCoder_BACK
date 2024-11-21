export type AnalyzeSeqIntervalResult = {
  startTimestamp: number;
  endTimestamp: number;
  datasCount: number;
  inputCharLength: number;
  removedCharLength: number;
  inputDataCount: number;
  removedDataCount: number;
  missTypeRate: number;
  totalTime: number;
  typePerSec: number;
  totalReInputCnt: number;
  totalReInputTime: number;
  reInputRate: number;
  averageReInputTime: number;
};
