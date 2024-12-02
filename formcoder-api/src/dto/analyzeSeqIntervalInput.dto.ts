import { IsNotEmpty } from 'class-validator';
import { SequenceData } from 'src/type/sequenceData';

export class AnalyzeSeqIntervalInputDto {
  @IsNotEmpty()
  readonly intervalTime: number;
  @IsNotEmpty()
  readonly sequence: SequenceData[];
}
