import { FacilityStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFacilityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(FacilityStatus)
  status?: FacilityStatus;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsOptional()
  @IsInt()
  buyPrice?: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsNotEmpty()
  @IsInt()
  facilityTypeId: number;

  @IsNotEmpty()
  @IsInt()
  roomId: number;
}
