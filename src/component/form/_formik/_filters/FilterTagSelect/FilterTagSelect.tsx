import React from 'react';
import { Field, FieldProps } from 'formik';
import { FilterFormElementBase, IFilterFormElementBaseProps } from '../FilterFormElementBase/FilterFormElementBase';
import { APP_FILTER_FORM_CONTROL } from '../FilterFormControl/FilterFormControl';
import ReactSelect from "react-select";
import { Props } from 'react-select/src/Select';

export interface IProps<T> extends Omit<Props, 'name'>, IFilterFormElementBaseProps<T> {
    control: APP_FILTER_FORM_CONTROL.FILTER_TAG_SELECT;
}

interface IState {
    inputValue: string;
}

enum OPERATOR {
    $in = '$in',
    $nin = '$nin'
}

type IFilterTagSelectValue = { [key in OPERATOR]?: Array<string>; }
interface ISelectValue { label: string; value: OPERATOR }

export class FilterTagSelect<T> extends FilterFormElementBase<T, IProps<T>, IState>{
    state = {
        inputValue: '',
    }

    private opreatorOptions: Array<ISelectValue> = [
        { label: 'nncluding', value: OPERATOR.$in },
        { label: "non-including", value: OPERATOR.$nin },
    ];

    operators = Object.values(OPERATOR);
    private selectValueOnEmpty = this.opreatorOptions[0];

    private convertOuter2Inner(v?: IFilterTagSelectValue): { operator: ISelectValue, value: Array<{ label: string, value: string }> | null; } {
        // debugger
        if (!v) return { operator: this.selectValueOnEmpty, value: null };
        // debugger
        const keys = Object.keys(v);
        const op = keys[0] as OPERATOR;
        if (this.operators.includes(op) && op in v) {
            let pureValue: Array<string> | undefined = (v as any)[op];
            let convertedValue: Array<{ label: string, value: string }> = [];
            if (pureValue !== undefined && pureValue.length > 0) {
                for (let i = 0; i < pureValue.length; i++) {
                    let item: { label: string, value: string } = {
                        label: pureValue[i],
                        value: pureValue[i],
                    };
                    convertedValue.push(item);
                }
            }
            // debugger
            return {
                operator: this.selectValueOnEmpty,
                value: (pureValue !== undefined && pureValue.length > 0) ? convertedValue : null,
            };
        }
        return { operator: this.selectValueOnEmpty, value: null };
    }

    private convertInner2Outer(o?: ISelectValue, v?: Array<{ label: string, value: string }> | null): IFilterTagSelectValue | undefined {
        const operator = o ? o.value : this.selectValueOnEmpty.value;
        this.selectValueOnEmpty = o ? o : this.selectValueOnEmpty;
        // debugger
        if (!v || v === null) return;
        let pureValue: Array<{ label: string, value: string }> = v;
        // debugger
        let convertedVAlue: Array<string> = pureValue.map((item: { label: string, value: string }, i: number) => { return item.value })
        // debugger
        return { [operator]: convertedVAlue };

    }

    handleTagsKeyDown(event: any, value: any, setFieldValue: any, opreator: ISelectValue) {
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                const newVal = this.state.inputValue;
                if (this.isTagExist(newVal, value) === true) return;
                // if (this.props.patternFunction !== undefined && this.props.patternFunction(newVal) === false) return;
                // if (this.props.patternRegex !== undefined && this.props.patternRegex.test(newVal) === false) return;
                const newValue: Array<{ label: string, value: string }> =
                    (value === undefined || value === null) ?
                        [{ label: newVal, value: newVal }]
                        :
                        [...value, { label: newVal, value: newVal }];
                // debugger
                this.setState({
                    ...this.state,
                    inputValue: '',
                }, () => {
                    // debugger;
                    const filterVal = this.convertInner2Outer(opreator, newValue);
                    // debugger
                    if (this.props.onChange) this.props.onChange(filterVal);
                    setFieldValue(this.props.name, filterVal);
                    // debugger
                });
                event.preventDefault();
        }
    }

    isTagExist(newTag: string, value: { label: string, value: string }[] | null | undefined): boolean {
        let array: { label: string, value: string }[] | null | undefined = value;
        if (array === undefined || array === null || array.length === 0 || array === []) {
            if (newTag === '') {
                return true;
            }
            return false;
        } else {
            let res: boolean = false;
            for (let i = 0; i < array.length; i++) {
                if (array[i].value === newTag || newTag === '') {
                    res = true;
                    break;
                }
            }
            return res;
        }
    }

    protected fieldRender() {
        const { name, ...rest } = this.props;
        return <>
            <Field name={name} {...rest}>
                {({ form, field }: FieldProps<IFilterTagSelectValue, T>) => {
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
                            value={fieldValue}
                            onChange={(v: Array<{ label: string, value: string }> | null | undefined | any) => {
                                const filterVal = this.convertInner2Outer(fieldOperator, v);
                                if (this.props.onChange) this.props.onChange(filterVal);
                                else setFieldValue(name as string, filterVal);
                            }}
                            inputValue={this.state.inputValue}
                            onInputChange={(inputVal) => this.setState({ ...this.state, inputValue: inputVal })}
                            onKeyDown={(e) => this.handleTagsKeyDown(e, fieldValue, setFieldValue, fieldOperator)}
                            menuIsOpen={false}
                            isMulti
                            components={{
                                DropdownIndicator: null,
                            }}
                        />
                    </div>
                }}
            </Field>
        </>
    }
}