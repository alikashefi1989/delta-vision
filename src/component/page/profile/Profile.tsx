import React from 'react';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { IUser } from '../../../model/user.model';
import { TInternationalization } from '../../../config/setup';
import { BaseComponent } from '../../_base/BaseComponent';
import { History } from 'history';
import { action_user_logged_in } from '../../../redux/action/user';
import { Formik } from 'formik';
import {
    FormControl,
    APP_FORM_CONTROL,
} from '../../form/_formik/FormControl/FormControl';
import { Localization } from '../../../config/localization/localization';
import * as Yup from 'yup';
import { AppRegex } from '../../../config/regex';
import { ToastContainer } from 'react-toastify';
import { Fab } from 'react-tiny-fab';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { appColor, APP_COLOR_NAME } from '../../../config/appColor';
import TopBarProgress from 'react-topbar-progress-indicator';
import { AppRoute } from '../../../config/route';
import { UserService } from '../../../service/user.service';
import { ILanguage_schema } from '../../../redux/action/language/languageAction';

interface IProfileForm {
    name: string;
    email: string;
    country?: string;
    phone?: string;
}

interface IProps {
    logged_in_user: IUser | null;
    internationalization: TInternationalization;
    history: History;
    onUserLoggedIn: (user: IUser) => void;
    language: ILanguage_schema;
}

interface IState {
    formData: IProfileForm;
    fetchData: IUser | undefined;
    formLoader: boolean;
    actionBtnVisibility: boolean;
    actionBtnLoading: boolean;
}

class ProfileComponent extends BaseComponent<IProps, IState> {
    state = {
        formData: {
            name: '',
            email: '',
            country: '',
            phone: '',
        },
        fetchData: undefined,
        formLoader: true,
        actionBtnVisibility: false,
        actionBtnLoading: false,
    };

    private _userService = new UserService();

    private formValidation = Yup.object({
        name: Yup.string().required(Localization.validation.required_field),
        // email: Yup.string().required(Localization.required_field).matches(AppRegex.email, {
        //     message: Localization.validation.emailFormat,
        //     excludeEmptyString: true
        // }),
        email: Yup.string()
            .required(Localization.validation.required_field)
            .email(Localization.validation.email_format),
        country: Yup.string().nullable(),
        phone: Yup.string()
            .matches(AppRegex.phone, Localization.validation.phone_format)
            .nullable(),
        // phone: Yup.string().matches(AppRegex.phone, {
        //     message: Localization.phone,
        //     excludeEmptyString: true
        // })
    });

    componentDidMount() {
        // CmpUtility.documentTitle = Localization.profile;
        this.fetchData();
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    // componentWillUnmount() {
    //     // CmpUtility.resetDocumentTitle();
    // }

    private async fetchData() {
        const userId = this.props.logged_in_user?.id;
        if (!userId) return;
        try {
            let res = await this._userService.byId(userId);
            // debugger;
            this.props.onUserLoggedIn(res.data.data);
            this.setState({
                fetchData: res.data.data,
                formData: {
                    name: res.data.data.name,
                    email: res.data.data.email,
                    country:
                        res.data.data.country?.name[this.defaultLangCode] || '',
                    phone: res.data.data.phone,
                },
                formLoader: false,
                actionBtnVisibility: true,
            });
        } catch (e) {
            // debugger;
            this.setState({ formLoader: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'fetchData_error' },
            });
        }
    }

    private goToDashboard() {
        this.navigate(AppRoute.routeData.dashboard.url());
    }

    private async update(values: IProfileForm) {
        const userId = this.props.logged_in_user?.id;
        if (!userId) return;
        debugger;
        this.setState({ actionBtnLoading: true });
        try {
            const res = await this._userService.update(values, userId);
            debugger;
            this.setState({ actionBtnLoading: false });
            this.apiSuccessNotify();
            this.props.onUserLoggedIn(res.data.data);
        } catch (e) {
            debugger;
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'onUpdate_error' },
            });
        }
    }

    render() {
        return (
            <>
                <div className="template-box animated fadeInDown">
                    <Formik
                        initialValues={this.state.formData}
                        onSubmit={(v) => this.update(v)}
                        validationSchema={this.formValidation}
                        enableReinitialize
                    >
                        {({
                            handleSubmit,
                            isValid,
                            handleReset,
                            dirty,
                            isSubmitting,
                        }) => (
                            <>
                                <div className="row">
                                    <div className="col-md-4">
                                        <FormControl
                                            control={APP_FORM_CONTROL.INPUT}
                                            name={'name'}
                                            label={Localization.name}
                                            placeholder={Localization.name}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <FormControl
                                            control={APP_FORM_CONTROL.INPUT}
                                            name={'country'}
                                            label={Localization.country}
                                            placeholder={Localization.country}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <FormControl
                                            control={APP_FORM_CONTROL.INPUT}
                                            name={'email'}
                                            label={Localization.email}
                                            placeholder={Localization.email}
                                            // disabled={true}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <FormControl
                                            control={APP_FORM_CONTROL.INPUT}
                                            name={'phone'}
                                            label={Localization.phone}
                                            placeholder={Localization.phone}
                                            // disabled={true}
                                        />
                                    </div>
                                    {this.state.actionBtnVisibility && (
                                        <div className="col-md-12 mt-3">
                                            <BtnLoader
                                                loading={isSubmitting}
                                                btnClassName={
                                                    'btn btn-primary mr-2'
                                                }
                                                disabled={!isValid || !dirty}
                                                onClick={() => handleSubmit()}
                                            >
                                                {' '}
                                                {Localization.edit}
                                            </BtnLoader>

                                            <button
                                                className="btn btn-warning"
                                                onClick={() => handleReset()}
                                            >
                                                {Localization.reset}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </Formik>

                    {/* <ContentLoader show={this.state.formLoader} gutterClassName="gutter-0" /> */}
                    {this.state.formLoader && <TopBarProgress />}
                </div>

                <Fab
                    icon={<i className="fa fa-arrow-left"></i>}
                    mainButtonStyles={{
                        backgroundColor: appColor(APP_COLOR_NAME.PRIMARY),
                    }}
                    event="hover"
                    position={{
                        bottom: 0,
                        [this.props.internationalization.rtl
                            ? 'left'
                            : 'right']: 0,
                    }}
                    text={Localization.back}
                    onClick={() => this.goToDashboard()}
                ></Fab>

                <ToastContainer {...this.getNotifyContainerConfig()} />
            </>
        );
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
        onUserLoggedIn: (user: IUser) => dispatch(action_user_logged_in(user)),
    };
};

const state2props = (state: redux_state) => {
    return {
        logged_in_user: state.logged_in_user,
        internationalization: state.internationalization,
        language: state.language,
    };
};

export const Profile = connect(state2props, dispatch2props)(ProfileComponent);
