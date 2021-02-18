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
import { WarehouseService } from '../../../../service/warehouse.service';
import { IWarehouse } from '../../../../model/warehouse.model';
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


interface IWarehouseForm {
    name: { [key: string]: string; };
    country: { label: string, value: IWarehouse } | null;
    isInternational: boolean;
}

interface IState {
    formData: IWarehouseForm;
    fetchData: IWarehouse | undefined;
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

class WarehouseSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        formData: { name: {}, country: null, isInternational: false },
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE
    };

    private _warehouseService = new WarehouseService();
    private entityId: string | undefined;

    private formValidation = Yup.object/* <IWarehouseForm> */({
        name: Yup.object().test('fill-default-name', Localization.validation.required_field, v => {
            if (v[this.defaultLangCode]) return true;
            return false;
        }),
        country: Yup.object().nullable().required(Localization.validation.required_field)
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
            case AppRoute.routeData.warehouse.create.path:
                return SAVE_PAGE_MODE.CREATE
            case AppRoute.routeData.warehouse.update.path:
                return SAVE_PAGE_MODE.UPDATE
            case AppRoute.routeData.warehouse.view.path:
                return SAVE_PAGE_MODE.VIEW
            case AppRoute.routeData.warehouse.copy.path:
                return SAVE_PAGE_MODE.COPY
            default:
                return SAVE_PAGE_MODE.CREATE
        }
    }

    private async fetchData() {
        // debugger;
        if (!this.entityId) return;

        try {
            const res = await this._warehouseService.byId(this.entityId);
            const country = res.data.data.country;
            const countryObj = country?.id
                ? { label: country.name[this.defaultLangCode], value: country }
                : null;

            this.setState({
                fetchData: res.data.data,
                formData: {
                    name: res.data.data.name,
                    country: countryObj,
                    isInternational: res.data.data.isInternational,
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

    private _debounceSearchWarehouseList: any;
    private debounceSearchWarehouseList(input: string, callback: any) {
        if (this._debounceSearchWarehouseList) clearTimeout(this._debounceSearchWarehouseList);
        this._debounceSearchWarehouseList = setTimeout(() => { this.searchWarehouseList(input, callback) }, 300);
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    private async searchWarehouseList(input: string, callback: any): Promise<void> {
        try {
            const res = await this._warehouseService.search({
                pagination: {
                    page: 0,
                    limit: Setup.recordDefaultLoadLength
                },
                search: input
            });

            // const result = this.nestedWarehouseList(res.data.data.items);
            const result = res.data.data.items.map(a => ({ label: a.name[this.defaultLangCode], value: a }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    private goToManage() {
        this.navigate(AppRoute.routeData.warehouse.manage.url());
    }
    private goToUpdate() {
        if (!this.entityId) return;
        this.navigate(AppRoute.routeData.warehouse.update.url(this.entityId));
    }
    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    private async create(values: IWarehouseForm, handleReset: () => void) {
        debugger;
        this.setState({ actionBtnLoading: true });
        try {
            await this._warehouseService.create({
                name: values.name,
                countryId: values.country?.value.id!,
                isInternational: values.isInternational
            });
            this.setState({ actionBtnLoading: false });
            handleReset();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({ error: e.response, toastOptions: { toastId: 'create_error' } });
        }
    }

    private async update(values: IWarehouseForm) {
        if (!this.entityId) return;
        debugger;
        this.setState({ actionBtnLoading: true });
        try {
            await this._warehouseService.update({
                name: values.name,
                countryId: values.country?.value.id!,
                isInternational: values.isInternational
            }, this.entityId);
            this.setState({ actionBtnLoading: true });
            this.goToManage();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({ error: e.response, toastOptions: { toastId: 'update_error' } });
        }
    }

    private actionBtnRender(formikProps: FormikProps<IWarehouseForm>): JSX.Element {
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

        </div>
    }

    private saveFormRender() {
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
                            {this.defaultLangCode && <div className="col-md-4">
                                <FormControl<IWarehouseForm>
                                    control={APP_FORM_CONTROL.MULTILANGUAGE_INPUT}
                                    name={"name"}
                                    label={Localization.name}
                                    placeholder={Localization.name}
                                    required
                                    readOnly={this.state.savePageMode === SAVE_PAGE_MODE.VIEW}
                                    defaultlangcode={this.defaultLangCode}
                                    languagelist={languageList}
                                />
                            </div>}
                            <div className="col-md-4">
                                <FormControl<IWarehouseForm>
                                    control={APP_FORM_CONTROL.ASYNCSELECT}
                                    name="country"
                                    placeholder={Localization.country}
                                    label={Localization.country + ' warehouse (for test)'}
                                    required
                                    // isClearable={true}
                                    loadOptions={(inputValue: string, callback: (options: any) => void) => this.debounceSearchWarehouseList(inputValue, callback)}
                                    defaultOptions
                                    readOnly={this.state.savePageMode === SAVE_PAGE_MODE.VIEW}
                                />
                            </div>
                            <div className="col-md-4">
                                <FormControl<IWarehouseForm>
                                    control={APP_FORM_CONTROL.CHECKBOX}
                                    name={"isInternational"}
                                    label={'is international'}
                                    round
                                    readOnly={this.state.savePageMode === SAVE_PAGE_MODE.VIEW}
                                />
                            </div>

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
export const WarehouseSave = connect(state2props, dispatch2props)(WarehouseSaveComponent);