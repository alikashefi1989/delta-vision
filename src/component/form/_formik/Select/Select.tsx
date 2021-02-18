import React from 'react';
import { Field, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import ReactSelect from "react-select";
import { Props } from 'react-select/src/Select';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';

export interface IProps<T> extends Omit<Props, 'name'>, IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.SELECT;

}

export class Select<T> extends FormElementBase<T, IProps<T>>{
    protected fieldRender() {
        const { name, ...rest } = this.props;

        return <Field name={name}>
            {({ form, field }: FieldProps<{ label: string, value: string }, T>) => {
                const { setFieldValue, setFieldTouched } = form;
                const { value } = field;

                return <ReactSelect
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
                        if (v === undefined) { v = null; }

                        if (this.props.onChange) this.props.onChange(v);
                        else setFieldValue(name as string, v);
                    }}
                    value={value}
                    // onBlur={field.onBlur}
                    onBlur={() => {
                        // debugger;
                        setFieldTouched(name as string, true)
                    }}
                />
            }}
        </Field>
    }
}
