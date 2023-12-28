import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

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
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
