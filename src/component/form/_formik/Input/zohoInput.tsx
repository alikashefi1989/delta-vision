import React from 'react';
import { Field, FieldInputProps } from 'formik';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import {
    ZohoFormElementBase,
    IZohoFormElementBaseProps,
} from '../FormElementBase/ZohoFormElementBase';

export interface IProps<T>
    extends Partial<Omit<FieldInputProps<any>, 'name'>>,
        Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
        IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.INPUT;
    controlsize?: 'sm' | 'lg';
}

export class ZohoInput<T> extends ZohoFormElementBase<T, IProps<T>> {
    private formControlClassName(): string {
        const size = this.props.controlsize
            ? ` form-control-${this.props.controlsize}`
            : '';
        return 'form-control' + size;
    }
    protected fieldRender() {
        const { name, labelClassName, icon, prevalue, ...rest } = this.props;

        return (
            <>
                {icon}
                {prevalue}
                <Field
                    className={this.formControlClassName()}
                    id={this.id}
                    name={name}
                    {...rest}
                />
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
