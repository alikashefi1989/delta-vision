import React from 'react';
import { Field, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import ReactSelect from "react-select";
import { Props } from 'react-select/src/Select';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';

export interface IProps<T> extends Omit<Props, 'name'>, IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.TAG_SELECT;
    patternFunction?: (value: string) => boolean;
    patternRegex?: RegExp;
}

interface IState {
    inputValue: string;
}

export class TagSelect<T> extends FormElementBase<T, IProps<T>, IState>{
    state = {
        inputValue: '',
    }

    handleTagsKeyDown(event: any, value: any, setFieldValue: any) {
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                const newVal = this.state.inputValue;
                if (this.isTagExist(newVal, value) === true) return;
                if (this.props.patternFunction !== undefined && this.props.patternFunction(newVal) === false) return;
                if (this.props.patternRegex !== undefined && this.props.patternRegex.test(newVal) === false) return;
                const newValue: Array<{ label: string, value: string }> =
                    (value === undefined || value === null) ?
                        [{ label: newVal, value: newVal }]
                        :
                        [...value, { label: newVal, value: newVal }];
                this.setState({
                    ...this.state,
                    inputValue: '',
                }, () => {
                    // debugger;
                    setFieldValue(this.props.name, newValue)
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

        return <Field name={name}>
            {({ form, field }: FieldProps<{ label: string, value: string }, T>) => {
                const { setFieldValue, setFieldTouched } = form;
                const { value } = field;
                return <ReactSelect
                    // id={this.id}
                    // className="basic-multi-select"
                    // classNamePrefix="select"
                    inputId={this.id}
                    {...field}
                    {...rest}
                    value={value}
                    onBlur={() => { setFieldTouched(name as string, true) }}
                    onChange={(v) => {
                        setFieldValue(name as string, v)
                    }}
                    inputValue={this.state.inputValue}
                    onInputChange={(inputVal) => this.setState({ ...this.state, inputValue: inputVal })}
                    onKeyDown={(e) => this.handleTagsKeyDown(e, value, setFieldValue)}
                    menuIsOpen={false}
                    isMulti
                    components={{
                        DropdownIndicator: null,
                    }}
                />
            }}
        </Field>
    }
}
