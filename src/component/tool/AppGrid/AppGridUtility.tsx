import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { IAppColumnInstance } from './AppGridCore';
import { HeaderGroup, HeaderProps } from 'react-table';
import { CmpUtility } from '../../_base/CmpUtility';
import { Formik } from 'formik';
import {
    APP_FORM_CONTROL,
    FormControl,
} from '../../form/_formik/FormControl/FormControl';
import { Localization } from '../../../config/localization/localization';
import { ReactSortable } from 'react-sortablejs';
import { UserService } from '../../../service/user.service';

export interface IGridPager {
    currentPage: number;
    limit: number;
    total: number;
    pageCount: number;
    onPageChange: (newPage: { selected: number }) => any;
}

// export type TColumnsDetail = Omit<Partial<IAppColumnInstance<any>>, 'header' | 'id'>;
export type TColumnsDetail = Omit<Partial<IAppColumnInstance<any>>, 'id'>;
// export type TColumnsDetail = Partial<IAppColumnInstance<any>>;

// export class AppGridUtility<D extends object> {
export class AppGridUtility {
    // static columns: { [key in 'selection' | 'index']: IAppColumnInstance<any> } = {
    static columns = {
        selection: () => {
            return {
                id: 'app-grid-selection',
                Header: ({ getToggleAllRowsSelectedProps }) => {
                    const {
                        indeterminate,
                        ...toggleAllRowsSelectedProps
                    } = getToggleAllRowsSelectedProps();
                    const id = Math.random().toString();
                    // console.log('header', indeterminate, toggleAllRowsSelectedProps);
                    return (
                        <>
                            {/* <div className="position-relative d-none">
                            <input type="checkbox" {...toggleAllRowsSelectedProps}
                                ref={input => { if (input) input.indeterminate = indeterminate as any; }}
                                style={{ opacity: 1, left: 0 }}
                            />
                        </div> */}
                            <div className="app-CHECKBOX mt-n1">
                                <input
                                    className={`app-checkbox native-style2 ${
                                        indeterminate ? 'indeterminate' : ''
                                    }`}
                                    id={id}
                                    {...toggleAllRowsSelectedProps}
                                    type="checkbox"
                                    ref={(input) => {
                                        if (input)
                                            input.indeterminate = indeterminate as any;
                                    }}
                                />
                                <label htmlFor={id}></label>
                            </div>
                        </>
                    );
                },
                Cell: ({ row }: any) => {
                    const {
                        indeterminate,
                        ...toggleRowSelectedProps
                    } = row.getToggleRowSelectedProps();
                    const id = Math.random().toString();
                    // console.log('cell', row.original.name, indeterminate, toggleRowSelectedProps);
                    return (
                        <>
                            {/* <div className="position-relative">
                            <input type="checkbox" {...toggleRowSelectedProps}
                                ref={input => { if (input) input.indeterminate = indeterminate as any; }}
                                style={{ opacity: 1, left: 0 }}
                            />
                        </div> */}
                            <div className="app-CHECKBOX mt-n1 prevent-onRowClick">
                                <input
                                    className={`app-checkbox native-style2 ${
                                        indeterminate ? 'indeterminate' : ''
                                    }`}
                                    id={id}
                                    {...toggleRowSelectedProps}
                                    type="checkbox"
                                    ref={(input) => {
                                        if (input)
                                            input.indeterminate = indeterminate as any;
                                    }}
                                />
                                <label htmlFor={id}></label>
                            </div>
                        </>
                    );
                },
                title: 'selection',
                width: 50,
                maxWidth: 50,
                minWidth: 50,
                canResize: false,
                visibleInColumnsDetail: false,
                disableSortBy: true,
                forceMaxWidth: 50,
            } as IAppColumnInstance<any>;
        },
        selectionRadio: () => {
            return {
                id: 'app-grid-selection-radio',
                Header: (p) => {
                    return <span></span>;
                },
                Cell: ({ row, getToggleAllRowsSelectedProps }: any) => {
                    const {
                        indeterminate,
                        title,
                        ...toggleRowSelectedProps
                    } = row.getToggleRowSelectedProps();
                    const {
                        // indeterminate,
                        // toggleAllRowsSelected,
                        ...toggleAllRowsSelectedProps
                    } = getToggleAllRowsSelectedProps();
                    // const id = Math.random().toString();
                    // console.log('cell', toggleRowSelectedProps, toggleAllRowsSelectedProps);
                    return (
                        <>
                            <div className="position-relative prevent-onRowClick">
                                <input
                                    // className={`app-checkbox-- native-style2-- `}
                                    // id={id}
                                    {...toggleRowSelectedProps}
                                    onChange={(e) => {
                                        // debugger;
                                        toggleAllRowsSelectedProps.onChange({
                                            target: { checked: false },
                                        });
                                        toggleRowSelectedProps.onChange(e);
                                    }}
                                    type="radio"
                                    style={{
                                        opacity: 1,
                                        left: 0,
                                        position: 'absolute',
                                    }}
                                    // ref={(input) => {
                                    //     if (input)
                                    //         input.indeterminate = indeterminate as any;
                                    // }}
                                />
                                {/* <label htmlFor={id}></label> */}
                            </div>
                        </>
                    );
                },
                title: 'radio selection',
                width: 50,
                maxWidth: 50,
                minWidth: 50,
                canResize: false,
                visibleInColumnsDetail: false,
                disableSortBy: true,
                forceMaxWidth: 50,
            } as IAppColumnInstance<any>;
        },
        index: () => {
            // return {
            //     id: 'app-grid-index',
            //     Header: (headerProps: React.PropsWithChildren<HeaderProps<D>>) => <div className="text-center">#</div>,
            //     Cell: (cellProps: CellProps<D>) => <div className="text-center">{cellProps.row.index + 1 + props.skip}</div>,
            //     // maxWidth: 50,
            //     width: 50,
            //     disableSortBy: true
            // }
        },
        columnsDetail: (col?: TColumnsDetail) => {
            return {
                id: 'app-grid-columnsDetail',
                Header: (p) => {
                    // console.log('app-grid-columnsDetail hedaer', p); // , columnsDetail
                    // return <div className="gholi99"><OverlayTrigger
                    // const [popperState, setPopperState] = React.useState({ show: false, focus: false });
                    return (
                        <OverlayTrigger
                            rootClose
                            trigger="click"
                            placement="bottom-start"
                            // flip
                            overlay={AppGridUtility.columnsDetailOverlayRender(
                                p
                            )}
                            // show={popperState.show as any}

                            // {...{
                            //     onToggle: (a: any) => {
                            //         debugger;
                            //     }
                            // }}
                            // popperConfig={{
                            //     modifiers: [
                            //         // {
                            //         //     name: 'offset',
                            //         //     options: {
                            //         //         offset: [0, 80],
                            //         //     },
                            //         // },
                            //         // {
                            //         //     name: 'preventOverflow',
                            //         //     options: {
                            //         //         // boundariesElement: 'window',
                            //         //         boundary:document.querySelector('body')
                            //         //     }
                            //         // }
                            //         {
                            //             name: 'preventOverflow',
                            //             options: {
                            //                 rootBoundary: 'document',
                            //                 boundariesElement: 'scrollParent',
                            //                 tether: false,
                            //                 boundary: document.querySelector('body')
                            //             },
                            //             boundaries: { top: 0 }
                            //         },
                            //         {
                            //             name: 'flip',
                            //             enabled: false,
                            //         },
                            //     ],
                            // }}
                        >
                            <div
                                className="cursor-pointer mt-1 d-flex max-w-16px--"
                                // onClick={() => { debugger; setPopperState({ show: false, focus: true }) }}
                            >
                                {/* <i className="fa fa-chevron-down"></i> */}
                                {/* <img src="/static/media/img/icon/columns-detail.svg" className="" alt="" /> */}
                                <span className="app-grid-column-detail-icon"></span>
                            </div>
                        </OverlayTrigger>
                    );
                },
                title: 'columns detail',
                width: 50,
                maxWidth: 50,
                minWidth: 50,
                canResize: false,
                visibleInColumnsDetail: false,
                disableSortBy: true,
                forceMaxWidth: 50,
                ...col,
            } as IAppColumnInstance<any>;
        },
    };

    static useFocus = () => {
        const htmlElRef = React.useRef<any>(null);
        const setFocus = () => {
            debugger;
            htmlElRef.current?.focus();
        };
        return [htmlElRef, setFocus];
    };

    static columnsDetailOverlayRender(
        p: React.PropsWithChildren<HeaderProps<any>>
    ) {
        const formData: { [key: string]: boolean } = {};
        const forceOrder: Array<{ id: string; order: number }> = [];
        p.allColumns.forEach((c: IAppColumnInstance<any>) => {
            if (typeof c.forceOrder === 'number') {
                forceOrder.push({ id: c.id, order: c.forceOrder });
            }
        });
        const allColumns_base: Array<
            IAppColumnInstance<any>
        > = p.allColumns.filter(
            (c: IAppColumnInstance<any>) => c.visibleInColumnsDetail !== false
        );

        /** replacing dot with ___; because dot make nested form in formik */
        const allColumns = allColumns_base.map((c) => {
            const newC = { ...c };
            newC.id = newC.id.replace(/\./gi, '___');
            return newC;
        });

        allColumns.forEach((c) => (formData[c.id] = false));
        p.visibleColumns.forEach(
            (c) => (formData[c.id.replace(/\./gi, '___')] = true)
        );
        const [orderList, setOrderList] = React.useState<
            Array<IAppColumnInstance<any>>
        >(allColumns);
        const [search, setSearch] = React.useState('');

        return (
            <Popover
                id={`grid-column-detail-popover`}
                className="grid-column-detail-popover"
            >
                <Popover.Content className="thin-scroll--">
                    <div className="columns-detail-wrapper pb-2-- pt-1--">
                        <div className="columns-detail-wrapper-header">
                            <div className="search-wrapper input-group input-group-sm mb-3--">
                                <div className="search-icon-container input-group-prepend">
                                    <span className="search-icon-wrapper input-group-text">
                                        {/* <i className="search-icon fa fa-search"></i> */}
                                        <span className="search-icon"></span>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="search-input form-control"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.currentTarget.value)
                                    }
                                    placeholder="Search"
                                />
                            </div>
                        </div>
                        <Formik
                            initialValues={formData}
                            onSubmit={() => {}}
                            enableReinitialize
                        >
                            {(formikProps) => (
                                <>
                                    <div className="columns-detail-wrapper-body thin-scroll">
                                        <ReactSortable
                                            list={orderList}
                                            setList={setOrderList}
                                            className="row form-inline"
                                            // swap
                                            ghostClass="columns-detail-wrapper-ghost"
                                            // animation={150}
                                        >
                                            {orderList.map((col) => {
                                                const colTitle =
                                                    col.title || col.id; // (col.id).replace(/___/gi, '.');
                                                const colShow = colTitle
                                                    .toLocaleLowerCase()
                                                    .includes(
                                                        search.toLocaleLowerCase()
                                                    );
                                                const randomId = Math.random().toString();
                                                return (
                                                    <div
                                                        key={col.id}
                                                        className={`col-12 mb-1 ${
                                                            colShow
                                                                ? ''
                                                                : 'd-none'
                                                        }`}
                                                    >
                                                        <div className="column-detail">
                                                            <FormControl
                                                                control={
                                                                    APP_FORM_CONTROL.CHECKBOX
                                                                }
                                                                name={col.id}
                                                                id={randomId}
                                                                // label={(col as any).title || col.id}
                                                                secondaryLabel={
                                                                    colTitle
                                                                }
                                                                // round
                                                                // indeterminate
                                                                nativeStyle
                                                                secondaryLabelClassName="ml-2 text-capitalize mt-2--"
                                                            />
                                                            <i className="fa fa-bars drag-icon"></i>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </ReactSortable>
                                    </div>
                                    <div className="columns-detail-wrapper-footer">
                                        <button
                                            className="btn btn-info btn-sm min-w-70px mr-3"
                                            onClick={() => {
                                                const values =
                                                    formikProps.values;
                                                const keys = Object.keys(
                                                    values
                                                );
                                                const hidden: Array<string> = [];
                                                keys.forEach((k) => {
                                                    if (values[k] !== true)
                                                        hidden.push(k);
                                                });
                                                const order = orderList.map(
                                                    (o) => o.id
                                                );

                                                // p.setHiddenColumns(hidden);
                                                // p.setColumnOrder(order);
                                                const h = hidden.map((k) =>
                                                    k.replace(/___/gi, '.')
                                                );
                                                const o = order.map((k) =>
                                                    k.replace(/___/gi, '.')
                                                );
                                                forceOrder.forEach((item) => {
                                                    o.splice(
                                                        item.order,
                                                        0,
                                                        item.id
                                                    );
                                                });
                                                p.setHiddenColumns(h);
                                                p.setColumnOrder(o);
                                                CmpUtility.dismissPopover();
                                            }}
                                        >
                                            {Localization.save}
                                        </button>
                                        <button
                                            className="btn btn-light btn-sm min-w-70px"
                                            onClick={() => {
                                                CmpUtility.dismissPopover();
                                            }}
                                        >
                                            {Localization.cancel}
                                        </button>
                                    </div>
                                </>
                            )}
                        </Formik>
                    </div>
                </Popover.Content>
            </Popover>
        );
    }

    static columnHeader(column: HeaderGroup<any>): React.ReactNode {
        const headerProps = column.getHeaderProps();
        if (typeof column.forceMaxWidth === 'number') {
            headerProps.style = headerProps.style || {};
            headerProps.style.maxWidth = column.forceMaxWidth + 'px';
        }
        if (column.style) {
            headerProps.style = { ...headerProps.style, ...column.style };
        }

        if (!column.canSort)
            return (
                <div {...headerProps} className="th">
                    {column.render('Header')}
                </div>
            );

        return (
            <div {...headerProps} className="th">
                <OverlayTrigger
                    rootClose
                    trigger="click"
                    placement="bottom-start"
                    overlay={
                        <Popover
                            id={`column-header-sort-menu-popover-${column.id}`}
                            className="popper-action-menu-wrapper"
                        >
                            <Popover.Content
                                onClick={() => CmpUtility.dismissPopover()}
                                className="px-0 py-1"
                            >
                                <ul className="list-group list-group-flush">
                                    {(!column.isSorted ||
                                        column.isSortedDesc) && (
                                        <li
                                            className="list-group-item list-group-item-action px-3"
                                            onClick={() => {
                                                // debugger;
                                                column.id =
                                                    (column as any)
                                                        .originalId ||
                                                    column.id;
                                                column.toggleSortBy &&
                                                    column.toggleSortBy(false);
                                            }}
                                        >
                                            <i className="icon fa fa-sort-up mr-1"></i>
                                            <span className="text text-capitalize small">
                                                asc
                                            </span>
                                        </li>
                                    )}
                                    {(!column.isSorted ||
                                        !column.isSortedDesc) && (
                                        <li
                                            className="list-group-item list-group-item-action px-3"
                                            onClick={() => {
                                                // debugger;
                                                column.id =
                                                    (column as any)
                                                        .originalId ||
                                                    column.id;
                                                column.toggleSortBy &&
                                                    column.toggleSortBy(true);
                                            }}
                                        >
                                            <i className="icon fa fa-sort-down mr-1"></i>
                                            <span className="text text-capitalize small">
                                                desc
                                            </span>
                                        </li>
                                    )}
                                    {column.isSorted && (
                                        <li
                                            className="list-group-item list-group-item-action px-3"
                                            onClick={() => {
                                                // debugger;
                                                column.id =
                                                    (column as any)
                                                        .originalId ||
                                                    column.id;
                                                column.clearSortBy &&
                                                    column.clearSortBy();
                                            }}
                                        >
                                            <i className="icon fa fa-sort text-light mr-1"></i>
                                            <span className="text text-capitalize small">
                                                unsort
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </Popover.Content>
                        </Popover>
                    }
                >
                    <div className="cursor-pointer d-inline-block">
                        {column.render('Header')}
                        <i
                            className={`sort-icon ml-2 fa fa-${
                                column.isSorted
                                    ? column.isSortedDesc
                                        ? 'sort-down'
                                        : 'sort-up'
                                    : ''
                            }`}
                        ></i>
                    </div>
                </OverlayTrigger>
            </div>
        );
    }

    static columnCell(cell: any): React.ReactNode {
        const cellProps = cell.getCellProps();
        if (typeof cell.column.forceMaxWidth === 'number') {
            cellProps.style.maxWidth = cell.column.forceMaxWidth + 'px';
        }
        if (cell.column.style) {
            cellProps.style = { ...cellProps.style, ...cell.column.style };
        }
        return (
            <div {...cellProps} className="td">
                {cell.render('Cell')}
            </div>
        );
    }

    static pager(options: IGridPager): JSX.Element {
        const { currentPage, limit, total, pageCount, onPageChange } = options;

        let from = currentPage * limit + 1;
        const to_max = (currentPage + 1) * limit;
        const to = to_max > total ? total : to_max;
        if (to === 0) from = 0;
        const totalPage = pageCount;
        const previousPageActive = currentPage > 0;
        const nextPageActive = currentPage + 1 < totalPage;

        return (
            <div className="app-pager-wrapper">
                <div
                    className={`pager-previous-page ${
                        previousPageActive ? 'active' : ''
                    }`}
                    onClick={() => {
                        if (!previousPageActive) return;
                        onPageChange({ selected: currentPage - 1 });
                    }}
                ></div>
                <div className="pager-from">{from}</div>
                <div className="pager-text">to</div>
                <div className="pager-to">{to}</div>
                <div
                    className={`pager-next-page ${
                        nextPageActive ? 'active' : ''
                    }`}
                    onClick={() => {
                        if (!nextPageActive) return;
                        onPageChange({ selected: currentPage + 1 });
                    }}
                ></div>
            </div>
        );
    }

    /**
     * store columns changes per user
     */
    static async saveColumnsChanges(
        entityName: string,
        columnOrder: Array<string>,
        hiddenColumns: Array<string>
    ) {
        try {
            const visibleColumnsOrder = columnOrder.filter(
                (c) => !hiddenColumns.includes(c)
            );
            await new UserService().setColumns(entityName, visibleColumnsOrder);
        } catch (error) {}
    }
}
