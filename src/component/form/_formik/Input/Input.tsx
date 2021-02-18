import React from 'react';
import { Field, FieldInputProps } from 'formik';
import {
    FormElementBase,
    IFormElementBaseProps,
} from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';

export interface IProps<T>
    extends Partial<Omit<FieldInputProps<any>, 'name'>>,
        Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
        IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.INPUT;
    controlsize?: 'sm' | 'lg';
}

export class Input<T> extends FormElementBase<T, IProps<T>> {
    private formControlClassName(): string {
        const size = this.props.controlsize
            ? ` form-control-${this.props.controlsize}`
            : '';
        return 'form-control' + size;
    }
    protected fieldRender() {
        const { name, isRequired, labelClassName, ...rest } = this.props;

        return (
            <Field
                className={this.formControlClassName()}
                id={this.id}
                name={name}
                {...rest}
            />
        );
    }
}
