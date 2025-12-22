import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubscriptionType } from '@prisma/client';

// Subscription quota limits
const QUOTA_LIMITS: Record<SubscriptionType, number> = {
    FREE: 1,
    PRO1: 3,
    PRO2: 10,
    PRO3: 50,
};

@Injectable()
export class QuotaService {
    constructor(private prisma: PrismaService) { }

    /**
     * Check if user has remaining quota for PDF exports
     */
    async checkQuota(userId: number): Promise<{
        hasQuota: boolean;
        used: number;
        limit: number;
        resetDate: Date | null;
    }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                subscription: true,
                reportsUsedThisMonth: true,
                reportQuotaResetAt: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Initialize quota if needed
        const now = new Date();
        const needsReset =
            !user.reportQuotaResetAt || user.reportQuotaResetAt <= now;

        if (needsReset) {
            // Reset quota for new month
            const nextMonth = new Date(now);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            nextMonth.setDate(1);
            nextMonth.setHours(0, 0, 0, 0);

            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    reportsUsedThisMonth: 0,
                    reportQuotaResetAt: nextMonth,
                },
            });

            const limit = QUOTA_LIMITS[user.subscription as SubscriptionType];
            return {
                hasQuota: true,
                used: 0,
                limit,
                resetDate: nextMonth,
            };
        }

        const used = user.reportsUsedThisMonth;
        const limit = QUOTA_LIMITS[user.subscription as SubscriptionType];
        const hasQuota = used < limit;

        return {
            hasQuota,
            used,
            limit,
            resetDate: user.reportQuotaResetAt,
        };
    }

    /**
     * Increment usage counter after successful export
     */
    async incrementUsage(userId: number): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                reportsUsedThisMonth: { increment: 1 },
            },
        });
    }

    /**
     * Get quota info for display in UI
     */
    async getQuotaInfo(userId: number) {
        const quota = await this.checkQuota(userId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { subscription: true },
        });

        return {
            tier: user?.subscription,
            used: quota.used,
            remaining: quota.limit - quota.used,
            limit: quota.limit,
            resetDate: quota.resetDate,
            hasQuota: quota.hasQuota,
        };
    }
}
