import React, { Fragment } from 'react';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { Field, FieldArray, FieldProps, Formik, FormikProps } from "formik";
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import * as Yup from "yup";
import { ILanguage_schema } from '../../../redux/action/language/languageAction';
import { APP_FORM_CONTROL, FormControl } from '../../form/_formik/FormControl/FormControl';

export interface FieldFilterConfig {
    fieldName: string;
    fieldChildName?: string;
    fieldType: string | number | boolean | Array<string> | Array<number> | null;
    isFieldSelected: boolean;
    fieldLabel: string | JSX.Element;
    fieldPlaceholder: string;
    value: any;
    mongoOprator: {
        label: string; // mongo oprator label
        value: string; // mongo oprator value
    }
}

interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
    entityFilterConfig: Array<FieldFilterConfig>;
    useConfigChange: (config: Array<FieldFilterConfig>) => void;
    entityName: string;
}

interface IState {
    formData: { filter: Array<FieldFilterConfig> };
}

class FilterFormBuilderComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        formData: { filter: [] },
    };

    componentDidMount() {
        this.setState({ ...this.state, formData: { ...this.state.formData, filter: this.props.entityFilterConfig } });
    }

    componentDidUpdate(prevProps: Readonly<IProps>) {
        if (prevProps.entityFilterConfig === this.props.entityFilterConfig) {
            return;
        } else {
            this.setState({ ...this.state, formData: { ...this.state.formData, filter: this.props.entityFilterConfig } });
        }
    }

    componentWillUnmount() { }

    // private convertOut2In(config: Array<FieldFilterConfig>): IState['formData'] {
    //     let initialConfig: IState['formData'] = {};
    //     for (let i = 0; i < config.length; i++) {
    //         initialConfig[config[i].fieldName] = config[i];
    //     };
    //     return initialConfig;
    // }

    // private convertIn2Out(config: IState['formData']): Array<FieldFilterConfig> {
    //     let updatedConfig: Array<FieldFilterConfig> = [];
    //     let fields: Array<string> = Object.keys(config);
    //     for (let i = 0; i < fields.length; i++) {
    //         let fieldName: string = fields[i];
    //         let item: FieldFilterConfig = config[fieldName];
    //         updatedConfig.push(item);
    //     }
    //     return updatedConfig;
    // }

    private formValidation = Yup.object/* <IStoreForm> */({

        // phoneList: Yup.array().of(Yup.object(
        //     {
        //         number: Yup.string().required(Localization.validation.required_field).matches(AppRegex.internationalPhone, Localization.validation.phone_format),
        //         type: Yup.object().required(Localization.validation.required_field).test('have-id', Localization.validation.required_field, v => {
        //             if (v && v.value && v.value.id && typeof v.value.id === 'string') return true;
        //             return false;
        //         }),
        //     }
        // )),

        // name: Yup.object().test('fill-default-name', Localization.validation.required_field, v => {
        //     if (v[this.props.language.defaultLanguage?.code || '']) return true;
        //     return false;
        // }),
    });

    private formInputRender(formData: IState['formData']['filter']) {
        // const defaultLangCode = this.props.language.defaultLanguage?.code;
        const { ...rest } = this.props;
        return <>
            {
                <Field name={'filter'} {...rest}>
                    {({ form, field }: FieldProps<Array<FieldFilterConfig>>) => {
                        const { value } = field;
                        return <>
                            <FieldArray name='filter'>
                                {arrayHelpers => <>
                                    {value.map((attr, index) => (<Fragment key={index}>
                                        <div className="col-12">
                                            <div className="d-felex justify-content-between mb-1">
                                                <div className='d-inline-block'>
                                                    <FormControl
                                                        control={APP_FORM_CONTROL.CHECKBOX}
                                                        name={`filter[${index}][isFieldSelected]`}
                                                        // controlClassName='mb-0'
                                                    />
                                                </div>
                                                <div className='d-inline-block'>
                                                    <label className='text-capitalize font-weight-normal px-1'>{attr.fieldLabel}</label>
                                                </div>
                                            </div>
                                        </div>
                                        {attr.isFieldSelected && <div className="col-12">
                                            <FormControl
                                                control={APP_FORM_CONTROL.INPUT}
                                                name={`filter[${index}][value]`}
                                                placeholder={attr.fieldPlaceholder}
                                            />
                                        </div>}
                                    </Fragment>))}
                                </>}
                            </FieldArray>
                        </>
                    }}
                </Field>
            }
        </>
    }

    // any changed to dynamic model
    private actionBtnRender(formikProps: FormikProps<any>): JSX.Element {

        const { handleReset } = formikProps;

        return <div className="col-md-12 mt-2">
            <BtnLoader
                loading={false}
                btnClassName={"btn btn-info text-white mr-2"}
                disabled={false}
                onClick={() => this.props.useConfigChange(this.state.formData.filter)}
            > {'Apply Filter'}
            </BtnLoader>

            <button
                className="btn btn-light text-info"
                onClick={() => handleReset()}>
                {'Clear'}
            </button>
        </div>
    }

    private saveFormRender() {
        return <div className="template-box animated fadeInDown min-h-150px">
            <Formik
                initialValues={this.state.formData}
                onSubmit={() => { }}
                validationSchema={this.formValidation}
                enableReinitialize
            >
                {(formikProps) => (
                    <>
                        <div className="row p-2">
                            <div className="col-12">
                                <div className='d-flex justify-content-between my-1'>
                                    <h4 className=' text-secondary'>
                                        <span>Filter </span>
                                        {this.props.entityName}
                                        <span> by</span>
                                    </h4>
                                    <div className=''>
                                        <i className="fa fa-search text-secondary"></i>
                                    </div>
                                </div>
                            </div>
                            {this.formInputRender(this.state.formData.filter)}
                            {
                                !formikProps.dirty
                                    ?
                                    undefined
                                    :
                                    this.actionBtnRender(formikProps)
                            }
                        </div>
                    </>
                )}
            </Formik>
        </div>
    }

    render() {
        return (
            <>
                {this.saveFormRender()}
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
export const FilterFormBuilder = connect(state2props, dispatch2props)(FilterFormBuilderComponent);