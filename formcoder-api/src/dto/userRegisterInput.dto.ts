import { IsNotEmpty } from 'class-validator';

export class UserRegisterInputDto {
  @IsNotEmpty()
  readonly userId: string;
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  readonly icon: string;
  @IsNotEmpty()
  readonly email: string;
}
