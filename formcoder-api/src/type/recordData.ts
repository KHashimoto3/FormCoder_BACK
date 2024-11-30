export type RecordData = {
  userId: string;
  formId: string;
  fbData: {
    id: number;
    partType: string;
    currentHintStep: number;
    clickedHintStep: number;
  }[];
  inputData: {
    id: number;
    partType: string;
    inputDataArray: string[];
  }[];
  connectedCode: string;
  sequence: {
    id: number;
    partType: string;
    timestamp: number;
    changeData: {
      from: {
        line: number;
        ch: number;
      };
      to: {
        line: number;
        ch: number;
      };
      text: string[];
      removed: string[];
      origin: string;
    };
  }[];
  seqAnalyze: any;
};
