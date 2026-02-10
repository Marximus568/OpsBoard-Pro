import { Incident } from '../../incidents/domain/models/incident.entity';
import { IncidentStatusEnum } from '../../incidents/domain/value-objects/incident-status.vo';
import { PriorityLevel } from '../../incidents/domain/value-objects/priority.vo';

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
        return incidents.filter(i => i.status.value === IncidentStatusEnum.OPEN).length;
    }

    static calculateInProgress(incidents: Incident[]): number {
        return incidents.filter(i => i.status.value === IncidentStatusEnum.IN_PROGRESS).length;
    }

    static calculateResolvedToday(incidents: Incident[]): number {
        const today = new Date().toDateString();
        return incidents.filter(i =>
            i.status.value === IncidentStatusEnum.RESOLVED &&
            i.updatedAt.toDateString() === today
        ).length;
    }

    static calculateSlaViolations(incidents: Incident[]): number {
        // Checking explicit slaBreached property or logic based on creation time
        return incidents.filter(i => i.slaBreached).length;
    }

    /**
     * Calculates average resolution time in hours for resolved incidents.
     */
    static calculateAverageResolutionTime(incidents: Incident[]): number {
        const resolved = incidents.filter(i =>
            i.status.value === IncidentStatusEnum.RESOLVED &&
            i.resolvedAt
        );

        if (resolved.length === 0) return 0;

        const totalHours = resolved.reduce((acc, current) => {
            const diff = current.resolvedAt!.getTime() - current.createdAt.getTime();
            return acc + (diff / (1000 * 60 * 60));
        }, 0);

        return Number((totalHours / resolved.length).toFixed(1));
    }

    /**
     * Calculates the count and percentage for each severity/priority level.
     */
    static calculateSeverityDistribution(incidents: Incident[]): SeverityDistribution[] {
        const priorities = Object.values(PriorityLevel);
        const total = incidents.length || 1;

        return priorities.map(p => {
            const count = incidents.filter(i => i.priority.value === p).length;
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
