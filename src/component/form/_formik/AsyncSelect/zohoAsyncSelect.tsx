import React from 'react';
import { Field, FieldProps } from 'formik';
import {
    ZohoFormElementBase,
    IZohoFormElementBaseProps,
} from '../FormElementBase/ZohoFormElementBase';
import Async from 'react-select/async';
import { Props, AsyncProps } from 'react-select/src/Async'; // , AsyncProps
import { APP_FORM_CONTROL } from '../FormControl/FormControl';

export interface IProps<T>
    extends Omit<Props<any>, 'name'>,
        AsyncProps<any>,
        IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.ASYNCSELECT;
    // loadOptions:()=>any;
    // isClearable:boolean;
}

export class ZohoInputAsyncSelect<T> extends ZohoFormElementBase<T, IProps<T>> {
    protected fieldRender() {
        const { name, icon, ...rest } = this.props;

        return (
            <>
                {icon}
                <Field name={name} {...rest}>
                    {/* {({ form, field }: FieldProps<{ label: string, value: string }, T>) => { */}
                    {({ form, field }: FieldProps<any, T>) => {
                        const { setFieldValue, setFieldTouched } = form;
                        const { value } = field;

                        return (
                            <Async
                                // id={this.id}
                                inputId={this.id}
                                // className="basic-multi-select"
                                // classNamePrefix="select"
                                // loadOptions
                                // {...field}
                                {...rest}
                                onChange={(v) => {
                                    if (v === undefined) {
                                        v = null;
                                    }

                                    if (this.props.onChange)
                                        this.props.onChange(v);
                                    else setFieldValue(name as string, v);
                                }}
                                value={value}
                                // onBlur={field.onBlur}
                                onBlur={() => {
                                    // debugger;
                                    setFieldTouched(name as string, true);
                                }}
                            />
                        );
                    }}
                </Field>
            </>
        );
    }
    render() {
        return (
            <div className={`${this.wrapperClassName()} zoho-select-input`}>
                {this.InputRender()}
            </div>
        );
    }
}
