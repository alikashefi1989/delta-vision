import React from 'react';
import { Field, FieldProps } from 'formik';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import {
    IZohoFormElementBaseProps,
    ZohoFormElementBase,
} from '../FormElementBase/ZohoFormElementBase';
import _ from 'lodash';

export interface IProps<T> extends IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.CURRENCY;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    controlsize?: 'sm' | 'lg';
    currency: string;
    initialValue?: string | number;
    min?: number;
    max?: number;
    onChange?: (e: any) => void;
}

export class ZohoCurreny<T> extends ZohoFormElementBase<T, IProps<T>> {
    private formControlClassName(): string {
        const size = this.props.controlsize
            ? ` form-control-${this.props.controlsize}`
            : '';
        return 'form-control' + size;
    }

    state = {
        inputValue: '',
    };

    componentDidMount() {
        if (!_.isNil(this.props.initialValue)) {
            this.setState({ inputValue: this.props.initialValue });
        }
    }
    protected fieldRender() {
        const { name, min, max, currency, ...rest } = this.props;

        return (
            <Field name={name} id={this.id}>
                {({ form, field }: FieldProps<any, T>) => {
                    const { setFieldValue } = form;
                    return (
                        <Field
                            className={this.formControlClassName()}
                            type="text"
                            {...rest}
                            {...field}
                            value={this.state.inputValue}
                            onChange={(e: any) => {
                                const inputElement: HTMLInputElement =
                                    e.currentTarget;
                                const inputValue: number = parseFloat(
                                    inputElement.value.replace(/\D/g, '')
                                );

                                if (
                                    (min && inputValue >= min) ||
                                    (max && inputValue <= max) ||
                                    Number.isNaN(inputValue)
                                ) {
                                    if (Number.isNaN(inputValue)) {
                                        setFieldValue(name as string, '0');
                                        this.setState({
                                            inputValue: '0',
                                        });
                                    } else {
                                        setFieldValue(
                                            name as string,
                                            inputValue
                                        );
                                        this.setState({
                                            inputValue:
                                                inputValue + ' ' + currency,
                                        });
                                    }
                                }

                                // When user inserted onChange
                                if (this.props.onChange) {
                                    if (Number.isNaN(inputValue)) {
                                        this.props.onChange(0);
                                    } else {
                                        this.props.onChange(inputValue);
                                    }
                                }
                            }}
                        />
                    );
                }}
            </Field>
        );
    }

    render() {
        return (
            <div className={`${this.wrapperClassName()} zoho-simple-input `}>
                {this.InputRender()}
            </div>
        );
    }
}
