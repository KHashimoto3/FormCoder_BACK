import { Test, TestingModule } from '@nestjs/testing';
import { CodeFormatterController } from './code-formatter.controller';

describe('CodeFormatterController', () => {
  let controller: CodeFormatterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeFormatterController],
    }).compile();

    controller = module.get<CodeFormatterController>(CodeFormatterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
