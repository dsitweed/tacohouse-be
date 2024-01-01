import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { BuildingsModule } from './buildings/buildings.module';
import { RoomsModule } from './rooms/rooms.module';
import { BuildingUnitPricesModule } from './building-unit-prices/building-unit-prices.module';
import { RoomUnitPricesModule } from './room-unit-prices/room-unit-prices.module';
import { InvoicesModule } from './invoices/invoices.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { ManagersModule } from './managers/managers.module';
import { FileModule } from './firebase/file.module';
import { ChatModule } from './chat/chat.module';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().default('JWT_SECRET'),
        JWT_REFRESH_SECRET: Joi.string().default('JWT_REFRESH_SECRET'),

        JWT_ACCESS_TOKEN_DURATION: Joi.string().default('100d'),
        ALLOWED_IMAGE_MIME_TYPES: Joi.string().default(
          'image/jpeg,image/png,image/gif,image/bmp,image/webp,image/svg+xml',
        ),
        DEFAULT_MAX_IMAGE_SIZE: Joi.number().default(2097152), // 2MB

        DATABASE_URL: Joi.string().uri().required(),
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),
        FIREBASE_PRIVATE_KEY: Joi.string().required(),
        FIREBASE_STORAGE_BUCKET: Joi.string().required(),
      }),
    }),
    CoreModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    BuildingsModule,
    RoomsModule,
    BuildingUnitPricesModule,
    RoomUnitPricesModule,
    InvoicesModule,
    FacilitiesModule,
    ManagersModule,
    FileModule,
    ChatModule,
    VotesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
