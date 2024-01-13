export class RecordInputDto {
  readonly userId: string;
  readonly formName: string;
  readonly fbData: {
    id: number;
    partType: string;
    currentHintStep: number;
    clickedHintStep: number;
  }[];
  readonly input: {
    id: number;
    partType: string;
    inputDataArray: string[];
  }[];
}
