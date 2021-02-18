import React from 'react';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { action_user_logged_in } from '../../../redux/action/user';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Localization } from '../../../config/localization/localization';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { action_set_token } from '../../../redux/action/token';
import { History } from 'history';
import { Formik, Form } from 'formik';
import { CmpUtility } from '../../_base/CmpUtility';

interface ILoginForm {
    email: string;
    password: string;
}

interface IState {}

interface IProps {
    onUserLoggedIn: (user: any) => void;
    history: History;
    internationalization: TInternationalization;
    onSetToken: (token: any) => void;
    // onSetAuthentication: (auth: string) => void;
}

class LoginComponent extends BaseComponent<IProps, IState> {
    componentDidMount() {
        CmpUtility.documentTitle = Localization.login;
    }

    componentWillUnmount() {
        CmpUtility.resetDocumentTitle();
    }

    private readonly initialValues: ILoginForm = {
        email: '',
        password: '',
    };

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
                            onSubmit={(v) => console.log(v)}
                            // enableReinitialize
                        >
                            {({ isSubmitting }) => (
                                <>
                                    <Form>
                                        <div className="loginbox-textbox">
                                            <div className="app-input form-group"></div>
                                        </div>
                                        <div className="loginbox-textbox">
                                            <div className="app-input form-group"></div>
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
        onUserLoggedIn: (user: any) => dispatch(action_user_logged_in(user)),
        onSetToken: (token: any) => dispatch(action_set_token(token)),
        // onSetAuthentication: (auth: string) =>
        //     dispatch(action_set_authentication(auth)),
    };
};
export const Login = connect(state2props, dispatch2props)(LoginComponent);
