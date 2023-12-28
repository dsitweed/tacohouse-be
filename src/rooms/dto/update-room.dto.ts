import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsNotEmpty()
  @IsNumber()
  buildingId: number;
}
