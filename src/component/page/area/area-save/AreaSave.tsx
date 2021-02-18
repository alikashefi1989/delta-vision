import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { Setup, TInternationalization } from '../../../../config/setup';
import {
    FormControl,
    APP_FORM_CONTROL,
} from '../../../form/_formik/FormControl/FormControl';
import { Localization } from '../../../../config/localization/localization';
import { Formik, FormikProps } from 'formik';
// import { ContentLoader } from '../../../form/content-loader/ContentLoader';
import { appColor, APP_COLOR_NAME } from '../../../../config/appColor';
import { Action, Fab } from 'react-tiny-fab';
import { AppRoute } from '../../../../config/route';
import { AreaService } from '../../../../service/area.service';
import { IArea } from '../../../../model/area.model';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import * as Yup from 'yup';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { ICountry } from '../../../../model/country.model';
import { CountryService } from '../../../../service/country.service';
import TopBarProgress from 'react-topbar-progress-indicator';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';

enum SAVE_PAGE_MODE {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    COPY = 'COPY',
    VIEW = 'VIEW',
}

interface IAreaForm {
    name: { [key: string]: string };
    country: { label: string; value: ICountry } | null;
    location: { lat: number; lng: number } | null;
    isActive: boolean;
}

interface IState {
    formData: IAreaForm;
    fetchData: IArea | undefined;
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

class AreaSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        formData: { name: {}, country: null, location: null, isActive: true },
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE,
    };

    private _areaService = new AreaService();
    private _countryService = new CountryService();
    private entityId: string | undefined;

    private formValidation = Yup.object(
        /* <IAreaForm> */ {
            name: Yup.object().test(
                'fill-default-name',
                Localization.validation.required_field,
                (v) => {
                    if (v[this.defaultLangCode]) return true;
                    return false;
                }
            ),
            country: Yup.object()
                .nullable()
                .required(Localization.validation.required_field),

            location: Yup.object().test(
                'choseLocation',
                Localization.validation.required_field,
                (v) => {
                    if (!v || !v.lat || !v.lng) return false;
                    return true;
                }
            ),
        }
    );

    componentDidMount() {
        // debugger;
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
        // debugger;
        if (this.props.match.params.id) {
            this.entityId = this.props.match.params.id;
            // debugger;
            this.setState(
                {
                    formLoader: true,
                    savePageMode: this.savePageMode(this.props.match.path),
                },
                () => this.fetchData()
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
            // debugger;
            this.setState({
                savePageMode: this.savePageMode(currentPath),
            });
        }
    }

    private savePageMode(path: string): SAVE_PAGE_MODE {
        switch (path) {
            case AppRoute.routeData.area.create.path:
                return SAVE_PAGE_MODE.CREATE;
            case AppRoute.routeData.area.update.path:
                return SAVE_PAGE_MODE.UPDATE;
            case AppRoute.routeData.area.view.path:
                return SAVE_PAGE_MODE.VIEW;
            case AppRoute.routeData.area.copy.path:
                return SAVE_PAGE_MODE.COPY;
            default:
                return SAVE_PAGE_MODE.CREATE;
        }
    }

    private async fetchData() {
        // debugger;
        if (!this.entityId) return;

        try {
            const res = await this._areaService.byId(this.entityId);
            const country = res.data.data.country;
            const countryObj = country?.id
                ? { label: country.name[this.defaultLangCode], value: country }
                : null;

            this.setState({
                fetchData: res.data.data,
                formData: {
                    name: res.data.data.name,
                    country: countryObj,
                    location: res.data.data.location
                        ? {
                              lat: res.data.data.location[0],
                              lng: res.data.data.location[1],
                          }
                        : null,
                    isActive: res.data.data.isActive,
                },
                formLoader: false,
                actionBtnVisibility: true,
            });
        } catch (e) {
            this.setState({
                formLoader: false,
            });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'fetchData_error' },
            });
        }
    }

    private _debounceSearchAreaList: any;
    private debounceSearchAreaList(input: string, callback: any) {
        if (this._debounceSearchAreaList)
            clearTimeout(this._debounceSearchAreaList);
        this._debounceSearchAreaList = setTimeout(() => {
            this.searchAreaList(input, callback);
        }, 300);
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    private async searchAreaList(input: string, callback: any): Promise<void> {
        try {
            const res = await this._countryService.search({
                pagination: {
                    page: 0,
                    limit: Setup.recordDefaultLoadLength,
                },
                search: input,
            });

            // const result = this.nestedAreaList(res.data.data.items);
            const result = res.data.data.items.map((a) => ({
                label: a.name[this.defaultLangCode],
                value: a,
            }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    private goToManage() {
        this.navigate(AppRoute.routeData.area.manage.url());
    }
    private goToUpdate() {
        if (!this.entityId) return;
        this.navigate(AppRoute.routeData.area.update.url(this.entityId));
    }
    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    private async create(values: IAreaForm, handleReset: () => void) {
        debugger;
        this.setState({ actionBtnLoading: true });
        try {
            await this._areaService.create({
                name: values.name,
                countryId: values.country?.value.id!,
                location: [values.location!.lat, values.location!.lng],
                // image: media.length ? media[0]._id : undefined,
                // attributes: values.attributes
            });
            this.setState({ actionBtnLoading: false });
            handleReset();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'create_error' },
            });
        }
    }

    private async update(values: IAreaForm) {
        if (!this.entityId) return;
        debugger;
        this.setState({ actionBtnLoading: true });
        try {
            await this._areaService.update(
                {
                    name: values.name,
                    countryId: values.country?.value.id!,
                    location: [values.location!.lat, values.location!.lng],
                    isActive: values.isActive,
                },
                this.entityId
            );
            this.setState({ actionBtnLoading: true });
            this.goToManage();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'update_error' },
            });
        }
    }

    private actionBtnRender(formikProps: FormikProps<IAreaForm>): JSX.Element {
        if (this.state.actionBtnVisibility === false) return <></>;
        if (this.state.savePageMode === SAVE_PAGE_MODE.VIEW) return <></>;

        const { isValid, handleReset, dirty, values } = formikProps;

        // return <div className="col-md-12 mt-3">
        //     {this.state.savePageMode !== SAVE_PAGE_MODE.UPDATE && <BtnLoader
        //         loading={this.state.actionBtnLoading}
        //         btnClassName={"btn btn-success mr-2"}
        //         disabled={!isValid || !dirty}
        //         onClick={() => this.create(values, handleReset)}
        //     > {Localization.create}
        //     </BtnLoader>}

        //     {this.state.savePageMode === SAVE_PAGE_MODE.UPDATE && <BtnLoader
        //         loading={this.state.actionBtnLoading}
        //         btnClassName={"btn btn-primary mr-2"}
        //         disabled={!isValid || !dirty}
        //         onClick={() => this.update(values)}
        //     > {Localization.edit}
        //     </BtnLoader>}

        //     <button
        //         className="btn btn-warning"
        //         onClick={() => handleReset()}>
        //         {Localization.reset}
        //     </button>

        // </div>
        return (
            <div className="col-md-12  sticky-top ">
                <div className="row custom-header">
                    <div className="col-md-6 col-sm-6 col-12 p-0">
                        <h3 className="font-weight-bold d-sm-block d-flex justify-content-center">
                            {`${this.state.savePageMode}`}
                        </h3>
                    </div>
                    <div className="d-flex flex-row-reverse col-md-6 col-sm-6 col-12 justify-content-sm-start  justify-content-center ">
                        {this.state.savePageMode !== SAVE_PAGE_MODE.UPDATE && (
                            <BtnLoader
                                loading={this.state.actionBtnLoading}
                                btnClassName={'btn btn-custom btn-custom-info'}
                                disabled={!isValid || !dirty}
                                onClick={() => this.create(values, handleReset)}
                            >
                                {' '}
                                {Localization.create}
                            </BtnLoader>
                        )}

                        {this.state.savePageMode === SAVE_PAGE_MODE.UPDATE && (
                            <BtnLoader
                                loading={this.state.actionBtnLoading}
                                btnClassName={'btn btn-custom btn-custom-info'}
                                disabled={!isValid || !dirty}
                                onClick={() => this.update(values)}
                            >
                                {' '}
                                {Localization.edit}
                            </BtnLoader>
                        )}

                        <button
                            className="btn btn-custom btn-custom-warning "
                            onClick={() => handleReset()}
                        >
                            {Localization.reset}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    private saveFormRender() {
        const languageList = this.props.language.list;

        return (
            <div className="template-box animated fadeInDown min-h-150px">
                <Formik
                    initialValues={this.state.formData}
                    onSubmit={() => {}}
                    validationSchema={this.formValidation}
                    enableReinitialize
                >
                    {(formikProps) => (
                        <>
                            <div className="row">
                                {this.actionBtnRender(formikProps)}
                                <div className="col-12 p-sm-4  p-2 pt-4">
                                    <h4 className="font-weight-bold">
                                        Area Information
                                    </h4>
                                </div>
                                {this.defaultLangCode && (
                                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                        <FormControl<IAreaForm>
                                            control={
                                                APP_FORM_CONTROL.MULTILANGUAGE_INPUT
                                            }
                                            name={'name'}
                                            label={`${Localization.name} ( ${this.defaultLangCode} )`}
                                            required
                                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                                            readOnly={
                                                this.state.savePageMode ===
                                                SAVE_PAGE_MODE.VIEW
                                            }
                                            defaultlangcode={
                                                this.defaultLangCode
                                            }
                                            languagelist={languageList}
                                        />
                                    </div>
                                )}
                                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                    <FormControl<IAreaForm>
                                        control={APP_FORM_CONTROL.ASYNCSELECT}
                                        name="country"
                                        label={Localization.country}
                                        icon={
                                            <i
                                                className="fa fa-lock zoho-icon"
                                                onClick={() => alert()}
                                            ></i>
                                        }
                                        required
                                        apptheme={FORM_ELEMENT_THEME.ZOHO}
                                        // isClearable={true}
                                        loadOptions={(
                                            inputValue: string,
                                            callback: (options: any) => void
                                        ) =>
                                            this.debounceSearchAreaList(
                                                inputValue,
                                                callback
                                            )
                                        }
                                        defaultOptions
                                        readOnly={
                                            this.state.savePageMode ===
                                            SAVE_PAGE_MODE.VIEW
                                        }
                                    />
                                </div>

                                {this.state.savePageMode !==
                                    SAVE_PAGE_MODE.CREATE && (
                                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                        <FormControl<IAreaForm>
                                            control={APP_FORM_CONTROL.CHECKBOX}
                                            name={'isActive'}
                                            label={'is Active'}
                                            round
                                            readOnly={
                                                this.state.savePageMode ===
                                                SAVE_PAGE_MODE.VIEW
                                            }
                                        />
                                    </div>
                                )}

                                <div className="col-md-12 ">
                                    <FormControl<IAreaForm>
                                        control={APP_FORM_CONTROL.MAP}
                                        name={'location'}
                                        label={'location'}
                                        // required
                                        isRequired
                                        readOnly={
                                            this.state.savePageMode ===
                                            SAVE_PAGE_MODE.VIEW
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </Formik>

                {/* <ContentLoader show={this.state.formLoader} gutterClassName="gutter-0" /> */}
                {this.state.formLoader && <TopBarProgress />}
            </div>
        );
    }

    render() {
        return (
            <>
                {this.saveFormRender()}

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
                    onClick={() => this.goToManage()}
                >
                    {this.state.savePageMode === SAVE_PAGE_MODE.VIEW ? (
                        <Action
                            text={Localization.goto_update}
                            style={{
                                backgroundColor: appColor(APP_COLOR_NAME.INFO),
                            }}
                            onClick={() => this.goToUpdate()}
                        >
                            <i className="fa fa-edit"></i>
                        </Action>
                    ) : (
                        <></>
                    )}
                </Fab>

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
export const AreaSave = connect(state2props, dispatch2props)(AreaSaveComponent);
