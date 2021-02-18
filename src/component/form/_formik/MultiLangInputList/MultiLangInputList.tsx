import React, { Fragment } from 'react';
import { Field, FieldArray, FieldInputProps, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL, FormControl } from '../FormControl/FormControl';
import { ILanguage } from '../../../../model/language.model';

export interface IProps<T> extends
    Partial<Omit<FieldInputProps<any>, 'name'>>,
    Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
    IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.MULTILANGUAGE_INPUT_LIST;
    // defaultValue?: string;
    defaultlangcode: string;
    languagelist: Array<ILanguage>;
    // value: Array<{ [key: string]: string }>
    itemlabel?: string;
}

export class MultiLangInputList<T> extends FormElementBase<T, IProps<T>>{
    protected fieldRender() {
        const { name, ...rest } = this.props;
        return <>
            <Field name={name} {...rest}>
                {({ form, field }: FieldProps<Array<{ [key: string]: string }>, T>) => {
                    const { value } = field;

                    return <>
                        <FieldArray name={name as string}>
                            {arrayHelpers => <>
                                {value.map((attr, index) => (<Fragment key={index}>
                                    <div className="row">
                                        <div className="col-10">
                                            <FormControl
                                                {...rest}
                                                control={APP_FORM_CONTROL.MULTILANGUAGE_INPUT}
                                                name={`${name}[${index}]`}
                                                label={`${this.props.itemlabel || ''} ${index + 1}`}
                                                placeholder={`${this.props.itemlabel || ''} ${index + 1}`}
                                                required
                                            // defaultlangcode={this.props.defaultlangcode}
                                            // languagelist={this.props.languagelist}
                                            // value={attr as any}
                                            // defaultValue={attr as any}
                                            />
                                        </div>
                                        <div className="col-2 text-right">
                                            <label className="d-block text-transparent">.</label>
                                            <button
                                                type="button"
                                                onClick={() => arrayHelpers.remove(index)}
                                                className="btn btn-circles-- btn-danger btn-xs icon-only rounded-circle mt-1"
                                            ><i className="fa fa-minus"></i></button>
                                        </div>
                                    </div>
                                </Fragment>))}
                                <div className="row">
                                    <div className="col-12">
                                        <button type="button"
                                            onClick={() => arrayHelpers.push({})}
                                            className="btn btn-circle btn-success btn-xs"
                                        ><i className="fa fa-plus"></i></button>
                                    </div>
                                </div>
                            </>}
                        </FieldArray>
                    </>
                }}
            </Field>
        </>
    }

    protected errorRender() {
        return <></>;
    }
}
