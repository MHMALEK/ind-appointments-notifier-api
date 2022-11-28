import { Test, TestingModule } from '@nestjs/testing';
import { IndServicesContentService } from './ind-services-content.service';

describe('IndServicesContentService', () => {
  let service: IndServicesContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndServicesContentService],
    }).compile();

    service = module.get<IndServicesContentService>(IndServicesContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
