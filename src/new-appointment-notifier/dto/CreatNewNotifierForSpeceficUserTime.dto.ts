import { IsNotEmpty } from 'class-validator';
import { GetSoonestAppointmentDTO } from 'src/appointments/DTO/getSoonestAppointment.dto';

export class CreatNewNotifierForSpeceficUserTimeDTO extends GetSoonestAppointmentDTO {
  @IsNotEmpty()
  telegramId: string;
  @IsNotEmpty()
  date: string;
}
