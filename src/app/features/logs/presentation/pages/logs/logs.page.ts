import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterBarComponent } from '../../components/molecules/search-filter-bar/search-filter-bar.component';
import { LogsViewerComponent } from '../../components/organisms/logs-viewer/logs-viewer.component';

@Component({
    selector: 'app-logs-page',
    standalone: true,
    imports: [CommonModule, SearchFilterBarComponent, LogsViewerComponent],
    templateUrl: './logs.page.html',
    styleUrls: ['./logs.page.scss']
})
export class LogsPage { }
