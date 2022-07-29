import { Test, TestingModule } from '@nestjs/testing';
import { IndAppointmentsService } from './ind-appointments.service';

describe('IndAppointmentsService', () => {
  let service: IndAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndAppointmentsService],
    }).compile();

    service = module.get<IndAppointmentsService>(IndAppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
