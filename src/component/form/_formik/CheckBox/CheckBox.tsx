import React from 'react';
import { Field } from 'formik';
import { FormElementBase, IFormElementBaseProps, TFieldProps } from '../FormElementBase/FormElementBase';
// import RCcheckBox, { Props } from "rc-checkbox";
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
// interface IFieldProps{
//     [p in keyof FieldInputProps]: any;
// }

// Omit<Props, 'name'>,
export interface IProps<T> extends Omit<TFieldProps<boolean>, 'name'>, IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.CHECKBOX;
    round?: boolean;
    indeterminate?: boolean;
    nativeStyle?: boolean;
    secondaryLabel?: string;
    secondaryLabelClassName?: string;
}

export class CheckBox<T> extends FormElementBase<T, IProps<T>>{
    private secondaryLabelRender() {
        if (this.props.secondaryLabel === undefined) return <></>;
        return <label htmlFor={this.id} className={this.props.secondaryLabelClassName}>{this.props.secondaryLabel}</label>;
    }

    protected fieldRender() {
        const { name, round, indeterminate, nativeStyle, secondaryLabel, secondaryLabelClassName, controlClassName, ...rest } = this.props;
        return <>
            <Field className={`form-control-- app-checkbox${round ? '-round' : ''} ${indeterminate ? 'indeterminate' : ''} ${nativeStyle ? 'native-style2' : ''}`}
                {...rest}
                id={this.id}
                name={name}
                type="checkbox"
                indeterminate={typeof indeterminate === 'boolean' ? indeterminate.toString() : undefined}
            />
            <label className="d-block" htmlFor={this.id}></label>
            {this.secondaryLabelRender()}
        </>
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
}
