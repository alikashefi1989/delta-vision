import React from 'react';
import { Field, FieldProps } from 'formik';
import { FilterFormElementBase, IFilterFormElementBaseProps } from '../FilterFormElementBase/FilterFormElementBase';
import { APP_FILTER_FORM_CONTROL } from '../FilterFormControl/FilterFormControl';
import ReactSelect from "react-select";
import { Props } from 'react-select/src/Select';

export interface IProps<T> extends Omit<Props, 'name'>, IFilterFormElementBaseProps<T> {
    control: APP_FILTER_FORM_CONTROL.FILTER_SELECT;
    options: Array<{ label: string; value: any }>;
}

interface IState {
}

enum OPERATOR {
    $eq = '$eq',
    $ne = '$ne'
}

type IFilterSelectValue = { [key in OPERATOR]?: any; }
interface ISelectValue { label: string; value: OPERATOR }

export class FilterSelect<T> extends FilterFormElementBase<T, IProps<T>, IState>{

    private opreatorOptions: Array<ISelectValue> = [
        { label: 'is', value: OPERATOR.$eq },
        { label: "isn't", value: OPERATOR.$ne },
    ];

    operators = Object.values(OPERATOR);
    private selectValueOnEmpty = this.opreatorOptions[0];

    private convertOuter2Inner(v?: IFilterSelectValue): { operator: ISelectValue, value: { label: string, value: any } | null; } {
        // debugger
        if (!v) return { operator: this.selectValueOnEmpty, value: null };
        // debugger
        const keys = Object.keys(v);
        const op = keys[0] as OPERATOR;
        if (this.operators.includes(op) && op in v) {
            const val = (v as any)[op];
            return {
                operator: this.opreatorOptions.find(itm => itm.value === op)!,
                value: this.props.options.find(itm => itm.value === val)!
            };
        }
        return { operator: this.selectValueOnEmpty, value: null };
    }

    private convertInner2Outer(o?: ISelectValue, v?: { label: string, value: any } | null): IFilterSelectValue | undefined {
        const operator = o ? o.value : this.selectValueOnEmpty.value;
        this.selectValueOnEmpty = o ? o : this.selectValueOnEmpty;
        if (!v || v === null) return;
        return { [operator]: v.value };
    }

    protected fieldRender() {
        const { name, ...rest } = this.props;
        return <>
            <Field name={name} {...rest}>
                {({ form, field }: FieldProps<IFilterSelectValue, T>) => {
                    const { setFieldValue } = form;
                    const { value } = field;
                    const { operator: fieldOperator, value: fieldValue } = this.convertOuter2Inner(value);

                    return <div className="d-flex filter-elements-holder">
                        <ReactSelect
                            className="app-select app-select-sm mr-3 min-w-100px"
                            placeholder=""
                            options={this.opreatorOptions}
                            onChange={(v: { label: string, value: OPERATOR } | null | any) => {
                                const filterVal = this.convertInner2Outer(v, fieldValue);
                                if (this.props.onChange) this.props.onChange(filterVal);
                                else setFieldValue(name as string, filterVal);
                            }}
                            value={fieldOperator}
                            components={{
                                DropdownIndicator: () => <><i className="fa fa-caret-down pr-2"></i></>,
                                IndicatorSeparator: () => null
                            }}
                            menuPlacement="auto"
                            isSearchable={false}
                        />
                        <ReactSelect
                            {...field}
                            {...rest}
                            inputId={this.id}
                            className="app-select app-select-sm w-100"
                            isClearable
                            isMulti={false}
                            onChange={(v: any) => {
                                if (!v) { v = undefined; }
                                //  debugger
                                if (this.props.onChange) this.props.onChange(this.convertInner2Outer(fieldOperator, v));
                                else setFieldValue(name as string, this.convertInner2Outer(fieldOperator, v));
                            }}
                            value={fieldValue}
                            components={{
                                DropdownIndicator: () => <><i className="fa fa-caret-down pr-2"></i></>,
                                IndicatorSeparator: () => null
                            }}
                        />
                    </div>
                }}
            </Field>
        </>
    }
}