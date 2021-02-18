import React from 'react';
import { Field, FieldProps } from 'formik';
import { FilterFormElementBase, IFilterFormElementBaseProps } from '../FilterFormElementBase/FilterFormElementBase';
import { APP_FILTER_FORM_CONTROL } from '../FilterFormControl/FilterFormControl';
import ReactSelect from "react-select";
import { Localization } from '../../../../../config/localization/localization';

export interface IProps<T> extends
    // Partial<Omit<FieldInputProps<any>, 'name'>>,
    // Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
    IFilterFormElementBaseProps<T> {
    control: APP_FILTER_FORM_CONTROL.FILTER_NUMBER;
    onChange?: (v: IFilterNumberValue | undefined) => void;
}

interface IState { }

enum OPERATOR {
    $lt = '$lt',
    $between = '$between',
    $gt = '$gt',
}

type IFilterNumberValue = { [key in OPERATOR]?: number }
interface ISelectValue { label: string; value: OPERATOR }

export class FilterNumber<T> extends FilterFormElementBase<T, IProps<T>, IState>{

    private opreatorOptions: Array<ISelectValue> = [
        { label: "<", value: OPERATOR.$lt },
        { label: "between", value: OPERATOR.$between },
        { label: ">", value: OPERATOR.$gt },
    ];
    operators = Object.values(OPERATOR);
    private selectValueOnEmpty = this.opreatorOptions[0];


    private convertOuter2Inner(v?: IFilterNumberValue): { operator: ISelectValue, value: { from?: number, to?: number } } {
        if (!v) return { operator: this.selectValueOnEmpty, value: {} };
        const keys: Array<string> = Object.keys(v);
        // debugger
        if (keys.length > 1) {
            // debugger
            return {
                // operator: this.opreatorOptions.find(itm => itm.value === OPERATOR.$between)!,
                operator: this.selectValueOnEmpty,
                value: {
                    from: (v as any)[OPERATOR.$gt],
                    to: (v as any)[OPERATOR.$lt],
                }
            };
        } else {
            const op = keys[0] as OPERATOR;
            // debugger
            if (this.operators.includes(op) && op in v) {
                return {
                    // operator: this.opreatorOptions.find(itm => itm.value === op)!,
                    operator: this.selectValueOnEmpty,
                    value: {
                        from: op === OPERATOR.$gt ? (v as any)[op] : undefined,
                        to: op === OPERATOR.$lt ? (v as any)[op] : undefined,
                    }
                };
            }
            return { operator: this.selectValueOnEmpty, value: {} };
        }
    }

    private convertInner2Outer(o?: ISelectValue, v?: { from?: number, to?: number } | null): IFilterNumberValue | undefined {
        // debugger
        const operator = o ? o.value : this.selectValueOnEmpty.value;
        this.selectValueOnEmpty = o ? o : this.selectValueOnEmpty;
        // debugger
        if (!v || v === null) return;
        if (Object.keys(v).length === 0) return;
        const def = this.fieldDetectorByOpretor(operator, v);
        if (operator === OPERATOR.$between) {
            // debugger
            const gt = this.fieldDetectorByOpretor(OPERATOR.$gt, v);
            const lt = this.fieldDetectorByOpretor(OPERATOR.$lt, v);
            return {
                [OPERATOR.$gt]: gt,
                [OPERATOR.$lt]: lt
            }
        } else {
            return { [operator]: def };
        }
    }

    private fieldDetectorByOpretor(op: OPERATOR, v: { from?: number, to?: number, }): number | undefined {
        if (op === OPERATOR.$lt) {
            return v.to;
        } else {
            return v.from;
        }
    }

    private finalCheck(obj: IFilterNumberValue | undefined): IFilterNumberValue | undefined {
        // debugger
        if (obj === undefined) {
            return
        }
        let finalObj: IFilterNumberValue = {};
        let keys: Array<string> = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            let fieldName: OPERATOR = keys[i] as OPERATOR;
            if (typeof obj[fieldName] !== 'undefined' && obj[fieldName] !== undefined) {
                finalObj[fieldName] = obj[fieldName];
            }
        }
        if (Object.keys(finalObj).length === 0) {
            return;
        } else {
            return finalObj;
        }
    }


    protected fieldRender() {
        const { name, ...rest } = this.props;
        return <>
            <Field name={name} {...rest}>
                {({ form, field }: FieldProps<IFilterNumberValue, T>) => {
                    const { setFieldValue } = form;
                    const { value } = field;
                    const { operator: fieldOperator, value: fieldValue } = this.convertOuter2Inner(value);

                    // debugger;
                    return <div className="d-flex filter-elements-holder">
                        <ReactSelect
                            className="app-select app-select-sm mr-3 min-w-100px"
                            placeholder=""
                            options={this.opreatorOptions}
                            onChange={(v: ISelectValue | null | any) => {
                                const filterVal = this.convertInner2Outer(v, fieldValue);
                                // debugger
                                if (this.props.onChange) this.props.onChange(filterVal);
                                else setFieldValue(name as string, this.finalCheck(filterVal));
                            }}
                            value={fieldOperator}
                            components={{
                                DropdownIndicator: () => <><i className="fa fa-caret-down pr-2"></i></>,
                                IndicatorSeparator: () => null
                            }}
                            menuPlacement="auto"
                            isSearchable={false}
                        />
                        {
                            (fieldOperator.value === OPERATOR.$gt || fieldOperator.value === OPERATOR.$between)
                                ?
                                <div className={"app-datepicker w-100 " + (fieldOperator.value === OPERATOR.$between ? "mr-2" : '')}>
                                    <Field
                                        id={this.id}
                                        className="form-control"
                                        type="number"
                                        value={fieldValue.from === undefined ? '' : fieldValue.from}
                                        onChange={(e: any) => {
                                            let stringValue: string = typeof e.target.value === 'string' ? e.target.value : '';
                                            let numberValue: number | undefined = stringValue === '' ? undefined : Number(stringValue);
                                            fieldValue.from = stringValue === '' ? undefined : numberValue;
                                            const filterVal = this.convertInner2Outer(fieldOperator, fieldValue);
                                            if (this.props.onChange) this.props.onChange(filterVal);
                                            else setFieldValue(name as string, this.finalCheck(filterVal));

                                        }}
                                        placeholder={fieldOperator.value === OPERATOR.$between ? Localization.from : undefined}
                                    />
                                </div>
                                :
                                undefined
                        }
                        {
                            (fieldOperator.value === OPERATOR.$lt || fieldOperator.value === OPERATOR.$between)
                                ?
                                <div className={"app-datepicker w-100 " + (fieldOperator.value === OPERATOR.$between ? "ml-2" : '')}>
                                    <Field
                                        id={this.id}
                                        className="form-control"
                                        type="number"
                                        value={fieldValue.to === undefined ? '' : fieldValue.to}
                                        onChange={(e: any) => {
                                            let stringValue: string = typeof e.target.value === 'string' ? e.target.value : '';
                                            let numberValue: number | undefined = stringValue === '' ? undefined : Number(stringValue);
                                            fieldValue.to = stringValue === '' ? undefined : numberValue;
                                            const filterVal = this.convertInner2Outer(fieldOperator, fieldValue);
                                            if (this.props.onChange) this.props.onChange(filterVal);
                                            else setFieldValue(name as string, this.finalCheck(filterVal));
                                        }}
                                        placeholder={fieldOperator.value === OPERATOR.$between ? Localization.to : undefined}
                                    />
                                </div>
                                :
                                undefined
                        }
                    </div>
                }}
            </Field>
        </>
    }
}