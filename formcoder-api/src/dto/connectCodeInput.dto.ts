import { IsNotEmpty } from 'class-validator';
import { CodingFormData } from 'src/type/formData';
import { InputData } from 'src/type/inputData';

export class ConnectCodeInputDto {
  @IsNotEmpty()
  readonly formData: CodingFormData[];
  @IsNotEmpty()
  readonly inputData: InputData[];
}
