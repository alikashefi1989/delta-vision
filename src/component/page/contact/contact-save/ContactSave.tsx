import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FormikProps } from 'formik';
import * as Yup from 'yup';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
    SAVE_PAGE_MODE,
} from '../../_base/BaseSave/BaseSave';
import {
    IContact,
    TContactCreate,
    TContactUpdate,
} from '../../../../model/contact.model';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { ContactService } from '../../../../service/contact.service';
import {
    APP_FORM_CONTROL,
    FormControl,
} from '../../../form/_formik/FormControl/FormControl';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import { Localization } from '../../../../config/localization/localization';
import { ICountry } from '../../../../model/country.model';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { Setup } from '../../../../config/setup';
import { CountryService } from '../../../../service/country.service';
import { GRID_CELL_TYPE } from '../../../../enum/grid-cell-type.enum';

interface IContactForm {
    name: string;
    title: string;
    phoneNumber: string | undefined;
    mobileNumber: string;
    email: string;
    country: { label: string; value: ICountry } | null;
    ownerLog: string;
    dateLog: number;
}

interface IState extends IStateBaseSave<IContact> {
    formData: IContactForm;
    fetchData: IContact | undefined;
    formLoader: boolean;
    actionBtnVisibility: boolean;
    actionBtnLoading: boolean;
    savePageMode: SAVE_PAGE_MODE;
}
interface IProps extends IPropsBaseSave {
    language: ILanguage_schema;
}

class ContactSaveComponent extends BaseSave<
    IContact,
    TContactCreate,
    TContactUpdate,
    IProps,
    IState
> {
    [x: string]: any;
    state: IState = {
        formData: {
            name: '',
            title: '',
            phoneNumber: '',
            mobileNumber: '',
            email: '',
            ownerLog: '',
            dateLog: 0,
            country: null,
        },
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE,
    };

    private modalColumns = [
        {
            accessor: 'readableId',
            cell: GRID_CELL_TYPE.CELL_TEXT_INFO,
            header: 'id',
            title: 'id',
        },
        {
            accessor: 'status',
            cell: GRID_CELL_TYPE.CELL_TEXT,
            header: 'status',
            title: 'status',
        },
        {
            accessor: 'country.name.en',
            cell: GRID_CELL_TYPE.CELL_TEXT,
            header: 'country',
            title: 'country',
        },
        {
            accessor: 'subTotal',
            cell: GRID_CELL_TYPE.CELL_NUMBER,
            header: 'total amount',
            title: 'total amount',
        },
        {
            accessor: 'createdAt',
            cell: GRID_CELL_TYPE.CELL_DATE,
            header: 'creation time',
            title: 'creation time',
        },
    ];

    protected _entityService = new ContactService();
    protected countryService = new CountryService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.contact;
    protected entityId: string | undefined;
    // protected formValidation = Yup.object(/* <IContactForm> */ {});

    protected form2CreateModel(form: IContactForm): TContactCreate {
        return {
            name: form.name,
            title: form.title,
            phoneNumber: form.phoneNumber ? form.phoneNumber : '',
            mobileNumber: form.mobileNumber,
            email: form.email,
            countryId: form.country === null ? '' : form.country.value.id,
        };
    }
    protected form2UpdateModel(form: IContactForm): TContactUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IContact): IContactForm {
        return {
            name: data.name,
            title: data.title,
            phoneNumber: data.phoneNumber,
            mobileNumber: data.mobileNumber,
            email: data.email,
            country: data.country
                ? {
                      label: data.country.name[this.defaultLangCode] || '',
                      value: data.country,
                  }
                : null,
            ownerLog:
                data.createdBy && data.createdBy.name
                    ? data.createdBy.name
                    : '',
            dateLog: data.createdAt,
        };
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.entityId = this.props.match.params.id;
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

    protected formValidation = Yup.object(
        /* <ICategoryForm> */ {
            name: Yup.string().test(
                'fill-default-name',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),
            title: Yup.string().test(
                'fill-default-title',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),
            email: Yup.string()
                .email('Invalid email format')
                .test(
                    'fill-default-email',
                    Localization.validation.required_field,
                    (v) => {
                        if (v) return true;
                        return false;
                    }
                ),
            phoneNumber: Yup.number()
                .typeError('Phone Number must specify a number')
                .test(
                    'fill-default-phoneNumber',
                    Localization.validation.required_field,
                    (v) => {
                        if (v) return true;
                        return false;
                    }
                ),
            mobileNumber: Yup.number()
                .typeError('Mobile Number must specify a number')
                .test(
                    'fill-default-mobileNumber',
                    Localization.validation.required_field,
                    (v) => {
                        if (v) return true;
                        return false;
                    }
                ),
        }
    );

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
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

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        return (
            <>
                <h4 className="font-weight-bold text-capitalize mb-4">
                    Contact information
                </h4>
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IContactForm>
                            control={APP_FORM_CONTROL.INPUT}
                            name={'name'}
                            label={'Name'}
                            placeholder={'Name'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IContactForm>
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
                                    formikProps.setFieldValue(
                                        'phoneNumber',
                                        ''
                                    );
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
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IContactForm>
                            control={APP_FORM_CONTROL.INPUT}
                            name={'phoneNumber'}
                            label={'Phone Number'}
                            placeholder={'Phone Number'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            prevalue={
                                <p className="small m-0 text-center zoho-pre-value">
                                    {formikProps.values.country === null
                                        ? ''
                                        : formikProps.values.country.value.code}
                                </p>
                            }
                            disabled={
                                formikProps.values.country === null
                                    ? true
                                    : false
                            }
                            // required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                    {/* <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IContactForm>
                            control={APP_FORM_CONTROL.INPUT}
                            name={'title'}
                            label={'Vendor'}
                            placeholder={'Vendor'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                            icon={<i className="fa fa-building zoho-icon"></i>}
                        />
                    </div> */}
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IContactForm>
                            control={APP_FORM_CONTROL.LOOKUP}
                            name={'title'}
                            label={Localization.vendor}
                            placeholder={Localization.vendor}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                            isClearable
                            modalHeader={
                                <span className="text-capitalize">
                                    choose a vendor
                                </span>
                            }
                            icon={<i className="fa fa-user zoho-icon"></i>}
                            modalColumns={this.modalColumns}
                            entityName={ROUTE_BASE_CRUD.store}
                            searchAccessor={'readableId'}
                            defaultFilter={{}}
                            onChange={(e: any) => console.log(e)}
                        />
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IContactForm>
                            control={APP_FORM_CONTROL.INPUT}
                            name={'mobileNumber'}
                            label={'Mobile Number'}
                            placeholder={'Mobile Number'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            prevalue={
                                <p className="small m-0 text-center zoho-pre-value">
                                    {formikProps.values.country === null
                                        ? ''
                                        : formikProps.values.country.value.code}
                                </p>
                            }
                            disabled={
                                formikProps.values.country === null
                                    ? true
                                    : false
                            }
                            // required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IContactForm>
                            control={APP_FORM_CONTROL.INPUT}
                            name={'email'}
                            label={'Email'}
                            placeholder={'Email'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                </div>

                {this.state.savePageMode !== SAVE_PAGE_MODE.CREATE &&
                this.state.savePageMode !== SAVE_PAGE_MODE.COPY ? (
                    <>
                        <h4 className="font-weight-bold text-capitalize mb-4">
                            log history
                        </h4>
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                <FormControl<IContactForm>
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
                                <FormControl<IContactForm>
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
export const ContactSave = connect(
    state2props,
    dispatch2props
)(ContactSaveComponent);
