import React from 'react';
import { Field, FieldInputProps, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import { ILanguage } from '../../../../model/language.model';
import { AttibuteInputModal } from './AttributeInputModal';
import { Localization } from '../../../../config/localization/localization';

export interface IProps<T> extends
    Partial<Omit<FieldInputProps<any>, 'name'>>,
    Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
    IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.ATTRIBUTE_INPUT;
    // defaultValue?: string;
    defaultlangcode: string;
    languagelist: Array<ILanguage>;
}

interface IState {
    modalShow: boolean;
}

export class AttributeInput<T> extends FormElementBase<T, IProps<T>, IState>{
    state = { modalShow: false };

    private showModal() { this.setState({ modalShow: true }); }
    private hideModal() { this.setState({ modalShow: false }); }

    protected readOnlyClassName(): string {
        return this.props.readOnly ? 'app-readOnly' : '';
    }
    private readOnlyDisableClassName(): string {
        return this.props.readOnly ? 'pointer-events-none' : '';
    }
    protected labelRender() {
        return <>
            {super.labelRender()}
            <small className="ml-2--">({this.props.defaultlangcode})</small>
            <i className="fa fa-language ml-2 text-info cursor-pointer"
                onClick={() => this.showModal()}
            ></i>
        </>;
    }

    protected fieldRender() {
        const { name, ...rest } = this.props;
        return <>
            <Field name={name} {...rest}>
                {({ form, field }: FieldProps<{ name: { [key: string]: string }, value: { [key: string]: string } }, T>) => {

                    const { setFieldValue } = form;
                    const { value } = field;
                    const thisFieldNameVal = value.name[this.props.defaultlangcode] || '';
                    const thisFieldValueVal = value.value[this.props.defaultlangcode] || '';
                    // debugger
                    return <>
                        <div className="row">
                            <div className="col-6">
                                <Field
                                    className={`form-control ${this.readOnlyDisableClassName()}`} id={this.id + '-Field-1'} name={name} {...rest}
                                    onChange={(v: React.ChangeEvent<HTMLInputElement>) => {
                                        // debugger
                                        const inputNameVal = v.target.value;
                                        const multiLangVal = { ...value, name: { ...value.name, [this.props.defaultlangcode]: inputNameVal } }

                                        if (this.props.onChange) this.props.onChange(multiLangVal);
                                        else setFieldValue(name as string, multiLangVal);
                                    }}
                                    value={thisFieldNameVal}
                                    placeholder={Localization.name}
                                />
                            </div>
                            <div className="col-6">
                                <Field
                                    className={`form-control ${this.readOnlyDisableClassName()}`} id={this.id + '-Field-2'} name={name} {...rest}
                                    onChange={(v: React.ChangeEvent<HTMLInputElement>) => {
                                        // debugger
                                        const inputValueVal = v.target.value;
                                        const multiLangVal = { ...value, value: { ...value.value, [this.props.defaultlangcode]: inputValueVal } }

                                        if (this.props.onChange) this.props.onChange(multiLangVal);
                                        else setFieldValue(name as string, multiLangVal);
                                    }}
                                    value={thisFieldValueVal}
                                    placeholder={Localization.value}
                                />
                            </div>
                        </div>
                        <AttibuteInputModal
                            languagelist={this.props.languagelist}
                            defaultlangcode={this.props.defaultlangcode}
                            show={this.state.modalShow}
                            onHide={() => this.hideModal()}
                            onConfirm={(v) => {
                                if (this.props.onChange) this.props.onChange(v);
                                else setFieldValue(name as string, v);
                                this.hideModal();
                            }}
                            value={value}
                            readOnly={this.props.readOnly}
                        />
                    </>
                }}
            </Field>
        </>
    }
}
