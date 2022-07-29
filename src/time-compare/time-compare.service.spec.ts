import { Test, TestingModule } from '@nestjs/testing';
import { TimeCompareService } from './time-compare.service';

describe('TimeCompareService', () => {
  let service: TimeCompareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeCompareService],
    }).compile();

    service = module.get<TimeCompareService>(TimeCompareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
