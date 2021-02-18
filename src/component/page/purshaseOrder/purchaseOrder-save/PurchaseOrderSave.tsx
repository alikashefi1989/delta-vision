import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Field, FormikProps } from 'formik';
import { SAVE_PAGE_MODE } from '../../_base/BaseSave/BaseSave';
import {
    APP_FORM_CONTROL,
    FormControl,
} from '../../../form/_formik/FormControl/FormControl';
import { Localization } from '../../../../config/localization/localization';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import { FieldArray } from 'formik';
import { SkuPicker } from '../../../form/_formik/SkuPicker/SkuPicker';
import PurchaseOrderMethodsComponent from './PurchaseOrderMethods';
import { IPurchaseOrderForm } from './PurchaseOrderMethods';
import AsyncSelect from 'react-select/async';

class PurchaseOrderSaveComponent extends PurchaseOrderMethodsComponent {
    private renderTable(formikProps: FormikProps<IPurchaseOrderForm>) {
        return (
            <div className="col-12 mb-5">
                <div className="card my-2 row-removeable-table-wrapper border-0">
                    <div className="card-body p-0">
                        <table className="table table-hover purchase-table text-center table-bordered row-removeable-table m-0">
                            <thead>
                                <tr>
                                    <td colSpan={7} className="text-left">
                                        <h4 className="font-weight-bold mb-0 text-capitalize border-0">
                                            Purchase Details
                                        </h4>
                                    </td>
                                </tr>
                                <tr>
                                    <th
                                        scope="col"
                                        className="text-muted text-capitalize text-left"
                                    >
                                        photo
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-muted text-capitalize text-left"
                                    >
                                        Product name
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-muted text-uppercase"
                                    >
                                        SKU
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-muted text-capitalize"
                                    >
                                        quantity
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-muted text-capitalize"
                                    >
                                        cost
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-muted text-capitalize"
                                    >
                                        percentage
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-muted text-capitalize"
                                    >
                                        selling price
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <FieldArray
                                    name="items"
                                    render={() => (
                                        <>
                                            {formikProps.values.items.length >
                                                0 &&
                                                formikProps.values.items.map(
                                                    (info, index) => (
                                                        <tr key={index}>
                                                            <td className="font-weight-bold align-items-center text-capitalize text-left">
                                                                <div
                                                                    className="position-relative mb-3"
                                                                    style={{
                                                                        width:
                                                                            '50px',
                                                                        height:
                                                                            '50px',
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            backgroundColor:
                                                                                '#fff',
                                                                            paddingBottom:
                                                                                '100%',
                                                                        }}
                                                                        className="m-2 position-relative "
                                                                    >
                                                                        <img
                                                                            src={
                                                                                info.photo
                                                                            }
                                                                            alt={
                                                                                info.productName
                                                                            }
                                                                            style={{
                                                                                display:
                                                                                    'block',
                                                                                maxWidth:
                                                                                    'none',
                                                                                maxHeight:
                                                                                    'none',
                                                                                objectFit:
                                                                                    'cover',
                                                                                objectPosition:
                                                                                    '50% 50%',
                                                                                top: 0,
                                                                                left: 0,
                                                                            }}
                                                                            className="w-100  position-absolute h-100"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="font-weight-bold text-capitalize text-left">
                                                                {
                                                                    info.productName
                                                                }
                                                            </td>
                                                            <td className="text-info align-items-center font-weight-bold text-uppercase">
                                                                {
                                                                    info.skuReadableId
                                                                }
                                                            </td>
                                                            <td className="font-weight-bold text-capitalize">
                                                                <FormControl
                                                                    control={
                                                                        APP_FORM_CONTROL.NUMBER
                                                                    }
                                                                    controlClassName="mb-0"
                                                                    name={`${'items'}[${index}][qty]`}
                                                                    currency={
                                                                        ''
                                                                    }
                                                                    apptheme={
                                                                        FORM_ELEMENT_THEME.ZOHO
                                                                    }
                                                                    value={
                                                                        formikProps
                                                                            .values
                                                                            .items[
                                                                            index
                                                                        ].qty
                                                                    }
                                                                    onChange={(
                                                                        e: any
                                                                    ) => {
                                                                        this.qtyOnChange(
                                                                            +e
                                                                                .target
                                                                                .value,
                                                                            index,
                                                                            formikProps
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="font-weight-bold text-capitalize">
                                                                <FormControl
                                                                    control={
                                                                        APP_FORM_CONTROL.NUMBER
                                                                    }
                                                                    controlClassName="mb-0"
                                                                    name={`${'items'}[${index}][price]`}
                                                                    currency={
                                                                        ''
                                                                    }
                                                                    apptheme={
                                                                        FORM_ELEMENT_THEME.ZOHO
                                                                    }
                                                                    value={
                                                                        formikProps
                                                                            .values
                                                                            .items[
                                                                            index
                                                                        ].price
                                                                    }
                                                                    onChange={(
                                                                        e: any
                                                                    ) => {
                                                                        this.costOnChange(
                                                                            +e
                                                                                .target
                                                                                .value,
                                                                            index,
                                                                            formikProps
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="font-weight-bold text-capitalize">
                                                                <FormControl
                                                                    control={
                                                                        APP_FORM_CONTROL.CURRENCY
                                                                    }
                                                                    controlClassName="mb-0"
                                                                    name={`${'items'}[${index}][percentage]`}
                                                                    currency={
                                                                        '%'
                                                                    }
                                                                    apptheme={
                                                                        FORM_ELEMENT_THEME.ZOHO
                                                                    }
                                                                    onChange={(
                                                                        e: any
                                                                    ) => {
                                                                        this.percentageChange(
                                                                            +e,
                                                                            index,
                                                                            formikProps
                                                                        );
                                                                    }}
                                                                    initialValue={
                                                                        0
                                                                    }
                                                                    min={0}
                                                                    max={100}
                                                                />
                                                            </td>
                                                            <td className="font-weight-bold text-capitalize">
                                                                <FormControl
                                                                    control={
                                                                        APP_FORM_CONTROL.NUMBER
                                                                    }
                                                                    controlClassName="mb-0"
                                                                    name={`${'items'}[${index}][sellPrice]`}
                                                                    currency={
                                                                        ''
                                                                    }
                                                                    apptheme={
                                                                        FORM_ELEMENT_THEME.ZOHO
                                                                    }
                                                                    value={
                                                                        formikProps
                                                                            .values
                                                                            .items[
                                                                            index
                                                                        ]
                                                                            .sellPrice
                                                                    }
                                                                    onChange={(
                                                                        e: any
                                                                    ) => {
                                                                        this.sellPriceOnChange(
                                                                            +e
                                                                                .target
                                                                                .value,
                                                                            index,
                                                                            formikProps
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td
                                                                colSpan={0}
                                                                className="remove-button-cell"
                                                            >
                                                                <button
                                                                    className="btn"
                                                                    onClick={() =>
                                                                        this.removeRow(
                                                                            index,
                                                                            formikProps
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fa fa-times-circle text-danger"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            <tr>
                                                <td></td>
                                                <td
                                                    className="text-muted p-0 text-left"
                                                    colSpan={3}
                                                >
                                                    <AsyncSelect
                                                        value={null}
                                                        cacheOptions
                                                        placeholder="Type or click to select an item"
                                                        components={{
                                                            DropdownIndicator: () =>
                                                                null,
                                                            IndicatorSeparator: () =>
                                                                null,
                                                        }}
                                                        loadOptions={(
                                                            inputValue: string,
                                                            callback: (
                                                                options: any
                                                            ) => void
                                                        ) =>
                                                            this.debounceSearchSkuList(
                                                                inputValue,
                                                                callback
                                                            )
                                                        }
                                                        defaultOptions
                                                        onChange={(e: any) => {
                                                            let items = this
                                                                .state.skuPicker
                                                                .value;
                                                            items.push({
                                                                count: 1,
                                                                sku: e.value,
                                                            });
                                                            console.log(items);
                                                            this.pushItems(
                                                                items,
                                                                formikProps
                                                            );
                                                        }}
                                                        styles={
                                                            this.selectStyles
                                                        }
                                                        formatOptionLabel={
                                                            this
                                                                .formatOptionLabel
                                                        }
                                                    />
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </>
                                    )}
                                />{' '}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-12 p-0 d-flex">
                    <button
                        type="button"
                        className="btn purchase-button p-1"
                        onClick={() => {
                            this.setState({
                                skuPicker: {
                                    ...this.state.skuPicker,
                                    show: true,
                                },
                            });
                        }}
                    >
                        <span className="left-icon">
                            <i className="fa fa-plus-circle"></i>
                        </span>
                        <span className="px-2 font-weight-bold ">
                            Add another Line
                        </span>
                        <span className="right-icon">
                            <i className="fa fa-caret-down"></i>
                        </span>
                    </button>
                    <SkuPicker
                        show={this.state.skuPicker.show}
                        value={this.skuPickerSetValue(formikProps)}
                        onConfirm={(value) =>
                            this.pushItems(value, formikProps)
                        }
                        onHide={() => {
                            this.setState({
                                skuPicker: {
                                    ...this.state.skuPicker,
                                    show: false,
                                },
                            });
                        }}
                    />
                    <div className="text-center m-auto d-flex">
                        <h4 className="mb-0 font-weight-bold ">Total Cost</h4>
                        <h4 className="mb-0 font-weight-bold mx-5">
                            {formikProps.values.totalPrice} KD
                        </h4>
                    </div>
                </div>
            </div>
        );
    }

    protected saveFormBodyRender(
        formikProps: FormikProps<IPurchaseOrderForm>
    ): JSX.Element {
        return (
            <>
                <div className="row">
                    <div className="col-12 col-lg-7">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <h4 className="font-weight-bold">
                                    Purchase items
                                </h4>
                            </div>
                            <div className="col-12">
                                <FormControl<IPurchaseOrderForm>
                                    control={APP_FORM_CONTROL.ASYNCSELECT}
                                    name="warehouseId"
                                    label={'warehouse'}
                                    icon={
                                        <i className="fa fa-building zoho-icon"></i>
                                    }
                                    required
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    // isClearable={true}
                                    loadOptions={(
                                        inputValue: string,
                                        callback: (options: any) => void
                                    ) =>
                                        this.debounceSearchWarehouseList(
                                            inputValue,
                                            callback
                                        )
                                    }
                                    defaultOptions
                                    readOnly={
                                        this.state.savePageMode ===
                                        SAVE_PAGE_MODE.VIEW
                                    }
                                />
                            </div>
                            <div className="col-12">
                                <FormControl<IPurchaseOrderForm>
                                    control={APP_FORM_CONTROL.ASYNCSELECT}
                                    name="supplierId"
                                    label={'supplier'}
                                    icon={
                                        <i className="fa fa-building zoho-icon"></i>
                                    }
                                    required
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    // isClearable={true}
                                    loadOptions={(
                                        inputValue: string,
                                        callback: (options: any) => void
                                    ) =>
                                        this.debounceSearchSupplierList(
                                            inputValue,
                                            callback
                                        )
                                    }
                                    defaultOptions
                                    readOnly={
                                        this.state.savePageMode ===
                                        SAVE_PAGE_MODE.VIEW
                                    }
                                />
                            </div>
                            <div className="col-12">
                                <FormControl<IPurchaseOrderForm>
                                    control={APP_FORM_CONTROL.SELECT}
                                    name={`type`}
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    label={Localization.type}
                                    required
                                    isClearable={false}
                                    options={this.state.typeOptions}
                                    readOnly={
                                        this.state.savePageMode ===
                                        SAVE_PAGE_MODE.VIEW
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row my-3">{this.renderTable(formikProps)}</div>
            </>
        );
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language,
    };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {};
};
export const PurchaseOrderSave = connect(
    state2props,
    dispatch2props
)(PurchaseOrderSaveComponent);
