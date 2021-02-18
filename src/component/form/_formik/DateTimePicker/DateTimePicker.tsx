import React from 'react';
import { Field, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import DatePicker from "react-datepicker";
import { ReactDatePickerProps } from "react-datepicker";
import { APP_FORM_CONTROL } from '../FormControl/FormControl';

export interface IProps<T> extends Omit<ReactDatePickerProps, 'name' | 'onChange'>, IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.DATE_TIME_PICKER;
    outerValue2Inner: (value: any) => string | undefined;
    innerValue2Outer: (value: Date | null) => any;
    onChange?: (v: any) => void
}

export class DateTimePicker<T> extends FormElementBase<T, IProps<T>>{

    protected fieldRender() {
        const { name, ...rest } = this.props;

        return <Field name={name}>
            {({ form, field }: FieldProps<any, T>) => {
                const { setFieldValue, setFieldTouched } = form;
                const { value } = field;

                return <div className="app-datepicker">
                    <DatePicker
                        {...field}
                        {...rest}
                        onChange={(v, event) => {
                            debugger
                            if (this.props.onChange) this.props.onChange(this.props.innerValue2Outer(v));
                            else setFieldValue(name as string, this.props.innerValue2Outer(v));
                        }}
                        value={this.props.outerValue2Inner(value)}
                        onBlur={() => {
                            setFieldTouched(name as string, true)
                        }}
                    />
                </div>
            }}
        </Field>
    }
}