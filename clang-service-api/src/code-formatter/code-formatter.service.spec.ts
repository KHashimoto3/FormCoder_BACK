import { Test, TestingModule } from '@nestjs/testing';
import { CodeFormatterService } from './code-formatter.service';

describe('CodeFormatterService', () => {
  let service: CodeFormatterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeFormatterService],
    }).compile();

    service = module.get<CodeFormatterService>(CodeFormatterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
