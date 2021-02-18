import React from 'react';
import { ErrorMessage, FieldInputProps } from 'formik';
import { TextError } from '../../TextError/TextError';
import { APP_FILTER_FORM_CONTROL } from '../FilterFormControl/FilterFormControl';

export interface IFilterFormElementBaseProps<T> {
    name: keyof T;
    label?: string;
    id?: string;
    control: APP_FILTER_FORM_CONTROL;
    controlClassName?: string;
    labelClassName?: string;
    tooltip?: string;
    // required?: boolean;
    // readOnly?: boolean;
}

export type TFieldProps<V> = {
    [P in keyof FieldInputProps<V>]?: FieldInputProps<V>[P];
}

export abstract class FilterFormElementBase<T, P extends IFilterFormElementBaseProps<T>, S = {}> extends React.Component<P, S>{
    protected id = this.props.id || this.props.name as string;

    protected labelRender() {
        if (!this.props.label) return <></>;
        return <label
            className={`${this.props.labelClassName || ''}`}
            htmlFor={this.id}
        >
            {this.props.label}
            {/* {this.props.required ? <span className="text-danger"> *</span> : <></>} */}
        </label>
    }

    protected errorRender() {
        return <ErrorMessage component={TextError} name={this.props.name as string} />
    }

    protected abstract fieldRender(): JSX.Element;

    // protected readOnlyClassName(): string {
    //     return this.props.readOnly ? 'app-readOnly pointer-events-none' : '';
    // }
    protected wrapperClassName(): string {
        const control = `app-${this.props.control}`;
        const controlClassName = this.props.controlClassName || '';
        // const readOnly = this.readOnlyClassName();
        return `form-group mb-2 ${control} ${controlClassName}`;
    }

    render() {
        return (
            <>
                <div className={this.wrapperClassName()}>
                    {this.labelRender()}
                    {this.fieldRender()}
                    {/* {this.errorRender()} */}
                </div>
            </>
        )
    }
}
