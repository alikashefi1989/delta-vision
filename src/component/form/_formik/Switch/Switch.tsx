import React from 'react';
import { Field, FieldProps } from 'formik';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import Switch from 'react-switch';
import {
    IZohoFormElementBaseProps,
    ZohoFormElementBase,
} from '../FormElementBase/ZohoFormElementBase';

export interface IProps<T> extends IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.SWITCH;
}

export class SwitchToggle<T> extends ZohoFormElementBase<T, IProps<T>> {
    protected fieldRender() {
        const { name, ...rest } = this.props;

        return (
            <Field name={name}>
                {({ form, field }: FieldProps<any, T>) => {
                    const { setFieldValue } = form;
                    const { value } = field;

                    return (
                        <>
                            <Switch
                                {...field}
                                {...rest}
                                onChange={(v) =>
                                    setFieldValue(name as string, v)
                                }
                                checked={value}
                                className="react-switch"
                                uncheckedIcon={false}
                                checkedIcon={false}
                                // onColor="#86d3ff"
                                // onHandleColor="#2693e6"
                                // handleDiameter={30}
                            />
                        </>
                    );
                }}
            </Field>
        );
    }
    render() {
        return (
            <div className={`${this.wrapperClassName()} zoho-switch-input `}>
                {this.InputRender()}
            </div>
        );
    }
}
