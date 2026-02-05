import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IncidentsFacade } from '../../incidents/application/incidents.facade';
import { DashboardMetricsRules, KpiMetric } from '../domain/dashboard-metrics.model';

/**
 * Facade for the Dashboard feature.
 * Orchestrates data from other features (Incidents, Deployments) to provide reactive KPIs.
 * 
 * DESIGN: Read-only orchestration layer. No direct HTTP calls allowed.
 */
@Injectable()
export class DashboardFacade {
    private readonly incidentsFacade = inject(IncidentsFacade);

    // Reactive signals derived from Incidents
    private readonly incidents = toSignal(this.incidentsFacade.incidents$, { initialValue: [] });

    // Summary Metrics
    readonly metrics = computed<KpiMetric[]>(() => [
        {
            label: 'Incidentes Abiertos',
            value: DashboardMetricsRules.calculateOpen(this.incidents()),
            color: 'var(--status-open)',
            icon: 'alert-circle'
        },
        {
            label: 'En Progreso',
            value: DashboardMetricsRules.calculateInProgress(this.incidents()),
            color: 'var(--status-progress)',
            icon: 'clock'
        },
        {
            label: 'Resueltos Hoy',
            value: DashboardMetricsRules.calculateResolvedToday(this.incidents()),
            color: 'var(--status-resolved)',
            icon: 'check-circle'
        },
        {
            label: 'Violaciones SLA',
            value: DashboardMetricsRules.calculateSlaViolations(this.incidents()),
            color: 'var(--status-error)',
            icon: 'timer-off'
        }
    ]);

    readonly severityDistribution = computed(() =>
        DashboardMetricsRules.calculateSeverityDistribution(this.incidents())
    );

    readonly trendData = computed(() =>
        DashboardMetricsRules.calculateTrend(this.incidents())
    );

    readonly totalIncidents = computed(() => this.incidents().length);

    constructor() {
        // Ensure incidents are loaded
        this.incidentsFacade.loadIncidents();
    }
}
