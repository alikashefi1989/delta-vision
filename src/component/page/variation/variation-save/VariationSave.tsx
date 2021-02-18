import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { Setup, TInternationalization } from '../../../../config/setup';
// import { countries } from 'countries-list';
import { FormControl, APP_FORM_CONTROL } from "../../../form/_formik/FormControl/FormControl";
import { Localization } from '../../../../config/localization/localization';
import { Formik, FormikProps } from "formik";
// import { ContentLoader } from '../../../form/content-loader/ContentLoader';
import { appColor, APP_COLOR_NAME } from "../../../../config/appColor";
import { Action, Fab } from "react-tiny-fab";
import { AppRoute } from '../../../../config/route';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import * as Yup from "yup"
import { VariationService } from '../../../../service/variation.service';
import { IVariation, IVariationItem } from '../../../../model/variation.model';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { VARIATION_TYPE } from '../../../../enum/variation-type.enum';
import TopBarProgress from 'react-topbar-progress-indicator';

enum SAVE_PAGE_MODE {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    COPY = "COPY",
    VIEW = "VIEW",
}

interface IVariationForm {
    name: { [key: string]: string; };
    type: { label: string, value: VARIATION_TYPE } | null;
    items: Array<{
        name: { [key: string]: string };
        values: Array<{
            label: string;
            value: string;
        }>;
    }>;
}

interface IState {
    formData: IVariationForm;
    fetchData: IVariation | undefined;
    formLoader: boolean;
    actionBtnVisibility: boolean;
    actionBtnLoading: boolean;
    savePageMode: SAVE_PAGE_MODE;
}
interface IProps {
    internationalization: TInternationalization;
    match: any;
    language: ILanguage_schema;
}

class VariationSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        formData: { name: {}, type: null, items: [] },
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE
    };

    private _variationService = new VariationService();
    private entityId: string | undefined;

    private formValidation = Yup.object/* <ILanguageForm> */({
        name: Yup.object().test('fill-default-name', Localization.validation.required_field, v => {
            if (v[this.props.language.defaultLanguage?.identifier || '']) return true;
            return false;
        }),
        type: Yup.object().required(Localization.validation.required_field).shape({ label: Yup.string(), value: Yup.string() }).required(Localization.validation.required_field),
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

    private savePageMode(path: string): SAVE_PAGE_MODE {
        switch (path) {
            case AppRoute.routeData.variation.create.path:
                return SAVE_PAGE_MODE.CREATE
            case AppRoute.routeData.variation.update.path:
                return SAVE_PAGE_MODE.UPDATE
            case AppRoute.routeData.variation.view.path:
                return SAVE_PAGE_MODE.VIEW
            case AppRoute.routeData.variation.copy.path:
                return SAVE_PAGE_MODE.COPY
            default:
                return SAVE_PAGE_MODE.CREATE
        }
    }

    private async fetchData() {
        // debugger;
        if (!this.entityId) return;

        try {
            const res = await this._variationService.byId(this.entityId);
            let variationType: { label: string, value: VARIATION_TYPE } = {
                label: Localization.variation_type[this.variationTypeByNumberReturn(res.data.data.type)],
                value: this.variationTypeByNumberReturn(res.data.data.type),
            };
            let variationItems: IVariationForm['items'] = res.data.data.items.map((item: IVariationItem) => {
                return {
                    name: item.name,
                    values: item.values.map((item: string) => {
                        return {
                            label: item.toString(),
                            value: item,
                        }
                    })
                }
            });
            this.setState({
                fetchData: res.data.data,
                formData: {
                    name: res.data.data.name,
                    type: variationType,
                    items: variationItems,
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

    variationTypeNumberReturn(variationType: VARIATION_TYPE): number {
        if (variationType === VARIATION_TYPE.STRING) {
            return 0;
        } else if (variationType === VARIATION_TYPE.NUMBER) {
            return 1;
        } else if (variationType === VARIATION_TYPE.COLOR) {
            return 2;
        } else {
            return 3;
        }
    }

    variationTypeByNumberReturn(num: number): VARIATION_TYPE {
        if (num === 0) {
            return VARIATION_TYPE.STRING;
        } else if (num === 1) {
            return VARIATION_TYPE.NUMBER;
        } else if (num === 2) {
            return VARIATION_TYPE.COLOR;
        } else {
            return VARIATION_TYPE.SIZE;
        }
    }

    private searchTypeList(input: string, callback: any): void {
        const res: Array<{ label: string, value: string }> = [];
        for (let i = 0; i < 4; i++) {
            const item: { label: string, value: string } = {
                label: Localization.variation_type[this.variationTypeByNumberReturn(i)],
                value: this.variationTypeByNumberReturn(i),
            }
            res.push(item);
        }
        callback(res);
    }

    private goToManage() {
        this.navigate(AppRoute.routeData.variation.manage.url());
    }
    private goToUpdate() {
        if (!this.entityId) return;
        this.navigate(AppRoute.routeData.variation.update.url(this.entityId));
    }
    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    private async create(values: IVariationForm, handleReset: () => void) {
        // debugger;
        this.setState({ actionBtnLoading: true });
        let variationItems: Array<Omit<IVariationItem, 'id'>> = values.items.map((item: {
            name: { [key: string]: string };
            values: Array<{
                label: string;
                value: string;
            }>;
        }) => {
            return {
                name: item.name,
                values: item.values.map((item2: { label: string; value: string }) => {
                    return item2.value
                })
            }
        });

        try {
            // const res = 
            await this._variationService.create({
                name: values.name,
                type: this.variationTypeNumberReturn(values.type?.value!),
                items: variationItems,
            });
            this.setState({ actionBtnLoading: false });
            handleReset();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({ error: e.response, toastOptions: { toastId: 'create_error' } });
        }
    }

    private async update(values: IVariationForm) {
        if (!this.entityId) return;
        // debugger;
        this.setState({ actionBtnLoading: true });
        let variationItems: Array<Omit<IVariationItem, 'id'>> = values.items.map((item: {
            name: { [key: string]: string };
            values: Array<{
                label: string;
                value: string;
            }>;
        }) => {
            return {
                name: item.name,
                values: item.values.map((item2: { label: string; value: string }) => {
                    return item2.value
                })
            }
        });

        try {
            // const res = 
            await this._variationService.update({
                name: values.name,
                type: this.variationTypeNumberReturn(values.type?.value!),
                items: variationItems,
            }, this.entityId);
            this.setState({ actionBtnLoading: true });
            this.goToManage();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({ error: e.response, toastOptions: { toastId: 'update_error' } });
        }
    }

    private actionBtnRender(formikProps: FormikProps<IVariationForm>): JSX.Element {
        if (this.state.actionBtnVisibility === false) return <></>;

        if (this.state.savePageMode === SAVE_PAGE_MODE.VIEW) return <></>;
        // <div className="col-md-12 mt-3"><button
        //     className="btn btn-info btn-circle btn-sm"
        //     onClick={() => this.goToUpdate()}>
        //     <i className="fa fa-edit"></i>
        // </button></div>;

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
                            {defaultLangCode && <div className="col-md-4">
                                <FormControl<IVariationForm>
                                    control={APP_FORM_CONTROL.MULTILANGUAGE_INPUT}
                                    name={"name"}
                                    label={Localization.name}
                                    placeholder={Localization.name}
                                    required
                                    readOnly={this.state.savePageMode === SAVE_PAGE_MODE.VIEW}
                                    defaultlangcode={defaultLangCode}
                                    languagelist={languageList}
                                />
                            </div>}
                            <div className="col-md-4">
                                <FormControl<IVariationForm>
                                    control={APP_FORM_CONTROL.ASYNCSELECT}
                                    name="type"
                                    placeholder={Localization.type}
                                    label={Localization.type}
                                    required
                                    // isClearable={true}
                                    loadOptions={(inputValue: string, callback: (options: any) => void) => this.searchTypeList(inputValue, callback)}
                                    defaultOptions
                                    onChange={(val: { label: string; value: VARIATION_TYPE } | null) => {
                                        formikProps.setValues({
                                            ...formikProps.values,
                                            type: val,
                                        });
                                    }}
                                    readOnly={this.state.savePageMode === SAVE_PAGE_MODE.VIEW}
                                />
                            </div>
                            {defaultLangCode && <div className="col-md-8">
                                <FormControl<IVariationForm>
                                    control={APP_FORM_CONTROL.VARIATION_ITEMS_LIST}
                                    name={"items"}
                                    label={Localization.items}
                                    required
                                    readOnly={this.state.savePageMode === SAVE_PAGE_MODE.VIEW}
                                    defaultlangcode={defaultLangCode}
                                    languagelist={languageList}
                                    itemlabel={Localization.value}
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
export const VariationSave = connect(state2props, dispatch2props)(VariationSaveComponent);