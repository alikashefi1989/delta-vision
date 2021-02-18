import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Setup, TInternationalization } from '../../../../config/setup';
import {
    FormControl,
    APP_FORM_CONTROL,
} from '../../../form/_formik/FormControl/FormControl';
import { Localization } from '../../../../config/localization/localization';
import { /*Formik,*/ FormikProps } from 'formik';
import { AppRoute } from '../../../../config/route';
import { StoreService } from '../../../../service/store.service';
import {
    IStore,
    TStoreCreate,
    TStoreUpdate,
} from '../../../../model/store.model';
import * as Yup from 'yup';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { UploadService } from '../../../../service/upload.service';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
    SAVE_PAGE_MODE,
} from '../../_base/BaseSave/BaseSave';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { IMedia } from '../../../../model/media.model';
import { ICountry } from '../../../../model/country.model';
import { CountryService } from '../../../../service/country.service';
import { ProvidedFile } from '../../../form/_formik/MultiFileInput/MultiFileInput';
import { ReactSortable } from 'react-sortablejs';
import { MEDIA_GROUP } from '../../../../enum/media-group.enum';

interface IStoreForm {
    name: string;
    phone: string | undefined;
    media: Array<File | IMedia>;
    country: { label: string; value: ICountry } | null;
    percentage: number | '';
    ownerLog: string;
    dateLog: number;
}

interface IState extends IStateBaseSave<IStore> {
    formData: IStoreForm;
    fetchData: IStore | undefined;
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

class StoreSaveComponent extends BaseSave<
    IStore,
    TStoreCreate,
    TStoreUpdate,
    IProps,
    IState
> {
    state: IState = {
        formData: {
            name: '',
            phone: '',
            media: [],
            country: null,
            percentage: '',
            ownerLog: '',
            dateLog: 0,
        },
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE,
    };

    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.store;
    protected _entityService = new StoreService();
    protected countryService = new CountryService();
    protected entityId: string | undefined;
    protected _uploadService = new UploadService();

    protected form2CreateModel(form: IStoreForm): TStoreCreate {
        return {
            name: { [this.defaultLangCode]: form.name },
            phoneList:
                form.phone === undefined
                    ? []
                    : [{ number: form.phone, typeId: '' }],
            countryId: form.country === null ? '' : form.country.value.id,
            defaultPercentage:
                typeof form.percentage === 'number'
                    ? form.percentage
                    : undefined,
            mediaId:
                form.media && form.media.length
                    ? (form.media[0] as IMedia).id
                    : undefined,
        };
    }
    protected form2UpdateModel(form: IStoreForm): TStoreUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IStore): IStoreForm {
        return {
            name: data.name[this.defaultLangCode] || '',
            phone:
                data.phoneList && data.phoneList.length
                    ? data.phoneList[0].number
                    : '',
            media: data.media ? [data.media] : [],
            country: data.country
                ? {
                      label: data.country.name[this.defaultLangCode] || '',
                      value: data.country,
                  }
                : null,
            percentage: data.defaultPercentage ? data.defaultPercentage : '',
            ownerLog:
                data.createdBy && data.createdBy.name
                    ? data.createdBy.name
                    : '',
            dateLog: data.createdAt,
        };
    }

    protected formValidation = Yup.object(
        /* <IStoreForm> */ {
            name: Yup.string().test(
                'fill-default-name',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),

            country: Yup.object()
                .nullable()
                .required(Localization.validation.required_field),
        }
    );

    componentDidMount() {
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

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    protected async create(formikProps: FormikProps<IStoreForm>) {
        // debugger;
        this.setState({ actionBtnLoading: true });
        try {
            debugger;
            const media = await this.upload(formikProps.values.media);
            if (media && media.length) {
                // formikProps.setFieldValue('media', media);
                let values: IStoreForm = formikProps.values;
                values.media = media;
                formikProps.setValues(values);
                debugger;
            }
            this.setState({ actionBtnLoading: true }, () =>
                super.create(formikProps)
            );
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'upload_error' },
            });
        }
    }

    protected async update(formikProps: FormikProps<IStoreForm>) {
        if (!this.entityId) return;
        // debugger;
        this.setState({ actionBtnLoading: true });
        try {
            debugger;
            const media = await this.upload(formikProps.values.media);
            debugger;
            if (media && media.length) {
                // formikProps.setFieldValue('media', media);
                let values: IStoreForm = formikProps.values;
                values.media = media;
                formikProps.setValues(values);
                debugger;
            }
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

    private _debounceSearchCountryList: any;
    private debounceSearchCountryList(input: string, callback: any) {
        if (this._debounceSearchCountryList)
            clearTimeout(this._debounceSearchCountryList);
        this._debounceSearchCountryList = setTimeout(() => {
            this.searchCountryList(input, callback);
        }, 300);
    }

    private async searchCountryList(
        input: string,
        callback: any
    ): Promise<void> {
        try {
            const res = await this.countryService.search({
                pagination: {
                    page: 0,
                    limit: Setup.recordDefaultLoadLength,
                },
                filter: {
                    [`name.${this.defaultLangCode}`]: {
                        $regex: input,
                        $options: 'i',
                    },
                },
                // search: input,
            });

            // const result = this.nestedAreaList(res.data.data.items);
            const result = res.data.data.items.map((country: ICountry) => ({
                label: country.name[this.defaultLangCode],
                value: country,
            }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    private async upload(image: IStoreForm['media']): Promise<IMedia[]> {
        debugger;
        if (!image.length || (image[0] as IMedia).id) {
            return image as IMedia[];
        }
        if (image.length) {
            // this condition for check default image (default image haven't id)
            let keys: Array<string> = Object.keys(image[0]);
            if (keys.includes('url') === true) {
                return [];
            }
        }
        const res = await this._uploadService.upload(
            image as Array<File>,
            MEDIA_GROUP.OTHER
        );
        return res.data.data.items;
    }

    extractorFileData(list: Array<ProvidedFile>): Array<File | IMedia> {
        let fileArray: Array<File | IMedia> = list.map((item: ProvidedFile) => {
            return item.file;
        });
        return fileArray;
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        // const defaultLangCode = this.props.language.defaultLanguage?.identifier;
        // const languageList = this.props.language.list;

        return (
            <>
                <h4 className="font-weight-bold text-capitalize">
                    vendor image
                </h4>
                <div className="row">
                    <div className="col-md-12">
                        <FormControl<IStoreForm>
                            control={APP_FORM_CONTROL.MULTI_FILE_INPUT}
                            name={'media'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            multiFileWrapperClass="category-save-page-image-wrapper"
                            multiFileInputClass="category-save-page-image-input"
                            multiFileLabelClass="category-save-page-image-label"
                            labelContent={
                                <span className="add-image-icon"></span>
                            }
                            ratio={1}
                            ratioError={(w: number, h: number) =>
                                this.toastNotify(
                                    'The aspect ratio should be 1',
                                    { autoClose: Setup.notify.timeout.warning },
                                    'warn'
                                )
                            }
                            provider={(providerProps: {
                                fieldName: string;
                                values: Array<File | IMedia>;
                                files: Array<ProvidedFile>;
                                setFieldValue: (
                                    field: string,
                                    value: Array<File | IMedia>
                                ) => void;
                                removeFunction: (
                                    index: number,
                                    fieldName: string,
                                    value: Array<File | IMedia>,
                                    setFieldValue: (
                                        field: string,
                                        value: any
                                    ) => void
                                ) => void;
                                sortFunction: (
                                    fieldName: string,
                                    value: Array<File | IMedia>,
                                    setFieldValue: (
                                        field: string,
                                        value: any
                                    ) => void
                                ) => void;
                            }) => {
                                return (
                                    <ReactSortable
                                        list={providerProps.files}
                                        setList={(newState) =>
                                            providerProps.sortFunction(
                                                providerProps.fieldName,
                                                this.extractorFileData(
                                                    newState
                                                ),
                                                providerProps.setFieldValue
                                            )
                                        }
                                        animation={300}
                                        className="category-dragable-list-wrapper"
                                        // style={{ flexWrap: 'wrap' }}
                                    >
                                        {providerProps.files.map(
                                            (item: ProvidedFile, i: number) => {
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="category-dragable-item"
                                                    >
                                                        <i
                                                            className="fa fa-times-circle"
                                                            title={
                                                                Localization.remove +
                                                                ' ' +
                                                                item.file.name
                                                            }
                                                            onClick={() =>
                                                                providerProps.removeFunction(
                                                                    item.index,
                                                                    providerProps.fieldName,
                                                                    providerProps.values,
                                                                    providerProps.setFieldValue
                                                                )
                                                            }
                                                        ></i>
                                                        <img
                                                            src={item.src}
                                                            alt=""
                                                        />
                                                    </div>
                                                );
                                            }
                                        )}
                                    </ReactSortable>
                                );
                            }}
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                </div>
                <h4 className="font-weight-bold text-capitalize mb-4">
                    vendor information
                </h4>
                <div className="row">
                    {this.defaultLangCode && (
                        <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                            <FormControl<IStoreForm>
                                control={APP_FORM_CONTROL.INPUT}
                                name={'name'}
                                label={'Vendor Name'}
                                placeholder={'Vendor Name'}
                                apptheme={FORM_ELEMENT_THEME.ZOHO}
                                required
                                readOnly={
                                    this.state.savePageMode ===
                                    SAVE_PAGE_MODE.VIEW
                                }
                            />
                        </div>
                    )}
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IStoreForm>
                            control={APP_FORM_CONTROL.ASYNCSELECT}
                            name={'country'}
                            components={{
                                DropdownIndicator: () =>
                                    this.state.savePageMode ===
                                    SAVE_PAGE_MODE.CREATE ? (
                                        <i className="fa fa-caret-down mx-3"></i>
                                    ) : null,
                                IndicatorSeparator: () => null,
                            }}
                            onChange={(val: any) => {
                                if (val === null) {
                                    formikProps.setFieldValue('country', val);
                                    formikProps.setFieldValue('phone', '');
                                } else {
                                    formikProps.setFieldValue('country', val);
                                }
                            }}
                            required
                            label={Localization.country}
                            placeholder={'country'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            isClearable={true}
                            loadOptions={(
                                inputValue: string,
                                callback: (options: any) => void
                            ) =>
                                this.debounceSearchCountryList(
                                    inputValue,
                                    callback
                                )
                            }
                            defaultOptions
                            readOnly={
                                this.state.savePageMode !==
                                SAVE_PAGE_MODE.CREATE
                            }
                            icon={
                                this.state.savePageMode ===
                                SAVE_PAGE_MODE.CREATE ? undefined : (
                                    <i className="fa fa-lock zoho-icon"></i>
                                )
                            }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IStoreForm>
                            control={APP_FORM_CONTROL.NUMBER}
                            name={'percentage'}
                            label={'Default Percentage'}
                            placeholder={'Default Percentage'}
                            min="0"
                            max="100"
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                    {this.defaultLangCode && (
                        <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                            <FormControl<IStoreForm>
                                control={APP_FORM_CONTROL.INPUT}
                                name={'phone'}
                                label={'Phone Number'}
                                placeholder={'Phone Number'}
                                apptheme={FORM_ELEMENT_THEME.ZOHO}
                                prevalue={
                                    <p className="small m-0 text-center zoho-pre-value">
                                        {formikProps.values.country === null
                                            ? ''
                                            : formikProps.values.country.value
                                                  .code}
                                    </p>
                                }
                                disabled={
                                    formikProps.values.country === null
                                        ? true
                                        : false
                                }
                                readOnly={
                                    this.state.savePageMode ===
                                    SAVE_PAGE_MODE.VIEW
                                }
                            />
                        </div>
                    )}
                </div>
                {this.state.savePageMode !== SAVE_PAGE_MODE.CREATE &&
                this.state.savePageMode !== SAVE_PAGE_MODE.COPY ? (
                    <>
                        <h4 className="font-weight-bold text-capitalize mb-4">
                            log history
                        </h4>
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                <FormControl<IStoreForm>
                                    control={APP_FORM_CONTROL.INPUT}
                                    name={'ownerLog'}
                                    label={'Owner'}
                                    placeholder={'Owner'}
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    readOnly={true}
                                    icon={
                                        <i className="fa fa-lock zoho-icon"></i>
                                    }
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                <FormControl<IStoreForm>
                                    control={APP_FORM_CONTROL.DATE_TIME_PICKER}
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    name={'dateLog'}
                                    label={'Date'}
                                    innerValue2Outer={(v: any) => {
                                        return v === null
                                            ? undefined
                                            : new Date(v).getTime();
                                    }}
                                    outerValue2Inner={(v: any) => {
                                        return new Date(
                                            !v ? '' : v
                                        ).toLocaleDateString('en-US');
                                    }}
                                    className="app-datepicker-input log-style"
                                    wrapperClassName="wrapper-log-style"
                                    selected={
                                        formikProps.values.date === undefined
                                            ? null
                                            : new Date(formikProps.values.date)
                                    }
                                    isClearable={true}
                                    placeholderText="date"
                                    readOnly={true}
                                    icon={
                                        <i className="fa fa-lock zoho-icon"></i>
                                    }
                                />
                            </div>
                        </div>
                    </>
                ) : undefined}
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
export const StoreSave = connect(
    state2props,
    dispatch2props
)(StoreSaveComponent);
