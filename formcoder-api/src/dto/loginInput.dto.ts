import { IsNotEmpty } from 'class-validator';

export class LoginInputDto {
  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  readonly password: string;
}
