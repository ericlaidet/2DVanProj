import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { QuotaService } from './quota.service';
import { PdfService } from './pdf.service';
import { PrismaModule } from '../prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ReportsController],
    providers: [ReportsService, QuotaService, PdfService],
    exports: [ReportsService, QuotaService],
})
export class ReportsModule { }
