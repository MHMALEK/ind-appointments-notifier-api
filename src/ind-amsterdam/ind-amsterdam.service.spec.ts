import { Test, TestingModule } from '@nestjs/testing';
import { IndAmsterdamService } from './ind-amsterdam.service';

describe('IndAmsterdamService', () => {
  let service: IndAmsterdamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndAmsterdamService],
    }).compile();

    service = module.get<IndAmsterdamService>(IndAmsterdamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
