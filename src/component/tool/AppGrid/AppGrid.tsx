import React from 'react';
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Localization } from '../../../config/localization/localization';
import { AppGridCore, TAppColumn } from './AppGridCore';
import ReactSelect from "react-select";
import { Store2 } from '../../../redux/store';
import { CmpUtility } from '../../_base/CmpUtility';
import { AppGridUtility, TColumnsDetail } from './AppGridUtility';
import { TableState, Row } from 'react-table';

interface IProps<D extends object> {
    columns: Array<TAppColumn<D>>;
    data: Array<D>;
    defaultColumn: Partial<TAppColumn<D>>;
    showIndexColumn?: boolean;
    skip?: number;
    pagination?: {
        visible: boolean;
        paginationStyle?: "pagination-lg" | "pagination-sm";
        pageCount: number;
        initialPage?: number;
        forcePage?: number;
        onPageChange: (selectedItem: { selected: number; }) => any;
        total?: number;
    };
    loading?: boolean;
    reload?: () => any;
    reset?: () => any;
    // size?: 'sm';
    showLimit?: boolean;
    limit?: number;
    onLimitChange?: (limit: number) => any;
    setSelectedRows?: (rows: Array<D>) => any;
    selectedRowIds?: { [key: string]: boolean; };
    showSelectionColumn?: boolean;
    actionListAlign?: JSX.Element;
    actionListAlignInverse?: JSX.Element;
    showHeader?: boolean;
    columnOrder?: Array<string>;
    hiddenColumns?: Array<string>;
    showColumnsDetail?: boolean;
    setColumnOrder?: (data?: Array<string>) => any;
    setHiddenColumns?: (data?: Array<string>) => any;
    columnsDetail?: TColumnsDetail;
    sortBy?: TableState<D>['sortBy'];
    setSortBy?: (data: TableState<D>['sortBy']) => any;
    onRowClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: Row<D>) => any;
    showTotal?: boolean;
}
interface IState { }

class AppGrid<D extends object> extends React.Component<IProps<D>, IState> {
    // static defaultProps: Partial<IProps<{}>> = {
    static defaultProps = {
        showIndexColumn: true,
        defaultColumn: {
            // minWidth: 100,
            // width: 150,
            // maxWidth: 400,
        },
        skip: 0,
        pagination: {
            visible: true,
            paginationStyle: '',
            pageCount: 0,
            onPageChange: (selectedItem: { selected: number; }) => { }
        },
        loading: false,
        showLimit: true,
        limit: 10,
        showSelectionColumn: true,
        showHeader: true,
        showColumnsDetail: true,
        showTotal: true,
    };

    private actionListRender(): JSX.Element {
        if (true) return <></>;
        return <div className="d-flex mb-3 justify-content-between">
            {this.actionListAlign()}
            {this.actionListAlignInverse()}
        </div>
    }

    private actionListAlign(): JSX.Element {
        if (this.props.reload === undefined && this.props.reset === undefined) return <></>;

        return <div className="action-list d-flex mb-3--">
            {this.props.reload !== undefined && <OverlayTrigger
                placement="top"
                delay={{ show: 150, hide: 300 }}
                overlay={({ show, ...props }: any) => <Tooltip id="grid-action-reload-tooltip" className="app-tooltip" show={show.toString()} {...props}>{Localization.reload}</Tooltip>}
            >
                <div className="action shadow-hover-sm cursor-pointer mr-2" onClick={() => this.props.reload!()}>
                    <i className="fa fa-refresh"></i>
                </div>
            </OverlayTrigger>}

            {this.props.reset !== undefined && <OverlayTrigger
                placement="top"
                delay={{ show: 150, hide: 300 }}
                overlay={({ show, ...props }: any) => <Tooltip id="grid-action-reset-tooltip" className="app-tooltip" show={show.toString()} {...props}>{Localization.reset}</Tooltip>}
            >
                <div className="action shadow-hover-sm cursor-pointer mr-2 text-warning" onClick={() => this.props.reset!()}>
                    <i className="fa fa-undo"></i>
                </div>
            </OverlayTrigger>}

            {this.props.actionListAlign}
        </div>
    }

    private appGridMoreActionsRender() {
        return <Popover id={`grid-action-more-popover`} className="popper-action-menu-wrapper" >
            <Popover.Content onClick={() => CmpUtility.dismissPopover()}>
                <ul className="list-group list-group-flush">
                    {/* <li className="list-group-item list-group-item-action text-info--" onClick={() => this.columnsDetailModalOnShow()}>
                        <i className="icon fa fa-gears"></i><span className="text">{Localization.settings}</span>
                    </li> */}
                    <li className="list-group-item list-group-item-action text-info--" onClick={() => { }}>
                        <i className="icon fa fa-print"></i><span className="text">print</span>
                    </li>
                    <li className="list-group-item list-group-item-action text-system" onClick={() => { }}>
                        <i className="icon fa fa-file-excel-o"></i><span className="text">excel</span>
                    </li>
                </ul>
            </Popover.Content>
        </Popover>
    }
    private actionListAlignInverse(): JSX.Element {
        return <div className="action-list d-flex mb-3--">
            {this.props.actionListAlignInverse}

            <OverlayTrigger
                rootClose
                trigger="click"
                placement={Store2.getState().internationalization.rtl ? 'right' : 'left'}
                overlay={this.appGridMoreActionsRender()}
            >
                <div className="action shadow-hover-sm cursor-pointer mr-2"><i className="fa fa-ellipsis-h"></i></div>
            </OverlayTrigger>
        </div>
    }

    private gridCoreRender(): JSX.Element {
        return <AppGridCore<D>
            showIndexColumn={this.props.showIndexColumn!}
            columns={this.props.columns}
            data={this.props.data}
            skip={this.props.skip!}
            defaultColumn={this.props.defaultColumn}
            loading={this.props.loading!}
            setSelectedRows={this.props.setSelectedRows}
            showSelectionColumn={this.props.showSelectionColumn!}
            selectedRowIds={this.props.selectedRowIds}
            showHeader={this.props.showHeader}
            columnOrder={this.props.columnOrder}
            hiddenColumns={this.props.hiddenColumns}
            showColumnsDetail={this.props.showColumnsDetail!}
            columnsDetail={this.props.columnsDetail}
            setColumnOrder={this.props.setColumnOrder}
            setHiddenColumns={this.props.setHiddenColumns}
            sortBy={this.props.sortBy}
            setSortBy={this.props.setSortBy}
            onRowClick={this.props.onRowClick}
        />
    }

    private pagerRender(): JSX.Element {
        let currentPage = this.props.pagination?.forcePage;
        if (currentPage === undefined) {
            currentPage = this.props.pagination?.initialPage || 0
        }
        const limit = this.props.limit || 0;
        if (!this.props.pagination?.visible) return <></>;

        return AppGridUtility.pager({
            currentPage: currentPage,
            limit,
            total: this.props.pagination.total || 0,
            pageCount: this.props.pagination.pageCount,
            onPageChange: this.props.pagination?.onPageChange
        });
    }

    private paginationRender(): JSX.Element {
        if (!this.props.pagination?.visible) return <></>;
        return <div className="app-pagination-wrapper app-pagination app-pagination-shadow d-flex--">
            <ReactPaginate
                // previousLabel={Localization.previous}
                // previousLabel={'<'}
                previousLabel={<i className="fa fa-chevron-left-app"></i>}
                // nextLabel={Localization.next}
                // nextLabel={'>'}
                nextLabel={<i className="fa fa-chevron-right-app"></i>}
                breakLabel="..."
                pageCount={this.props.pagination?.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={(selectedItem: { selected: number; }) => {
                    this.props.pagination?.onPageChange(selectedItem);
                }}
                initialPage={this.props.pagination.initialPage}
                forcePage={this.props.pagination.forcePage}

                containerClassName={`pagination mb-0 ${this.props.pagination?.paginationStyle || 'pagination-sm'}`}
                activeClassName="active"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                pageClassName="page-item"
                pageLinkClassName="page-link"
            />
        </div>
    }

    private limitLabelValue(v: number) {
        return { label: `${v} Records Per Page`, value: v };
    }

    private limitRender() {
        if (!this.props.showLimit || !this.props.onLimitChange) return <></>;
        return <ReactSelect
            className="mr-3 w-190px shadow-hover-sm-- app-grid-limit app-grid-limit-sm app-select--"
            placeholder=""
            options={[
                this.limitLabelValue(10),
                this.limitLabelValue(20),
                this.limitLabelValue(30),
                this.limitLabelValue(40),
                this.limitLabelValue(50),
            ]}
            onChange={(v: { label: string, value: number } | null | any) => {
                // debugger;
                if (this.props.onLimitChange && v) this.props.onLimitChange(v.value);
            }}
            value={this.limitLabelValue(this.props.limit!)}
            // components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            components={{ DropdownIndicator: () => <><i className="fa fa-caret-down pr-2"></i></>, IndicatorSeparator: () => null }}
            menuPlacement="auto"
            isSearchable={false}
        />
    }

    private totalRender() {
        if (!this.props.showTotal) return <div className="mr-auto"></div>;
        if (this.props.pagination?.total === undefined) return <></>;
        return <div className="total-render shadow-hover-sm-- rounded-- px-3 text-capitalize font-weight-bold-- mr-auto d-flex align-items-center bg-white">
            <span className="mr-2">total count:</span>
            <span className="total-number">{this.props.pagination.total}</span>
        </div>
    }

    private gridFooterRender() {
        if (
            !this.props.showTotal
            && (!this.props.showLimit || !this.props.onLimitChange)
            && !this.props.pagination?.visible
        ) return <></>;

        return <div className="app-data-grid-footer d-flex my-3--px-3 p-3">
            {this.totalRender()}
            {this.limitRender()}
            {/* {this.paginationRender()} */}
            {this.pagerRender()}
        </div>
    }

    render() {
        return (<>
            <div className="row">
                <div className="col-12 app-data-grid-wrapper">
                    {this.actionListRender()}
                    {this.gridCoreRender()}
                    {this.gridFooterRender()}
                </div>
            </div>
        </>);
    }
}

export default AppGrid;