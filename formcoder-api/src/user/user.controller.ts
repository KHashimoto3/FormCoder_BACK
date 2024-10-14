import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpService } from '@nestjs/axios';
import { UserRegisterInputDto } from '../dto/userRegisterInput.dto';
import { LoginInputDto } from '../dto/loginInput.dto';
import { LoginOutput } from 'src/type/loginOutput';

@Controller('user')
export class UserController {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  //cloud firestoreにユーザー情報をpushする
  @Post('/register')
  registUser(
    @Body() registUserDataDto: UserRegisterInputDto,
  ): Promise<{ message: string }> {
    return this.userService.registUser(registUserDataDto);
  }

  //ログイン
  @Post('/login')
  login(
    @Body() loginUserDataDto: LoginInputDto,
  ): Promise<{ userData: LoginOutput }> {
    return this.userService.login(
      loginUserDataDto.userId,
      loginUserDataDto.password,
    );
  }
}
