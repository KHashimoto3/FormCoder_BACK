import { IsNotEmpty } from 'class-validator';

export class RecordInputDto {
  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  readonly formName: string;

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
}
