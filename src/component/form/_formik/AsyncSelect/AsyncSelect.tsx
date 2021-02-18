import React from 'react';
import { Field, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import Async from 'react-select/async';
// import { Props } from 'react-select/src/Select';
import { Props, AsyncProps } from 'react-select/src/Async'; // , AsyncProps
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
// import { TextError } from '../TextError/TextError';

export interface IProps<T> extends Omit<Props<any>, 'name'>, AsyncProps<any>, IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.ASYNCSELECT;
    // loadOptions:()=>any;
    // isClearable:boolean;
}

export class AsyncSelect<T> extends FormElementBase<T, IProps<T>>{
    protected fieldRender() {
        const { name, ...rest } = this.props;

        return <Field name={name} {...rest}>
            {/* {({ form, field }: FieldProps<{ label: string, value: string }, T>) => { */}
            {({ form, field }: FieldProps<any, T>) => {

                const { setFieldValue, setFieldTouched } = form;
                const { value } = field;

                return <Async
                    // id={this.id}
                    inputId={this.id}
                    // className="basic-multi-select"
                    // classNamePrefix="select"
                    // loadOptions
                    // {...field}
                    {...rest}

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

    // protected errorRender() {
    //     // return <span className="text-danger">
    //     //     <ErrorMessage name={this.props.name as string} />
    //     // </span>
    //     // const aa = TextError;
    //     // const bb = ErrorMessage;
    //     // console.log('000416541650');
    //     return <ErrorMessage component={TextError} name={this.props.name as string} />
    // }
}
