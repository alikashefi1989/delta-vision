import React from 'react';
import { ForgetPassService } from '../../../service/forgetPass.service';
import { redux_state } from '../../../redux/app_state';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Localization } from '../../../config/localization/localization';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { History } from 'history';
import { Formik, Form } from 'formik';
import { FormControl, APP_FORM_CONTROL } from '../../form/_formik/FormControl/FormControl';
import * as Yup from "yup";
import { CmpUtility } from '../../_base/CmpUtility';
import { AppRoute } from '../../../config/route';

interface IForgetPassForm { email: string; }

interface IState { }

interface IProps {
    history: History;
    internationalization: TInternationalization;
}

class ForgetPasswordComponent extends BaseComponent<IProps, IState> {
    private _forgetPassService = new ForgetPassService();

    componentDidMount() {
        CmpUtility.documentTitle = Localization.login;
    }

    componentWillUnmount() {
        CmpUtility.resetDocumentTitle();
    }

    private async onSubmit(values: IForgetPassForm) {
        // debugger;
        try {
            const response = await this._forgetPassService.forgotPassword(values);
            if (response) {
                this.props.history.push(AppRoute.routeData.dashboard.url());
            }

        } catch (e) {
            this.handleError({ error: e.response, toastOptions: { toastId: 'onLogin_error' } });
        }
    }

    private readonly initialValues: IForgetPassForm = {
        email: "",
    }

    private validation = Yup.object({
        email: Yup.string().required(Localization.validation.required_field).email(Localization.validation.email_format),
    });

    render() {
        return (
            <>
                <div className="login-container animated fadeInDown">
                    <div className="loginbox bg-white">
                        <div className="loginbox-logo">
                            {/* <img src='/static/media/img/other/modish-logo-border.svg' alt="modish-logo" className="logo" /> */}
                            <img src='/static/media/img/other/NES.svg' alt="modish-logo" className="logo" />
                        </div>
                        <div className="loginbox-title text-uppercase">{Localization.forgot_password}</div>
                        <Formik<IForgetPassForm>
                            initialValues={this.initialValues}
                            onSubmit={(v) => this.onSubmit(v)}
                            validationSchema={this.validation}
                        // enableReinitialize
                        >
                            {({ isSubmitting }) => (
                                <>
                                    <Form>
                                        <div className="loginbox-textbox">
                                            <div className="app-input form-group">
                                                <FormControl
                                                    control={APP_FORM_CONTROL.INPUT}
                                                    name={"email"}
                                                    placeholder={Localization.email}
                                                />
                                            </div>
                                        </div>

                                        <div className="loginbox-textbox">
                                            <BtnLoader
                                                btnClassName="btn btn-primary btn-block"
                                                loading={isSubmitting}
                                                onClick={() => { }}
                                                type="submit"
                                            >
                                                {Localization.submit}
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
        )
    }
}

const state2props = (state: redux_state) => { return { internationalization: state.internationalization } }
export const ForgetPassword = connect(state2props)(ForgetPasswordComponent);