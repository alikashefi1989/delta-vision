import React, { Fragment } from 'react';
import { Field, FieldArray, FieldInputProps, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL, FormControl } from '../FormControl/FormControl';
import { Localization } from '../../../../config/localization/localization';
import { IVariationItem } from '../../../../model/variation.model';
import { ILanguage } from '../../../../model/language.model';

export interface IProps<T> extends
    Partial<Omit<FieldInputProps<any>, 'name'>>,
    Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
    IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.VARIATION_ITEMS_LIST;
    defaultlangcode: string;
    languagelist: Array<ILanguage>;
    itemlabel?: string;
}

export class VariationItemsList<T> extends FormElementBase<T, IProps<T>>{

    protected fieldRender() {
        const { name, ...rest } = this.props;
        return <>
            <Field name={name} {...rest}>
                {({ form, field }: FieldProps<Array<Omit<IVariationItem, 'id'>>, T>) => {
                    const { value } = field;
                    return <>
                        <FieldArray name={name as string}>
                            {arrayHelpers => <>
                                {value.map((attr, index) => (<Fragment key={index}>
                                    <div className="row">
                                        <div className="col-4">
                                            <FormControl
                                                control={APP_FORM_CONTROL.MULTILANGUAGE_INPUT}
                                                name={`${name}[${index}][name]`}
                                                placeholder={Localization.name}
                                                label={Localization.name}
                                                required
                                                defaultlangcode={this.props.defaultlangcode}
                                                languagelist={this.props.languagelist}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <FormControl
                                                {...rest}
                                                control={APP_FORM_CONTROL.TAG_SELECT}
                                                name={`${name}[${index}][values]`}
                                                label={`${this.props.itemlabel || ''} ${index + 1}`}
                                                placeholder={`${this.props.itemlabel || ''} ${index + 1}`}
                                                required
                                            />
                                        </div>
                                        <div className="col-1 text-right">
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
                                            onClick={() => arrayHelpers.push({ name: {}, values: [] })}
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
