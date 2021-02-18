import React from 'react';
import { Field, FieldInputProps } from 'formik';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import {
    IZohoFormElementBaseProps,
    ZohoFormElementBase,
} from '../FormElementBase/ZohoFormElementBase';

export interface IProps<T>
    extends Partial<Omit<FieldInputProps<any>, 'name'>>,
        Partial<
            Omit<HTMLTextAreaElement, 'name' | 'id' | 'readOnly' | 'value'>
        >,
        IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.TEXTAREA;
    rows?: number;
}

export class ZohoTextarea<T> extends ZohoFormElementBase<T, IProps<T>> {
    protected fieldRender() {
        const { name, isRequired, icon, ...rest } = this.props;

        return (
            <>
                {icon}
                <Field
                    className="form-control"
                    id={this.id}
                    name={this.props.name}
                    as="textarea"
                    rows={this.props.rows}
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
