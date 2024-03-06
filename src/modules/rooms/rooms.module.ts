import { Module } from '@nestjs/common';
import { BuildingsModule } from 'src/modules/buildings/buildings.module';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [BuildingsModule],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
