import React from 'react';
import { LoginService } from '../../../service/login.service';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { IUser } from '../../../model/user.model';
import { action_user_logged_in } from '../../../redux/action/user';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Localization } from '../../../config/localization/localization';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { IToken } from '../../../model/token.model';
import { action_set_token } from '../../../redux/action/token';
import { History } from 'history';
// import { action_set_authentication } from '../../../redux/action/authentication';
import { Utility } from '../../../asset/script/utility';
import { Formik, Form } from 'formik';
import {
    FormControl,
    APP_FORM_CONTROL,
} from '../../form/_formik/FormControl/FormControl';
import * as Yup from 'yup';
import { AppRegex } from '../../../config/regex';
import { CmpUtility } from '../../_base/CmpUtility';
import { AppRoute } from '../../../config/route';
import { AppGuid } from '../../../asset/script/guid';

interface ILoginForm {
    email: string;
    password: string;
}

interface IState {}

interface IProps {
    onUserLoggedIn: (user: IUser) => void;
    history: History;
    internationalization: TInternationalization;
    onSetToken: (token: IToken) => void;
    // onSetAuthentication: (auth: string) => void;
}

class LoginComponent extends BaseComponent<IProps, IState> {
    private _loginService = new LoginService();

    componentDidMount() {
        CmpUtility.documentTitle = Localization.login;
    }

    componentWillUnmount() {
        CmpUtility.resetDocumentTitle();
    }

    private async onLogin(values: ILoginForm) {
        // debugger;
        try {
            const browserDetail = Utility.browserDetail();
            const res_deviceAuth = await this._loginService.deviceAuth({
                // isActive: true,
                identifier: AppGuid.generate(),
                osType: browserDetail.OSName,
                title: `${browserDetail.browserName}__${browserDetail.fullVersion}`,
                name: browserDetail.appName,
            });

            const res_token = await this._loginService.getToken(
                values,
                res_deviceAuth.data.data.token
            );
            if (res_token) {
                // const authObj = {
                //     username: values.email,
                //     password: values.password,
                // };
                // this.props.onSetAuthentication(
                //     Utility.get_encode_auth(authObj)
                // );
                this.props.onSetToken(res_token.data.data.token);

                this.props.onUserLoggedIn(res_token.data.data.user);
                this.props.history.push(AppRoute.routeData.dashboard.url());
            }
        } catch (e) {
            // debugger;
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'onLogin_error' },
            });
        }
    }

    private readonly initialValues: ILoginForm = {
        email: '',
        password: '',
    };

    private validation = Yup.object({
        email: Yup.string()
            .required(Localization.validation.required_field)
            .email(Localization.validation.email_format),
        password: Yup.string()
            .required(Localization.validation.required_field)
            .matches(
                AppRegex.password,
                Localization.validation.password_format
            ),
    });

    render() {
        return (
            <>
                <div className="login-container animated fadeInDown">
                    <div className="loginbox bg-white">
                        <div className="loginbox-logo">
                            {/* <img src='/static/media/img/other/modish-logo-border.svg' alt="modish-logo" className="logo" /> */}
                            <img
                                src="/static/media/img/other/NES.svg"
                                alt="modish-logo"
                                className="logo"
                            />
                        </div>
                        <div className="loginbox-title text-uppercase">
                            {Localization.sign_in}
                        </div>
                        {/* <div className="loginbox-social"></div> */}
                        <Formik<ILoginForm>
                            initialValues={this.initialValues}
                            onSubmit={(v) => this.onLogin(v)}
                            validationSchema={this.validation}
                            // enableReinitialize
                        >
                            {({ isSubmitting }) => (
                                <>
                                    <Form>
                                        <div className="loginbox-textbox">
                                            <div className="app-input form-group">
                                                <FormControl
                                                    control={
                                                        APP_FORM_CONTROL.INPUT
                                                    }
                                                    name={'email'}
                                                    placeholder={
                                                        Localization.email
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="loginbox-textbox">
                                            <div className="app-input form-group">
                                                <FormControl
                                                    control={
                                                        APP_FORM_CONTROL.INPUT
                                                    }
                                                    type={'password'}
                                                    name={'password'}
                                                    placeholder={
                                                        Localization.password
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="loginbox-textbox">
                                            <BtnLoader
                                                btnClassName="btn btn-primary btn-block"
                                                loading={isSubmitting}
                                                // onClick={() => handleSubmit()}
                                                onClick={() => {}}
                                                type="submit"
                                            >
                                                {Localization.sign_in}
                                            </BtnLoader>
                                        </div>
                                    </Form>
                                </>
                            )}
                        </Formik>
                    </div>
                </div>

                <ToastContainer {...this.getNotifyContainerConfig()} />
            </>
        );
    }
}

const state2props = (state: redux_state) => {
    return { internationalization: state.internationalization };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {
        onUserLoggedIn: (user: IUser) => dispatch(action_user_logged_in(user)),
        onSetToken: (token: IToken) => dispatch(action_set_token(token)),
        // onSetAuthentication: (auth: string) =>
        //     dispatch(action_set_authentication(auth)),
    };
};
export const Login = connect(state2props, dispatch2props)(LoginComponent);
