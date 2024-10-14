import { IsNotEmpty } from 'class-validator';

export class RecordInputDto {
  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  readonly formId: string;

  @IsNotEmpty()
  readonly fbData: {
    id: number;
    partType: string;
    currentHintStep: number;
    clickedHintStep: number;
  }[];

  @IsNotEmpty()
  readonly inputData: {
    id: number;
    partType: string;
    inputDataArray: string[];
  }[];

  readonly connectedCode: string;

  readonly sequence: {
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

  readonly seqAnalyze: any;
}
