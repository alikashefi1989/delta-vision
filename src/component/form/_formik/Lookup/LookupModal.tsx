import React from 'react';
import Modal from 'react-bootstrap/Modal';
import AppGrid from '../../../tool/AppGrid';
import { IEntityColumn } from '../../../../model/column.model';
import { GridCell } from '../../../tool/GridCell/GridCell';
import { Setup } from '../../../../config/setup';
import { ROUTE_BASE_CRUD, BaseUtility } from '../../../page/_base/BaseUtility';
import TopBarProgress from 'react-topbar-progress-indicator';
import { AppGridUtility } from '../../../tool/AppGrid/AppGridUtility';

interface IProps {
    show: boolean;
    onHide: () => any;
    onConfirm: (v: Array<any>) => any;
    value: Array<any>;
    readOnly?: boolean;
    title: React.ReactNode;
    isMulti?: boolean;
    columns: Array<IEntityColumn>;
    entityName: ROUTE_BASE_CRUD;
    searchAccessor: string;
    defaultFilter?: Object;
}

interface IState {
    value: Array<any>;
    data: Array<any>;
    gridSearch: string;
    pagination: {
        pageCount: number;
        initialPage: number;
        limit: number;
        total: number;
    };
    gridLoading: boolean;
    // selectedRows: Array<any>;
    selectedRowIds: { [key: string]: boolean };
}

export class LookupModal extends React.Component<IProps, IState> {
    state = {
        value: this.props.value,
        data: [],
        gridSearch: '',
        pagination: {
            pageCount: 0,
            initialPage: 0,
            limit: Setup.recordDefaultLoadLength,
            total: 0,
        },
        gridLoading: false,
        // selectedRows: this.props.value,
        selectedRowIds: {},
    };
    private _columns = this.generateColumns();

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps: IProps) {
        if (
            JSON.stringify(this.props.value) !==
                JSON.stringify(prevProps.value) &&
            JSON.stringify(this.props.value) !==
                JSON.stringify(this.state.value)
        ) {
            // if (
            //     JSON.stringify(this.props.value) !==
            //     JSON.stringify(this.state.value)
            // ) {
            // debugger;
            this.setState({
                value: this.props.value,
                // selectedRows: this.props.value,
                selectedRowIds: this.getSelectedRowIds(
                    this.props.value,
                    this.state.data
                ),
            });
            // }
        } else if (this.props.show === true && prevProps.show === false) {
            // debugger;
            setTimeout(() => {
                // debugger;
                const srIds = this.getSelectedRowIds(
                    this.props.value,
                    this.state.data
                );
                // this.setState({
                //     // value: this.props.value,
                //     // selectedRows: this.props.value,
                //     selectedRowIds: this.getSelectedRowIds(this.props.value, this.state.data)
                // });
                if (
                    JSON.stringify(srIds) !==
                    JSON.stringify(this.state.selectedRowIds)
                )
                    this.setState((prevState) => {
                        // debugger;
                        return { ...prevState, selectedRowIds: srIds };
                    });
            }, 500);
        }
    }

    private generateColumns() {
        const columns = this.props.columns.map((c) => {
            return {
                Header: c.header,
                accessor: c.accessor,
                title: c.title,
                Cell: GridCell.render(c),
                // disableSortBy: c.sortable === false ? true : false,
                disableSortBy: true,
            };
        });
        columns.unshift(AppGridUtility.columns.selectionRadio() as any);
        // columns.unshift(AppGridUtility.columns.selection() as any);
        return columns;
    }

    private async onGridSearch(searchText: string) {
        this.setState(
            {
                gridSearch: searchText,
                pagination: {
                    ...this.state.pagination,
                    initialPage: 0,
                },
            },
            () => {
                this.debounce();
            }
        );
    }

    private setTimeoutDebounce: NodeJS.Timeout | undefined;
    private debounce() {
        if (this.setTimeoutDebounce) clearTimeout(this.setTimeoutDebounce);
        this.setTimeoutDebounce = setTimeout(() => {
            this.fetchData();
        }, 500);
    }

    private filter() {
        let filter = {};
        if (this.state.gridSearch) {
            filter = {
                // readableId: { $regex: `${this.state.gridSearch}`, $options: 'i' }, // sku
                [this.props.searchAccessor]: {
                    $regex: `${this.state.gridSearch}`,
                    $options: 'i',
                },
            };
            if (
                this.props.defaultFilter &&
                Object.keys(this.props.defaultFilter).length
            ) {
                filter = { $and: [filter, this.props.defaultFilter] };
            }
        } else if (
            this.props.defaultFilter &&
            Object.keys(this.props.defaultFilter).length
        ) {
            filter = this.props.defaultFilter;
        }

        return filter;
    }

    private async fetchData() {
        try {
            const res = await BaseUtility.crudService(
                this.props.entityName
            ).search({
                // search: this.state.gridSearch,
                filter: this.filter(),
                pagination: {
                    page: this.state.pagination.initialPage,
                    limit: this.state.pagination.limit,
                },
            });
            // debugger;
            this.setState({ selectedRowIds: {} }, () => {
                this.setState({
                    data: res.data.data.items,
                    pagination: {
                        ...this.state.pagination,
                        pageCount: this.pageCount(
                            res.data.data.explain.pagination.total,
                            this.state.pagination.limit
                        ),
                        total: res.data.data.explain.pagination.total,
                    },
                    gridLoading: false,
                    // selectedRowIds: this.state.pagination.initialPage === 2 ? { '3': true, '5': true } : {},
                    // selectedRows
                    // selectedRowIds: this.getSelectedRowIds(this.state.selectedRows, res.data.data.items),
                    selectedRowIds: this.getSelectedRowIds(
                        this.state.value,
                        res.data.data.items
                    ),
                    // value: this.state.selectedRows
                });
            });
            // this.setState({ data: res.data.data.items });
        } catch (e) {
            this.setState({ gridLoading: false });
            // this.setState({ data: [] });
        }
    }

    private pageCount(total: number, limit: number): number {
        return Math.ceil(total / limit);
    }

    private hideModal() {
        // this.setState({ selectedRowIds: {} }, () => {
        this.props.onConfirm(this.state.value);
        this.props.onHide();
        // });
    }

    private onPageChange(selectedItem: { selected: number }) {
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

    private setSelectedRows = (rows: Array<any>): void => {
        // debugger;
        if (rows.length)
            this.setState({
                // selectedRows: rows,
                value: rows,
            });
    };

    private getSelectedRowIds(selectedRows: Array<any>, data: Array<any>) {
        // debugger;
        const obj: { [key: string]: boolean } = {};
        selectedRows.forEach((s) => {
            const i = data.findIndex((d) => d.id === s.id);
            if (i !== -1) obj[i] = true;
        });
        // selectedRowIds: this.state.pagination.initialPage === 2 ? { '3': true, '5': true } : {},
        return obj;
    }

    private searchRender() {
        return (
            <div className={`search-wrapper input-group input-group-sm mb-3--`}>
                <div className="search-icon-container input-group-prepend">
                    <span className="search-icon-wrapper input-group-text">
                        <span className="search-icon"></span>
                    </span>
                </div>
                <input
                    type="text"
                    className="search-input form-control"
                    value={this.state.gridSearch}
                    onChange={(e) => {
                        this.onGridSearch(e.currentTarget.value);
                    }}
                    placeholder="Search"
                />
            </div>
        );
    }

    modal_render() {
        return (
            <>
                <Modal
                    size="xl"
                    show={this.props.show}
                    onHide={() => this.hideModal()}
                >
                    <Modal.Body>
                        <div className="row app-lookup-modal">
                            <div className="col-12">
                                <h4 className="font-weight-bold">
                                    {this.props.title}
                                </h4>
                            </div>
                            <div className="col-12 mb-4">
                                {this.searchRender()}
                            </div>

                            <div className="col-12">
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
                                    // reload={() => this.fetchData()}
                                    // reset={() => this.resetGrid()}
                                    // onLimitChange={(l) =>
                                    //     this.onLimitChange(l)
                                    // }
                                    limit={this.state.pagination.limit}
                                    setSelectedRows={this.setSelectedRows}
                                    selectedRowIds={this.state.selectedRowIds}
                                    // columnsDetail={this.AppGridColumnsDetail()}
                                    // columnOrder={this.state.columnOrder}
                                    // hiddenColumns={this.state.hiddenColumns}
                                    // setColumnOrder={this.setColumnOrder}
                                    // setHiddenColumns={this.setHiddenColumns}
                                    sortBy={[]}
                                    // setSortBy={this.setSortBy}
                                    // onRowClick={(e, row) => {
                                    //     // debugger;
                                    //     // this.goToView(row.original.id);
                                    // }}
                                    showSelectionColumn={false}
                                    showColumnsDetail={false}
                                    showLimit={false}
                                    showTotal={false}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                {this.state.gridLoading && <TopBarProgress />}
            </>
        );
    }

    render() {
        return <>{this.modal_render()}</>;
    }
}
