import { IsNotEmpty } from 'class-validator';
import { SequenceData } from 'src/type/sequenceData';

export class AnalyzeSeqPartInputDto {
  @IsNotEmpty()
  readonly sequence: SequenceData[];
}
