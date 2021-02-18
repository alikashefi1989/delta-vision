import React from 'react';
import { Field } from 'formik';
import { TFieldProps } from '../FormElementBase/FormElementBase';
// import RCcheckBox, { Props } from "rc-checkbox";
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import {
    IZohoFormElementBaseProps,
    ZohoFormElementBase,
} from '../FormElementBase/ZohoFormElementBase';
// interface IFieldProps{
//     [p in keyof FieldInputProps]: any;
// }

// Omit<Props, 'name'>,
export interface IProps<T>
    extends Omit<TFieldProps<boolean>, 'name'>,
        IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.CHECKBOX;
    round?: boolean;
    indeterminate?: boolean;
    nativeStyle?: boolean;
    secondaryLabel?: string;
    secondaryLabelClassName?: string;
}

export class ZohoCheckBox<T> extends ZohoFormElementBase<T, IProps<T>> {
    private secondaryLabelRender() {
        if (this.props.secondaryLabel === undefined) return <></>;
        return (
            <label
                htmlFor={this.id}
                className={this.props.secondaryLabelClassName}
            >
                {this.props.secondaryLabel}
            </label>
        );
    }

    protected fieldRender() {
        const {
            name,
            round,
            indeterminate,
            nativeStyle,
            secondaryLabel,
            secondaryLabelClassName,
            controlClassName,
            ...rest
        } = this.props;
        return (
            <>
                <Field
                    className={`form-control-- app-checkbox${
                        round ? '-round' : ''
                    } ${indeterminate ? 'indeterminate' : ''} ${
                        nativeStyle ? 'native-style2' : ''
                    }`}
                    {...rest}
                    id={this.id}
                    name={name}
                    type="checkbox"
                    indeterminate={
                        typeof indeterminate === 'boolean'
                            ? indeterminate.toString()
                            : undefined
                    }
                />
                <label className="d-block" htmlFor={this.id}></label>
                {this.secondaryLabelRender()}
            </>
        );
    }

    // render() {
    //     return (
    //         <>
    //             <div className={`form-group app-${this.props.control} ${this.props.controlClassName || ''}`}>
    //                 {this.labelRender()}
    //                 {this.fieldRender()}
    //                 {this.errorRender()}
    //             </div>
    //         </>
    //     )
    // }

    render() {
        return (
            <div className={`${this.wrapperClassName()} zoho-checkbox-input `}>
                {this.labelRender()}
                <div className="form-content-container">
                    {
                        <div
                            className={`form-field-container d-inline-block ${
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
