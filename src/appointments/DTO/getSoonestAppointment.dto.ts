import { IsNotEmpty, IsOptional } from 'class-validator';
import IND_DESKS from 'src/types/ind-desks';
import IND_SERVICES from 'src/types/ind-services';

export class GetSoonestAppointmentDTO {
  @IsNotEmpty()
  service: IND_SERVICES;

  @IsNotEmpty()
  desk: IND_DESKS;

  @IsOptional()
  numberOfPeople: string;
}
