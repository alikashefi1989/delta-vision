import React from 'react';
import { FieldInputProps } from 'formik';
import {
    FormElementBase,
    FORM_ELEMENT_THEME,
    IFormElementBaseProps,
} from './FormElementBase';

// export enum FORM_ELEMENT_THEME {
//     DEFAULT = 'DEFAULT',
//     ZOHO = 'ZOHO',
// }
export interface IZohoFormElementBaseProps<T> extends IFormElementBaseProps<T> {
    // name: keyof T;
    // label?: string;
    // id?: string;
    // control: APP_FORM_CONTROL;
    // controlClassName?: string;
    // labelClassName?: string;
    // tooltip?: string;
    // required?: boolean;
    // readOnly?: boolean;
    // isRequired?: boolean;
    apptheme: FORM_ELEMENT_THEME.ZOHO;
    icon?: JSX.Element;
    prevalue?: JSX.Element;
    countryCode?: string;
}

export type TFieldProps<V> = {
    [P in keyof FieldInputProps<V>]?: FieldInputProps<V>[P];
};

export abstract class ZohoFormElementBase<
    T,
    P extends IZohoFormElementBaseProps<T>,
    S = {}
> extends FormElementBase<T, P, S> {
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
                }form-label-container text-truncate`}
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

    protected wrapperClassName(): string {
        const control = `app-${this.props.control}`;
        const controlClassName = this.props.controlClassName || '';
        const readOnly = this.readOnlyClassName();
        const iconClassName = this.props.icon ? 'zoho-icon-input' : '';
        const preValueClassName =
            this.props.prevalue || this.props.countryCode
                ? 'zoho-pre-value-input'
                : '';
        return `form-group ${control} ${controlClassName} ${readOnly} ${iconClassName} ${preValueClassName} zoho_input_theme`;
    }

    protected InputRender() {
        return (
            <>
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
            </>
        );
    }

    render() {
        return (
            <div className={this.wrapperClassName()}>{this.InputRender()}</div>
        );
    }
}
