import { IsString, IsInt, MinDate, IsDataURI, IsDateString, IsNotEmpty } from 'class-validator';

export class SignUpDTO {
    email: string;
    password: string;
    role: string;
  }

export class LoginDTO {
  email: string;
  password: string;
}

export class CreateEventDTO {

  @IsString()
  @IsNotEmpty()
  eventName: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  ownerId: number;
}