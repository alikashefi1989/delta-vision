import React from 'react';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { ILanguage_schema } from '../../../redux/action/language/languageAction';
import {
    APP_FILTER_FORM_CONTROL,
    FilterFormControl,
} from '../../form/_formik/_filters/FilterFormControl/FilterFormControl';
import { Formik } from 'formik';
import { LanguageService } from '../../../service/language.service';
import { ILanguage } from '../../../model/language.model';
import { FormControl } from '../../form/_formik/FormControl/FormControl';
import { APP_FORM_CONTROL } from '../../form/_formik/FormControl/FormControl';
import AppTimeLine from '../../tool/AppTimeLine/AppTimeLine';
import { GRID_CELL_TYPE } from '../../../enum/grid-cell-type.enum';
import { ROUTE_BASE_CRUD } from '../_base/BaseUtility';
// import { UserService } from '../../../service/user.service';
import { ProvidedFile } from '../../form/_formik/MultiFileInput/MultiFileInput';
import { IMedia } from '../../../model/media.model';
import { FORM_ELEMENT_THEME } from '../../form/_formik/FormElementBase/FormElementBase';
import {
    SkuPicker,
    ISkuPickerValue,
} from '../../form/_formik/SkuPicker/SkuPicker';
import StatusMultiStep from '../../tool/StatusMultiStep/StatusMultiStep';
import * as Yup from 'yup';

interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
}

interface IForm {
    date: number | undefined;
    lookup1: Object | null;
    lookup2: Array<Object>;
}

interface IState {
    formData: IForm;
    skuPicker: {
        show: boolean;
        value: Array<ISkuPickerValue>;
    };
    status: any[];
}

class PageComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        formData: {
            date: undefined,
            lookup1: { id: '5ff464f64d59b800267c10cb', name: 'gholi' },
            lookup2: [{ id: '5ff464f64d59b800267c10cb', name: 'gholi' }],
        },
        skuPicker: {
            show: false,
            value: [],
        },
        status: [
            { title: 'ali', isActive: false, disabled: false },
            { title: 'hassan', isActive: true, disabled: true },
            { title: 'mohammad', isActive: false, disabled: true },
        ],
    };

    private _languageService = new LanguageService();

    private modalColumns = [
        {
            accessor: 'name',
            cell: GRID_CELL_TYPE.CELL_TEXT_INFO,
            header: 'name',
            title: 'name',
        },
        {
            accessor: 'phone',
            cell: GRID_CELL_TYPE.CELL_PHONE,
            header: 'phone',
            title: 'phone',
        },
        {
            accessor: 'gender',
            cell: GRID_CELL_TYPE.CELL_TEXT,
            header: 'gender',
            title: 'gender',
        },
    ];

    private async fetchLanguage(): Promise<
        Array<{ label: string; value: any }>
    > {
        try {
            const res = await this._languageService.search({
                pagination: { page: 0, limit: 10 },
            });
            let options: Array<{
                label: string;
                value: any;
            }> = res.data.data.items.map((item: ILanguage) => {
                return {
                    label: this.labelCreator(item),
                    value: item.id,
                    val: item,
                };
            });
            return Promise.resolve(options);
        } catch (e) {
            return Promise.reject();
        }
    }

    mongoValue(value: ILanguage): string {
        return value.id;
    }

    labelCreator(value: ILanguage): string {
        return value.identifier;
    }

    extractorFileData(list: Array<ProvidedFile>): Array<File | IMedia> {
        let fileArray: Array<File | IMedia> = list.map((item: ProvidedFile) => {
            return item.file;
        });
        return fileArray;
    }

    StatusMultiStepTest() {
        return (
            <div className="card">
                <div className="card-header">Status Multi Step</div>
                <div className="card-body">
                    <h5 className="card-title">How to use Status Multi Step</h5>
                    <div className="card-text">
                        <StatusMultiStep
                            steps={this.state.status}
                            onStatusChanged={(e) => {
                                const newStatus = this.state.status.map(
                                    (st) => {
                                        if (e.title === st.title) {
                                            return {
                                                title: st.title,
                                                isActive: true,
                                            };
                                        } else {
                                            return {
                                                title: st.title,
                                                isActive: false,
                                            };
                                        }
                                    }
                                );
                                this.setState({
                                    status: newStatus,
                                });
                            }}
                        />
                    </div>
                    <p className="card-text">
                        {`<StatusMultiStep
                                steps={ }
                                onStatusChanged={(e) => { }} />`}
                    </p>
                    <p style={{ direction: 'rtl', textAlign: 'right' }}>
                        فقط کافیه کامپوننت رو صدا بزنید، بهش یه پراپرتی steps
                        بدین
                    </p>
                    <p style={{ direction: 'rtl', textAlign: 'right' }}>
                        این پراپرتی یه آرایه هستش به این شکل
                    </p>
                    <p
                        style={{ direction: 'rtl', textAlign: 'right' }}
                    >{`[{title: 'ali', isActive: false, disabled: false }]`}</p>
                    <p style={{ direction: 'rtl', textAlign: 'right' }}>
                        یه پراپرتی دیگه هم هست که وقتی روی یکی از مراحل کلیک
                        میکنید یه تابع رو فراخونی میکنه و به عنوان آرگومان بهش
                        اون مرحله رو میفرسته
                    </p>
                </div>
            </div>
        );
    }

    InputPercentageTest() {
        return (
            <div className="card">
                <div className="card-header">Input Percentage</div>
                <div className="card-body">
                    <h5 className="card-title">How to use Input Percentage</h5>
                    <div className="card-text">
                        <Formik
                            initialValues={{ number: '' }}
                            onSubmit={() => {}}
                            // validationSchema={this.formValidation}
                            enableReinitialize
                        >
                            {(formikProps) => (
                                <div className="row">
                                    <div className="col-md-12">
                                        <FormControl
                                            control={
                                                APP_FORM_CONTROL.PERCENTAGE
                                            }
                                            label={'number'}
                                            name={'number'}
                                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                                        />
                                    </div>
                                </div>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    }

    InputCurrencyTest() {
        return (
            <div className="card">
                <div className="card-header">Input Currency</div>
                <div className="card-body">
                    <h5 className="card-title">How to use Input Currency</h5>
                    <div className="card-text">
                        <Formik
                            initialValues={{ number: '' }}
                            onSubmit={() => {}}
                            // validationSchema={this.formValidation}
                            enableReinitialize
                        >
                            {(formikProps) => (
                                <div className="row">
                                    <div className="col-md-12">
                                        <FormControl
                                            control={APP_FORM_CONTROL.CURRENCY}
                                            label={'number'}
                                            name={'number'}
                                            currency={'KD'}
                                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                                        />
                                    </div>
                                </div>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    }

    InputPhoneTest() {
        return (
            <div className="card">
                <div className="card-header">Input Phone</div>
                <div className="card-body">
                    <h5 className="card-title">How to use Input Phone</h5>
                    <div className="card-text">
                        <Formik
                            initialValues={{ number: '' }}
                            onSubmit={() => {}}
                            validationSchema={Yup.object({
                                number: Yup.string().required('Required'),
                            })}
                            enableReinitialize
                        >
                            {(formikProps) => (
                                <div className="row">
                                    <div className="col-md-12">
                                        <FormControl
                                            control={
                                                APP_FORM_CONTROL.PHONE_NUMBER
                                            }
                                            label={'number'}
                                            name={'number'}
                                            countryCode={'+98'}
                                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                                        />
                                    </div>
                                </div>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <>
                <div className="template-box animated fadeInDown">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="text-center"> PAGE</h1>
                        </div>
                    </div>
                    <hr className="bg-success" />
                    <h1 className="text-center">FILTER SECTION</h1>
                    <Formik
                        initialValues={{ note: { $eq: 'jafar' } }}
                        onSubmit={() => {}}
                        // validationSchema={this.formValidation}
                        enableReinitialize
                    >
                        {(formikProps) => (
                            <>
                                <div className="row">
                                    <div className="col-md-12">
                                        <FilterFormControl
                                            control={
                                                APP_FILTER_FORM_CONTROL.FILTER_TEXT
                                            }
                                            name={'note'}
                                            label={'note'}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <FilterFormControl
                                            control={
                                                APP_FILTER_FORM_CONTROL.FILTER_SELECT
                                            }
                                            name={'isActive'}
                                            label={'activation'}
                                            options={[
                                                {
                                                    label: 'active',
                                                    value: true,
                                                },
                                                {
                                                    label: 'inactive',
                                                    value: false,
                                                },
                                            ]}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <FilterFormControl
                                            control={
                                                APP_FILTER_FORM_CONTROL.FILTER_DATE_PICKER
                                            }
                                            name={'date'}
                                            label={'date'}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <FilterFormControl
                                            control={
                                                APP_FILTER_FORM_CONTROL.FILTER_NUMBER
                                            }
                                            name={'number'}
                                            label={'number'}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <FilterFormControl
                                            control={
                                                APP_FILTER_FORM_CONTROL.FILTER_TAG_SELECT
                                            }
                                            name={'tag'}
                                            label={'tag'}
                                        />
                                    </div>
                                    {/* <div className="col-md-12">
                                        <FilterFormControl
                                            control={APP_FILTER_FORM_CONTROL.FILTER_ASYNC_SELECT}
                                            label={'async'}
                                            name={'async'}
                                            loadOptions={() => this.fetchLanguage()}
                                            optionsLabelCreator={(value: any) => this.labelCreator(value)}
                                            pureValue2MongoValue={(value: any) => this.mongoValue(value)}
                                        />
                                    </div> */}
                                    <div className="col-md-12">
                                        <FilterFormControl
                                            control={
                                                APP_FILTER_FORM_CONTROL.FILTER_ASYNC_TAG
                                            }
                                            label={'asyncTag'}
                                            name={'asyncTag'}
                                            loadOptions={() =>
                                                this.fetchLanguage()
                                            }
                                            pureValue2MongoValue={(
                                                value: Array<{
                                                    label: string;
                                                    value: any;
                                                    val: any;
                                                }>
                                            ) => {
                                                // debugger
                                                return value.map(
                                                    (item: {
                                                        label: string;
                                                        value: any;
                                                        val: any;
                                                    }) => {
                                                        return item.val.id;
                                                    }
                                                );
                                            }}
                                        />
                                    </div>

                                    <div className="col-md-12 mt-3">
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => {
                                                console.log(formikProps.values);
                                                debugger;
                                            }}
                                        >
                                            clickkkk
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Formik>
                    <hr className="bg-success" />
                    <h1 className="text-center">FORM ELEMENT SECTION</h1>
                    <Formik
                        initialValues={this.state.formData}
                        onSubmit={() => {}}
                        // validationSchema={this.formValidation}
                        enableReinitialize
                    >
                        {(formikProps) => (
                            <>
                                <div className="row">
                                    <div className="col-md-12">
                                        {/* <FormControl<IForm>
                                            control={
                                                APP_FORM_CONTROL.DATE_TIME_PICKER
                                            }
                                            name={'date'}
                                            innerValue2Outer={(v) => {
                                                return v === null
                                                    ? undefined
                                                    : new Date(v).getTime();
                                            }}
                                            outerValue2Inner={(v) => {
                                                return new Date(
                                                    !v ? '' : v
                                                ).toLocaleDaring('en-US');
                                            }}
                                            className="app-datepicker-input"
                                            selected={
                                                formikProps.values.date ===
                                                undefined
                                                    ? null
                                                    : new Date(
                                                          formikProps.values.date
                                                      )
                                            }
                                            isClearable={true}
                                            placeholderText="date"
                                        /> */}
                                    </div>
                                    <div className="col-6">
                                        <FormControl
                                            control={APP_FORM_CONTROL.LOOKUP}
                                            label={'lookup'}
                                            name={'lookup1'}
                                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                                            isClearable
                                            modalHeader={
                                                <span className="text-capitalize">
                                                    choose sale id
                                                </span>
                                            }
                                            icon={
                                                <i className="fa fa-user zoho-icon"></i>
                                            }
                                            modalColumns={this.modalColumns}
                                            entityName={ROUTE_BASE_CRUD.user}
                                            searchAccessor={'name'}
                                        />
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => {
                                                console.log(formikProps.values);
                                                debugger;
                                            }}
                                        >
                                            clickkkk
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Formik>
                    <hr className="bg-success" />
                    <h1 className="text-center">TIME LINE</h1>
                    <AppTimeLine
                        entityName="user"
                        entityId="5fddebb66e016c0026c2256e"
                    />
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <div
                    className="btn btn-info"
                    onClick={() => {
                        this.setState({
                            skuPicker: { ...this.state.skuPicker, show: true },
                        });
                    }}
                >
                    open sku picker
                </div>
                <SkuPicker
                    show={this.state.skuPicker.show}
                    value={this.state.skuPicker.value}
                    onConfirm={(value) => {
                        debugger;
                        this.setState({
                            skuPicker: {
                                ...this.state.skuPicker,
                                show: false,
                                value,
                            },
                        });
                    }}
                    onHide={() => {
                        this.setState({
                            skuPicker: { ...this.state.skuPicker, show: false },
                        });
                    }}
                />
                <pre>{JSON.stringify(this.state.skuPicker.value, null, 2)}</pre>
                <br />
                <br />
                <br />
                {this.StatusMultiStepTest()}
                <br />
                {this.InputPercentageTest()}
                <br />
                {this.InputCurrencyTest()}
                <br />
                {this.InputPhoneTest()}
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
export const TestPage = connect(state2props, dispatch2props)(PageComponent);
