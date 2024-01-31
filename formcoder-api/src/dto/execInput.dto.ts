import { IsNotEmpty } from 'class-validator';

export class execInputDto {
  @IsNotEmpty()
  code: string;
  input: string;
}
