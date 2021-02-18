import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Setup } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import { AppRoute } from '../../../../config/route';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import TopBarProgress from 'react-topbar-progress-indicator';
import AppTimeLine from '../../../tool/AppTimeLine/AppTimeLine';
import BaseDetail, {
    IPropsBaseDetail,
    IStateBaseDetail,
} from '../../_base/BaseDetail/BaseDetail';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import {
    IRefund,
    TRefundCreate,
    TRefundUpdate,
} from '../../../../model/refund.model';
import { RefundService } from '../../../../service/refund.service';
import { CmpUtility } from '../../../_base/CmpUtility';

interface IState extends IStateBaseDetail<IRefund> {}
interface IProps extends IPropsBaseDetail {
    language: ILanguage_schema;
}

class RefundViewComponent extends BaseDetail<
    IRefund,
    TRefundCreate,
    TRefundUpdate,
    IProps,
    IState
> {
    state: IState = { ...this.baseState };

    protected _entityService = new RefundService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.refund;

    componentDidMount() {
        if (!this.props.language.defaultLanguage?.id) {
            this.goToLanguageManage();
            setTimeout(() => {
                this.toastNotify(
                    Localization.msg.ui.no_default_lang_create,
                    { autoClose: Setup.notify.timeout.warning },
                    'warn'
                );
            }, 300);
            return;
        }
        super.componentDidMount();
    }

    componentDidUpdate(prevProps: Readonly<IProps>) {
        const prevPath = prevProps.match.path;
        const currentPath = this.props.match.path;
        if (prevPath !== currentPath) {
            this.setState({
                savePageMode: this.savePageMode(currentPath),
            });
        }
    }

    get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    renderItemDetail() {
        if (this.state.fetchData) {
            return (
                <div
                    className="content-container d-flex flex-wrap"
                    id="item-information"
                >
                    <div className="title-container">
                        <p className="text-capitalize">Refund Information</p>
                    </div>
                    <div className="col-6">
                        <div className="field-container ">
                            <p className="label- ">Number </p>
                            <span className="">{this.state.fetchData.id}</span>
                        </div>
                        <div className="field-container ">
                            <p className="label- ">Date </p>
                            <span className="">
                                {CmpUtility.timestamp2Date(
                                    this.state.fetchData.createdAt / 1000
                                )}
                            </span>
                        </div>
                        <div className="field-container ">
                            <p className="label- ">Owner </p>
                            <span className="">
                                {this.state.fetchData.createdBy?.name}
                            </span>
                        </div>
                        <div className="field-container ">
                            <p className="label- ">Order ID </p>
                            <span className=" text-info">
                                {this.state.fetchData.readableId}
                            </span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="field-container ">
                            <p className="label- ">Refunded Amount </p>
                            <span className="">
                                {this.state.fetchData.returnAmount}
                            </span>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    }

    // Country: ${address.country.name[this.defaultLangCode]}
    getOrderAddress(address: IRefund['extraDetail']['address']) {
        return `City: ${address.area.name[this.defaultLangCode]} Street: ${
            address.detail.Street
        }`;
    }

    saleInformationRender() {
        // try {
        if (this.state.fetchData) {
            const sale = this.state.fetchData;
            return (
                <div className="card w-100 my-2" id="sale-information">
                    <h4 className="card-header bg-transparent font-weight-bold">
                        Sales Information
                    </h4>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className="col-6 text-muted mb-2">
                                        Order ID
                                    </div>
                                    <div className="col-6 mb-3">
                                        {sale.readableId}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Date
                                    </div>
                                    <div className="col-6 mb-3">
                                        {CmpUtility.timestamp2Date(
                                            sale.updatedAt / 1000
                                        )}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Customer Email
                                    </div>
                                    <div className="col-6 text-info mb-3">
                                        {sale.extraDetail.customer.email}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Phone Number
                                    </div>
                                    <div className="col-6 mb-3">
                                        {sale.extraDetail.customer.phone}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Delivery Address
                                    </div>
                                    <div className="col-6 mb-3">
                                        {this.getOrderAddress(
                                            sale.extraDetail.address
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className="col-6 text-muted mb-3">
                                        Payment Type
                                    </div>
                                    <div className="col-6 mb-3">
                                        {sale.readableId}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Total Amount
                                    </div>
                                    <div className="col-6 mb-3">
                                        {sale.subTotal
                                            ? sale.subTotal
                                            : 'there is no data'}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Total Delivery Charges
                                    </div>
                                    <div className="col-6 text-info mb-3">
                                        {}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Cupon
                                    </div>
                                    <div className="col-6 mb-3">
                                        {sale.extraDetail.coupon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
        // } catch (error) {
        //     this.toastNotify(
        //         'there is an error with api response',
        //         {
        //             delay: 1000,
        //             toastId: 'djsensv39r74387q',
        //         },
        //         'error'
        //     );
        // }
    }

    refundDetailsRender() {
        if (this.state.fetchData) {
            const { items } = this.state.fetchData;
            return (
                <div
                    className="content-container card w-100 my-2"
                    id="refund-details"
                >
                    <h4 className="card-header bg-transparent font-weight-bold">
                        Refund Details
                    </h4>
                    <div className="card-body p-0">
                        <table className="table table-hover text-center">
                            <thead>
                                <tr>
                                    <th scope="col" className="text-muted">
                                        SKU
                                    </th>
                                    <th scope="col" className="text-muted">
                                        Price
                                    </th>
                                    <th scope="col" className="text-muted">
                                        Amount
                                    </th>
                                    <th scope="col" className="text-muted">
                                        Refund reasons
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr>
                                        <th
                                            scope="row"
                                            className="text-info font-weight-normal"
                                        >
                                            {item.sku.readableId}
                                        </th>
                                        <td className="font-weight-normal">
                                            {item.price} KD
                                        </td>
                                        <td className="font-weight-normal">
                                            {item.qty}
                                        </td>
                                        <td className="font-weight-normal d-flex justify-content-center">
                                            {
                                                item.reason.name[
                                                    this.defaultLangCode
                                                ]
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    }

    renderNavbar() {
        return (
            <div className="top-btn-container">
                <div className="side-item-container">
                    <div className="back-icon-container">
                        <div
                            className="pointer"
                            onClick={() => this.goToManage()}
                            // href={`/#${AppRoute.routeData[this.appRouteBaseCRUD].manage.url()}`}
                        >
                            <span className="back-icon"></span>
                        </div>
                    </div>
                    <div className="image-container">
                        <img src={this.state.fetchData?.qrcode} alt="" />
                        {/* <div className="image-uploader">
                            <span className="icon-camera" />
                        </div> */}
                    </div>
                    <div className="text-container">
                        <p className="main-text">{this.state.fetchData?.id}</p>
                    </div>
                </div>
                {this.renderNavbarBtn()}
            </div>
        );
    }

    saveFormRender() {
        return (
            <div className="template-box animated fadeInDown min-h-150px p-0">
                <div className="row detail-container">
                    <span
                        className={`btn-action-container ${
                            this.state.showRelatedList ? '' : 'hidden-related'
                        }`}
                        onClick={() => this.handleShowRelatedContainer()}
                    ></span>
                    {this.renderNavbar()}
                    {this.renderRelatedList([
                        { title: 'refund information', id: 'item-information' },
                        { title: 'sale information', id: 'sale-information' },
                        { title: 'refund details', id: 'refund-details' },
                    ])}
                    <div className="main-content-container">
                        <div className="header-container">
                            <div className="switch-container">
                                {this.renderSwitch()}
                            </div>
                        </div>

                        <div
                            className={`detail-container ${
                                this.state.showOverview ? '' : 'd-none'
                            }`}
                        >
                            {this.renderItemDetail()}
                            {this.saleInformationRender()}
                            {this.refundDetailsRender()}
                            {this.renderRelatedTable()}
                        </div>
                        {this.state.showOverview ? null : (
                            <div className="detail-container">
                                <div className="content-container">
                                    <AppTimeLine
                                        entityName="user"
                                        entityId={this.props.match.params.id}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {this.state.formLoader && <TopBarProgress />}
            </div>
        );
    }

    render() {
        return (
            <>
                {this.saveFormRender()}
                <ToastContainer {...this.getNotifyContainerConfig()} />
            </>
        );
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language,
    };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {};
};
export const RefundView = connect(
    state2props,
    dispatch2props
)(RefundViewComponent);
