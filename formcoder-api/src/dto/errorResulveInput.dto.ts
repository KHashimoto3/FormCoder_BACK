import { IsNotEmpty } from 'class-validator';

export class ErrorResulveInputDto {
  @IsNotEmpty()
  readonly errors: string[];
}
