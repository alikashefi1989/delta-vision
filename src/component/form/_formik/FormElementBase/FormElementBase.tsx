import React from 'react';
import { ErrorMessage, FieldInputProps } from 'formik';
import { TextError } from '../TextError/TextError';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';

export enum FORM_ELEMENT_THEME {
    DEFAULT = 'DEFAULT',
    ZOHO = 'ZOHO',
}
export interface IFormElementBaseProps<T> {
    name: keyof T;
    label?: string;
    id?: string;
    control: APP_FORM_CONTROL;
    controlClassName?: string;
    labelClassName?: string;
    tooltip?: string;
    required?: boolean;
    readOnly?: boolean;
    isRequired?: boolean;
    apptheme?: FORM_ELEMENT_THEME;
}

export type TFieldProps<V> = {
    [P in keyof FieldInputProps<V>]?: FieldInputProps<V>[P];
};

export abstract class FormElementBase<
    T,
    P extends IFormElementBaseProps<T>,
    S = {}
> extends React.Component<P, S> {
    protected id = this.props.id || (this.props.name as string);
    static defaultProps = {
        apptheme: FORM_ELEMENT_THEME.DEFAULT,
    };
    protected labelRender() {
        if (!this.props.label) return <></>;
        return (
            <label
                className={`${
                    this.props.labelClassName || ''
                }form-label-container`}
                htmlFor={this.id}
            >
                {this.props.label}
                {this.props.required ? (
                    <span className="text-danger"> *</span>
                ) : (
                    <></>
                )}
            </label>
        );
    }

    protected errorRender() {
        return (
            <ErrorMessage
                component={TextError}
                name={this.props.name as string}
            />
        );
    }

    protected abstract fieldRender(): JSX.Element;

    protected readOnlyClassName(): string {
        return this.props.readOnly ? 'app-readOnly pointer-events-none' : '';
    }
    protected wrapperClassName(): string {
        const control = `app-${this.props.control}`;
        const controlClassName = this.props.controlClassName || '';
        const readOnly = this.readOnlyClassName();
        return `form-group ${control} ${controlClassName} ${readOnly}`;
    }

    render() {
        return (
            <div className={this.wrapperClassName()}>
                {this.labelRender()}
                {this.fieldRender()}
                {this.errorRender()}
            </div>
        );
    }
}
