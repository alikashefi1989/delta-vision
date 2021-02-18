import React from 'react';
import { Field, FieldProps } from 'formik';
// import {
//     FormElementBase,
//     IFormElementBaseProps,
// } from '../FormElementBase/FormElementBase';
import ReactSelect from 'react-select';
import { Props } from 'react-select/src/Select';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import { LookupModal } from './LookupModal';
import { IEntityColumn } from '../../../../model/column.model';
import { ROUTE_BASE_CRUD } from '../../../page/_base/BaseUtility';
import {
    ZohoFormElementBase,
    IZohoFormElementBaseProps,
} from '../FormElementBase/ZohoFormElementBase';

export interface IProps<T>
    extends Omit<Props, 'name'>,
        IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.LOOKUP;
    modalHeader: React.ReactNode;
    // modalOpenerIcon?: React.ReactNode;
    modalColumns: Array<IEntityColumn>;
    entityName: ROUTE_BASE_CRUD;
    searchAccessor: string;
    defaultFilter?: Object;
}

export class ZohoLookup<T> extends ZohoFormElementBase<T, IProps<T>> {
    state = { modalShow: false };

    private showModal() {
        this.setState({ modalShow: true });
    }
    private hideModal() {
        this.setState({ modalShow: false });
    }

    private retrieveNested(obj: any, accessor: string) {
        let str = '';
        if (accessor.includes('.')) {
            let newItem = obj;
            accessor.split('.').forEach((l) => {
                newItem = newItem[l];
            });
            str = newItem;
        } else {
            str = obj[accessor];
        }
        return str;
    }

    protected fieldRender() {
        const {
            name,
            modalHeader,
            // modalOpenerIcon,
            modalColumns,
            onSearch,
            icon,
            ...rest
        } = this.props;

        return (
            <>
                <span
                    onClick={() => this.showModal()}
                    // className="cursor-pointer"
                >
                    {icon ? icon : <i className="fa fa-info zoho-icon"></i>}
                </span>
                {/* {icon} */}
                <Field name={name}>
                    {({ form, field }: FieldProps<Object, T>) => {
                        const { setFieldValue, setFieldTouched } = form;
                        const { value } = field;
                        const selectValue = value
                            ? {
                                  label: this.retrieveNested(
                                      value,
                                      this.props.searchAccessor
                                  ),
                                  value: value,
                              }
                            : null;
                        const modalValue = value
                            ? Array.isArray(value)
                                ? value
                                : [value]
                            : [];

                        return (
                            <>
                                <ReactSelect
                                    inputId={this.id}
                                    {...field}
                                    {...rest}
                                    isSearchable={false}
                                    components={{
                                        DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null,
                                        Menu: () => null,
                                    }}
                                    onChange={(sv: any) => {
                                        if (sv === undefined) {
                                            sv = null;
                                        }

                                        let v = null;
                                        if (sv) v = sv.value;

                                        if (this.props.onChange)
                                            this.props.onChange(v);
                                        else setFieldValue(name as string, v);
                                    }}
                                    value={selectValue}
                                    onBlur={() => {
                                        setFieldTouched(name as string, true);
                                    }}
                                />
                                <LookupModal
                                    show={this.state.modalShow}
                                    onHide={() => this.hideModal()}
                                    onConfirm={(mv) => {
                                        let v = null;
                                        if (mv && mv.length) v = mv[0];

                                        if (this.props.onChange)
                                            this.props.onChange(v);
                                        else setFieldValue(name as string, v);
                                        this.hideModal();
                                    }}
                                    value={modalValue}
                                    readOnly={this.props.readOnly}
                                    title={modalHeader}
                                    columns={modalColumns}
                                    entityName={this.props.entityName}
                                    searchAccessor={this.props.searchAccessor}
                                    defaultFilter={this.props.defaultFilter}
                                />
                            </>
                        );
                    }}
                </Field>
            </>
        );
    }

    render() {
        return (
            <div className={`${this.wrapperClassName()} zoho-select-input`}>
                {this.InputRender()}
            </div>
        );
    }
}
