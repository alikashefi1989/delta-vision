import "react-table";

declare module "react-table" {
    export interface UseTableInstanceProps<D extends object> {
        resetResizing: () => void;
    }
    export interface UseTableColumnProps<D extends object> {
        getResizerProps: () => void;
        isResizing: boolean;
        canResize: boolean;
    }
    export interface TableOptions {
        [key: string]: any
        autoResetPage?: any
    }
    export interface TableState<D extends object = {}> {
        selectedRowIds?: { [key: string]: boolean; };
        columnOrder?: Array<string>;
        sortBy?: Array<{ id: string; desc?: boolean; }>;
    }
    export interface HeaderGroup<D> {
        getSortByToggleProps: () => any;
        isSorted: boolean;
        isSortedDesc: boolean;
        canSort: boolean;
        clearSortBy?: () => any;
        toggleSortBy?: (desc: boolean, multi?: boolean) => any;
        forceMaxWidth?: number;
        // appCanSort?: boolean;
        forceOrder?: number;
        style?: React.CSSProperties;
    }
}
