import React from 'react';
import { Field, FieldProps } from 'formik';
import DatePicker from 'react-datepicker';
import { ReactDatePickerProps } from 'react-datepicker';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import {
    IZohoFormElementBaseProps,
    ZohoFormElementBase,
} from '../FormElementBase/ZohoFormElementBase';

export interface IProps<T>
    extends Omit<ReactDatePickerProps, 'name' | 'onChange'>,
        IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.DATE_TIME_PICKER;
    outerValue2Inner: (value: any) => string | undefined;
    innerValue2Outer: (value: Date | null) => any;
    onChange?: (v: any) => void;
}

export class ZohoDateTimePicker<T> extends ZohoFormElementBase<T, IProps<T>> {
    protected fieldRender() {
        const { name, icon, ...rest } = this.props;

        return (
            <>
                {icon}
                <Field name={name}>
                    {({ form, field }: FieldProps<any, T>) => {
                        const { setFieldValue, setFieldTouched } = form;
                        const { value } = field;

                        return (
                            <div className="app-datepicker">
                                <DatePicker
                                    {...field}
                                    {...rest}
                                    onChange={(v, event) => {
                                        debugger;
                                        if (this.props.onChange)
                                            this.props.onChange(
                                                this.props.innerValue2Outer(v)
                                            );
                                        else
                                            setFieldValue(
                                                name as string,
                                                this.props.innerValue2Outer(v)
                                            );
                                    }}
                                    value={this.props.outerValue2Inner(value)}
                                    onBlur={() => {
                                        setFieldTouched(name as string, true);
                                    }}
                                />
                            </div>
                        );
                    }}
                </Field>
            </>
        );
    }
    render() {
        return (
            <div
                className={`${this.wrapperClassName()} zoho-select-input zoho_input_theme`}
            >
                {this.labelRender()}
                <div className="form-content-container">
                    {
                        <div
                            className={`form-field-container ${
                                this.props.required
                                    ? 'form-field-isRequired'
                                    : ''
                            }`}
                        >
                            {this.fieldRender()}
                        </div>
                    }
                    {this.errorRender()}
                </div>
            </div>
        );
    }
}
