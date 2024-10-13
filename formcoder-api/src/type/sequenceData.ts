export type SequenceData = {
  id: number;
  partType: string;
  timestamp: number;
  changeData: changeData;
};

type changeData = {
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
