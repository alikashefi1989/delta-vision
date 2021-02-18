import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Setup, TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import { AppRoute } from '../../../../config/route';
import { PurchaseOrderService } from '../../../../service/purchaseOrder.service';
import {
    IPurchaseOrder,
    TPurchaseOrderCreate,
    TPurchaseOrderUpdate,
} from '../../../../model/PurchaseOrder.model';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import TopBarProgress from 'react-topbar-progress-indicator';
import AppTimeLine from '../../../tool/AppTimeLine/AppTimeLine';
import BaseDetail, {
    IStateBaseDetail,
} from '../../_base/BaseDetail/BaseDetail';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import moment from 'moment';

interface IState extends IStateBaseDetail<IPurchaseOrder> {}
interface IProps {
    internationalization: TInternationalization;
    match: any;
    language: ILanguage_schema;
}

class PurchaseOrderViewComponent extends BaseDetail<
    IPurchaseOrder,
    TPurchaseOrderCreate,
    TPurchaseOrderUpdate,
    IProps,
    IState
> {
    state: IState = { ...this.baseState };

    protected _entityService = new PurchaseOrderService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.purchaseOrder;
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
            <div
                className="content-container d-flex flex-wrap"
                id="item-information"
            >
                <div className="title-container">
                    <p className="text-capitalize">
                        Purchase order information
                    </p>
                </div>
                <div className="col-6">
                    <div className="field-container ">
                        <p className="label- ">Purchase Order ID</p>{' '}
                        <span className="">{this.state.fetchData?.id}</span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Date </p>{' '}
                        <span className="">
                            {this.state.fetchData?.date &&
                                moment(this.state.fetchData?.date).format(
                                    'YYYY/MM/DD'
                                )}
                        </span>{' '}
                    </div>
                    <div className="field-container align-items-start">
                        <p className="label- ">Supplier </p>{' '}
                        <span className="pt-2">
                            {this.state.fetchData?.supplierId}
                        </span>{' '}
                    </div>
                    <div className="field-container align-items-start">
                        <p className="label- ">Total Amount </p>{' '}
                        <span className="pt-2">
                            {this.state.fetchData?.totalPrice}
                        </span>{' '}
                    </div>
                </div>
                <div className="col-6">
                    <div className="field-container ">
                        <p className="label- ">Issuer</p>{' '}
                        <span className="">
                            {this.state.fetchData?.createdBy?.name}
                        </span>{' '}
                    </div>
                    <div className="field-container align-items-start">
                        <p className="label- ">Type</p>{' '}
                        <span className="pt-2">
                            {this.state.fetchData?.type}
                        </span>{' '}
                    </div>
                    <div className="field-container align-items-start">
                        <p className="label- ">Country</p>{' '}
                        <span className="pt-2">
                            {this.state.fetchData?.country.name.en}
                        </span>{' '}
                    </div>
                    <div className="field-container align-items-start">
                        <p className="label- ">Wearhouse</p>{' '}
                        <span className="pt-2">
                            {/* {this.state.fetchData?.description.ar} */}
                        </span>{' '}
                    </div>
                </div>
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
                        {
                            title: 'purchaseOrder information',
                            id: 'item-information',
                        },
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
                                        entityName={this.appRouteBaseCRUD}
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
export const PurchaseOrderView = connect(
    state2props,
    dispatch2props
)(PurchaseOrderViewComponent);
