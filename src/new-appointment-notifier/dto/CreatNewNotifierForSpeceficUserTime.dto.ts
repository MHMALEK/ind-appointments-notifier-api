import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { GetSoonestAppointmentDTO } from 'src/appointments/DTO/getSoonestAppointment.dto';

export class CreatNewNotifierForSpeceficUserTimeDTO extends GetSoonestAppointmentDTO {
  @IsNotEmpty()
  telegramId: string;
  @IsNotEmpty()
  date: string;
  @Optional()
  email: string;
}

export class CreatNewNotifierForSpeceficUserTimeViaEmailDTO extends GetSoonestAppointmentDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  date: string;
  @Optional()
  telegramId: string;
}
