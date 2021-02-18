import React from 'react';
import { Field, FieldProps } from 'formik';
import { FilterFormElementBase, IFilterFormElementBaseProps } from '../FilterFormElementBase/FilterFormElementBase';
import { APP_FILTER_FORM_CONTROL } from '../FilterFormControl/FilterFormControl';
import ReactSelect from "react-select";
import AsyncSelect from 'react-select/async';
import { Props, AsyncProps } from 'react-select/src/Async';


export interface IProps<T> extends Omit<Props<any>, 'name'>, AsyncProps<any>, IFilterFormElementBaseProps<T> {
    control: APP_FILTER_FORM_CONTROL.FILTER_ASYNC_TAG;
    pureValue2MongoValue: (value: Array<{ label: string, value: any, val: any }>) => Array<any>;
    /* cant define below props because this is a async function and it's not usable in convertOuter2Inner function*/
    // mongoValue2PureValue: (value: Array<any>) => Promise<Array<{ label: string, value: any }>>
}

interface IState {
}

enum OPERATOR {
    $in = '$in',
    $nin = '$nin'
}

type IFilterAsyncTagValue = { [key in OPERATOR]?: Array<any>; }
interface ISelectValue { label: string; value: OPERATOR }

export class FilterAsyncTag<T> extends FilterFormElementBase<T, IProps<T>, IState>{

    private opreatorOptions: Array<ISelectValue> = [
        { label: 'Including', value: OPERATOR.$in },
        { label: "excluding", value: OPERATOR.$nin },
    ];

    operators = Object.values(OPERATOR);
    private selectValueOnEmpty = this.opreatorOptions[0];
    private asyncTags: Array<{ label: string, value: any, val: any }> = [];

    private convertOuter2Inner(v?: IFilterAsyncTagValue) {
        // debugger
        if (!v) return { operator: this.selectValueOnEmpty, value: null };
        const keys = Object.keys(v);
        const op = keys[0] as OPERATOR;
        // debugger
        if (this.operators.includes(op) && op in v) {
            // ****** can not call an async function in sync funtion (cant't convertOuter2Inner function change from sync to async)
            //TPDO readme start
            // if v.length !== this.asyncTags 
            // ||
            // if v[ids] !== this.asyncTags[ids]
            // call request for fetch this.props.loadFilters of v[ids] also update this.asyncTags
            //TPDO readme end
            return {
                operator: this.selectValueOnEmpty,
                value: this.asyncTags
            };
        }
        return { operator: this.selectValueOnEmpty, value: null };
    }

    private convertInner2Outer(o?: ISelectValue, v?: Array<{ label: string, value: any, val: any }> | null): IFilterAsyncTagValue | undefined {
        const operator = o ? o.value : this.selectValueOnEmpty.value;
        this.selectValueOnEmpty = o ? o : this.selectValueOnEmpty;
        this.asyncTags = (v === undefined || v === null || v.length === 0) ? [] : v;
        if (!v || v === null || v.length === 0) return;
        let mongoValue: Array<any> = this.props.pureValue2MongoValue(this.asyncTags);
        // debugger
        return { [operator]: mongoValue };
    }

    protected fieldRender() {
        const { name, ...rest } = this.props;
        return <>
            <Field name={name} {...rest}>
                {({ form, field }: FieldProps<IFilterAsyncTagValue, T>) => {
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
                        <AsyncSelect
                            {...field}
                            {...rest}
                            className="app-select app-select-sm w-100"
                            isClearable
                            isMulti={true}
                            cacheOptions
                            defaultOptions
                            value={fieldValue}
                            onChange={(v: any) => {
                                if (!v) { v = undefined; }
                                // debugger
                                if (this.props.onChange) this.props.onChange(this.convertInner2Outer(fieldOperator, v));
                                else setFieldValue(name as string, this.convertInner2Outer(fieldOperator, v));
                            }}
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