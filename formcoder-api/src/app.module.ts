import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormController } from './form/form.controller';
import { HttpModule } from '@nestjs/axios';
import { FormService } from './form/form.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, FormController],
  providers: [AppService, FormService],
})
export class AppModule {}
