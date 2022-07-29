import { Test, TestingModule } from '@nestjs/testing';
import { IndAmsterdamController } from './ind-amsterdam.controller';

describe('IndAmsterdamController', () => {
  let controller: IndAmsterdamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndAmsterdamController],
    }).compile();

    controller = module.get<IndAmsterdamController>(IndAmsterdamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
