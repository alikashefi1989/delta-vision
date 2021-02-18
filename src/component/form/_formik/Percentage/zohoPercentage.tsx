import React from 'react';
import { Field, FieldProps } from 'formik';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import {
    IZohoFormElementBaseProps,
    ZohoFormElementBase,
} from '../FormElementBase/ZohoFormElementBase';

export interface IProps<T> extends IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.PERCENTAGE;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    controlsize?: 'sm' | 'lg';
}

export class ZohoPercentage<T> extends ZohoFormElementBase<T, IProps<T>> {
    private formControlClassName(): string {
        const size = this.props.controlsize
            ? ` form-control-${this.props.controlsize}`
            : '';
        return 'form-control' + size;
    }
    protected fieldRender() {
        const { name, ...rest } = this.props;
        return (
            <Field name={name} id={this.id}>
                {({ form, field }: FieldProps<any, T>) => {
                    const { setFieldValue } = form;
                    return (
                        <Field
                            className={this.formControlClassName()}
                            type="text"
                            {...rest}
                            {...field}
                            onChange={(e: any) => {
                                const myString = e.currentTarget.value.replace(
                                    /\D/g,
                                    ''
                                );
                                if (myString === '') {
                                    setFieldValue(name as string, '');
                                } else {
                                    setFieldValue(
                                        name as string,
                                        '% ' + myString
                                    );
                                }
                            }}
                        />
                    );
                }}
            </Field>
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
