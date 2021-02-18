import React, { Fragment } from 'react';
import { Field, FieldArray, FieldInputProps, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL, FormControl } from '../FormControl/FormControl';
// import { ILanguage } from '../../../../model/language.model';
import { Localization } from '../../../../config/localization/localization';
import { IPhoneLabel } from '../../../../model/phoneLabel.model';

export interface IProps<T> extends
    Partial<Omit<FieldInputProps<any>, 'name'>>,
    Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
    IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.PHONE_LIST;
    // defaultValue?: string;
    defaultlangcode: string;
    // languagelist: Array<ILanguage>;
    // value: Array<{ [key: string]: string }>
    itemlabel?: string;
    loadoptions: (searchKey?: any, limit?: number, skip?: number,) => Promise<Array<IPhoneLabel>>;
    loadoptionsdebouncetime: number;
    searchlimit: number;
    searchskip: number;
}

export class PhoneList<T> extends FormElementBase<T, IProps<T>>{

    private setTimeout_options_val: any;
    debounce(inputValue: any, callBack: any) {
        if (this.setTimeout_options_val) {
            clearTimeout(this.setTimeout_options_val);
        }
        this.setTimeout_options_val = setTimeout(() => {
            this.promiseOptions(inputValue, callBack);
        }, this.props.loadoptionsdebouncetime);
    }

    async promiseOptions(searchKey: any, callBack: any) {
        try {
            let res: Array<IPhoneLabel> = await this.props.loadoptions(searchKey, this.props.searchlimit, this.props.searchskip);
            let options = res.map((option: IPhoneLabel) => {
                return {
                    label: (option.title && typeof option.title[this.props.defaultlangcode] === 'string')
                        ?
                        option.title[this.props.defaultlangcode]
                        :
                        '',
                    value: option,
                }
            });
            callBack(options);
        } catch (error) {
            callBack();
        }
    }

    protected fieldRender() {
        const { name, ...rest } = this.props;
        return <>
            <Field name={name} {...rest}>
                {({ form, field }: FieldProps<Array<
                    {
                        number: string;
                        type: {
                            id: string;
                            style?: { [key: string]: string };
                            title?: { [key: string]: string; };
                        }
                    }
                >, T>) => {
                    const { value } = field;
                    return <>
                        <FieldArray name={name as string}>
                            {arrayHelpers => <>
                                {value.map((attr, index) => (<Fragment key={index}>
                                    <div className="row">
                                        <div className="col-3">
                                            <FormControl
                                                control={APP_FORM_CONTROL.ASYNCSELECT}
                                                name={`${name}[${index}][type]`}
                                                placeholder={Localization.type}
                                                label={Localization.type}
                                                required
                                                // isClearable={true}
                                                loadOptions={(inputValue: string, callback: (options: any) => void) => this.debounce(inputValue, callback)}
                                                defaultOptions
                                            />
                                        </div>
                                        <div className="col-8">
                                            <FormControl
                                                {...rest}
                                                control={APP_FORM_CONTROL.INPUT}
                                                name={`${name}[${index}][number]`}
                                                label={`${this.props.itemlabel || ''} ${index + 1}`}
                                                placeholder={`${this.props.itemlabel || ''} ${index + 1}`}
                                                required
                                                value={attr.number}
                                                defaultValue={attr.number}
                                            />
                                        </div>
                                        <div className="col-1 text-right">
                                            <label className="d-block text-transparent">.</label>
                                            <button
                                                type="button"
                                                onClick={() => arrayHelpers.remove(index)}
                                                className="btn btn-circles-- btn-danger btn-xs icon-only rounded-circle mt-1"
                                            ><i className="fa fa-minus"></i></button>
                                        </div>
                                    </div>
                                </Fragment>))}
                                <div className="row">
                                    <div className="col-12">
                                        <button type="button"
                                            onClick={() => arrayHelpers.push({})}
                                            className="btn btn-circle btn-success btn-xs"
                                        ><i className="fa fa-plus"></i></button>
                                    </div>
                                </div>
                            </>}
                        </FieldArray>
                    </>
                }}
            </Field>
        </>
    }

    protected errorRender() {
        return <></>;
    }
}
