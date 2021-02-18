import React from 'react';
import {
    useTable,
    useResizeColumns,
    Column,
    useRowSelect,
    ColumnInstance,
    useFlexLayout,
    useExpanded,
    useColumnOrder,
    useSortBy,
    TableState,
    Row,
} from 'react-table';
import { ContentLoader } from '../../form/content-loader/ContentLoader';
import { AppGridUtility, TColumnsDetail } from './AppGridUtility';

export interface IAppColumnInstance<D extends object>
    extends ColumnInstance<D> {
    title?: string;
    visibleInColumnsDetail?: boolean;
    disableSortBy?: boolean;
    forceMaxWidth?: number;
    // appCanSort?: boolean;
    forceOrder?: number;
    style?: React.CSSProperties;

    // columns: Array<IAppColumnInstance<D>>;
}

export type TAppColumn<D extends object> = Column<D> & {
    title?: string;
    visibleInColumnsDetail?: boolean;
    disableSortBy?: boolean;
    forceMaxWidth?: number;
    // appCanSort?: boolean;
    forceOrder?: number;
    style?: React.CSSProperties;

    columns?: Array<TAppColumn<D>>;
};

interface IProps<D extends object> {
    columns: Array<TAppColumn<D>>;
    data: Array<D>;
    skip: number;
    defaultColumn: Partial<TAppColumn<D>>;
    showIndexColumn: boolean;
    loading: boolean;
    setSelectedRows?: (rows: Array<D>) => any;
    selectedRowIds?: { [key: string]: boolean };
    showSelectionColumn: boolean;
    showHeader?: boolean;
    columnOrder?: Array<string>;
    hiddenColumns?: Array<string>;
    showColumnsDetail: boolean;
    setColumnOrder?: (data?: Array<string>) => any;
    setHiddenColumns?: (data?: Array<string>) => any;
    columnsDetail?: TColumnsDetail;
    sortBy?: TableState<D>['sortBy'];
    setSortBy?: (data: TableState<D>['sortBy']) => any;
    onRowClick?: (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        row: Row<D>
    ) => any;
}

export function AppGridCore<D extends object>(
    props: IProps<D>
): React.ReactElement<IProps<D>> {
    // debugger;
    // console.log('AppGridCore props.hiddenColumns', props.hiddenColumns);

    const defaultColumn = React.useMemo(() => {
        return props.defaultColumn;
    }, [props.defaultColumn]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
        state: {
            columnOrder,
            hiddenColumns,
            sortBy,
            // , ...otherState
        },
        // stateReducer,
        toggleAllRowsSelected,
        toggleRowSelected,
        flatRows,
        rowsById,
        setSortBy,
        // ...otherTableInstanceProps
    } = useTable(
        {
            columns: props.columns,
            data: props.data,
            defaultColumn,
            initialState: {
                // selectedRowIds: props.selectedRowIds || {},
                columnOrder: props.columnOrder || [],
                hiddenColumns: props.hiddenColumns || [],

                sortBy: props.sortBy || [],
            },
            // state: {
            //     selectedRowIds: props.selectedRowIds || {},
            //     columnOrder: props.columnOrder || [],
            //     hiddenColumns: props.hiddenColumns || []
            // },
            manualSortBy: true,
        },
        useFlexLayout,
        useResizeColumns,
        useSortBy,
        useExpanded,
        useRowSelect,
        useColumnOrder,
        (hooks) => {
            if (
                props.showSelectionColumn === false &&
                props.showColumnsDetail === false
            )
                return;
            hooks.visibleColumns.push((columns) => {
                const cols = [...columns];
                if (props.showSelectionColumn) {
                    cols.unshift(AppGridUtility.columns.selection());
                }
                if (props.showColumnsDetail !== false) {
                    cols.unshift(
                        AppGridUtility.columns.columnsDetail(
                            props.columnsDetail
                        )
                    );
                }
                return cols;
            });
        }
    );
    // console.log('otherState, otherTableInstanceProps: ', otherState, otherTableInstanceProps);
    // console.log('flatRows, rowsById', flatRows, rowsById);

    const {
        setSelectedRows,
        setColumnOrder,
        setHiddenColumns,
        selectedRowIds,
        sortBy: sortBy_p,
        setSortBy: setSortBy_p,
    } = props;

    React.useEffect(() => {
        if (setSelectedRows)
            setSelectedRows(selectedFlatRows.map((row: any) => row.original));
    }, [setSelectedRows, selectedFlatRows]);

    React.useEffect(() => {
        // debugger;
        if (setColumnOrder) setColumnOrder(columnOrder);
    }, [setColumnOrder, columnOrder]);

    React.useEffect(() => {
        // debugger;
        if (setHiddenColumns) setHiddenColumns(hiddenColumns);
    }, [setHiddenColumns, hiddenColumns]);

    React.useEffect(() => {
        if (flatRows.length === 0) return;
        toggleAllRowsSelected(false);
        Object.keys(selectedRowIds || {}).forEach((k) => {
            if (rowsById[k]) {
                toggleRowSelected(k, selectedRowIds![k]);
            }
        });
    }, [
        selectedRowIds,
        toggleRowSelected,
        toggleAllRowsSelected,
        flatRows,
        rowsById,
    ]);

    React.useEffect(() => {
        setSortBy(sortBy_p);
    }, [setSortBy, sortBy_p]);
    React.useEffect(() => {
        setSortBy_p && setSortBy_p(sortBy);
    }, [sortBy, setSortBy_p]);

    return (
        <>
            {/*  id="scroll_table" */}
            <div className="app-data-grid table-responsive mb-3--">
                <div
                    {...getTableProps()}
                    className="table table-light table-striped-- table-borderless-- table-head-bordered-- table-hover table-sm-- mb-0"
                >
                    {props.showHeader !== false && (
                        <div className="thead">
                            {/* {console.log('headerGroups: ', headerGroups)} */}
                            {headerGroups.map((headerGroup) => (
                                <div
                                    {...headerGroup.getHeaderGroupProps()}
                                    className="tr"
                                >
                                    {headerGroup.headers.map((column) =>
                                        AppGridUtility.columnHeader(column)
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div {...getTableBodyProps()} className="tbody">
                        {rows.map((row: any, i: any) => {
                            prepareRow(row);
                            return (
                                <div
                                    {...row.getRowProps()}
                                    className={`tr ${
                                        row.isSelected ? 'row-selected' : ''
                                    }`}
                                    onClick={(e: any) => {
                                        if (props.onRowClick) {
                                            if (
                                                e.target?.closest &&
                                                e.target.closest(
                                                    '.prevent-onRowClick'
                                                )
                                            )
                                                return;
                                            props.onRowClick(e, row);
                                        }
                                    }}
                                >
                                    {row.cells.map((cell: any) =>
                                        AppGridUtility.columnCell(cell)
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <ContentLoader
                    show={props.loading}
                    gutterClassName="gutter-0"
                />
            </div>
        </>
    );
}
