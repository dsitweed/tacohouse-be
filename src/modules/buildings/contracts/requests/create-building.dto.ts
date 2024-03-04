import { BuildingType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateBuildingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(BuildingType)
  @IsNotEmpty()
  type: BuildingType;

  @IsString()
  ward: string;

  @IsString()
  district: string;

  @IsString()
  province: string;
}
