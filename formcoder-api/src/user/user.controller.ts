import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpService } from '@nestjs/axios';

@Controller('user')
export class UserController {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  //cloud firestoreにユーザー情報をpushする
  @Post('/register')
  registUser(): Promise<{ message: string }> {
    return this.userService.registUser();
  }
}
