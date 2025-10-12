import { Signal } from '@angular/core';
import { PaginatedRequest } from '../request.model';

export interface TableMetadata {
    columns: Column[];
    state: Signal<PaginatedRequest>;
}

export interface Column {
    name: string;
    displayName: string;
    className?: string;
    hidden: boolean;
    sortable: boolean;
}

export interface PaginatedResponse {
    items: Record<string, string>[];
    totalCount: number;
}
