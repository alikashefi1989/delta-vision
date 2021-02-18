import React from 'react';
import { Field, FieldInputProps } from 'formik';
import {
    FormElementBase,
    IFormElementBaseProps,
} from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';

export interface IProps<T>
    extends Partial<Omit<FieldInputProps<any>, 'name'>>,
        Partial<
            Omit<HTMLTextAreaElement, 'name' | 'id' | 'readOnly' | 'value'>
        >,
        IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.TEXTAREA;
    rows?: number;
}

export class Textarea<T> extends FormElementBase<T, IProps<T>> {
    protected fieldRender() {
        const { name, isRequired, ...rest } = this.props;

        return (
            <Field
                className="form-control"
                id={this.id}
                name={this.props.name}
                as="textarea"
                rows={this.props.rows}
                {...rest}
            />
        );
    }
}
