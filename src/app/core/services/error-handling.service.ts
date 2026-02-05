import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from './logging.service';

export enum ErrorCategory {
    NETWORK,
    AUTH,
    BUSINESS,
    UNKNOWN
}

export interface AppError {
    category: ErrorCategory;
    message: string;
    originalError?: any;
}

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlingService {
    constructor(private loggingService: LoggingService) { }

    handleError(error: any): AppError {
        const normalizedError = this.normalizeError(error);
        this.loggingService.error('Error handled:', normalizedError);
        return normalizedError;
    }

    private normalizeError(error: any): AppError {
        if (error instanceof HttpErrorResponse) {
            if (error.status === 401 || error.status === 403) {
                return { category: ErrorCategory.AUTH, message: 'Authentication error', originalError: error };
            }
            return { category: ErrorCategory.NETWORK, message: 'Network error', originalError: error };
        }

        // Taxonomy extension point
        return { category: ErrorCategory.UNKNOWN, message: 'An unexpected error occurred', originalError: error };
    }
}
