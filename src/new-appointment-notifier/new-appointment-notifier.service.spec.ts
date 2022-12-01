import { Test, TestingModule } from '@nestjs/testing';
import { NewAppointmentNotifierService } from './new-appointment-notifier.service';

describe('NewAppointmentNotifierService', () => {
  let service: NewAppointmentNotifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewAppointmentNotifierService],
    }).compile();

    service = module.get<NewAppointmentNotifierService>(
      NewAppointmentNotifierService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
