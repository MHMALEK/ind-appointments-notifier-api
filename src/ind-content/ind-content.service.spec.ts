import { Test, TestingModule } from '@nestjs/testing';
import { IndContentService } from './ind-content.service';

describe('IndServicesContentService', () => {
  let service: IndContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndContentService],
    }).compile();

    service = module.get<IndContentService>(IndContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
