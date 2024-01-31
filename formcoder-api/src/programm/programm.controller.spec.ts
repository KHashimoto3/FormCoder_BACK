import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammController } from './programm.controller';

describe('ProgrammController', () => {
  let controller: ProgrammController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgrammController],
    }).compile();

    controller = module.get<ProgrammController>(ProgrammController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
