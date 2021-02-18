import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
} from '../../_base/BaseSave/BaseSave';
import { Setup, TInternationalization } from '../../../../config/setup';
import {
    FormControl,
    APP_FORM_CONTROL,
} from '../../../form/_formik/FormControl/FormControl';
import { Localization } from '../../../../config/localization/localization';
import { FormikProps } from 'formik';
import { AppRoute } from '../../../../config/route';
import { CountryService } from '../../../../service/country.service';
import {
    ICountry,
    TCountryCreate,
    TCountryUpdate,
} from '../../../../model/country.model';
// import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import * as Yup from 'yup';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

enum SAVE_PAGE_MODE {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    COPY = 'COPY',
    VIEW = 'VIEW',
}

interface INestedCountryOptions {
    label: string;
    value?: ICountry;
    options?: Array<INestedCountryOptions>;
    indent: number;
}

interface ICountryForm {
    name: { [key: string]: string };
    currency: { [key: string]: string };
    code: string;
    location: { lat: number; lng: number } | null;
    currencySymbol: string;
}

interface IState extends IStateBaseSave<ICountry> {
    formData: ICountryForm;
    fetchData: ICountry | undefined;
    formLoader: boolean;
    actionBtnVisibility: boolean;
    actionBtnLoading: boolean;
    savePageMode: SAVE_PAGE_MODE;
}
interface IProps extends IPropsBaseSave {
    internationalization: TInternationalization;
    match: any;
    language: ILanguage_schema;
}

class CountrySaveComponent extends BaseSave<
    ICountry,
    TCountryCreate,
    TCountryUpdate,
    IProps,
    IState
> {
    state: IState = {
        formData: {
            name: {},
            currency: {},
            currencySymbol: '',
            code: '',
            location: null,
        },
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE,
    };

    protected _entityService = new CountryService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.country;

    protected form2CreateModel(form: ICountryForm): TCountryCreate {
        return {
            name: form.name,
            currency: form.currency,
            code: form.code,
            location: [1, 2],
            currencySymbol: form.currencySymbol,
        };
    }
    protected form2UpdateModel(form: ICountryForm): TCountryUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: ICountry): ICountryForm {
        return {
            name: data.name,
            currency: data.currency,
            code: data.code,
            location: { lat: data.location[0], lng: data.location[1] },
            currencySymbol: data.currencySymbol,
        };
    }
    protected entityId: string | undefined;

    protected formValidation = Yup.object(
        /* <ICountryForm> */ {
            name: Yup.object().test(
                'fill-default-name',
                Localization.validation.required_field,
                (v) => {
                    if (
                        v[this.props.language.defaultLanguage?.identifier || '']
                    )
                        return true;
                    return false;
                }
            ),

            currency: Yup.object().test(
                'fill-default-currency',
                Localization.validation.required_field,
                (v) => {
                    if (
                        v[this.props.language.defaultLanguage?.identifier || '']
                    )
                        return true;
                    return false;
                }
            ),

            code: Yup.string().test(
                'fill-default-code',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),

            currencySymbol: Yup.string().test(
                'fill-default-currencySymbol',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),

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
        super.componentDidMount();
    }

    componentWillUnmount() {
        this.clearTmpUrl();
    }

    protected async fetchData() {
        // debugger;
        if (!this.entityId) return;

        try {
            const res = await this._entityService.byId(this.entityId);
            this.setState({
                fetchData: res.data.data,
                formData: {
                    name: res.data.data.name,
                    currency: res.data.data.currency,
                    code: res.data.data.code,
                    currencySymbol: res.data.data.currencySymbol,
                    location: res.data.data.location
                        ? {
                              lat: res.data.data.location[0],
                              lng: res.data.data.location[1],
                          }
                        : null,
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

    protected _debounceSearchCountryList: any;
    protected debounceSearchCountryList(input: string, callback: any) {
        if (this._debounceSearchCountryList)
            clearTimeout(this._debounceSearchCountryList);
        this._debounceSearchCountryList = setTimeout(() => {
            this.searchCountryList(input, callback);
        }, 300);
    }

    protected get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    protected nestedCountryList(
        list: Array<ICountry>,
        indent = -1
    ): Array<INestedCountryOptions> {
        indent = indent + 1;
        const result = [];
        for (let i = 0; i < list.length; i++) {
            const cat = list[i];
            result.push({ label: cat.name[this.defaultLangCode], indent });
        }
        return result;
    }

    protected async searchCountryList(
        input: string,
        callback: any
    ): Promise<void> {
        try {
            const res = await this._entityService.search({
                pagination: {
                    page: 0,
                    limit: Setup.recordDefaultLoadLength,
                },
                search: input,
            });

            const result = this.nestedCountryList(res.data.data.items);
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    protected goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    protected async create(formikProps: FormikProps<ICountryForm>) {
        this.setState({ actionBtnLoading: true });
        try {
            this.setState({ actionBtnLoading: true }, () =>
                super.create(formikProps)
            );
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'create_error' },
            });
        }
    }

    protected async update(formikProps: FormikProps<ICountryForm>) {
        if (!this.entityId) return;
        this.setState({ actionBtnLoading: true });
        try {
            this.setState({ actionBtnLoading: true }, () =>
                super.update(formikProps)
            );
            this.goToManage();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'update_error' },
            });
        }
    }

    //#region tmpUrl
    protected tmpUrl_list: string[] = [];
    protected getTmpUrl(file: File): string {
        const tmpUrl = URL.createObjectURL(file);
        this.tmpUrl_list.push(tmpUrl);
        return tmpUrl;
    }
    protected clearTmpUrl() {
        this.tmpUrl_list.forEach((url) => {
            URL.revokeObjectURL(url);
        });
    }
    //#endregion

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        const defaultLangCode = this.props.language.defaultLanguage?.identifier;
        const languageList = this.props.language.list;

        return (
            <div className="row">
                {defaultLangCode && (
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<ICountryForm>
                            control={APP_FORM_CONTROL.MULTILANGUAGE_INPUT}
                            name={'name'}
                            label={`${Localization.name} ( ${this.defaultLangCode} )`}
                            placeholder={Localization.name}
                            required
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                            defaultlangcode={defaultLangCode}
                            languagelist={languageList}
                        />
                    </div>
                )}
                {defaultLangCode && (
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<ICountryForm>
                            control={APP_FORM_CONTROL.MULTILANGUAGE_INPUT}
                            name={'currency'}
                            label={`${Localization.currency}  ${defaultLangCode}`}
                            placeholder={Localization.currency}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                            defaultlangcode={defaultLangCode}
                            languagelist={languageList}
                        />
                    </div>
                )}

                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                    <FormControl<ICountryForm>
                        control={APP_FORM_CONTROL.INPUT}
                        name={'code'}
                        label={Localization.code}
                        placeholder={Localization.code}
                        apptheme={FORM_ELEMENT_THEME.ZOHO}
                        required
                        readOnly={
                            this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                        }
                    />
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                    <FormControl<ICountryForm>
                        control={APP_FORM_CONTROL.INPUT}
                        name={'currencySymbol'}
                        label={Localization.currencySymbol}
                        placeholder={Localization.currencySymbol}
                        apptheme={FORM_ELEMENT_THEME.ZOHO}
                        required
                        readOnly={
                            this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                        }
                    />
                </div>

                <div className="col-md-12 ">
                    <FormControl<ICountryForm>
                        control={APP_FORM_CONTROL.MAP}
                        name={'location'}
                        label={'location'}
                        // required
                        isRequired
                        readOnly={
                            this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                        }
                    />
                </div>
            </div>
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
export const CountrySave = connect(
    state2props,
    dispatch2props
)(CountrySaveComponent);
