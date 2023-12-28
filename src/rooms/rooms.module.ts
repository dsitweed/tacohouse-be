import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { BuildingsModule } from 'src/buildings/buildings.module';

@Module({
  imports: [BuildingsModule],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
