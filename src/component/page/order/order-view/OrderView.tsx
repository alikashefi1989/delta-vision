import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Setup, TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import { AppRoute } from '../../../../config/route';
import { OrderService } from '../../../../service/order.service';
import {
    IOrder,
    TOrderCreate,
    TOrderUpdate,
} from '../../../../model/order.model';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import TopBarProgress from 'react-topbar-progress-indicator';
import AppTimeLine from '../../../tool/AppTimeLine/AppTimeLine';
import BaseDetail, {
    IStateBaseDetail,
} from '../../_base/BaseDetail/BaseDetail';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

interface IState extends IStateBaseDetail<IOrder> {}
interface IProps {
    internationalization: TInternationalization;
    match: any;
    language: ILanguage_schema;
}

class OrderViewComponent extends BaseDetail<
    IOrder,
    TOrderCreate,
    TOrderUpdate,
    IProps,
    IState
> {
    state: IState = { ...this.baseState };

    protected _entityService = new OrderService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.order;
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
        if (this.props.match.params.id) {
            this.entityId = this.props.match.params.id;
            this.setState(
                {
                    formLoader: true,
                    savePageMode: this.savePageMode(this.props.match.path),
                },
                () => {
                    this.getReleteds();
                    this.fetchData();
                }
            );
        } else {
            this.setState({
                actionBtnVisibility: true,
            });
        }
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

    componentWillUnmount() {}

    get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    renderItemDetail() {
        return (
            <div className="content-container d-flex flex-wrap">
                <div className="title-container col-12">
                    <p className="text-capitalize">Sales Information</p>
                </div>
                <div className="col-6 p-0">
                    <div className="field-container ">
                        <p className="label- ">Order Id </p>{' '}
                        <span className="text-info">
                            {this.state.fetchData?.normalId}
                        </span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Date </p>{' '}
                        <span className="">
                            {this.state.fetchData?.createdAt &&
                                this.timestamp_to_date(
                                    this.state.fetchData.createdAt / 1000
                                )}
                        </span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Customer Email </p>{' '}
                        <span className="text-info"></span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Phone Number </p>{' '}
                        <span className=""></span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Delivary Address </p>{' '}
                        <span className=""></span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Address Type </p>{' '}
                        <span className=""></span>{' '}
                    </div>
                </div>
                <div className="col-6 p-0">
                    <div className="field-container ">
                        <p className="label- ">Payment Type </p>{' '}
                        <span className=""></span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Total Amount </p>{' '}
                        <span className=""></span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Barcel Amount </p>{' '}
                        <span className=""></span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Delivery Charge </p>{' '}
                        <span className="">{`${this.state.fetchData?.shipping} ${this.state.fetchData?.currencySymbol}`}</span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Coupon </p>{' '}
                        <span className="text-info"></span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Country </p>{' '}
                        <span className="">
                            {this.state.fetchData?.country?.name?.en}
                        </span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">WearHouse </p>{' '}
                        <span className=""></span>{' '}
                    </div>
                </div>
            </div>
        );
    }

    renderNavbar() {
        return (
            <div className="top-btn-container">
                <div className="side-item-container">
                    <div className="back-icon-container">
                        <div
                            className="pointer d-flex"
                            onClick={() => this.goToManage()}
                        >
                            <span className="back-icon"></span>
                        </div>
                    </div>
                    <div className="image-container">
                        <img
                            src={'static/media/img/other/noImage.png'}
                            alt=""
                        />
                        <div className="image-uploader">
                            <span className="icon-camera" />
                        </div>
                    </div>
                    <div className="text-container">
                        <p className="main-text">
                            {this.state.fetchData?.normalId}
                        </p>
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
                        { title: 'sales information', id: 'item-information' },
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
export const OrderView = connect(
    state2props,
    dispatch2props
)(OrderViewComponent);
