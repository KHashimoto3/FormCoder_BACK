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

@Module({
  imports: [HttpModule],
  controllers: [AppController, FormController, HintController, RecordController],
  providers: [AppService, FormService, HintService, RecordService],
})
export class AppModule {}
