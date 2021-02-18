import React from 'react';
import { Field } from 'formik';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import {
    IZohoFormElementBaseProps,
    ZohoFormElementBase,
} from '../FormElementBase/ZohoFormElementBase';

export interface IProps<T> extends IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.NUMBER;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    controlsize?: 'sm' | 'lg';
}

export class ZohoNumber<T> extends ZohoFormElementBase<T, IProps<T>> {
    private formControlClassName(): string {
        const size = this.props.controlsize
            ? ` form-control-${this.props.controlsize}`
            : '';
        return 'form-control' + size;
    }
    protected fieldRender() {
        const { name, icon, ...rest } = this.props;
        return (
            <>
                {icon}
                <Field
                    className={this.formControlClassName()}
                    id={this.id}
                    name={name}
                    type="number"
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
