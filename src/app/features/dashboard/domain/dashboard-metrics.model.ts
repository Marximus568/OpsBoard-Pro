import { Incident } from '../../incidents/domain/models/incident.entity';
import { IncidentStatus } from '../../incidents/domain/models/incident-status.enum';
import { IncidentPriority } from '../../incidents/domain/models/incident-priority.enum';

/**
 * KPI Metric model for summarized data.
 */
export interface KpiMetric {
    label: string;
    value: number;
    color: string;
    icon?: string;
}

/**
 * Data for distribution charts (Pie/Bar).
 */
export interface SeverityDistribution {
    priority: string;
    count: number;
    percentage: number;
}

/**
 * Data for trend charts (Line/Area).
 */
export interface TrendPoint {
    date: string;
    count: number;
}

/**
 * Pure functions for Dashboard metrics calculation.
 * DESIGN: Business logic separated from Angular/RxJS for maximum portability and testability.
 */
export class DashboardMetricsRules {

    static calculateOpen(incidents: Incident[]): number {
        return incidents.filter(i => i.status === IncidentStatus.OPEN).length;
    }

    static calculateInProgress(incidents: Incident[]): number {
        return incidents.filter(i => i.status === IncidentStatus.IN_PROGRESS).length;
    }

    static calculateResolvedToday(incidents: Incident[]): number {
        const today = new Date().toDateString();
        return incidents.filter(i =>
            i.status === IncidentStatus.RESOLVED &&
            i.updatedAt.toDateString() === today
        ).length;
    }

    /**
     * SLA Violation rule: Logic can be refined based on priority and elapsed time.
     * For now, it uses a placeholder logic (e.g., incidents open > 24h).
     */
    static calculateSlaViolations(incidents: Incident[]): number {
        const now = new Date();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        return incidents.filter(i =>
            i.status !== IncidentStatus.RESOLVED &&
            i.status !== IncidentStatus.CLOSED &&
            (now.getTime() - i.createdAt.getTime()) > ONE_DAY_MS
        ).length;
    }

    /**
     * Calculates the count and percentage for each severity/priority level.
     */
    static calculateSeverityDistribution(incidents: Incident[]): SeverityDistribution[] {
        const priorities = Object.values(IncidentPriority);
        const total = incidents.length || 1;

        return priorities.map(p => {
            const count = incidents.filter(i => i.priority === p).length;
            return {
                priority: p,
                count,
                percentage: Number(((count / total) * 100).toFixed(1))
            };
        });
    }

    /**
     * Calculates an incident trend over the last 7 days.
     */
    static calculateTrend(incidents: Incident[]): TrendPoint[] {
        const trend: TrendPoint[] = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const count = incidents.filter(inc => {
                const incDate = inc.createdAt.toISOString().split('T')[0];
                return incDate === dateStr;
            }).length;

            trend.push({ date: dateStr, count });
        }

        return trend;
    }
}
