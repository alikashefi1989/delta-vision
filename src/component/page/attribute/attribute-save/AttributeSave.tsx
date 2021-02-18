import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { Setup, TInternationalization } from '../../../../config/setup';
import { FormControl, APP_FORM_CONTROL } from "../../../form/_formik/FormControl/FormControl";
import { Localization } from '../../../../config/localization/localization';
import { Formik, FormikProps } from "formik";
// import { ContentLoader } from '../../../form/content-loader/ContentLoader';
import { appColor, APP_COLOR_NAME } from "../../../../config/appColor";
import { Action, Fab } from "react-tiny-fab";
import { AppRoute } from '../../../../config/route';
import { AttributeService } from '../../../../service/attribute.service';
import { IAttribute } from '../../../../model/attribute.model';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import * as Yup from "yup";
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import TopBarProgress from 'react-topbar-progress-indicator';

enum SAVE_PAGE_MODE {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    COPY = "COPY",
    VIEW = "VIEW",
}

interface IAttributeForm {
    attribute: { name: { [key: string]: string }; value: { [key: string]: string } };
}

interface IState {
    formData: IAttributeForm;
    fetchData: IAttribute | undefined;
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

class AttributeSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        formData: { attribute: { name: {}, value: {} } },
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE,
        inputValue: ''
    };

    private _attributeService = new AttributeService();
    private entityId: string | undefined;

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    private formValidation = Yup.object/* <IAttributeForm> */({
        attribute: Yup.object().test('fill-default-attribute', Localization.validation.required_field, v => {
            // console.log('sssss', v)
            if(!v.name || !v.value) return false;
            if (!v.name[this.defaultLangCode] || !v.value[this.defaultLangCode]) return false;
            return true;
        }),
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
            case AppRoute.routeData.attribute.create.path:
                return SAVE_PAGE_MODE.CREATE
            case AppRoute.routeData.attribute.update.path:
                return SAVE_PAGE_MODE.UPDATE
            case AppRoute.routeData.attribute.view.path:
                return SAVE_PAGE_MODE.VIEW
            case AppRoute.routeData.attribute.copy.path:
                return SAVE_PAGE_MODE.COPY
            default:
                return SAVE_PAGE_MODE.CREATE
        }
    }

    private async fetchData() {
        if (!this.entityId) return;
        // const defaultLangCode = this.props.language.defaultLanguage?.code || '';
        try {
            const res = await this._attributeService.byId(this.entityId);
            this.setState({
                fetchData: res.data.data,
                formData: {
                    attribute: { name: res.data.data.name, value: res.data.data.value },
                },
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

    private goToManage() {
        this.navigate(AppRoute.routeData.attribute.manage.url());
    }
    private goToUpdate() {
        if (!this.entityId) return;
        this.navigate(AppRoute.routeData.attribute.update.url(this.entityId));
    }
    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    private async create(values: IAttributeForm, handleReset: () => void) {
        debugger;
        this.setState({ actionBtnLoading: true });
        try {
            await this._attributeService.create({
                name: values.attribute.name,
                value: values.attribute.value,
            });
            this.setState({ actionBtnLoading: false });
            handleReset();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({ error: e.response, toastOptions: { toastId: 'create_error' } });
        }
    }

    private async update(values: IAttributeForm) {
        if (!this.entityId) return;
        debugger;
        this.setState({ actionBtnLoading: true });
        try {
            await this._attributeService.update({
                name: values.attribute.name,
                value: values.attribute.value,
            }, this.entityId);
            this.setState({ actionBtnLoading: true });
            this.goToManage();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({ error: e.response, toastOptions: { toastId: 'update_error' } });
        }
    }

    private actionBtnRender(formikProps: FormikProps<IAttributeForm>): JSX.Element {
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
        const defaultLangCode = this.props.language.defaultLanguage?.identifier;
        const languageList = this.props.language.list;

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
                            {defaultLangCode && <div className="col-md-8">
                                <FormControl<IAttributeForm>
                                    control={APP_FORM_CONTROL.ATTRIBUTE_INPUT}
                                    name={"attribute"}
                                    label={Localization.attribute}
                                    // placeholder={Localization.name}
                                    required
                                    readOnly={this.state.savePageMode === SAVE_PAGE_MODE.VIEW}
                                    defaultlangcode={defaultLangCode}
                                    languagelist={languageList}
                                />
                            </div>}
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
export const AttributeSave = connect(state2props, dispatch2props)(AttributeSaveComponent);