import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpService } from '@nestjs/axios';
import { UserRegisterInputDto } from 'src/dto/userRegisterInput.dto';

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
}
