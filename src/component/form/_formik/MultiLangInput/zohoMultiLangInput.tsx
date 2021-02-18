import React from 'react';
import { Field, FieldInputProps, FieldProps } from 'formik';
import {
    ZohoFormElementBase,
    IZohoFormElementBaseProps,
} from '../FormElementBase/ZohoFormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import { ILanguage } from '../../../../model/language.model';
import { MultiLangInputModal } from './MultiLangInputModal';

export interface IProps<T>
    extends Partial<Omit<FieldInputProps<any>, 'name'>>,
        Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
        IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.MULTILANGUAGE_INPUT;
    // defaultValue?: string;
    defaultlangcode: string;
    languagelist: Array<ILanguage>;
}

interface IState {
    modalShow: boolean;
}

export class ZohoMultiLangInput<T> extends ZohoFormElementBase<
    T,
    IProps<T>,
    IState
> {
    state = { modalShow: false };

    private showModal() {
        this.setState({ modalShow: true });
    }
    private hideModal() {
        this.setState({ modalShow: false });
    }

    protected readOnlyClassName(): string {
        return this.props.readOnly ? 'app-readOnly' : '';
    }
    private readOnlyDisableClassName(): string {
        return this.props.readOnly ? 'pointer-events-none' : '';
    }

    protected fieldRender() {
        const { name, labelClassName, ...rest } = this.props;
        return (
            <>
                <i
                    className="fa fa-language ml-2 text-info cursor-pointer"
                    onClick={() => this.showModal()}
                ></i>

                <Field name={name} {...rest}>
                    {({
                        form,
                        field,
                    }: FieldProps<{ [key: string]: string }, T>) => {
                        const { setFieldValue } = form;
                        const { value } = field;
                        const thisFieldValue =
                            value[this.props.defaultlangcode] || '';

                        return (
                            <>
                                <Field
                                    className={`form-control ${this.readOnlyDisableClassName()}`}
                                    id={this.id}
                                    name={name}
                                    {...rest}
                                    onChange={(
                                        v: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        const inputVal = v.target.value;
                                        const multiLangVal = {
                                            ...value,
                                            [this.props
                                                .defaultlangcode]: inputVal,
                                        };

                                        if (this.props.onChange)
                                            this.props.onChange(multiLangVal);
                                        else
                                            setFieldValue(
                                                name as string,
                                                multiLangVal
                                            );
                                    }}
                                    value={thisFieldValue}
                                />
                                <MultiLangInputModal
                                    languagelist={this.props.languagelist}
                                    defaultlangcode={this.props.defaultlangcode}
                                    show={this.state.modalShow}
                                    onHide={() => this.hideModal()}
                                    onConfirm={(v) => {
                                        if (this.props.onChange)
                                            this.props.onChange(v);
                                        else setFieldValue(name as string, v);
                                        this.hideModal();
                                    }}
                                    value={value}
                                    readOnly={this.props.readOnly}
                                />
                            </>
                        );
                    }}
                </Field>
            </>
        );
    }

    render() {
        return (
            <div className={`${this.wrapperClassName()} zoho-with-icon-input`}>
                {this.InputRender()}
            </div>
        );
    }
}
