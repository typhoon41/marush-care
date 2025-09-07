export interface TableMetadata {
    columns: Column[];
    sortedBy: string;
    sortedDirection: 'asc' | 'desc';
}

export interface Column {
    name: string;
    displayName: string;
    className?: string;
    hidden: boolean;
    sortable: boolean;
}
