export interface GridOptions {
    sortable?: boolean;
    filterable?: boolean;
    pageSize?: number; // Default number of rows per page
}
export interface Row {
    id: number;
    [key: string]: any; // or define specific fields if the data is static
}
 export interface Column {
    headerName: string;
    field: string;
    sortable?: boolean;
    filterable?: boolean;
    width?: number;
    editable?: boolean; // To enable cell editing
}

export interface GridComponentProps {
    columns: Column[];
    rows: Row[];
    gridOptions?: GridOptions;
}
