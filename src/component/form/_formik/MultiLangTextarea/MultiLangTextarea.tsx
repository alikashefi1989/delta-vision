import React from 'react';
import { Field, FieldInputProps, FieldProps } from 'formik';
import {
    FormElementBase,
    IFormElementBaseProps,
} from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import { ILanguage } from '../../../../model/language.model';
import { MultiLangTextareaModal } from './MultiLangTextareaModal';

export interface IProps<T>
    extends Partial<Omit<FieldInputProps<any>, 'name'>>,
        Partial<
            Omit<HTMLTextAreaElement, 'name' | 'id' | 'readOnly' | 'value'>
        >,
        IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.MULTILANGUAGE_TEXTAREA;
    // defaultValue?: string;
    defaultlangcode: string;
    languagelist: Array<ILanguage>;
    textareaRows?: number;
}

interface IState {
    modalShow: boolean;
}

export class MultiLangTextarea<T> extends FormElementBase<
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
    protected labelRender() {
        return (
            <>
                {super.labelRender()}
                <>
                    <small className="ml-2--">
                        ({this.props.defaultlangcode})
                    </small>
                    <i
                        className="fa fa-language ml-2 text-info cursor-pointer"
                        onClick={() => this.showModal()}
                    ></i>
                </>
            </>
        );
    }

    protected fieldRender() {
        const { name, isRequired, ...rest } = this.props;
        return (
            <>
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
                                        v: React.ChangeEvent<HTMLTextAreaElement>
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
                                    as="textarea"
                                    rows={this.props.textareaRows}
                                />
                                <MultiLangTextareaModal
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
                                    textareaRows={this.props.textareaRows}
                                />
                            </>
                        );
                    }}
                </Field>
            </>
        );
    }
}
