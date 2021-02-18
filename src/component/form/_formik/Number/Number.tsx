import React from 'react';
import { Field } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';

export interface IProps<T> extends IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.NUMBER;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
}

export class Number<T> extends FormElementBase<T, IProps<T>>{
    protected fieldRender() {
        const { name, ...rest } = this.props;
        return <Field className="form-control" {...rest} id={this.id} name={name} type="number"
        // onChange={(e:any) => {
        //     // debugger;
        // }}
        />
        // return <Field name={name}>
        //     {({ form, field }: FieldProps<number, T>) => {
        //         const { setFieldValue } = form;
        //         const { value } = field;

        //         return <Field className="form-control" {...rest} id={this.id} name={name} type="number"
        //             onChange={(e: any) => {
        //                 debugger;
        //                 let v = e.target.value;
        //                 if (v === null || v === undefined) { v = undefined; }
        //                 setFieldValue(name as string, parseInt(v));
        //             }}
        //             value={value}
        //         />
        //     }}
        // </Field>
    }
}
