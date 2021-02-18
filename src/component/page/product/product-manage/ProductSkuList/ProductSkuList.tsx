import React from 'react';
import { redux_state } from '../../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Setup, TInternationalization } from '../../../../../config/setup';
import { TAppColumn } from '../../../../tool/AppGrid';
import { Localization } from '../../../../../config/localization/localization';
import { AppRoute } from '../../../../../config/route';
import { Popover } from 'react-bootstrap';
import { CmpUtility } from '../../../../_base/CmpUtility';
import { ILanguage_schema } from '../../../../../redux/action/language/languageAction';
import TopBarProgress from 'react-topbar-progress-indicator';
import BaseManage, { IStateBaseManage } from '../../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../../_base/BaseUtility';
// import { Fab } from "react-tiny-fab";
// import { appColor, APP_COLOR_NAME } from "../../../../../config/appColor";
import { APP_FILTER_FORM_CONTROL, FilterFormControl } from '../../../../form/_formik/_filters/FilterFormControl/FilterFormControl';
import { SkuService } from '../../../../../service/sku.service';
import { ISku } from '../../../../../model/sku.model';
import { ConfirmNotify } from '../../../../form/confirm-notify/ConfirmNotify';
import { ProductService } from '../../../../../service/product.service';

interface IState extends IStateBaseManage<ISku> {
    toggleActiveModal: {
        show: boolean;
        loader: boolean;
    };
    setAsDefaultModal: {
        show: boolean;
        loader: boolean;
    };
}
interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
    match: any;
}

class ProductSkuListComponent extends BaseManage<ISku, any, any, IProps, IState> {
    state: IState = {
        toggleActiveModal: {
            show: false,
            loader: false
        },
        setAsDefaultModal: {
            show: false,
            loader: false
        },
        ...this.baseState
    };

    columns: Array<TAppColumn<any>> = [
        {
            Header: 'sku',
            accessor: `sku`,
            title: 'sku',
            Cell: (cell: any) => {
                return <div className="text-primary text-nowrap-ellipsis max-w-250px"
                // onClick={() => this.goToView(cell.row.original.id)}
                // title={Localization.view}
                >{cell.row.original.sku}</div>
            },
            minWidth: 100
        },
        {
            Header: 'product',
            accessor: `product`,
            title: 'product',
            Cell: (cell: any) => {
                return <div className="text-primary text-nowrap-ellipsis max-w-150px"
                // onClick={() => this.goToView(cell.row.original.id)}
                // title={Localization.view}
                >{cell.row.original['product.name'][this.defaultLangCode || '']}</div>
            },
            minWidth: 100
        },
        {
            accessor: 'isActive',
            Header: 'is active',
            title: 'is active',
            Cell: (cell: any) => {
                return cell.row.original.isActive ?
                    <span className="text-capitalize">yes</span> :
                    <span className="text-capitalize">no</span>
                // return <>{cell.row.original.isActive ?
                //     <i className="fa fa-check text-success"></i> :
                //     <i className="fa fa-times text-danger"></i>}</>
            },
            minWidth: 100,
        },
        // {
        //     Header: 'barcode',
        //     accessor: `barcode`,
        //     title: 'barcode',
        //     Cell: (cell: any) => {
        //         return <div className="text-primary cursor-pointer text-nowrap-ellipsis max-w-150px"
        //         // onClick={() => this.goToView(cell.row.original.id)}
        //         // title={Localization.view}
        //         >{cell.row.original.barcode}</div>
        //     },
        //     minWidth: 100
        // },
        ...this.baseColumns
    ];

    protected _entityService = new SkuService();
    protected _productService = new ProductService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.product;
    protected product_id: string | undefined = undefined;
    componentDidMount() {
        if (!this.props.language.defaultLanguage?.id) {
            this.goToLanguageManage();
            setTimeout(() => {
                this.toastNotify(Localization.msg.ui.no_default_lang_create, { autoClose: Setup.notify.timeout.warning }, 'warn');
            }, 300);
            return;
        }
        this.product_id = this.props.match.params.product_id;
        if (this.product_id) {
            this.fetchData();
            // this.fetchFilters(); // TODO : add after implementation in back-end side
        }
    }

    protected async fetchData() {
        // debugger;
        this.setState({ gridLoading: true });
        let generalFilter: any = this.filter()
        try {
            const res = await this._entityService.search({
                pagination: {
                    page: this.state.pagination.initialPage,
                    limit: this.state.pagination.limit,
                },
                filter: { ...generalFilter, productId: this.product_id }
            });
            const originalData = [...res.data.data.items];
            this.setState({
                data: originalData,
                pagination: {
                    ...this.state.pagination,
                    pageCount: this.pageCount(res.data.data.explain.pagination.total, this.state.pagination.limit),
                    total: res.data.data.explain.pagination.total
                },
                gridLoading: false
            });
        } catch (e) {
            this.setState({ gridLoading: false });
            this.handleError({ error: e.response, toastOptions: { toastId: 'fetchData_error' } });
        }
    }

    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    private goToManage() {
        this.navigate(AppRoute.routeData.product.manage.url());
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    private toggleActiveModalOnHide() {
        this._chosenRow = undefined;
        this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, show: false } });
    }

    private toggleActiveModalOnShow(row: ISku) {
        this._chosenRow = row;
        this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, show: true } });
    }

    private async toggleActiveRow() {
        // debugger;
        if (this._chosenRow === undefined) return;
        const isActive: boolean = !this._chosenRow.isActive;

        this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, loader: true } });
        try {
            // const res = 
            await this._entityService.setActivation(this._chosenRow.id, isActive);
            this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, loader: false, show: false } });
            this.fetchData();
        } catch (e) {
            this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, loader: false } });
            this.handleError({ error: e.response, toastOptions: { toastId: 'toggleActiveRow_error' } });
        }
    }

    private setAsDefaulModalOnHide() {
        this._chosenRow = undefined;
        this.setState({ setAsDefaultModal: { ...this.state.setAsDefaultModal, show: false } });
    }

    private setAsDefaulModalOnShow(row: ISku) {
        this._chosenRow = row;
        this.setState({ setAsDefaultModal: { ...this.state.setAsDefaultModal, show: true } });
    }

    private async setAsDefaulRow() {
        // debugger;
        if (this._chosenRow === undefined || this.product_id === undefined) return;

        this.setState({ setAsDefaultModal: { ...this.state.setAsDefaultModal, loader: true } });
        try {
            // const res = 
            await this._productService.setDefaultSku(this.product_id, this._chosenRow.id);
            this.setState({ setAsDefaultModal: { ...this.state.setAsDefaultModal, loader: false, show: false } });
            if (this.product_id) {
                this.fetchData();
            }
        } catch (e) {
            this.setState({ setAsDefaultModal: { ...this.state.setAsDefaultModal, loader: false } });
            this.handleError({ error: e.response, toastOptions: { toastId: 'setAsDefaulRow_error' } });
        }
    }

    private appGridRowSetAsDefaultSkuToggleRender(row: ISku) {
        return <li className="list-group-item list-group-item-action text-success" onClick={() => this.setAsDefaulModalOnShow(row)}>
            <i className="icon fa fa-list"></i><span className="text">{Localization.set_as_default}</span>
        </li>
    }

    private appGridRowActionToggleActiveRender(row: ISku) {
        if (row.isActive)
            return <li className="list-group-item list-group-item-action text-warning" onClick={() => this.toggleActiveModalOnShow(row)}>
                <i className="icon fa fa-times"></i><span className="text">{Localization.inactive}</span>
            </li>
        else
            return <li className="list-group-item list-group-item-action text-success" onClick={() => this.toggleActiveModalOnShow(row)}>
                <i className="icon fa fa-check"></i><span className="text">{Localization.active}</span>
            </li>
    }

    protected appGridRowActionsRender(row: ISku, index: number) {
        return <Popover id={`grid-action-menu-popover-${index}`} className="popper-action-menu-wrapper" >
            <Popover.Content onClick={() => CmpUtility.dismissPopover()}>
                <ul className="list-group list-group-flush">
                    {this.appGridRowActionRemoveRender(row)}
                    {this.appGridRowActionToggleActiveRender(row)}
                    {this.appGridRowSetAsDefaultSkuToggleRender(row)}
                </ul>
            </Popover.Content>
        </Popover>
    }

    protected pageManageSidebarBody() {
        return <>
            <div className="row">
                {this.filterRender(
                    <FilterFormControl
                        control={APP_FILTER_FORM_CONTROL.FILTER_TEXT}
                        name={`product${this._F2FSymbol}name${this._F2FSymbol}${this.defaultLangCode}`}
                        // label={'name'}
                        controlClassName="ml-2"
                    />,
                    `product${this._F2FSymbol}name${this._F2FSymbol}${this.defaultLangCode}`,
                    'product'
                )}
                {this.filterRender(
                    <FilterFormControl
                        control={APP_FILTER_FORM_CONTROL.FILTER_TEXT}
                        name={`sku`}
                        // label={'name'}
                        controlClassName="ml-2"
                    />,
                    `sku`,
                    'sku'
                )}
                {this.filterRender(
                    <FilterFormControl
                        control={APP_FILTER_FORM_CONTROL.FILTER_SELECT}
                        name={"isActive"}
                        // label={'activation'}
                        options={[
                            { label: 'active', value: true },
                            { label: 'inactive', value: false },
                        ]}
                        controlClassName="ml-2"
                    />,
                    'isActive',
                    'activation'
                )}
            </div>
            {super.pageManageSidebarBody()}
        </>
    }

    protected AppGridColumnsDetail() {
        return { Cell: () => <span></span> }
    }

    render() {
        return (
            <>
                {this.pageManageWrapper()}

                <ConfirmNotify
                    confirmBtn_className="text-danger"
                    confirmBtn_text={() => <span className="btn-- text-danger">{Localization.remove}</span>}
                    msgFunc={() => {
                        if (this._chosenRow === undefined) return <></>;
                        return <>
                            <div className="text-info mb-2">{this._chosenRow.sku}</div>
                            <div>{Localization.msg.ui.item_will_be_removed_continue}</div>
                        </>
                    }}
                    show={this.state.removeModal.show}
                    btnLoader={this.state.removeModal.loader}
                    onHide={() => this.removeModalOnHide()}
                    onConfirm={() => this.removeRow()}
                />

                <ConfirmNotify
                    confirmBtn_className="text-warning"
                    confirmBtn_text={() => <span className="btn-- text-warning">{this._chosenRow?.isActive ? Localization.inactive : Localization.active}</span>}
                    msgFunc={() => {
                        if (this._chosenRow === undefined) return <></>;
                        return <>
                            <div className="text-info mb-2--">{this._chosenRow.sku}</div>
                        </>
                    }}
                    show={this.state.toggleActiveModal.show}
                    btnLoader={this.state.toggleActiveModal.loader}
                    onHide={() => this.toggleActiveModalOnHide()}
                    onConfirm={() => this.toggleActiveRow()}
                />

                <ConfirmNotify
                    confirmBtn_className="text-system"
                    confirmBtn_text={() => <span className="btn-- text-system">{Localization.set_as_default}</span>}
                    // msg={Localization.msg.ui.item_will_be_removed_continue}
                    msgFunc={() => {
                        if (this._chosenRow === undefined) return <></>;
                        return <>
                            <div className="text-info mb-2--">{this._chosenRow.sku}</div>
                            {/* <div>item_will_be_default_continue</div> */}
                        </>
                    }}
                    show={this.state.setAsDefaultModal.show}
                    btnLoader={this.state.setAsDefaultModal.loader}
                    onHide={() => this.setAsDefaulModalOnHide()}
                    onConfirm={() => this.setAsDefaulRow()}
                />

                {/* <Fab
                    icon={<i className="fa fa-arrow-left"></i>}
                    mainButtonStyles={{ backgroundColor: appColor(APP_COLOR_NAME.PRIMARY) }}
                    event="hover"
                    position={{
                        bottom: 0,
                        [this.props.internationalization.rtl ? "left" : "right"]: 0,
                    }}
                    text={Localization.back}
                    onClick={() => this.goToManage()}
                >
                </Fab> */}

                <ToastContainer {...this.getNotifyContainerConfig()} />
                {this.state.gridLoading && <TopBarProgress />}
            </>
        )
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language
    }
}
const dispatch2props = (dispatch: Dispatch) => { return {} }
export const ProductSkuList = connect(state2props, dispatch2props)(ProductSkuListComponent);