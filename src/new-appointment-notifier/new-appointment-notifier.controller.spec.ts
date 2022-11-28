import { Test, TestingModule } from '@nestjs/testing';
import { NewAppointmentNotifierController } from './new-appointment-notifier.controller';

describe('NewAppointmentNotifierController', () => {
  let controller: NewAppointmentNotifierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewAppointmentNotifierController],
    }).compile();

    controller = module.get<NewAppointmentNotifierController>(NewAppointmentNotifierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
