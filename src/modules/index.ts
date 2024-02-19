import { AuthModule } from './auth/auth.module';
import { BuildingUnitPricesModule } from './building-unit-prices/building-unit-prices.module';
import { BuildingsModule } from './buildings/buildings.module';
import { ChatModule } from './chat/chat.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ManagersModule } from './managers/managers.module';
import { RoomUnitPricesModule } from './room-unit-prices/room-unit-prices.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { VotesModule } from './votes/votes.module';

export const businessModules = [
  AuthModule,
  BuildingUnitPricesModule,
  BuildingsModule,
  ChatModule,
  FacilitiesModule,
  InvoicesModule,
  ManagersModule,
  RoomUnitPricesModule,
  RoomsModule,
  UsersModule,
  VotesModule,
];
