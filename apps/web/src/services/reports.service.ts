// apps/web/src/services/reports.service.ts
import { apiFetch } from '../api/api';

export interface ExportReportData {
    planId: number;
    screenshot2D: string;
    screenshots3D?: {
        front?: string;
        side?: string;
        iso?: string;
    };
}

export interface QuotaInfo {
    tier: string;
    used: number;
    remaining: number;
    limit: number;
    resetDate: string;
    hasQuota: boolean;
}

const reportsService = {
    /**
     * Export a plan as PDF
     */
    async exportPdf(data: ExportReportData): Promise<void> {
        try {
            const blob = await apiFetch('/reports/export', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (!(blob instanceof Blob)) {
                throw new Error('Expected blob from export API');
            }

            // Create a link to download the file
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `rapport-plan-${data.planId}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('Error exporting PDF:', error);
            throw error;
        }
    },

    /**
     * Get current user quota info
     */
    async getQuota(): Promise<QuotaInfo> {
        return apiFetch('/reports/quota');
    }
};

export default reportsService;
