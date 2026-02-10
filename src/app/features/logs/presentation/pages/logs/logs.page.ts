import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsSearchComponent } from '../../components/organisms/logs-search/logs-search.component';
import { LogsViewerComponent } from '../../components/organisms/logs-viewer/logs-viewer.component';
import { QuickFiltersComponent } from '../../components/molecules/quick-filters/quick-filters.component';

@Component({
    selector: 'app-logs-page',
    standalone: true,
    imports: [CommonModule, LogsSearchComponent, LogsViewerComponent, QuickFiltersComponent],
    templateUrl: './logs.page.html',
    styleUrls: ['./logs.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsPage { }
