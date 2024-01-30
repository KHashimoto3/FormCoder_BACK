import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammService } from './programm.service';

describe('ProgrammService', () => {
  let service: ProgrammService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgrammService],
    }).compile();

    service = module.get<ProgrammService>(ProgrammService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
