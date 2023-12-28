import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MeModule } from './me/me.module';

@Module({
  imports: [MeModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
