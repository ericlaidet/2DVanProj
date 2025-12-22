import {
    Controller,
    Get,
    Post,
    Body,
    Req,
    Res,
    UseGuards,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService, ExportReportDto } from './reports.service';
import { QuotaService } from './quota.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(
        private reportsService: ReportsService,
        private quotaService: QuotaService,
    ) { }

    /**
     * GET /api/reports/quota
     * Get current user's quota information
     */
    @Get('quota')
    async getQuota(@Req() req: any) {
        const userId = req.user.id;
        return this.quotaService.getQuotaInfo(userId);
    }

    /**
     * POST /api/reports/export
     * Export a plan as PDF
     */
    @Post('export')
    async exportPdf(
        @Req() req: any,
        @Body() dto: ExportReportDto,
        @Res() res: Response,
    ) {
        const userId = req.user.id;

        try {
            const pdfBuffer = await this.reportsService.exportPlanAsPdf(userId, dto);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="rapport-plan-${dto.planId}.pdf"`,
            );
            res.status(HttpStatus.OK).send(pdfBuffer);
        } catch (error: any) {
            if (error.status === HttpStatus.PAYMENT_REQUIRED) {
                res.status(HttpStatus.PAYMENT_REQUIRED).json(error.response);
            } else {
                throw error;
            }
        }
    }
}
