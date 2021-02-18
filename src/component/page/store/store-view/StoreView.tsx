import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Setup, TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import { AppRoute } from '../../../../config/route';
import { StoreService } from '../../../../service/store.service';
import {
    IStore,
    TStoreCreate,
    TStoreUpdate,
} from '../../../../model/store.model';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import TopBarProgress from 'react-topbar-progress-indicator';
import AppTimeLine from '../../../tool/AppTimeLine/AppTimeLine';
import BaseDetail, {
    IStateBaseDetail,
} from '../../_base/BaseDetail/BaseDetail';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

interface IState extends IStateBaseDetail<IStore> {}
interface IProps {
    internationalization: TInternationalization;
    match: any;
    language: ILanguage_schema;
}

class StoreViewComponent extends BaseDetail<
    IStore,
    TStoreCreate,
    TStoreUpdate,
    IProps,
    IState
> {
    state: IState = { ...this.baseState };

    protected _entityService = new StoreService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.store;
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

    // componentDidUpdate(prevProps: Readonly<IProps>) {
    //     const prevPath = prevProps.match.path;
    //     const currentPath = this.props.match.path;
    //     if (prevPath !== currentPath) {
    //         this.setState({
    //             savePageMode: this.savePageMode(currentPath),
    //         });
    //     }
    // }

    // componentWillUnmount() {}

    get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    renderItemDetail() {
        return (
            <div className="col-12 d-flex flex-wrap p-0">
                <div
                    className="content-container d-flex flex-column mr-3"
                    id="item-information"
                >
                    <div className="title-container">
                        <p className="text-capitalize">Vendor Information</p>
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Number </p>{' '}
                        <span className="">{this.state.fetchData?.id}</span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Name </p>{' '}
                        <span className="">
                            {this.state.fetchData?.name?.en}
                        </span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Phone Number</p>{' '}
                        <span className="">
                            {this.state.fetchData?.phoneList?.[0].number}
                        </span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Vendor Country</p>{' '}
                        <span className="">{''}</span>{' '}
                    </div>
                </div>
                <div className="content-container col-4">
                    <div className="title-container">
                        <p className="text-capitalize">Vendor Agreement</p>
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Type</p>{' '}
                        <span className="">{''}</span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Default Percantage</p>{' '}
                        <span className="">{''}</span>{' '}
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
                            className="pointer"
                            onClick={() => this.goToManage()}
                            // href={`/#${AppRoute.routeData[this.appRouteBaseCRUD].manage.url()}`}
                        >
                            <span className="back-icon"></span>
                        </div>
                    </div>
                    <div className="image-container">
                        <img
                            src={
                                this.state.fetchData?.media?.url ||
                                'static/media/img/other/noImage.png'
                            }
                            alt=""
                        />
                        <div className="image-uploader">
                            <span className="icon-camera" />
                        </div>
                    </div>
                    <div className="text-container">
                        <p className="main-text">
                            {this.state.fetchData?.name.en ||
                                this.state.fetchData?.name.US}
                        </p>
                        {/* <p className="detail-text"> &nbsp;&nbsp;-&nbsp;&nbsp;King (Sample)</p> */}
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
                        { title: 'vendor information', id: 'item-information' },
                        { title: 'summary', id: 'related-summary' },
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
                            {this.renderSummary()}
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
export const StoreView = connect(
    state2props,
    dispatch2props
)(StoreViewComponent);
