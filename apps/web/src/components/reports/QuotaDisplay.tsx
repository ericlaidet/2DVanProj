// apps/web/src/components/reports/QuotaDisplay.tsx
import React, { useEffect, useState } from 'react';
import reportsService, { QuotaInfo } from '../../services/reports.service';
import './QuotaDisplay.css';

const QuotaDisplay: React.FC = () => {
    const [quota, setQuota] = useState<QuotaInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchQuota = async () => {
        try {
            const data = await reportsService.getQuota();
            setQuota(data);
        } catch (err) {
            console.error('Failed to fetch quota:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuota();

        // Refresh quota every minute or on demand
        const interval = setInterval(fetchQuota, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading || !quota) return null;

    return (
        <div className="quota-display">
            <div className="quota-info">
                <span className="quota-label">Exports PDF :</span>
                <span className={`quota-value ${quota.remaining === 0 ? 'exhausted' : ''}`}>
                    {quota.used} / {quota.limit}
                </span>
            </div>
            <div className="quota-bar-container">
                <div
                    className="quota-bar-fill"
                    style={{ width: `${(quota.used / quota.limit) * 100}%` }}
                />
            </div>
            {quota.remaining <= 1 && quota.remaining > 0 && (
                <span className="quota-warning">Dernier export disponible !</span>
            )}
            {quota.remaining === 0 && (
                <span className="quota-exhausted">Quota atteint</span>
            )}
        </div>
    );
};

export default QuotaDisplay;
