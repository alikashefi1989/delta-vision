import { Formik } from 'formik';
import React, { createRef } from 'react';
import { TableState } from 'react-table';
import { Setup } from '../../../config/setup';
import { BaseModel } from '../../../model/base.model';
import { IDynamicFilter } from '../../../model/dynamicFilter.model';
import { ISearchPayload } from '../../../model/searchPayload.model';
import DynamicFilterFormControl from '../../page/_base/BaseManage/DynamicFilterFormControl';
import { BaseUtility } from '../../page/_base/BaseUtility';
import AppGrid from '../AppGrid';
import { TAppColumn } from '../AppGrid/AppGridCore';
import { AppGridUtility } from '../AppGrid/AppGridUtility';
import { GridCell } from '../GridCell/GridCell';
import { Field, FieldProps } from 'formik';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { Localization } from '../../../config/localization/localization';
import { IEntityColumn } from '../../../model/column.model';
import {
    IEntityRelated,
    IEntityRelatedAction,
} from '../../../model/related.model';
import { Utility } from '../../../asset/script/utility';
// import { AppGuid } from '../../../asset/script/guid';

interface IProps {
    // entityName: ROUTE_BASE_CRUD;
    // entityTitle: string;
    // filter: Object;
    onTotalChange?: (total: number) => any;
    // mVAId: string;
    entityId: string;
    entityRelated: IEntityRelated;
}
interface IState<D extends Object> {
    data: Array<D>;
    pagination: {
        pageCount: number;
        initialPage: number;
        limit: number;
        total: number;
    };
    filter: { [key: string]: any };
    // entityFilters: Array<IDynamicFilter>;
    gridLoading: boolean;
    selectedRows: Array<D>;
    selectedRowIds: { [key: string]: boolean };
    hiddenColumns: Array<string>;
    columnOrder: Array<string>;
    sortBy: TableState<D>['sortBy'];
    lazyLoadItems: {
        currentPage: number;
        lazyLoad: boolean;
        createScroll: boolean;
    };
    filterRowVisibility: boolean;
}

export class AppGridFull<EntityModel extends BaseModel> extends React.Component<
    IProps,
    IState<EntityModel>
> {
    state: IState<EntityModel> = {
        data: [],
        pagination: {
            pageCount: 0,
            initialPage: 0,
            limit: Setup.recordDefaultLoadLength,
            total: 0,
        },
        filter: {},
        // entityFilters: [],
        gridLoading: false,
        selectedRows: [],
        selectedRowIds: {},
        hiddenColumns: [],
        columnOrder: [],
        sortBy: [],
        lazyLoadItems: {
            currentPage: 0,
            lazyLoad: false,
            createScroll: false,
        },
        filterRowVisibility: false,
    };
    private _entityService = BaseUtility.crudService(
        this.props.entityRelated.entityName
    );
    private _columns: Array<TAppColumn<any>> = [];
    private ref_tableContainer = createRef<HTMLDivElement>();
    // private gridUUID = AppGuid.generate();

    async componentDidMount() {
        // await this.fetchFilters();
        // await this.fetchColumns();
        this.generateColumns(
            this.props.entityRelated.columns,
            this.props.entityRelated.filterOptions,
            this.props.entityRelated.action
        );
        this.handlChangeLazyLoad(true);
        this.fetchData();
    }
    private filter() {
        let filter = { ...this.state.filter };
        // filter = { $and: [filter, this.props.filter] }; // TO_DO
        return filter;
    }

    private sort(): ISearchPayload['sort'] {
        const sort: ISearchPayload['sort'] = {};
        this.state.sortBy!.forEach((s) => {
            sort[s.id] = s.desc ? -1 : 1;
        });
        if (!Object.keys(sort).length) return;
        return sort;
    }

    private handlChangeLazyLoad(value: boolean) {
        this.setState({
            lazyLoadItems: {
                ...this.state.lazyLoadItems,
                lazyLoad: value,
            },
        });
    }

    private async handleCurrentPage() {
        await this.setState({
            lazyLoadItems: {
                ...this.state.lazyLoadItems,
                currentPage: this.state.pagination.initialPage
                    ? this.state.pagination.initialPage *
                      (this.state.pagination.limit /
                          Setup.recordDefaultLoadLength)
                    : 0,
            },
        });
    }

    private hasScroll() {
        let target = this.getTable();
        if (target) {
            if (target.scrollHeight > target.clientHeight) {
            } else {
                let endCondition =
                    (this.state.pagination.limit /
                        Setup.recordDefaultLoadLength) *
                    (this.state.pagination.initialPage + 1);
                if (this.state.lazyLoadItems.currentPage + 1 < endCondition) {
                    this.setState({
                        lazyLoadItems: {
                            ...this.state.lazyLoadItems,
                            createScroll: true,
                            currentPage:
                                this.state.lazyLoadItems.currentPage + 1,
                        },
                    });
                    this.fetchData();
                }
            }
        }
    }

    private checkScrollEnded() {
        let target: HTMLElement | any = this.getTable();
        if (target) {
            target.addEventListener('scroll', () => {
                if (
                    target.scrollTop >=
                    target.scrollHeight - target.offsetHeight
                ) {
                    let endCondition =
                        (this.state.pagination.limit /
                            Setup.recordDefaultLoadLength) *
                        (this.state.pagination.initialPage + 1);
                    if (
                        this.state.lazyLoadItems.currentPage + 1 <
                        endCondition
                    ) {
                        this.setState({
                            lazyLoadItems: {
                                ...this.state.lazyLoadItems,
                                createScroll: true,
                                currentPage:
                                    this.state.lazyLoadItems.currentPage + 1,
                            },
                        });
                        this.fetchData();
                    }
                }
            });
        }
    }

    private goToTableTop() {
        let target = this.getTable();
        if (target) {
            target.scrollTo(0, 0);
        }
    }

    private defaultPagination() {
        return {
            page: this.state.pagination.initialPage,
            limit: this.state.pagination.limit,
        };
    }

    private lazyLoadPagination() {
        return {
            page: this.state.lazyLoadItems.currentPage,
            limit: Setup.recordDefaultLoadLength,
        };
    }

    private getTable = () => {
        // debugger;
        const target = this.ref_tableContainer.current;
        if (target) {
            return target.querySelector('.app-data-grid'); // #scroll_table
        }
    };

    private async fetchData() {
        let { lazyLoad, createScroll } = this.state.lazyLoadItems;
        // debugger;
        if (lazyLoad && !createScroll) {
            await this.handleCurrentPage();
        }
        this.setState({ gridLoading: true });
        try {
            const res = await this._entityService.relatedSearch(
                {
                    pagination: lazyLoad
                        ? this.lazyLoadPagination()
                        : this.defaultPagination(),
                    sort: this.sort(),
                    filter: this.filter(),
                },
                this.props.entityRelated.mVAId,
                this.props.entityId
            );
            this.props.onTotalChange &&
                this.props.onTotalChange(
                    res.data.data.explain.pagination.total
                );

            if (lazyLoad && !createScroll) {
                this.goToTableTop();
            }
            this.setState({
                data:
                    lazyLoad && createScroll
                        ? [...this.state.data, ...res.data.data.items]
                        : res.data.data.items,
                pagination: {
                    ...this.state.pagination,
                    pageCount: this.pageCount(
                        res.data.data.explain.pagination.total,
                        this.state.pagination.limit
                    ),
                    total: res.data.data.explain.pagination.total,
                },
                gridLoading: false,
                lazyLoadItems: {
                    ...this.state.lazyLoadItems,
                    createScroll: false,
                },
            });
            if (lazyLoad) {
                this.hasScroll();
            }
        } catch (e) {
            this.setState({ gridLoading: false });
            // this.handleError({ error: e.response, toastOptions: { toastId: 'fetchData_error' } });
        }
    }
    private pageCount(total: number, limit: number): number {
        return Math.ceil(total / limit);
    }
    // private async fetchFilters() {
    //     try {
    //         const res = await this._entityService.filters();
    //         this.setState({ entityFilters: res.data.data.items });
    //     } catch (e) {
    //         // this.handleError({ error: e.response, toastOptions: { toastId: 'fetchFilters_error' } });
    //     }
    // }

    private _F2FSymbol = '___';
    private F2FReplaceSymbolWith(key: string): string {
        return key.replace(new RegExp(this._F2FSymbol, 'gi'), '.');
    }
    private F2FReplaceWithSymbol(key: string): string {
        return key.replace(/\./gi, this._F2FSymbol);
    }
    private filter2Form(filterValues: Object): Object {
        const v: any = { ...filterValues };
        Object.keys(v).forEach((k) => {
            if (k.includes('.')) {
                const newKey = this.F2FReplaceWithSymbol(k);
                v[newKey] = v[k];
                delete v[k];
            }
        });
        return v;
    }
    private form2Filter(formValues: Object): Object {
        const v: any = { ...formValues };
        Object.keys(v).forEach((k) => {
            if (k.includes(this._F2FSymbol)) {
                const newKey = this.F2FReplaceSymbolWith(k);
                v[newKey] = v[k];
                delete v[k];
            }
        });
        return v;
    }

    // private async fetchColumns() {
    //     try {
    //         const res = await this._entityService.columns();
    //         this.generateColumns(res.data.data.columns);
    //     } catch (e) {
    //         // this.handleError({ error: e.response, toastOptions: { toastId: 'fetchColumns_error' } });
    //     }
    // }

    private async generateColumns(
        entityColumns: Array<IEntityColumn>,
        entityFilters: Array<IDynamicFilter>,
        actions?: Array<IEntityRelatedAction>
    ) {
        // debugger;
        const hiddenColumns: Array<string> = [];
        // const entityFilters = this.state.entityFilters;
        const columns: Array<TAppColumn<any>> = entityColumns.map((c) => {
            if (c.hidden === true) hiddenColumns.push(c.accessor);
            const ef = entityFilters.find((ef) => ef.key === c.accessor);
            return {
                ...this.emptyColumn(),
                accessor: c.accessor! + '', //_filter
                // isVisible: !(c.hidden === true),
                // show: !(c.hidden === true),
                columns: [
                    {
                        Header: c.header,
                        accessor: c.accessor,
                        title: c.title,
                        Cell: GridCell.render(c),
                        disableSortBy: c.sortable === false ? true : false,
                        // isVisible: !(c.hidden === true),
                        // show: !(c.hidden === true),
                        columns: [
                            {
                                ...this.emptyColumn(),
                                accessor: c.accessor! + '', //_filter
                                title: c.title,
                                Header: () => {
                                    if (!ef) return <span></span>;
                                    return (
                                        <div className="grid-full-filter-element-wrapper">
                                            <DynamicFilterFormControl
                                                dynamicFilter={ef}
                                                // entityName={ef.entity?.name}
                                                name={this.F2FReplaceWithSymbol(
                                                    ef.key
                                                )}
                                                controlClassName=""
                                            />
                                        </div>
                                    );
                                },
                                style: { zIndex: 2 },
                                // isVisible: !(c.hidden === true),
                                // show: !(c.hidden === true),
                                columns: [
                                    {
                                        ...this.emptyColumn(),
                                        accessor: c.accessor! + '', //_action
                                        title: c.title,
                                        visibleInColumnsDetail: true,
                                        Cell: GridCell.render(c),
                                        // isVisible: !(c.hidden === true),
                                        // show: !(c.hidden === true),
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
        });

        columns.unshift(this.filterActionColumn());
        columns.push(this.headerActionsColumn(actions));
        columns.push(this.filterToggleColumn());
        columns.push(this.columnsDetailColumn());

        // await Utility.waitOnMe(1500);
        this._columns = columns;
        // debugger;
        // console.log('generate hidden/Columns', this.state.hiddenColumns, hiddenColumns);
        // console.warn('generate', this.state, hiddenColumns);
        // this.setState({ hiddenColumns });
        this.setState((s) => {
            return { ...s, hiddenColumns };
        });
        // setTimeout(() => {
        //     console.log('hiddenColumns', hiddenColumns);
        //     this.setState({ hiddenColumns });
        // }, 5500);
    }

    private emptyColumn() {
        return {
            disableSortBy: true,
            visibleInColumnsDetail: false,
            Header: () => <span></span>,
            Cell: () => <span></span>,
        };
    }

    private filterToggleColumn() {
        return {
            ...this.emptyColumn(),
            id: 'app-grid-filter-toggle',
            forceMaxWidth: 26,
            Header: () => (
                <div className="cursor-pointer mt-1 d-flex app-grid-filter-toggle-icon-wrapper">
                    <span
                        className="app-grid-filter-toggle-icon"
                        onClick={() => {
                            this.setState({
                                filterRowVisibility: !this.state
                                    .filterRowVisibility,
                            });
                        }}
                    ></span>
                </div>
            ),
            columns: [
                {
                    ...this.emptyColumn(),
                    id: 'app-grid-filter-toggle',
                    forceMaxWidth: 26,
                    columns: [
                        {
                            ...this.emptyColumn(),
                            id: 'app-grid-filter-toggle',
                            forceMaxWidth: 26,
                            columns: [
                                {
                                    ...this.emptyColumn(),
                                    id: 'app-grid-filter-toggle',
                                    forceMaxWidth: 26,
                                },
                            ],
                        },
                    ],
                },
            ] as any,
        };
    }
    private columnsDetailColumn() {
        return AppGridUtility.columns.columnsDetail({
            columns: [
                {
                    ...this.emptyColumn(),
                    id: 'app-grid-columnsDetail',
                    forceMaxWidth: 50,
                    columns: [
                        {
                            ...this.emptyColumn(),
                            id: 'app-grid-columnsDetail',
                            forceMaxWidth: 50,
                            columns: [
                                {
                                    ...this.emptyColumn(),
                                    id: 'app-grid-columnsDetail',
                                    forceMaxWidth: 50,
                                },
                            ],
                        },
                    ],
                },
            ] as any,
        });
    }
    private filterActionColumn() {
        return {
            ...this.emptyColumn(),
            id: 'app-grid-filter-action',
            forceMaxWidth: 0,
            forceOrder: 0,
            style: { padding: 0 },
            Header: () => {
                return (
                    <span className="app-data-grid-full-title">
                        {this.props.entityRelated.title}
                    </span>
                );
            },
            columns: [
                {
                    ...this.emptyColumn(),
                    id: 'app-grid-filter-action',
                    forceMaxWidth: 0,
                    forceOrder: 0,
                    style: { padding: 0 },
                    columns: [
                        {
                            ...this.emptyColumn(),
                            id: 'app-grid-filter-action',
                            forceMaxWidth: 0,
                            forceOrder: 0,
                            style: { padding: 0 },
                            columns: [
                                {
                                    ...this.emptyColumn(),
                                    id: 'app-grid-filter-action',
                                    forceMaxWidth: 0,
                                    forceOrder: 0,
                                    style: { padding: 0 },
                                    Header: () => {
                                        return (
                                            <Field>
                                                {({ form }: FieldProps) => {
                                                    const {
                                                        values,
                                                        resetForm,
                                                    } = form;

                                                    return (
                                                        <div className="grid-full-filter-action-container">
                                                            <div className="grid-full-filter-action-wrapper">
                                                                <BtnLoader
                                                                    loading={
                                                                        this
                                                                            .state
                                                                            .gridLoading
                                                                    }
                                                                    btnClassName="btn text-capitalize mr-1 btn-sm filter-apply"
                                                                    onClick={() => {
                                                                        this.setState(
                                                                            {
                                                                                filter: this.form2Filter(
                                                                                    values
                                                                                ), // formikProps.values,
                                                                                pagination: {
                                                                                    ...this
                                                                                        .state
                                                                                        .pagination,
                                                                                    initialPage: 0,
                                                                                },
                                                                            },
                                                                            () => {
                                                                                this.fetchData();
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    apply
                                                                </BtnLoader>
                                                                <button
                                                                    disabled={
                                                                        this
                                                                            .state
                                                                            .gridLoading
                                                                    }
                                                                    className="btn text-capitalize btn-sm filter-clear"
                                                                    onClick={() => {
                                                                        resetForm();
                                                                        this.setState(
                                                                            {
                                                                                filter: {},
                                                                            },
                                                                            () => {
                                                                                this.fetchData();
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        Localization.clear
                                                                    }
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            </Field>
                                        );
                                    },
                                },
                            ],
                        },
                    ] as any,
                },
            ],
        };
    }
    private headerActionsColumn(actions?: Array<IEntityRelatedAction>) {
        return {
            ...this.emptyColumn(),
            id: 'app-grid-header-actions',
            forceMaxWidth: 0,
            forceOrder: 0,
            style: { padding: 0 },
            Header: () => {
                return (
                    <div className="app-data-grid-header-actions-wrapper">
                        {actions?.map((action, i) => (
                            <div
                                key={i}
                                className="header-action"
                                onClick={() =>
                                    this.handleGridHeaderAction(action)
                                }
                            >
                                {action.title}
                            </div>
                        ))}
                    </div>
                );
            },
            columns: [
                {
                    ...this.emptyColumn(),
                    id: 'app-grid-header-actions',
                    forceMaxWidth: 0,
                    forceOrder: 0,
                    style: { padding: 0 },
                    columns: [
                        {
                            ...this.emptyColumn(),
                            id: 'app-grid-header-actions',
                            forceMaxWidth: 0,
                            forceOrder: 0,
                            style: { padding: 0 },
                            columns: [
                                {
                                    ...this.emptyColumn(),
                                    id: 'app-grid-header-actions',
                                    forceMaxWidth: 0,
                                    forceOrder: 0,
                                    style: { padding: 0 },
                                },
                            ],
                        },
                    ] as any,
                },
            ],
        };
    }

    private handleGridHeaderAction(action: IEntityRelatedAction) {
        debugger;
    }

    private onPageChange(selectedItem: { selected: number }) {
        this.setState(
            {
                pagination: {
                    ...this.state.pagination,
                    initialPage: selectedItem.selected,
                },
                gridLoading: true,
            },
            () => {
                this.fetchData();
            }
        );
    }
    private resetGrid() {
        this.setState(
            {
                pagination: {
                    ...this.state.pagination,
                    initialPage: 0,
                },
                filter: {},
                gridLoading: true,
            },
            () => {
                this.fetchData();
            }
        );
    }

    private onLimitChange(limit: number) {
        this.setState(
            {
                pagination: {
                    ...this.state.pagination,
                    initialPage: 0,
                    limit,
                },
                gridLoading: true,
            },
            () => {
                this.fetchData();
            }
        );
    }
    private setSelectedRows = (rows: Array<any>): void => {
        this.setState({ selectedRows: rows });
    };
    private setColumnOrder = async (colIds?: Array<string>) => {
        // debugger;
        // if (!colIds?.length) return;
        // this.setState({ columnOrder: colIds || [] });
        // console.warn('setColumnOrder', this.state, colIds);
        this.setState((s) => {
            return { ...s, columnOrder: colIds || [] };
        });

        await Utility.waitOnMe(700);
        const clientColumns = [
            'app-grid-filter-toggle',
            'app-grid-filter-action',
        ];
        const columnOrder = this.state.columnOrder.filter(
            (c) => !clientColumns.includes(c)
        );
        const hiddenColumns = this.state.hiddenColumns.filter(
            (c) => !clientColumns.includes(c)
        );
        const columnIds = (colIds || []).filter(
            (c) => !clientColumns.includes(c)
        );
        columnIds.length &&
            AppGridUtility.saveColumnsChanges(
                this.props.entityRelated.entityName,
                columnOrder,
                hiddenColumns
            );
    };
    private setHiddenColumns = (colIds?: Array<string>): void => {
        // debugger;
        if (!colIds?.length && !this.state.hiddenColumns.length) return;
        // console.log('setHiddenColumns: state.hiddenColumns, colIds', this.state.hiddenColumns, colIds);
        // this.setState({ hiddenColumns: colIds || [] });
        // console.warn('setHiddenColumns', this.state, colIds);
        this.setState((s) => {
            return { ...s, hiddenColumns: colIds || [] };
        });
    };

    private setSortBy = (data: TableState['sortBy'] = []) => {
        // console.log('this.state.sortBy, data', this.state.sortBy, data);
        // debugger;
        /** prevent first duplicate fetch */
        if (JSON.stringify(this.state.sortBy) === JSON.stringify(data)) {
            return;
        }
        this.setState({ sortBy: data }, () => this.fetchData());
    };
    // private goToView(id: string) {
    //     this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].view.url(id));
    // }
    render() {
        return (
            <div
                className={`app-data-grid-full ${
                    this.state.filterRowVisibility ? '' : 'filter-row-invisible'
                }`}
            >
                {/* <div className="btn btn-info" onClick={() => {
                    debugger;
                    console.log(this.state);
                }}>aaaa</div> */}
                <Formik
                    initialValues={this.filter2Form(this.state.filter)}
                    onSubmit={() => {}}
                    enableReinitialize
                >
                    {(formikProps) => (
                        <>
                            <div className="row">
                                <div
                                    className={`col-12 ${
                                        this._columns.length ? '' : 'd-none'
                                    }`}
                                    ref={this.ref_tableContainer}
                                >
                                    <AppGrid<any>
                                        columns={this._columns}
                                        data={this.state.data}
                                        skip={
                                            this.state.pagination.limit *
                                            this.state.pagination.initialPage
                                        }
                                        pagination={{
                                            visible:
                                                this.state.pagination.total >
                                                this.state.pagination.limit, // ? false : true,
                                            pageCount: this.state.pagination
                                                .pageCount,
                                            onPageChange: (s) => {
                                                this.onPageChange(s);
                                            },
                                            forcePage: this.state.pagination
                                                .initialPage,
                                            total: this.state.pagination.total,
                                        }}
                                        reload={() => this.fetchData()}
                                        reset={() => this.resetGrid()}
                                        onLimitChange={(l) =>
                                            this.onLimitChange(l)
                                        }
                                        limit={this.state.pagination.limit}
                                        setSelectedRows={this.setSelectedRows}
                                        selectedRowIds={
                                            this.state.selectedRowIds
                                        }
                                        // columnsDetail={this.AppGridColumnsDetail()}
                                        columnOrder={this.state.columnOrder}
                                        hiddenColumns={this.state.hiddenColumns}
                                        setColumnOrder={this.setColumnOrder}
                                        setHiddenColumns={this.setHiddenColumns}
                                        sortBy={this.state.sortBy}
                                        setSortBy={this.setSortBy}
                                        onRowClick={(e, row) => {
                                            // debugger;
                                            // this.goToView(row.original.id);
                                        }}
                                        showSelectionColumn={false}
                                        showColumnsDetail={false}
                                        showLimit={false}
                                        showTotal={false}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </Formik>
            </div>
        );
    }
}
