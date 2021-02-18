import React from 'react';
import { Field, FieldInputProps, FieldProps } from 'formik';
import {
    FilterFormElementBase,
    IFilterFormElementBaseProps,
} from '../FilterFormElementBase/FilterFormElementBase';
import { APP_FILTER_FORM_CONTROL } from '../FilterFormControl/FilterFormControl';
import ReactSelect from 'react-select';

export interface IProps<T>
    extends Partial<Omit<FieldInputProps<any>, 'name'>>,
        Partial<Omit<HTMLInputElement, 'name' | 'id' | 'readOnly' | 'value'>>,
        IFilterFormElementBaseProps<T> {
    control: APP_FILTER_FORM_CONTROL.FILTER_TEXT;
}

interface IState {}

enum OPERATOR {
    $regex = '$regex',
    $eq = '$eq',
    $ne = '$ne',
}
type IFilterTextValue = { [key in OPERATOR]?: string } & { $options?: string };
interface ISelectValue {
    label: string;
    value: OPERATOR;
}

export class FilterText<T> extends FilterFormElementBase<T, IProps<T>, IState> {
    private options: Array<ISelectValue> = [
        { label: 'contains', value: OPERATOR.$regex },
        { label: 'is', value: OPERATOR.$eq },
        { label: "isn't", value: OPERATOR.$ne },
    ];
    operators = Object.values(OPERATOR);
    private selectValueOnEmpty = this.options[0];

    private convertOuter2Inner(
        v?: IFilterTextValue
    ): { operator: ISelectValue; value: string } {
        if (!v) return { operator: this.selectValueOnEmpty, value: '' };
        const keys = Object.keys(v);
        const op = keys[0] as OPERATOR;
        if (this.operators.includes(op) && op in v)
            return {
                operator: this.options.find((itm) => itm.value === op)!,
                value: (v as any)[op],
            };
        return { operator: this.selectValueOnEmpty, value: '' };
    }
    private convertInner2Outer(
        o?: ISelectValue,
        v?: string
    ): IFilterTextValue | undefined {
        const operator = o ? o.value : this.selectValueOnEmpty.value;
        this.selectValueOnEmpty = o ? o : this.selectValueOnEmpty;
        if (!v) return;
        if (operator === OPERATOR.$regex)
            return { [operator]: v, $options: 'i' };
        else return { [operator]: v };
    }

    protected fieldRender() {
        const { name, controlClassName, ...rest } = this.props;
        return (
            <>
                <Field name={name} {...rest}>
                    {({ form, field }: FieldProps<IFilterTextValue, T>) => {
                        const { setFieldValue } = form;
                        const { value } = field;
                        const {
                            value: fieldValue,
                            operator: fieldOperator,
                        } = this.convertOuter2Inner(value);

                        return (
                            <div className="d-flex filter-elements-holder">
                                <ReactSelect
                                    className="app-select app-select-sm mr-3 min-w-100px"
                                    placeholder=""
                                    options={this.options}
                                    onChange={(
                                        v:
                                            | { label: string; value: number }
                                            | null
                                            | any
                                    ) => {
                                        const filterVal = this.convertInner2Outer(
                                            v,
                                            fieldValue
                                        );
                                        if (this.props.onChange)
                                            this.props.onChange(filterVal);
                                        else
                                            setFieldValue(
                                                name as string,
                                                filterVal
                                            );
                                    }}
                                    value={fieldOperator}
                                    components={{
                                        DropdownIndicator: () => (
                                            <>
                                                <i className="fa fa-caret-down pr-2"></i>
                                            </>
                                        ),
                                        IndicatorSeparator: () => null,
                                    }}
                                    menuPlacement="auto"
                                    isSearchable={false}
                                />
                                <div>
                                    <Field
                                        className={`form-control form-control-sm`}
                                        id={this.id}
                                        name={name}
                                        {...rest}
                                        onChange={(
                                            v: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            const inputVal = v.target.value;
                                            const filterVal = this.convertInner2Outer(
                                                fieldOperator,
                                                inputVal
                                            );
                                            if (this.props.onChange)
                                                this.props.onChange(filterVal);
                                            else
                                                setFieldValue(
                                                    name as string,
                                                    filterVal
                                                );
                                        }}
                                        value={fieldValue}
                                    />
                                </div>
                            </div>
                        );
                    }}
                </Field>
            </>
        );
    }
}
