import React, { SyntheticEvent } from 'react';
import { Field, FieldProps } from 'formik';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import {
    IZohoFormElementBaseProps,
    ZohoFormElementBase,
} from '../FormElementBase/ZohoFormElementBase';
import parsePhoneNumber from 'libphonenumber-js';

export interface IProps<T> extends IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.PHONE_NUMBER;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    controlsize?: 'sm' | 'lg';
    countryCode: string;
}

export class ZohoPhoneNumberInput<T> extends ZohoFormElementBase<T, IProps<T>> {
    private formControlClassName(): string {
        const size = this.props.controlsize
            ? ` form-control-${this.props.controlsize}`
            : '';
        return 'form-control' + size;
    }

    state = {
        formValue: '',
    };

    protected fieldRender() {
        const { name, icon, countryCode, ...rest } = this.props;
        return (
            <>
                <p className="small m-0 text-center zoho-pre-value">
                    {countryCode}
                </p>
                <Field id={this.id} name={name}>
                    {({ field, form }: FieldProps<any, T>) => {
                        const { setFieldValue } = form;
                        return (
                            <Field
                                className={this.formControlClassName()}
                                type="text"
                                {...rest}
                                {...field}
                                value={this.state.formValue}
                                onChange={(
                                    e: SyntheticEvent<HTMLInputElement>
                                ) => {
                                    console.log(form);
                                    const phone = e.currentTarget.value;
                                    const phoneNumber = parsePhoneNumber(
                                        countryCode + phone
                                    );
                                    if (phoneNumber) {
                                        setFieldValue(
                                            name as string,
                                            phoneNumber.number
                                        );
                                        this.setState({
                                            formValue: phoneNumber.formatNational(),
                                        });
                                    } else {
                                        setFieldValue(name as string, phone);
                                        this.setState({ formValue: phone });
                                    }
                                }}
                            />
                        );
                    }}
                </Field>
            </>
        );
    }

    render() {
        return (
            <div className={`${this.wrapperClassName()} zoho-simple-input `}>
                {this.InputRender()}
            </div>
        );
    }
}
