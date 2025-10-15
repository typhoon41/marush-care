import { WritableSignal } from '@angular/core';
import { PaginatedRequest } from '../paginated-request';

export interface TableMetadata {
    columns: Column[];
    state: WritableSignal<PaginatedRequest>;
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
