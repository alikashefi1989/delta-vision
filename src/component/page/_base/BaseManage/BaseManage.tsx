import React, { Fragment, createRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { Setup, TInternationalization } from '../../../../config/setup';
import AppGrid, { TAppColumn } from '../../../tool/AppGrid';
import { Localization } from '../../../../config/localization/localization';
import { AppRoute } from '../../../../config/route';
import { CrudService } from '../../../../service/crud.service';
import { ConfirmNotify } from '../../../form/confirm-notify/ConfirmNotify';
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import { CmpUtility } from '../../../_base/CmpUtility';
import TopBarProgress from 'react-topbar-progress-indicator';
import { Formik, FormikProps } from 'formik';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import { BaseModel } from '../../../../model/base.model';
import {
    AppGridUtility,
    TColumnsDetail,
} from '../../../tool/AppGrid/AppGridUtility';
import { TableState, Row } from 'react-table';
import { ISearchPayload } from '../../../../model/searchPayload.model';
import { ROUTE_BASE_CRUD } from '../BaseUtility';
import { IDynamicFilter } from '../../../../model/dynamicFilter.model';
import DynamicFilterFormControl from './DynamicFilterFormControl';
import { GridCell } from '../../../tool/GridCell/GridCell';
import { Utility } from '../../../../asset/script/utility';
import { EmptyPageManage } from '../../../tool/EmptyPageManage/EmptyPageManage';
// import { GRID_CELL_TYPE } from '../../../../enum/grid-cell-type.enum';

export interface IStateBaseManage<D extends {}> {
    data: Array<D>;
    pagination: {
        pageCount: number;
        initialPage: number;
        limit: number;
        total: number;
    };
    filter: { [key: string]: any };
    filterVisibility: { [key: string]: boolean };
    filterOutspread: { nameStartWith: string };
    entityFilters: Array<IDynamicFilter>;
    searchInFilter: string;
    searchInFilterVisibility: boolean;
    gridLoading: boolean;
    removeModal: {
        show: boolean;
        loader: boolean;
    };
    selectedRows: Array<D>;
    selectedRowIds: { [key: string]: boolean };
    sidebarShow: boolean;
    hiddenColumns: Array<string>;
    columnOrder: Array<string>;
    sortBy: TableState<D>['sortBy'];
    lazyLoadItems: {
        currentPage: number;
        lazyLoad: boolean;
        createScroll: boolean;
    };
}
export interface IPropsBaseManage {
    internationalization: TInternationalization;
}

export default abstract class BaseManage<
    EntityModel extends BaseModel,
    EntityModelCreate,
    EntityModelUpdate,
    P extends IPropsBaseManage,
    S extends IStateBaseManage<EntityModel>
> extends BaseComponent<P, S> {
    protected filterOutspreadDefault = { nameStartWith: '' };
    protected baseState: IStateBaseManage<EntityModel> = {
        data: [],
        pagination: {
            pageCount: 0,
            initialPage: 0,
            limit: Setup.recordDefaultLoadLength,
            total: 0,
        },
        filter: {},
        filterVisibility: {},
        filterOutspread: this.filterOutspreadDefault,
        entityFilters: [],
        searchInFilter: '',
        searchInFilterVisibility: false,
        gridLoading: false,
        removeModal: {
            show: false,
            loader: false,
        },
        selectedRows: [],
        // selectedRowIds: { '3': true, '5': true },
        selectedRowIds: {},
        sidebarShow: true,
        // hiddenColumns: ['updatedAt', 'app-grid-actions'], // 'createdAt',
        hiddenColumns: [],
        columnOrder: [],
        sortBy: [],
        lazyLoadItems: {
            currentPage: 0,
            lazyLoad: false,
            createScroll: false,
        },
    };

    protected baseColumns: Array<TAppColumn<any>> = [
        // {
        //     Header: <div className="text-center">#</div>,
        //     id: "app-grid-index",
        //     // filterable: false,
        //     Cell: (cell: any) => {
        //         return <div className="text-center">{cell.row.index + 1 + this.state.pagination.limit * this.state.pagination.initialPage}</div>;
        //     },
        //     width: 50,
        //     title: 'index'
        // },

        {
            accessor: 'createdAt',
            Header: 'created time',
            Cell: (cell: any) => {
                return (
                    <>
                        {cell.row.original.createdAt ? (
                            <span
                                title={this.getFromNowDate(
                                    cell.row.original.createdAt / 1000
                                )}
                            >
                                {this.timestamp_to_date(
                                    cell.row.original.createdAt / 1000
                                )}
                            </span>
                        ) : (
                            <></>
                        )}
                    </>
                );
            },
            minWidth: 100,
            title: 'created time',
        },
        {
            accessor: 'updatedAt',
            Header: 'modified time',
            Cell: (cell: any) => {
                return (
                    <>
                        {cell.row.original.updatedAt ? (
                            <span
                                title={this.getFromNowDate(
                                    cell.row.original.updatedAt / 1000
                                )}
                            >
                                {this.timestamp_to_date(
                                    cell.row.original.updatedAt / 1000
                                )}
                            </span>
                        ) : (
                            <></>
                        )}
                    </>
                );
            },
            minWidth: 100,
            title: 'modified time',
        },
        {
            Header: '',
            accessor: 'app-grid-actions',
            Cell: (cell: any) =>
                this.appGridRowActionsWrapperRender(
                    cell.row.original,
                    cell.row.index
                ),
            maxWidth: 100,
            title: 'actions',
        },
    ];

    // protected abstract columns: Array<TAppColumn<any>>;
    protected columns: Array<TAppColumn<any>> = [];

    protected abstract _entityService: CrudService<
        EntityModel,
        EntityModelCreate,
        EntityModelUpdate
    >;

    protected abstract appRouteBaseCRUD: ROUTE_BASE_CRUD;
    protected titleBaseCRUD: string | undefined;

    ref_tableContainer = createRef<HTMLDivElement>();

    componentDidMount() {
        this.fetchData();
        this.fetchFilters();
        this.fetchColumns();
        // setTimeout(() => {
        //     debugger;
        //     // this.setState({ selectedRowIds: { '0': true, '130': true, '3': true, '4': true, '2': true, '7': true, } });
        //     this.setState({ sortBy: [{ id: "direction", desc: false }] });
        // }, 5000);
    }

    protected filterOutspread(): Object | undefined {
        const filterOutspread = this.state.filterOutspread;
        if (filterOutspread.nameStartWith !== '') {
            return {
                name: {
                    $regex: `^${filterOutspread.nameStartWith}`,
                    $options: 'i',
                },
            };
        }
    }
    protected filter() {
        let filter = { ...this.state.filter };
        /** remove invisible filter */
        const fv = this.state.filterVisibility;
        Object.keys(fv).forEach((v) => {
            if (fv[v] === false) delete filter[this.F2FReplaceSymbolWith(v)];
        });

        const filterOutspread = this.filterOutspread();
        if (filterOutspread) {
            filter = { $and: [filter, filterOutspread] };
        }
        return filter;
    }

    protected sort(): ISearchPayload['sort'] {
        const sort: ISearchPayload['sort'] = {};
        this.state.sortBy!.forEach((s) => {
            sort[s.id] = s.desc ? -1 : 1;
        });
        if (!Object.keys(sort).length) return;
        return sort;
    }

    protected handlChangeLazyLoad(value: boolean) {
        this.setState({
            lazyLoadItems: {
                ...this.state.lazyLoadItems,
                lazyLoad: value,
            },
        });
    }

    protected async handleCurrentPage() {
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

    protected hasScroll() {
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

    protected checkScrollEnded() {
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

    protected goToTableTop() {
        let target = this.getTable();
        if (target) {
            target.scrollTo(0, 0);
        }
    }

    protected defaultPagination() {
        return {
            page: this.state.pagination.initialPage,
            limit: this.state.pagination.limit,
        };
    }

    protected lazyLoadPagination() {
        return {
            page: this.state.lazyLoadItems.currentPage,
            limit: Setup.recordDefaultLoadLength,
        };
    }

    protected getTable = () => {
        // debugger;
        const target = this.ref_tableContainer.current;
        if (target) {
            return target.querySelector('.app-data-grid'); // #scroll_table
        }
    };

    protected async fetchData() {
        let { lazyLoad, createScroll } = this.state.lazyLoadItems;
        // debugger;
        if (lazyLoad && !createScroll) {
            await this.handleCurrentPage();
        }
        this.setState({ gridLoading: true });
        try {
            const res = await this._entityService.search({
                pagination: lazyLoad
                    ? this.lazyLoadPagination()
                    : this.defaultPagination(),
                sort: this.sort(),
                filter: this.filter(),
            });
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
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'fetchData_error' },
            });
        }
    }

    protected async fetchFilters() {
        try {
            const res = await this._entityService.filters();
            this.setState({ entityFilters: res.data.data.items });
        } catch (e) {
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'fetchFilters_error' },
            });
        }
    }

    protected async fetchColumns() {
        try {
            const res = await this._entityService.columns();
            const hiddenColumns: Array<string> = [];
            const columns = res.data.data.columns.map((c) => {
                if (c.hidden === true) hiddenColumns.push(c.accessor);
                // let minWidth = c.minWidth;
                // if (!minWidth) {
                //     minWidth = c.cell === GRID_CELL_TYPE.CELL_PHONE_LIST ? 250 : minWidth;
                // }
                return {
                    Header: c.header,
                    accessor: c.accessor,
                    title: c.title,
                    Cell: GridCell.render(c),
                    disableSortBy: c.sortable === false ? true : false,
                    // minWidth,
                    // maxWidth: c.cell === GRID_CELL_TYPE.CELL_PHONE_LIST ? 250 : undefined
                };
            });
            this.columns = columns;
            this.setState({ hiddenColumns });
        } catch (e) {
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'fetchColumns_error' },
            });
        }
    }

    protected pageCount(total: number, limit: number): number {
        return Math.ceil(total / limit);
    }

    protected goToCreate() {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].create.url());
    }
    protected goToUpdate(id: string) {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].update.url(id));
    }
    protected goToCopy(id: string) {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].copy.url(id));
    }
    protected goToView(id: string) {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].view.url(id));
    }

    protected onPageChange(selectedItem: { selected: number }) {
        this.setState(
            {
                pagination: {
                    ...this.state.pagination,
                    initialPage: selectedItem.selected,
                    // limit: this.state.pagination.limit
                },
                gridLoading: true,
            },
            () => {
                this.fetchData();
            }
        );
    }

    protected resetGrid() {
        this.setState(
            {
                pagination: {
                    ...this.state.pagination,
                    initialPage: 0,
                    // limit: this.state.pagination.limit
                },
                filter: {},
                filterVisibility: {},
                filterOutspread: this.filterOutspreadDefault,
                gridLoading: true,
            },
            () => {
                this.fetchData();
            }
        );
    }

    protected onLimitChange(limit: number) {
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

    protected _chosenRow: EntityModel | undefined;
    protected removeModalOnHide() {
        this._chosenRow = undefined;
        this.setState({
            removeModal: { ...this.state.removeModal, show: false },
        });
    }
    protected removeModalOnShow(row: EntityModel) {
        this._chosenRow = row;
        this.setState({
            removeModal: { ...this.state.removeModal, show: true },
        });
    }

    protected async removeRow() {
        // debugger;
        if (this._chosenRow === undefined) return;

        this.setState({
            removeModal: { ...this.state.removeModal, loader: true },
        });
        try {
            // const res =
            await this._entityService.remove(this._chosenRow.id);
            this.setState({
                removeModal: {
                    ...this.state.removeModal,
                    loader: false,
                    show: false,
                },
            });
            this.fetchData();
        } catch (e) {
            this.setState({
                removeModal: { ...this.state.removeModal, loader: false },
            });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'removeRow_error' },
            });
        }
    }

    protected setSelectedRows = (rows: Array<any>): void => {
        // debugger;
        this.setState({ selectedRows: rows });
    };
    protected setColumnOrder = async (colIds?: Array<string>) => {
        // debugger;
        this.setState({ columnOrder: colIds || [] });

        await Utility.waitOnMe(700);
        colIds?.length &&
            AppGridUtility.saveColumnsChanges(
                this.appRouteBaseCRUD,
                this.state.columnOrder,
                this.state.hiddenColumns
            );
    };
    protected setHiddenColumns = (colIds?: Array<string>): void => {
        // debugger;
        // colIds?.length && this.saveColumnsChanges(this.appRouteBaseCRUD, colIds);
        this.setState({ hiddenColumns: colIds || [] });
    };

    /**
     * store columns changes per user
     */
    // protected async saveColumnsChanges(entityName: string, columnOrder: Array<string>, hiddenColumns: Array<string>) {
    //     try {
    //         const visibleColumnsOrder = columnOrder.filter(c => !hiddenColumns.includes(c));
    //         await (new UserService()).setColumns(entityName, visibleColumnsOrder);
    //     } catch (error) {
    //     }
    // }

    protected setSortBy = (data: TableState['sortBy'] = []) => {
        // console.log('this.state.sortBy, data', this.state.sortBy, data);
        // debugger;
        /** prevent first duplicate fetch */
        if (JSON.stringify(this.state.sortBy) === JSON.stringify(data)) {
            return;
        }
        this.setState({ sortBy: data }, () => this.fetchData());
    };

    protected appGridRowActionViewRender(row: EntityModel) {
        return (
            <li
                className="list-group-item list-group-item-action text-info"
                onClick={() => this.goToView(row.id)}
            >
                <i className="icon fa fa-eye"></i>
                <span className="text">{Localization.view}</span>
            </li>
        );
    }
    protected appGridRowActionUpdateRender(row: EntityModel) {
        return (
            <li
                className="list-group-item list-group-item-action text-primary"
                onClick={() => this.goToUpdate(row.id)}
            >
                <i className="icon fa fa-edit"></i>
                <span className="text">{Localization.edit}</span>
            </li>
        );
    }
    protected appGridRowActionCopyRender(row: EntityModel) {
        return (
            <li
                className="list-group-item list-group-item-action text-system"
                onClick={() => this.goToCopy(row.id)}
            >
                <i className="icon fa fa-copy"></i>
                <span className="text">{Localization.copy}</span>
            </li>
        );
    }
    protected appGridRowActionRemoveRender(row: EntityModel) {
        return (
            <li
                className="list-group-item list-group-item-action text-danger"
                onClick={() => this.removeModalOnShow(row)}
            >
                <i className="icon fa fa-trash"></i>
                <span className="text">{Localization.remove}</span>
            </li>
        );
    }
    protected appGridRowActionsRender(row: EntityModel, index: number) {
        return (
            <Popover
                id={`grid-action-menu-popover-${index}`}
                className="popper-action-menu-wrapper"
            >
                <Popover.Content onClick={() => CmpUtility.dismissPopover()}>
                    <ul className="list-group list-group-flush">
                        {this.appGridRowActionViewRender(row)}
                        {this.appGridRowActionUpdateRender(row)}
                        {this.appGridRowActionCopyRender(row)}
                        {this.appGridRowActionRemoveRender(row)}
                    </ul>
                </Popover.Content>
            </Popover>
        );
    }

    private appGridRowActionsWrapperRender(row: EntityModel, index: number) {
        return (
            <>
                <OverlayTrigger
                    // {...{ show: this.state.actionPopover[index] } as any}
                    rootClose
                    trigger="click"
                    placement={
                        this.props.internationalization.rtl ? 'right' : 'left'
                    }
                    overlay={this.appGridRowActionsRender(row, index)}
                >
                    <div className="btn btn-xs btn-light icon-only prevent-onRowClick">
                        <i className="fa fa-ellipsis-h dropdown-icon"></i>
                    </div>
                </OverlayTrigger>

                {/* <Dropdown className="popper-action-menu-wrapper">
                <Dropdown.Toggle
                    split
                    variant="light"
                    className="btn-xs"
                    id={"dropdown-grid-action" + index}
                >
                    <i className="fa fa-ellipsis-h dropdown-icon"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className="text-info" onClick={() => this.goToView(row.id)}>
                        <i className="icon fa fa-eye"></i><span className="text">{Localization.view}</span>
                    </Dropdown.Item>
                    <Dropdown.Item className="text-primary" onClick={() => this.goToUpdate(row.id)}>
                        <i className="icon fa fa-edit"></i><span className="text">{Localization.edit}</span>
                    </Dropdown.Item>
                    <Dropdown.Item className="text-system" onClick={() => this.goToCopy(row.id)}>
                        <i className="icon fa fa-copy"></i><span className="text">{Localization.copy}</span>
                    </Dropdown.Item>
                    <Dropdown.Item className="text-danger" onClick={() => this.removeModalOnShow(row)}>
                        <i className="icon fa fa-trash"></i><span className="text">{Localization.remove}</span>
                    </Dropdown.Item>

                    {row.isActive ? <Dropdown.Item className="text-warning" onClick={() => this.toggleActiveModalOnShow(row)}>
                        <i className="icon fa fa-times"></i><span className="text">{Localization.inactive}</span>
                    </Dropdown.Item> :
                        <Dropdown.Item className="text-success" onClick={() => this.toggleActiveModalOnShow(row)}>
                            <i className="icon fa fa-check"></i><span className="text">{Localization.active}</span>
                        </Dropdown.Item>}

                    {!row.isDefault && <Dropdown.Item className="text-system" onClick={() => this.setAsDefaultModalOnShow(row)}>
                        <i className="icon fa fa-star"></i><span className="text">{Localization.set_as_default}</span>
                    </Dropdown.Item>}

                </Dropdown.Menu>
            </Dropdown> */}
            </>
        );
    }

    protected headerActionFilterLookupOverlayRender() {
        // if (1) return <></>;
        return (
            <Popover
                id={`header-action-filter-lookup-popover`}
                className="popper-action-menu-wrapper d-none"
            >
                <Popover.Content onClick={() => CmpUtility.dismissPopover()}>
                    <ul className="list-group list-group-flush">
                        <li
                            className="list-group-item list-group-item-action"
                            onClick={() => {}}
                        >
                            <span className="text-capitalize">all leads</span>
                        </li>
                        <li
                            className="list-group-item list-group-item-action"
                            onClick={() => {}}
                        >
                            <span className="text-capitalize">
                                converted leads
                            </span>
                        </li>
                        <li
                            className="list-group-item list-group-item-action"
                            onClick={() => {}}
                        >
                            <span className="text-capitalize">junk leads</span>
                        </li>
                    </ul>
                </Popover.Content>
            </Popover>
        );
    }
    protected headerActionFilterLookupRender() {
        const title = this.titleBaseCRUD || this.appRouteBaseCRUD;
        return (
            <OverlayTrigger
                rootClose
                trigger="click"
                placement="bottom-start"
                overlay={this.headerActionFilterLookupOverlayRender()}
            >
                <div className="header-action-filter-lookup mr-2 btn btn-sm min-w-40px">
                    <span className="text-capitalize font-weight-bold mr-2">
                        all {title}
                    </span>
                    <i className="fa fa-caret-down"></i>
                </div>
            </OverlayTrigger>
        );
    }
    protected headerActionEditEntityRender() {
        return (
            <div
                className="header-action-edit-entity action cursor-pointer mr-2-- border-0 text-capitalize"
                onClick={() => {}}
            >
                edit
            </div>
        );
    }
    protected headerActionReloadRender() {
        return (
            <div
                className="header-action-reload action shadow-hover-sm-- cursor-pointer mr-2 border-0"
                onClick={() => this.fetchData()}
            >
                <span className="icon"></span>
            </div>
        );
        // return <OverlayTrigger
        //     placement="bottom"
        //     delay={{ show: 150, hide: 300 }}
        //     overlay={({ show, ...props }: any) => <Tooltip id="header-action-reload-tooltip" className="app-tooltip" show={show.toString()} {...props}>{Localization.reload}</Tooltip>}
        // >
        //     <div className="header-action-reload action shadow-hover-sm-- cursor-pointer mr-2 border-0" onClick={() => this.fetchData()}>
        //         <span className="icon"></span>
        //     </div>
        // </OverlayTrigger>
    }
    protected headerActionResetRender() {
        return (
            <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 300 }}
                overlay={({ show, ...props }: any) => (
                    <Tooltip
                        id="header-action-reset-tooltip"
                        className="app-tooltip"
                        show={show.toString()}
                        {...props}
                    >
                        {Localization.reset}
                    </Tooltip>
                )}
            >
                <div
                    className="action shadow-hover-sm cursor-pointer text-warning mr-2"
                    onClick={() => this.resetGrid()}
                >
                    <i className="fa fa-undo"></i>
                </div>
            </OverlayTrigger>
        );
    }

    protected setNameStartWith(alpha: string) {
        this.setState(
            {
                filterOutspread: {
                    ...this.state.filterOutspread,
                    nameStartWith: alpha,
                },
                pagination: { ...this.state.pagination, initialPage: 0 },
            },
            () => this.fetchData()
        );
    }
    protected headerActionFilterAlphaOverlayRender() {
        const SW = this.state.filterOutspread.nameStartWith;
        return (
            <Popover
                id={`header-action-filter-alpha-popover`}
                className="popper-action-menu-wrapper popper-action-filter-alpha-wrapper"
            >
                <Popover.Content
                    onClick={() => CmpUtility.dismissPopover()}
                    className="px-1 ultra-thin-scroll"
                >
                    <ul className="list-group list-group-flush text-center">
                        <li
                            className="list-group-item list-group-item-action px-2 py-0"
                            onClick={() => this.setNameStartWith('')}
                        >
                            <span
                                className={`small text-capitalize ${
                                    SW === ''
                                        ? 'text-info font-weight-bold'
                                        : ''
                                }`}
                            >
                                all
                            </span>
                        </li>
                        {Array.from('abcdefghijklmnopqrstuvwxyz').map(
                            (alpha) => (
                                <li
                                    key={alpha}
                                    className="list-group-item list-group-item-action px-2 py-0"
                                    onClick={() => this.setNameStartWith(alpha)}
                                >
                                    <span
                                        className={`small text-capitalize ${
                                            SW === alpha
                                                ? 'text-info font-weight-bold'
                                                : ''
                                        }`}
                                    >
                                        {alpha}
                                    </span>
                                </li>
                            )
                        )}
                    </ul>
                </Popover.Content>
            </Popover>
        );
    }
    protected headerActionFilterAlphaRender() {
        const SW = this.state.filterOutspread.nameStartWith;
        return (
            <OverlayTrigger
                rootClose
                trigger="click"
                placement="bottom"
                overlay={this.headerActionFilterAlphaOverlayRender()}
            >
                <div
                    className={`action header-action-filter-alpha cursor-pointer mr-2 ${
                        SW === '' ? 'border-0' : ''
                    }`}
                >
                    {SW === '' ? (
                        // <img src="/static/media/img/icon/az-filter.svg" className="" alt="" />
                        <span className="icon"></span>
                    ) : (
                        <>
                            <span className="text-capitalize text-info px-2">
                                {SW}
                            </span>
                            <span
                                className="px-1 border-left"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    this.setNameStartWith('');
                                }}
                            >
                                &times;
                            </span>
                        </>
                    )}
                </div>
            </OverlayTrigger>
        );
    }

    protected headerActionCreateRender() {
        return (
            <div
                className="mr-2 ml-2 btn z-btn-light text-capitalize"
                onClick={() => this.goToCreate()}
            >
                create
            </div>
        );
    }
    protected headerActionCreateRender_DELETE_ME() {
        return (
            <div className="header-action-create btn-group btn-group-sm-- mr-2 ml-2">
                <button
                    className="btn btn-light-- z-btn-light px-2"
                    onClick={() => this.goToCreate()}
                >
                    <span className="icon"></span>
                </button>
                <button className="btn btn-light-- z-btn-light text-capitalize">
                    import
                </button>
            </div>
        );
        // return <OverlayTrigger
        //     placement="bottom"
        //     delay={{ show: 150, hide: 300 }}
        //     overlay={({ show, ...props }: any) => <Tooltip id="header-action-create-tooltip" className="app-tooltip" show={show.toString()} {...props}>{Localization.create}</Tooltip>}
        // >
        //     <div className="header-action-create btn-group btn-group-sm mr-2 ml-2">
        //         <button className="btn btn-light" onClick={() => this.goToCreate()}>
        //             <span className="icon"></span>
        //         </button>
        //         <button className="btn btn-light text-capitalize">import</button>
        //     </div>
        //     {/* <div className="action-- shadow-hover-sm-- cursor-pointer-- mr-2 ml-2 text-success-- btn btn-sm btn-light min-w-40px" onClick={() => this.goToCreate()}>
        //         <i className="fa fa-plus"></i>
        //     </div> */}
        // </OverlayTrigger>
    }
    protected headerActionMoreOverlayRender() {
        return (
            <Popover
                id={`header-action-more-popover`}
                className="popper-action-menu-wrapper"
            >
                <Popover.Content onClick={() => CmpUtility.dismissPopover()}>
                    <ul className="list-group list-group-flush">
                        {/* <li className="list-group-item list-group-item-action text-info--" onClick={() => this.columnsDetailModalOnShow()}>
                        <i className="icon fa fa-gears"></i><span className="text">{Localization.settings}</span>
                    </li> */}
                        <li
                            className="list-group-item list-group-item-action text-info--"
                            onClick={() => {}}
                        >
                            <i className="icon fa fa-print"></i>
                            <span className="text">print</span>
                        </li>
                        <li
                            className="list-group-item list-group-item-action text-system"
                            onClick={() => {}}
                        >
                            <i className="icon fa fa-file-excel-o"></i>
                            <span className="text">excel</span>
                        </li>
                    </ul>
                </Popover.Content>
            </Popover>
        );
    }
    protected headerActionMoreRender() {
        return (
            <OverlayTrigger
                rootClose
                trigger="click"
                placement="bottom-end"
                overlay={this.headerActionMoreOverlayRender()}
            >
                <div className="action-- shadow-hover-sm-- cursor-pointer-- mr-2 btn btn-sm-- btn-light-- z-btn-light min-w-40px">
                    <i className="fa fa-ellipsis-h"></i>
                </div>
            </OverlayTrigger>
        );
    }
    protected headerActionEditRender() {
        if (this.state.selectedRows.length !== 1) return;
        const row = this.state.selectedRows[0];
        return (
            <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 300 }}
                overlay={({ show, ...props }: any) => (
                    <Tooltip
                        id="header-action-edit-tooltip"
                        className="app-tooltip"
                        show={show.toString()}
                        {...props}
                    >
                        {Localization.edit}
                    </Tooltip>
                )}
            >
                <div
                    className="action shadow-hover-sm cursor-pointer mr-2 text-primary"
                    onClick={() => this.goToUpdate(row.id)}
                >
                    <i className="fa fa-edit"></i>
                </div>
            </OverlayTrigger>
        );
    }
    protected headerActionCopyRender() {
        if (this.state.selectedRows.length !== 1) return;
        const row = this.state.selectedRows[0];
        return (
            <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 300 }}
                overlay={({ show, ...props }: any) => (
                    <Tooltip
                        id="header-action-copy-tooltip"
                        className="app-tooltip"
                        show={show.toString()}
                        {...props}
                    >
                        {Localization.copy}
                    </Tooltip>
                )}
            >
                <div
                    className="action shadow-hover-sm cursor-pointer mr-2 text-system"
                    onClick={() => this.goToCopy(row.id)}
                >
                    <i className="fa fa-copy"></i>
                </div>
            </OverlayTrigger>
        );
    }
    protected headerActionRemoveRender() {
        if (this.state.selectedRows.length !== 1) return;
        const row = this.state.selectedRows[0];
        return (
            <div
                className="mr-2 ml-2 btn z-btn-light text-capitalize"
                onClick={() => this.removeModalOnShow(row)}
            >
                delete
            </div>
        );
    }
    protected headerActionRemoveRender_DELETE_ME() {
        if (this.state.selectedRows.length !== 1) return;
        const row = this.state.selectedRows[0];
        return (
            <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 300 }}
                overlay={({ show, ...props }: any) => (
                    <Tooltip
                        id="header-action-delete-tooltip"
                        className="app-tooltip"
                        show={show.toString()}
                        {...props}
                    >
                        {Localization.remove}
                    </Tooltip>
                )}
            >
                <div
                    className="action shadow-hover-sm cursor-pointer mr-2 text-danger"
                    onClick={() => this.removeModalOnShow(row)}
                >
                    <i className="fa fa-trash"></i>
                </div>
            </OverlayTrigger>
        );
    }
    protected headerActionSelectedRowRender() {
        if (this.state.selectedRows.length === 0) return <></>;
        return (
            <div className="selected-row action-- d-flex align-items-center mr-4">
                <span>{this.state.selectedRows.length} record selected.</span>
                <span
                    className="clear-btn text-primary text-capitalize cursor-pointer ml-1"
                    onClick={() => {
                        // debugger;
                        this.setState({ selectedRowIds: {}, selectedRows: [] });
                    }}
                >
                    clear
                </span>
            </div>
        );
    }
    protected headerActionPagerRender() {
        return AppGridUtility.pager({
            currentPage: this.state.pagination.initialPage,
            limit: this.state.pagination.limit,
            total: this.state.pagination.total,
            pageCount: this.state.pagination.pageCount,
            onPageChange: (s) => {
                this.onPageChange(s);
            },
        });
    }

    protected headerActionSendEmailRender() {
        return (
            <div className="mr-2 ml-2-- btn btn-sm--btn-light z-btn-light text-capitalize">
                send email
            </div>
        );
    }
    protected headerActionCreateTaskRender() {
        return (
            <div className="mr-2 ml-2-- btn btn-sm--btn-light z-btn-light text-capitalize">
                create task
            </div>
        );
    }
    protected headerActionMassUpdateRender() {
        return (
            <div className="mr-2 ml-2-- btn btn-sm--btn-light z-btn-light text-capitalize">
                mass update
            </div>
        );
    }

    protected pageManageHeaderMain() {
        let cls = '';
        if (this.state.selectedRows.length !== 0) cls = 'hide-header';
        return (
            <div className={'row page-manage-header-main ' + cls}>
                <div className="col-12">
                    <div className="d-flex justify-content-between">
                        <div className="action-list d-flex">
                            {/* {this.headerActionFilterLookupRender()} */}
                            {/* {this.headerActionEditEntityRender()} */}
                            {this.headerActionReloadRender()}
                            {/* {this.headerActionResetRender()} */}
                        </div>
                        <div className="action-list d-flex">
                            {this.headerActionCreateRender()}
                            {/* {this.headerActionMoreRender()} */}
                            {this.headerActionFilterAlphaRender()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    protected pageManageHeaderSecondary() {
        let cls = '';
        if (this.state.selectedRows.length === 0) cls = 'hide-header';
        return (
            <div
                className={
                    'row page-manage-header-secondary align-items-center ' + cls
                }
            >
                <div className="col-12">
                    <div className="d-flex justify-content-between">
                        <div className="action-list d-flex">
                            {this.headerActionSelectedRowRender()}
                            {/* {this.headerActionEditRender()}
                        {this.headerActionCopyRender()}
                        {this.headerActionRemoveRender()} */}
                            {/* {this.headerActionSendEmailRender()}
                            {this.headerActionCreateTaskRender()}
                            {this.headerActionMassUpdateRender()}
                            {this.headerActionMoreRender()} */}
                            {this.headerActionRemoveRender()}
                        </div>
                        <div className="action-list d-flex">
                            {this.headerActionPagerRender()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    protected pageManageHeader() {
        return (
            <div className="page-manage-header py-2--">
                {this.pageManageHeaderMain()}
                {this.pageManageHeaderSecondary()}
            </div>
        );
    }

    protected _F2FSymbol = '___';
    protected F2FReplaceSymbolWith(key: string): string {
        return key.replace(new RegExp(this._F2FSymbol, 'gi'), '.');
    }
    protected F2FReplaceWithSymbol(key: string): string {
        return key.replace(/\./gi, this._F2FSymbol);
    }
    protected filter2Form(filterValues: Object): Object {
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
    protected form2Filter(formValues: Object): Object {
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
    protected filterCheckbox(key: string, label: string) {
        return (
            <div className="app-CHECKBOX form-inline mb-2">
                <input
                    className="app-checkbox native-style2"
                    id={`filter-checkbox-${key}`}
                    type="checkbox"
                    onChange={(e) => {
                        this.setState({
                            filterVisibility: {
                                ...this.state.filterVisibility,
                                [key]: e.currentTarget.checked,
                            },
                        });
                    }}
                    checked={this.state.filterVisibility[key] || false}
                />
                <label
                    htmlFor={`filter-checkbox-${key}`}
                    className="mt-n2"
                ></label>
                <label
                    htmlFor={`filter-checkbox-${key}`}
                    className={`text-capitalize cursor-pointer font-size-09 ml-2 ${
                        this.state.filterVisibility[key]
                            ? 'font-weight-bold-- font-weight-600'
                            : ''
                    }`}
                >
                    {label}
                </label>
            </div>
        );
    }
    protected filterVisibility(key: string) {
        return this.state.filterVisibility[key];
        // return !(this.state.filterVisibility[key] === false);
    }
    protected filterRender(
        filter: JSX.Element,
        key: string,
        label: string
    ): JSX.Element {
        const searchVisible = label
            .toLocaleLowerCase()
            .includes(this.state.searchInFilter.toLocaleLowerCase());
        if (!searchVisible) return <></>;
        return (
            <div className="col-md-12 mb-1">
                {this.filterCheckbox(key, label)}
                {this.filterVisibility(key) && filter}
            </div>
        );
    }
    protected pageManageSidebarBody() {
        return (
            <div className="row">
                {this.state.entityFilters.map((f) => {
                    return (
                        <Fragment key={f.key}>
                            {this.filterRender(
                                <DynamicFilterFormControl
                                    dynamicFilter={f}
                                    // entityService={this._entityService}
                                    // entityName={f.entity?.name}
                                    name={this.F2FReplaceWithSymbol(f.key)}
                                    controlClassName="ml-2"
                                />,
                                this.F2FReplaceWithSymbol(f.key),
                                f.title
                            )}
                        </Fragment>
                    );
                })}
            </div>
        );
    }

    protected onSearchInFilterChange(newVal: string) {
        this.setState({ searchInFilter: newVal });
    }
    protected hideSearchInFilter() {
        this.setState({ searchInFilterVisibility: false });
    }
    protected showSearchInFilter() {
        this.setState({ searchInFilterVisibility: true });
    }
    protected pageManageSidebarFooter(formikProps: FormikProps<S['filter']>) {
        const filterVisibilityKeys = Object.keys(this.state.filterVisibility);
        let found = false;
        for (let key of filterVisibilityKeys) {
            if (this.state.filterVisibility[key]) {
                found = true;
                break;
            }
        }
        if (!found) return <></>;

        return (
            <div className="row">
                <div className="col-md-12 mt-3 text-center--">
                    <BtnLoader
                        loading={this.state.gridLoading}
                        btnClassName="btn btn-info-- z-btn-primary text-capitalize min-w-100px-- mr-3"
                        onClick={() => {
                            this.setState(
                                {
                                    filter: this.form2Filter(
                                        formikProps.values
                                    ), // formikProps.values,
                                    pagination: {
                                        ...this.state.pagination,
                                        initialPage: 0,
                                    },
                                },
                                () => {
                                    this.fetchData();
                                }
                            );
                        }}
                    >
                        apply filter
                    </BtnLoader>
                    <button
                        disabled={this.state.gridLoading}
                        className="btn btn-light-- z-btn-light --text-primary text-capitalize min-w-100px--"
                        onClick={() => {
                            formikProps.resetForm();
                            this.setState(
                                { filter: {}, filterVisibility: {} },
                                () => {
                                    this.fetchData();
                                }
                            );
                        }}
                    >
                        {Localization.clear}
                    </button>
                </div>
            </div>
        );
    }
    protected pageManageSidebar() {
        const title = this.titleBaseCRUD || this.appRouteBaseCRUD;

        return (
            <div className="page-manage-sidebar-container">
                <div
                    className="sidebar-toggler"
                    onClick={() =>
                        this.setState({ sidebarShow: !this.state.sidebarShow })
                    }
                >
                    {/* <i className="fa fa-ellipsis-v"></i> */}
                    {this.state.sidebarShow ? (
                        <img
                            src="/static/media/img/icon/sidebar-left.svg"
                            className=""
                            alt=""
                        />
                    ) : (
                        <img
                            src="/static/media/img/icon/sidebar-right.svg"
                            className=""
                            alt=""
                        />
                    )}
                </div>
                <div
                    className={
                        'page-manage-sidebar-wrapper ' +
                        (this.state.sidebarShow ? 'open' : '')
                    }
                >
                    <div
                        className={
                            'page-manage-sidebar ' +
                            (this.state.sidebarShow ? 'open' : '')
                        }
                    >
                        <div className="page-manage-sidebar-inner">
                            <div className="page-manage-sidebar-inner-header">
                                <div
                                    className={`search-title-wrapper ${
                                        this.state.searchInFilterVisibility
                                            ? 'd-none'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        this.showSearchInFilter();
                                    }}
                                >
                                    <span className="title text-capitalize">
                                        filter {title}{' '}
                                        <span className="text-lowercase">
                                            by
                                        </span>
                                    </span>
                                    <span className="search-icon-wrapper">
                                        <span className="search-icon"></span>
                                    </span>
                                </div>
                                <div
                                    className={`search-wrapper input-group input-group-sm mb-3-- ${
                                        this.state.searchInFilterVisibility
                                            ? ''
                                            : 'd-none'
                                    }`}
                                >
                                    <div className="search-icon-container input-group-prepend">
                                        <span className="search-icon-wrapper input-group-text">
                                            <span className="search-icon"></span>
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="search-input form-control"
                                        value={this.state.searchInFilter}
                                        onChange={(e) =>
                                            this.onSearchInFilterChange(
                                                e.currentTarget.value
                                            )
                                        }
                                        placeholder="Search"
                                    />
                                    <span
                                        className="search-clear-icon-wrapper"
                                        onClick={() => {
                                            if (this.state.searchInFilter)
                                                this.onSearchInFilterChange('');
                                            else this.hideSearchInFilter();
                                        }}
                                    >
                                        <span className="search-clear-icon"></span>
                                    </span>
                                </div>
                            </div>
                            <Formik
                                // initialValues={this.state.filter}
                                initialValues={this.filter2Form(
                                    this.state.filter
                                )}
                                onSubmit={() => {}}
                                enableReinitialize
                            >
                                {(formikProps) => (
                                    <>
                                        <div className="page-manage-sidebar-inner-body thin-scroll">
                                            {this.pageManageSidebarBody()}
                                        </div>
                                        <div className="page-manage-sidebar-inner-footer">
                                            {this.pageManageSidebarFooter(
                                                formikProps
                                            )}
                                        </div>
                                    </>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    protected AppGridColumnsDetail(): TColumnsDetail {
        return {
            Cell: (p) => (
                <div
                    className="column-detail-cell-edit prevent-onRowClick"
                    onClick={() => this.goToUpdate(p.row.original.id)}
                >
                    {/* <i className="fa fa-pencil"></i> */}
                    <span className="icon"></span>
                </div>
            ),
        };
    }
    protected gridOnRowClick(
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        row: Row<any>
    ) {
        this.goToView(row.original.id);
    }
    protected pageManageMain() {
        return (
            <div className="page-manage-main">
                <div className="row">
                    <div
                        className={`col-12 ${
                            this.columns.length ? '' : 'd-none'
                        }`}
                        ref={this.ref_tableContainer}
                    >
                        <AppGrid<any>
                            columns={this.columns}
                            data={this.state.data}
                            // skip={this.state.pagination.skip}
                            skip={
                                this.state.pagination.limit *
                                this.state.pagination.initialPage
                            }
                            pagination={{
                                visible: true,
                                pageCount: this.state.pagination.pageCount,
                                onPageChange: (s) => {
                                    this.onPageChange(s);
                                },
                                /** in pagination mode (not pager): comment if you call fetch in componentDidMount */
                                // initialPage: this.state.pagination.initialPage,
                                forcePage: this.state.pagination.initialPage,
                                total: this.state.pagination.total,
                            }}
                            // loading={this.state.gridLoading}
                            reload={() => this.fetchData()}
                            reset={() => this.resetGrid()}
                            onLimitChange={(l) => this.onLimitChange(l)}
                            limit={this.state.pagination.limit}
                            setSelectedRows={this.setSelectedRows}
                            // showSelectionColumn={false}
                            selectedRowIds={this.state.selectedRowIds}
                            // actionListAlignInverse={this.actionListAlignInverseRender()}
                            // showHeader={false}
                            // showColumnsDetail={false}
                            columnsDetail={this.AppGridColumnsDetail()}
                            columnOrder={this.state.columnOrder}
                            hiddenColumns={this.state.hiddenColumns}
                            setColumnOrder={this.setColumnOrder}
                            setHiddenColumns={this.setHiddenColumns}
                            sortBy={this.state.sortBy}
                            setSortBy={this.setSortBy}
                            onRowClick={(e, row) => {
                                // debugger;
                                this.gridOnRowClick(e, row);
                                // this.goToView(row.original.id);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
    protected pageManageBody() {
        return (
            <div className="d-flex">
                {this.pageManageSidebar()}
                {this.pageManageMain()}
            </div>
        );
    }

    protected pageManageWrapper() {
        return (
            <div
                className={
                    'page-manage-wrapper animated fadeInDown ' +
                    (this.state.sidebarShow ? 'sidebar-open' : '')
                }
            >
                {this.pageManageHeader()}
                {/* {this.pageManageBody()} */}
                {/* {this.emptyManagePage()} */}
                {this.showEmptyPage()
                    ? this.emptyManagePage()
                    : this.pageManageBody()}
            </div>
        );
    }

    protected showEmptyPage(): boolean {
        const f = this.filter();
        // console.log('showEmptyPage', f);
        if (Object.keys(f).length) return false;
        if (this.state.data.length) return false;
        if (this.state.gridLoading) return false;
        return true;
    }

    protected removeModalInfoLabel(
        chosenRow?: EntityModel
    ): string | undefined {
        return chosenRow?.id;
    }
    protected removeModalInfoRender(chosenRow?: EntityModel): JSX.Element {
        if (chosenRow === undefined) return <></>;
        return (
            <>
                <div className="text-info mb-2">
                    {this.removeModalInfoLabel(chosenRow)}
                </div>
                <div>{Localization.msg.ui.item_will_be_removed_continue}</div>
            </>
        );
    }
    protected removeModalRender(chosenRow?: EntityModel) {
        return (
            <ConfirmNotify
                confirmBtn_className="text-danger"
                confirmBtn_text={() => (
                    <span className="btn-- text-danger">
                        {Localization.remove}
                    </span>
                )}
                // msg={Localization.msg.ui.item_will_be_removed_continue}
                msgFunc={() => this.removeModalInfoRender(chosenRow)}
                show={this.state.removeModal.show}
                btnLoader={this.state.removeModal.loader}
                onHide={() => this.removeModalOnHide()}
                onConfirm={() => this.removeRow()}
            />
        );
    }

    private fabRender() {
        // <Fab
        //     icon={<i className="fa fa-plus"></i>}
        //     mainButtonStyles={{ backgroundColor: appColor(APP_COLOR_NAME.SUCCESS) }}
        //     event="hover"
        //     position={{
        //         bottom: 0,
        //         [this.props.internationalization.rtl ? "left" : "right"]: 0,
        //     }}
        //     text={Localization.create}
        //     onClick={() => this.goToCreate()}
        // >
        // </Fab>
    }

    protected emptyManagePage() {
        return (
            <EmptyPageManage
                lifeCycleImageUrl={
                    '/static/media/img/entity-life-cycle/product.png'
                }
                onCreateClicked={() => this.goToCreate()}
                createBtnText="create new"
                titleText="life cycle"
                caption={<div className="caption-wrapper mb-5"></div>}
            />
        );
    }

    render() {
        return (
            <>
                {this.pageManageWrapper()}

                {this.removeModalRender(this._chosenRow)}
                <ToastContainer {...this.getNotifyContainerConfig()} />
                {this.state.gridLoading && <TopBarProgress />}
            </>
        );
    }
}
