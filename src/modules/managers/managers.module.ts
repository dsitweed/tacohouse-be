import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { InvoicesModule } from 'src/modules/invoices/invoices.module';

@Module({
  imports: [InvoicesModule],
  controllers: [ManagersController],
  providers: [ManagersService],
})
export class ManagersModule {}
