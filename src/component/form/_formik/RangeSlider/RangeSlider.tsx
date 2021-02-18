import React from 'react';
import { Field, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import { Range } from "rc-slider";
import { RangeProps } from 'rc-slider';

export interface IProps<T> extends RangeProps, IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.RANGESLIDER;
}

export class RangeSlider<T> extends FormElementBase<T, IProps<T>>{
    protected fieldRender() {
        const { name, ...rest } = this.props;

        return <Field name={name}>
            {({ form, field }: FieldProps<[number,number], T>) => {
                const { setFieldValue } = form;
                const { value } = field;

                return (
                    <>
                        {/* <div className="justify-content-between d-flex"> */}
                        {/* <span>{this.props.name == "" ? 0 : values.Range2[0]}</span> */}
                        {/* {console.log(value)} */}
                        {/* <span className="flex-start">{value[1]}</span>
                            <span className="flex-end">{value[0]}</span> */}
                        {/* </div> */}

                        <Range
                            {...field}
                            {...rest}
                            onChange={(v) => {

                                // if (v === null || v === undefined) { v = []; }
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
