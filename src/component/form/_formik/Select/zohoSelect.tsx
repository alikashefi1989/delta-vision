import React from 'react';
import { Field, FieldProps } from 'formik';
import ReactSelect from 'react-select';
import { Props } from 'react-select/src/Select';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import {
    IZohoFormElementBaseProps,
    ZohoFormElementBase,
} from '../FormElementBase/ZohoFormElementBase';

export interface IProps<T>
    extends Omit<Props, 'name'>,
        IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.SELECT;
}

export class ZohoSelect<T> extends ZohoFormElementBase<T, IProps<T>> {
    protected fieldRender() {
        const { name, icon, ...rest } = this.props;

        return (
            <>
                {icon}
                <Field name={name}>
                    {({
                        form,
                        field,
                    }: FieldProps<{ label: string; value: string }, T>) => {
                        const { setFieldValue, setFieldTouched } = form;
                        const { value } = field;

                        return (
                            <ReactSelect
                                // id={this.id}
                                inputId={this.id}
                                // className="basic-multi-select"
                                // classNamePrefix="select"
                                {...field}
                                {...rest}
                                // onChange2={(v) => {
                                //     // console.log('settigggggg', v);
                                //     if (v === null || v === undefined) { v = []; }
                                //     setFieldValue(name as string, v);
                                // }}
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
            <div className={`${this.wrapperClassName()} zoho-select-input `}>
                {this.InputRender()}
            </div>
        );
    }
}
