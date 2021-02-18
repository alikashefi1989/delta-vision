import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Setup, TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import { AppRoute } from '../../../../config/route';
import { ContactService } from '../../../../service/contact.service';
import {
    IContact,
    TContactCreate,
    TContactUpdate,
} from '../../../../model/contact.model';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import TopBarProgress from 'react-topbar-progress-indicator';
import AppTimeLine from '../../../tool/AppTimeLine/AppTimeLine';
import BaseDetail, {
    IStateBaseDetail,
} from '../../_base/BaseDetail/BaseDetail';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

interface IState extends IStateBaseDetail<IContact> {}
interface IProps {
    internationalization: TInternationalization;
    match: any;
    language: ILanguage_schema;
}

class ContactViewComponent extends BaseDetail<
    IContact,
    TContactCreate,
    TContactUpdate,
    IProps,
    IState
> {
    state: IState = { ...this.baseState };

    protected _entityService = new ContactService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.contact;
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

    // renderItemDetail() {
    //     return (
    //         <div className="content-container " id="item-information">
    //             <div className="title-container">
    //                 <p className="text-capitalize">Contact Information</p>
    //             </div>
    //             <div className="field-container ">
    //                 <p className="label- ">Number </p>{' '}
    //                 <span className="">{this.state.fetchData?.id}</span>{' '}
    //             </div>
    //             {/* <div className="field-container "><p className="label- ">Name </p> <span className="">{this.state.fetchData?.title?.en}</span> </div>
    //         <div className="field-container "><p className="label- ">Ar Name </p> <span className="">{this.state.fetchData?.title?.ar}</span> </div> */}
    //         </div>
    //     );
    // }

    renderItemDetail() {
        return (
            <div className="col-12 d-flex flex-wrap p-0">
                <div
                    className="content-container d-flex flex-column mr-3"
                    id="item-information"
                >
                    <div className="title-container">
                        <p className="text-capitalize">Contact Information</p>
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Number </p>{' '}
                        <span className="">
                            {this.state.fetchData?.readableId}
                        </span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Name </p>{' '}
                        <span className="">{this.state.fetchData?.name}</span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Vendor</p>{' '}
                        <span className="text-info">
                            {this.state.fetchData?.title}
                        </span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Phone Number</p>{' '}
                        <span className="">
                            {this.state.fetchData?.phoneNumber}
                        </span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Mobile Number</p>{' '}
                        <span className="">
                            {this.state.fetchData?.mobileNumber}
                        </span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Email</p>{' '}
                        <span className=" text-info">
                            {this.state.fetchData?.email}
                        </span>{' '}
                    </div>
                </div>
                <div className="content-container col-4">
                    <div className="title-container">
                        <p className="text-capitalize">Contact Access</p>
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Status</p>{' '}
                        <span className="">{''}</span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Last Login</p>{' '}
                        <span className="">{''}</span>{' '}
                    </div>
                    <div className="field-container ">
                        <p className="label- ">Reset Password</p>{' '}
                        <span className="">{''}</span>{' '}
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
                            title: 'contact information',
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
export const ContactView = connect(
    state2props,
    dispatch2props
)(ContactViewComponent);
