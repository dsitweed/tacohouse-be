import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppInterceptorModule } from './common/interceptor/interceptor.module';
import { AppConfigModule } from './config/config.module';
import { FileModule } from './firebase/file.module';
import { businessModules } from './modules';

@Module({
  imports: [
    AppConfigModule,
    AppInterceptorModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    FileModule,
    ...businessModules,
  ],
  controllers: [AppController],
})
export class AppModule {}
