import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QuotaService } from './quota.service';
import { PdfService } from './pdf.service';

interface FurnitureItem {
    id: string;
    name: string;
    type: string;
    x: number;
    y: number;
    z?: number;
    width: number;
    height: number;
    depth?: number;
}

export interface ExportReportDto {
    planId: number;
    screenshot2D: string;
    screenshots3D?: {
        front?: string;
        side?: string;
        iso?: string;
    };
}

@Injectable()
export class ReportsService {
    constructor(
        private prisma: PrismaService,
        private quotaService: QuotaService,
        private pdfService: PdfService,
    ) { }

    /**
     * Export plan as PDF with quota validation
     */
    async exportPlanAsPdf(userId: number, dto: ExportReportDto): Promise<Buffer> {
        // Check quota
        const quota = await this.quotaService.checkQuota(userId);
        if (!quota.hasQuota) {
            throw new HttpException(
                {
                    message: 'Quota mensuel dépassé',
                    quota: {
                        used: quota.used,
                        limit: quota.limit,
                        resetDate: quota.resetDate,
                    },
                },
                HttpStatus.PAYMENT_REQUIRED,
            );
        }

        // Fetch plan data
        const plan = await this.prisma.plan.findFirst({
            where: { id: dto.planId, userId },
            include: {
                user: { select: { name: true } },
                planVans: { include: { van: true } },
            },
        });

        if (!plan) {
            throw new HttpException('Plan non trouvé', HttpStatus.NOT_FOUND);
        }

        const van = plan.planVans[0]?.van;
        if (!van) {
            throw new HttpException('Van non trouvé pour ce plan', HttpStatus.BAD_REQUEST);
        }

        // Parse furniture data with safe defaults for dimensions
        const furniture = (Array.isArray(plan.jsonData)
            ? plan.jsonData
            : []).map((item: any) => ({
                ...item,
                width: item.width || 500,
                height: item.height || 500,
                name: item.name || item.type || 'Meuble inconnu',
            })) as unknown as FurnitureItem[];

        // Generate PDF
        const pdfBuffer = await this.pdfService.generatePdf({
            planId: plan.id,
            userName: plan.user.name,
            vanModel: van.displayName,
            vanDimensions: {
                length: van.length,
                width: van.width,
                height: van.height || 2000, // Default height if not in DB
            },
            furniture,
            screenshot2D: dto.screenshot2D,
            screenshots3D: dto.screenshots3D,
        });

        // Increment usage
        await this.quotaService.incrementUsage(userId);

        return pdfBuffer;
    }
}
