import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormController } from './form/form.controller';
import { HttpModule } from '@nestjs/axios';
import { FormService } from './form/form.service';
import { HintController } from './hint/hint.controller';
import { HintService } from './hint/hint.service';
import { RecordController } from './record/record.controller';
import { RecordService } from './record/record.service';
import { ProgrammController } from './programm/programm.controller';
import { ProgrammService } from './programm/programm.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, FormController, HintController, RecordController, ProgrammController, UserController],
  providers: [AppService, FormService, HintService, RecordService, ProgrammService, UserService],
})
export class AppModule {}
