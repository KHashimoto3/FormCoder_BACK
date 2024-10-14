import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { CodeFormatterService } from './code-formatter/code-formatter.service';
import { CodeFormatterController } from './code-formatter/code-formatter.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, CodeFormatterController],
  providers: [AppService, CodeFormatterService],
})
export class AppModule {}
