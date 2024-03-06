import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsString()
  @Length(12)
  citizenNumber: string;

  @IsString()
  @Length(10)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  citizenImageUrls?: string[];

  @IsNotEmpty()
  @IsDateString()
  dob: Date; // date of birth

  @IsNotEmpty()
  @IsInt()
  roomId: number;
}
