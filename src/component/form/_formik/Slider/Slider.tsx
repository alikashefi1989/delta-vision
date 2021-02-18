import React from 'react';
import { Field, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import RCslider, { SliderProps } from "rc-slider";

export interface IProps<T> extends SliderProps, IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.SLIDER;
}

export class Slider<T> extends FormElementBase<T, IProps<T>>{
    protected fieldRender() {
        const { name, ...rest } = this.props;

        return <Field name={name}>
            {({ form, field }: FieldProps<number, T>) => {
                const { setFieldValue } = form;
                const { value } = field;

                return (
                    <>
                        <RCslider
                            {...field}
                            {...rest}
                            onChange={(v) => {
                                // let converted = value;
                                // if (typeof value === "string")
                                // converted= parseFloat(value);
                                setFieldValue(name as string, v);
                            }}
                            value={value}
                        />
                    </>
                )
            }}
        </Field>
    }
}
