import React from 'react';
import { Field, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import { RadioGroup } from "react-radio-group";

export interface IProps<T> extends IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.RADIOBUTTON;
}

export class RadioButton<T> extends FormElementBase<T, IProps<T>>{
    protected fieldRender() {
        const { name, ...rest } = this.props;

        return <Field name={name}>
            {({ form, field }: FieldProps<any, T>) => {
                const { setFieldValue } = form;
                const { value } = field;

                return (
                    <>
                        <RadioGroup
                            {...field}
                            {...rest}
                            selectedValue={value}
                            onChange={(v) => {
                                setFieldValue(name as string, v);
                            }}
                            value={value}
                        >

                        </RadioGroup>
                    </>
                )
            }}
        </Field>
    }
}
