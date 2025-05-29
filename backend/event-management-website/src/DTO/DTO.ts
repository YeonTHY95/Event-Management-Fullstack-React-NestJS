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

export class UpdateEventDTO {

  @IsInt()
  @IsNotEmpty()
  eventID: number;

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

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsInt()
  ownerId: number;
}

export class DeleteEventDTO {
  @IsInt()
  @IsNotEmpty()
  selectedEvents: number[];

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}