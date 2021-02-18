import React, { Fragment } from 'react';
import { Field, FieldArray, FieldInputProps, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL, FormControl } from '../FormControl/FormControl';
import { IVariation, IVariationItem } from '../../../../model/variation.model';

export interface IProps<T> extends
    Partial<Omit<FieldInputProps<any>, 'name'>>,
    Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
    IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.SKU_LIST; // modify
    defaultlangcode: string;
    variationLabel?: string;
    itemlabel?: string;
    loadoptionsdebouncetime: number;
    loadoptions: (callback: any, searchKey?: any) => Promise<void>;
}

export class SkuList<T> extends FormElementBase<T, IProps<T>>{

    private setTimeout_options_val: any;
    debounce(inputValue: any, callBack: any) {
        if (this.setTimeout_options_val) {
            clearTimeout(this.setTimeout_options_val);
        }
        this.setTimeout_options_val = setTimeout(() => {
            this.props.loadoptions(callBack, inputValue);
        }, this.props.loadoptionsdebouncetime);
    }

    protected convertVariationItems2LabelValue(variation: { label: string, value: IVariation } | null): Array<{ label: string; value: IVariationItem }> {
        if (variation === null) {
            return [];
        } else {
            let options: Array<{ label: string; value: IVariationItem }> = [];
            if (variation.value.items && variation.value.items.length) {
                let variationItems: Array<{ label: string; value: IVariationItem }> = variation.value.items.map((item: IVariationItem) => {
                    return {
                        label: item.name[this.props.defaultlangcode] || '',
                        value: item,
                    }
                });
                if (variationItems.length) {
                    options = variationItems;
                }
            }
            return options;
        }
    }

    protected fieldRender() {
        const { name, ...rest } = this.props;
        return <>
            <Field name={name} {...rest}>
                {({ form, field }: FieldProps<Array<
                    {
                        variation: { label: string, value: IVariation } | null;
                        variationAllItems: Array<{ label: string; value: IVariationItem }>;
                        variationSelectedItems: Array<{ label: string; value: IVariationItem } | null>;
                    }
                >, T>) => {
                    const { value } = field;
                    const { setFieldValue } = form;
                    return <>
                        <FieldArray name={name as string}>
                            {arrayHelpers => <>
                                {value.map((attr, index) => (<Fragment key={index}>
                                    <div className="row">
                                        <div className="col-4">
                                            <FormControl
                                                control={APP_FORM_CONTROL.ASYNCSELECT}
                                                name={`${name}[${index}][variation]`}
                                                placeholder={this.props.variationLabel}
                                                label={this.props.variationLabel}
                                                required
                                                isMulti={false}
                                                // isClearable={true}
                                                loadOptions={(inputValue: string, callback: (options: any) => void) => this.debounce(inputValue, callback)}
                                                defaultOptions
                                                onChange={(val: any) => {
                                                    setFieldValue(`${name}[${index}]`, {
                                                        variation: val,
                                                        variationAllItems: this.convertVariationItems2LabelValue(val),
                                                        variationSelectedItems: [],
                                                    });
                                                    // setFieldValue(`${name}[${index}][variation]`, val);
                                                    // setFieldValue(`${name}[${index}][variationAllItems]`,
                                                    //     this.convertVariationItems2LabelValue(val));
                                                    // setFieldValue(`${name}[${index}][variationSelectedItems]`, null);
                                                    // console.log(val)
                                                }}
                                            />
                                        </div>
                                        <div className="col-7">
                                            <FormControl
                                                control={APP_FORM_CONTROL.SELECT}
                                                name={`${name}[${index}][variationSelectedItems]`}
                                                placeholder={this.props.itemlabel}
                                                label={this.props.itemlabel}
                                                isMulti={true}
                                                required
                                                // isClearable={true}
                                                options={value[index].variationAllItems}
                                                onChange={(val: any) => {
                                                    setFieldValue(`${name}[${index}][variationSelectedItems]`, val)
                                                    // console.log(val)
                                                }}
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
                                            onClick={() => arrayHelpers.push(
                                                {
                                                    variation: null,
                                                    variationAllItems: [],
                                                    variationSelectedItems: []
                                                }
                                            )}
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
