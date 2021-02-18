import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { Setup, TInternationalization } from '../../../../config/setup';
// import { FormControl, APP_FORM_CONTROL } from "../../../form/_formik/FormControl/FormControl";
import { Localization } from '../../../../config/localization/localization';
import { Formik, FormikProps } from "formik";
// import { ContentLoader } from '../../../form/content-loader/ContentLoader';
import { appColor, APP_COLOR_NAME } from "../../../../config/appColor";
import { Action, Fab } from "react-tiny-fab";
import { AppRoute } from '../../../../config/route';
import { UserService } from '../../../../service/user.service';
import { IUser } from '../../../../model/user.model';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import * as Yup from "yup";
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
// import { UploadService } from '../../../../service/upload.service';
// import { IMedia } from '../../../../model/media.model';
// import { AppRegex } from '../../../../config/regex';
import TopBarProgress from 'react-topbar-progress-indicator';

enum SAVE_PAGE_MODE {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    COPY = "COPY",
    VIEW = "VIEW",
}

interface IUserForm { }

interface IState {
    formData: IUserForm;
    fetchData: IUser | undefined;
    formLoader: boolean;
    actionBtnVisibility: boolean;
    actionBtnLoading: boolean;
    savePageMode: SAVE_PAGE_MODE;
    inputValue: string;
}
interface IProps {
    internationalization: TInternationalization;
    match: any;
    language: ILanguage_schema;
}

class UserSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        formData: {},
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE,
        inputValue: ''
    };

    private _userService = new UserService();
    private entityId: string | undefined;

    private formValidation = Yup.object/* <IUserForm> */({

    });

    componentDidMount() {
        // debugger;
        if (!this.props.language.defaultLanguage?.id) {
            this.goToLanguageManage();
            setTimeout(() => {
                this.toastNotify(Localization.msg.ui.no_default_lang_create, { autoClose: Setup.notify.timeout.warning }, 'warn');
            }, 300);
            return;
        }
        // debugger;
        if (this.props.match.params.id) {
            this.entityId = this.props.match.params.id;
            // debugger;
            this.setState({
                formLoader: true,
                savePageMode: this.savePageMode(this.props.match.path),
            }, () => this.fetchData());

        } else {
            this.setState({
                actionBtnVisibility: true
            });
        }
    }

    componentDidUpdate(prevProps: Readonly<IProps>) {
        const prevPath = prevProps.match.path;
        const currentPath = this.props.match.path;
        if (prevPath !== currentPath) {
            // debugger;
            this.setState({
                savePageMode: this.savePageMode(currentPath),
            });
        }
    }

    componentWillUnmount() { }

    private savePageMode(path: string): SAVE_PAGE_MODE {
        switch (path) {
            case AppRoute.routeData.user.create.path:
                return SAVE_PAGE_MODE.CREATE
            case AppRoute.routeData.user.update.path:
                return SAVE_PAGE_MODE.UPDATE
            case AppRoute.routeData.user.view.path:
                return SAVE_PAGE_MODE.VIEW
            case AppRoute.routeData.user.copy.path:
                return SAVE_PAGE_MODE.COPY
            default:
                return SAVE_PAGE_MODE.CREATE
        }
    }

    private async fetchData() {
        if (!this.entityId) return;
        // const defaultLangCode = this.props.language.defaultLanguage?.code || ''; // TODO: uncomment Me
        try {
            const res = await this._userService.byId(this.entityId);
            this.setState({
                fetchData: res.data.data,
                // formData: {
                //     // user fields should complete
                // },
                formLoader: false,
                actionBtnVisibility: true
            });
        } catch (e) {
            this.setState({
                formLoader: false
            });
            this.handleError({ error: e.response, toastOptions: { toastId: 'fetchData_error' } });
        }
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    private goToManage() {
        this.navigate(AppRoute.routeData.user.manage.url());
    }
    private goToUpdate() {
        if (!this.entityId) return;
        this.navigate(AppRoute.routeData.user.update.url(this.entityId));
    }
    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    private async create(values: IUserForm, handleReset: () => void) {
        debugger;
        this.setState({ actionBtnLoading: true });
        try {
            // await this._userService.create({
            //     // pass created data of user
            // });
            this.setState({ actionBtnLoading: false });
            handleReset();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({ error: e.response, toastOptions: { toastId: 'create_error' } });
        }
    }

    private async update(values: IUserForm) {
        if (!this.entityId) return;
        debugger;
        this.setState({ actionBtnLoading: true });
        try {
            // await this._userService.update({
            //     // pass updated data of user
            // }, this.entityId);
            this.setState({ actionBtnLoading: true });
            this.goToManage();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({ error: e.response, toastOptions: { toastId: 'update_error' } });
        }
    }

    private actionBtnRender(formikProps: FormikProps<IUserForm>): JSX.Element {
        if (this.state.actionBtnVisibility === false) return <></>;
        if (this.state.savePageMode === SAVE_PAGE_MODE.VIEW) return <></>;

        const { isValid, handleReset, dirty, values } = formikProps;

        return <div className="col-md-12 mt-3">
            {this.state.savePageMode !== SAVE_PAGE_MODE.UPDATE && <BtnLoader
                loading={this.state.actionBtnLoading}
                btnClassName={"btn btn-success mr-2"}
                disabled={!isValid || !dirty}
                onClick={() => this.create(values, handleReset)}
            > {Localization.create}
            </BtnLoader>}

            {this.state.savePageMode === SAVE_PAGE_MODE.UPDATE && <BtnLoader
                loading={this.state.actionBtnLoading}
                btnClassName={"btn btn-primary mr-2"}
                disabled={!isValid || !dirty}
                onClick={() => this.update(values)}
            > {Localization.edit}
            </BtnLoader>}

            <button
                className="btn btn-warning"
                onClick={() => handleReset()}>
                {Localization.reset}
            </button>

            {/* <button
                className="btn btn-warning"
                onClick={() => this.upload(values)}>
                upload
            </button> */}
        </div>
    }

    private saveFormRender() {
        // const defaultLangCode = this.props.language.defaultLanguage?.code;
        // const languageList = this.props.language.list;

        return <div className="template-box animated fadeInDown min-h-150px">
            <Formik
                initialValues={this.state.formData}
                onSubmit={() => { }}
                validationSchema={this.formValidation}
                enableReinitialize
            >
                {(formikProps) => (
                    <>
                        <div className="row">
                            {/* field import here */}
                            {this.actionBtnRender(formikProps)}
                        </div>
                    </>
                )}
            </Formik>

            {/* <ContentLoader show={this.state.formLoader} gutterClassName="gutter-0" /> */}
            {this.state.formLoader && <TopBarProgress />}
        </div>
    }

    render() {
        return (
            <>
                {this.saveFormRender()}

                <Fab
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
                    {this.state.savePageMode === SAVE_PAGE_MODE.VIEW ? <Action
                        text={Localization.goto_update}
                        style={{ backgroundColor: appColor(APP_COLOR_NAME.INFO) }}
                        onClick={() => this.goToUpdate()}
                    >
                        <i className="fa fa-edit"></i>
                    </Action> : <></>}
                </Fab>

                <ToastContainer {...this.getNotifyContainerConfig()} />
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
export const UserSave = connect(state2props, dispatch2props)(UserSaveComponent);