import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/,
    {
      message:
        'Password should length at least 6 and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
    },
  )
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  address: string;

  @IsString()
  @Length(12, 12)
  citizenNumber: string;

  @IsString()
  @MinLength(10)
  phoneNumber: string;

  @IsString()
  avatarUrl: string;

  citizenImageUrl: string[];

  @IsString()
  dob: string; // dob
}

export class UpdateUserDtoPartial extends PartialType(UpdateUserDto) {}
