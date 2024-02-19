import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBuildingUnitPriceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  buildingId: number;
}
