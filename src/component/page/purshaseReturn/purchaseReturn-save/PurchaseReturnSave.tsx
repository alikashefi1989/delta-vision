import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Field, FieldProps, FormikProps } from 'formik';
import * as Yup from 'yup';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
    SAVE_PAGE_MODE,
} from '../../_base/BaseSave/BaseSave';
import {
    IPurchaseReturn,
    TPurchaseReturnCreate,
    TPurchaseReturnUpdate,
} from '../../../../model/purchaseReturn.model';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { PurchaseReturnService } from '../../../../service/purchaseReturn.service';
import { FieldArray } from 'formik';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import { Localization } from '../../../../config/localization/localization';
import {
    APP_FORM_CONTROL,
    FormControl,
} from '../../../form/_formik/FormControl/FormControl';
import {
    SkuPicker,
    ISkuPickerValue,
} from '../../../form/_formik/SkuPicker/SkuPicker';
import { Setup } from '../../../../config/setup';
import { StoreService } from '../../../../service/store.service';
import { RefundReasonService } from '../../../../service/refundReason.service';
import _ from 'lodash';
import ReactSelect from 'react-select';
import { ISku } from '../../../../model/sku.model';

interface IPurchaseReturnForm {
    items: Array<{
        productName: string;
        skuId: string;
        skuReadableId: string;
        qty: number;
        price: number;
        refundType: {
            label: string;
            value: string;
        } | null;
        sku?: ISku;
    }>;
    supplierId: {
        label: string;
        value: string;
    } | null;
    type: string;
    currencyUnit: string;
    date: number;
    totalPrice: number;
    sendEmail: boolean;
    returnFromDocAccountId?: string;
}

interface IState extends IStateBaseSave<IPurchaseReturn> {
    formData: IPurchaseReturnForm;
    skuPicker: {
        show: boolean;
        value: Array<ISkuPickerValue>;
    };
    refundTypeOptions: Array<{ label: string; value: string }>;
}
interface IProps extends IPropsBaseSave {}

class PurchaseReturnSaveComponent extends BaseSave<
    IPurchaseReturn,
    TPurchaseReturnCreate,
    TPurchaseReturnUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        formData: {
            items: [],
            date: this.calcDate(),
            supplierId: null,
            totalPrice: 0,
            currencyUnit: 'KD',
            type: 'return',
            sendEmail: false,
        },
        skuPicker: {
            show: false,
            value: [],
        },
        refundTypeOptions: [],
    };

    componentDidMount() {
        super.componentDidMount();
        this.fetchRefundTypes();
    }

    private _storeService = new StoreService();
    private _refundReasonService = new RefundReasonService();

    protected _entityService = new PurchaseReturnService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.purchaseReturn;

    protected formValidation = Yup.object({
        supplierId: Yup.object()
            .required(Localization.validation.required_field)
            .nullable(),
        items: Yup.array()
            .of(
                Yup.object().shape({
                    skuId: Yup.string().required(
                        Localization.validation.required_field
                    ),
                    price: Yup.string().required(
                        Localization.validation.required_field
                    ),
                    qty: Yup.string().required(
                        Localization.validation.required_field
                    ),
                    refundType: Yup.string().required(
                        Localization.validation.required_field
                    ),
                })
            )
            .required(Localization.validation.required_field),
    });

    private async fetchRefundTypes() {
        try {
            const res = await this._refundReasonService.search({
                pagination: {
                    page: 0,
                    limit: 1000,
                },
            });

            const result = res.data.data.items.map((a) => ({
                label: a.name?.en,
                value: a.id,
            }));

            this.setState({ refundTypeOptions: result });
        } catch (e) {}
    }

    private calcDate() {
        let date = new Date();
        let timestamp = date.getTime();
        return timestamp;
    }

    private onTotalPriceCalc() {
        let currentPrice = 0;
        let data = this.state.formData;
        if (!_.isEmpty(data.items)) {
            return data.items.map((item) => {
                currentPrice += item.price;
                return (data.totalPrice = currentPrice);
            });
        } else {
            data.totalPrice = 0;
        }
        this.setState({ formData: data });
    }

    private removeRow(
        index: number,
        formikProps: FormikProps<IPurchaseReturnForm>
    ) {
        let values = this.state.formData;
        values.items.splice(index, 1);
        let products = this.state.skuPicker;
        products.value.splice(index, 1);
        formikProps.setFieldValue('items', values.items);
        this.setState({
            formData: values,
            skuPicker: products,
        });
        this.onTotalPriceCalc();
    }

    private qtyOnChange(qty: number, index: number) {
        let currentValue = this.state.formData;
        currentValue.items[index].qty = qty;
        let products = this.state.skuPicker;
        this.setState({
            formData: currentValue,
        });
        if (!_.isEmpty(products.value) && products.value[index].count) {
            products.value[index].count = qty;
        }
    }

    private refundTypeOnchange(value: string, index: number) {
        let values: any = this.state.formData;
        values.items[index].refundType = value;
        this.setState({ formData: values });
    }

    private removeKey(array: any, key: Array<string>) {
        let arr = array;
        arr.map((item: any) => {
            if (typeof item.refundType === 'object') {
                item.refundType = item.refundType.value;
            }
            return key.forEach((e) => delete item[e]);
        });
        return arr;
    }
    private editItems(data: any) {
        let items: any = [];
        if (!_.isEmpty(data)) {
            data.map((i: any) => {
                return items.push({
                    productName: i.sku.product.name.en,
                    skuReadableId: `${i.sku.readableId}`,
                    skuId: i.skuId,
                    qty: +i.qty,
                    price: +i.price,
                    refundType: {
                        value: i.refundType.id,
                        label: i.refundType.name.en,
                    },
                    sku: i.sku,
                });
            });
        }
        return items;
    }

    protected form2CreateModel(
        form: IPurchaseReturnForm
    ): TPurchaseReturnCreate {
        return {
            date: this.calcDate(),
            supplierId: form.supplierId?.value,
            totalPrice: form.totalPrice,
            currencyUnit: 'KD',
            items: this.removeKey(form.items, [
                'productName',
                'skuReadableId',
                'sku',
            ]),
            type: 'return',
            returnFromDocAccountId: undefined,
        };
    }

    private skuPickerSetValue(formikProps: FormikProps<IPurchaseReturnForm>) {
        let skuValues: any = [];

        if (!_.isEmpty(formikProps.values.items)) {
            formikProps.values.items.map((item) => {
                if (item.sku) {
                    skuValues.push({ count: item.qty, sku: item.sku });
                }
                return skuValues;
            });
            return skuValues;
        }
        return this.state.skuPicker.value;
    }

    private pushItems(
        value: any,
        formikProps: FormikProps<IPurchaseReturnForm>
    ) {
        debugger;
        let values: any = formikProps.values;
        if (value) {
            value.map((item: any) => {
                return values.items.push({
                    productName: item.sku.product.name.en,
                    skuReadableId: item.sku.readableId,
                    skuId: item.sku.id,
                    qty: item.count,
                    price: item.sku.price?.originalPrice,
                    refundType: this.state.refundTypeOptions[0].value,
                    sku: item.sku,
                });
            });
        }

        values.items = values.items.reduce((acc: any, current: any) => {
            const x = acc.find((item: any) => item.skuId === current.skuId);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        if (value.length !== values.items.length) {
            let ids: any = [];
            value.map((i: any) => {
                return ids.push(i.sku.id);
            });
            const filtered_items = values.items.filter(function (item: any) {
                return ids.includes(item.skuId);
            });
            values.items = filtered_items;
        }
        formikProps.setFieldValue('items', values.items);
        this.setState(
            {
                skuPicker: {
                    ...this.state.skuPicker,
                    show: false,
                    value,
                },
            },
            () => this.onTotalPriceCalc()
        );
    }

    protected form2UpdateModel(
        form: IPurchaseReturnForm
    ): TPurchaseReturnUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IPurchaseReturn): IPurchaseReturnForm {
        return {
            date: data.date,
            supplierId: !_.isEmpty(data.supplier)
                ? {
                      value: data.supplier[0].id,
                      label: data.supplier[0].name.en,
                  }
                : null,
            totalPrice: data.totalPrice,
            currencyUnit: 'KD',
            items: this.editItems(data.items),
            type: 'return',
            returnFromDocAccountId: data.id,
            sendEmail: false, // TODO: Change this later
        };
    }

    protected async create(formikProps: FormikProps<any>, goBack?: boolean) {
        // TODO: remove all any
        this.setState({ actionBtnLoading: true });
        try {
            debugger;
            await this._entityService.create(
                this.form2CreateModel(formikProps.values)
            );

            this.setState({
                actionBtnLoading: false,
            });
            formikProps.handleReset();
            formikProps.setFieldValue('items', []);

            if (goBack) {
                this.goToManage();
            }
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'create_error' },
            });
        }
    }

    private renderTable(formikProps: FormikProps<IPurchaseReturnForm>) {
        console.log(formikProps.errors, formikProps.dirty, formikProps.isValid);
        return (
            <div className="col-12">
                <div className="card my-2 row-removeable-table-wrapper border-0">
                    <div className="card-body p-0">
                        <table className="table table-hover text-center table-bordered row-removeable-table m-0">
                            <thead>
                                <tr>
                                    <td colSpan={5} className="text-left">
                                        <h4 className="font-weight-bold mb-0 text-capitalize border-0">
                                            Purchase Return Details
                                        </h4>
                                    </td>
                                </tr>
                                <tr>
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
                                        price
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-muted text-capitalize"
                                    >
                                        Refund Type
                                    </th>
                                </tr>
                            </thead>
                            <FieldArray
                                name="items"
                                render={() => (
                                    <tbody>
                                        {formikProps.values.items.length > 0 &&
                                            formikProps.values.items.map(
                                                (info, index) => (
                                                    <tr key={index}>
                                                        <th
                                                            scope="row"
                                                            className="font-weight-bold text-capitalize text-left"
                                                        >
                                                            {info.productName}
                                                        </th>
                                                        <th
                                                            scope="row"
                                                            className="text-info font-weight-bold text-uppercase"
                                                        >
                                                            {info.skuReadableId}
                                                        </th>
                                                        <td className="font-weight-bold text-capitalize">
                                                            <Field
                                                                name={`${'items'}[${index}][qty]`}
                                                                required
                                                                type="number"
                                                                min="1"
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
                                                                        index
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="font-weight-bold text-capitalize">
                                                            {info.price}
                                                        </td>
                                                        <td className="font-weight-bold text-capitalize">
                                                            <ReactSelect
                                                                className="app-select border-0 app-select-sm mr-3 min-w-100px"
                                                                placeholder={
                                                                    Localization.type
                                                                }
                                                                options={
                                                                    this.state
                                                                        .refundTypeOptions
                                                                }
                                                                components={{
                                                                    DropdownIndicator: () => (
                                                                        <>
                                                                            <i className="fa fa-caret-down pr-2"></i>
                                                                        </>
                                                                    ),
                                                                    IndicatorSeparator: () =>
                                                                        null,
                                                                }}
                                                                menuPlacement="auto"
                                                                isSearchable={
                                                                    false
                                                                }
                                                                defaultValue={
                                                                    this.state
                                                                        .refundTypeOptions[0]
                                                                }
                                                                onChange={(
                                                                    e: any
                                                                ) =>
                                                                    this.refundTypeOnchange(
                                                                        e.value,
                                                                        index
                                                                    )
                                                                }
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
                                        {formikProps.values.items.length ===
                                            0 && (
                                            <tr className="font-weight-bold text-center text-uppercase">
                                                <td colSpan={5}>no data</td>
                                            </tr>
                                        )}
                                    </tbody>
                                )}
                            />
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
                        <h4 className="mb-0 font-weight-bold">
                            Total Purchase Return
                        </h4>
                        <h4 className="mb-0 font-weight-bold mx-5">
                            {formikProps.values.totalPrice} KD
                        </h4>
                    </div>
                </div>
            </div>
        );
    }

    customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            borderBottom: '1px dotted pink',
            color: state.isSelected ? 'red' : 'blue',
            padding: 20,
        }),
        control: () => ({
            width: 200,
        }),
        singleValue: (provided: any, state: any) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = 'opacity 300ms';

            return { ...provided, opacity, transition };
        },
    };

    private _debounceSearchStoreList: any;
    private debounceSearchStoreList(input: string, callback: any) {
        if (this._debounceSearchStoreList)
            clearTimeout(this._debounceSearchStoreList);
        this._debounceSearchStoreList = setTimeout(() => {
            this.searchStoreList(input, callback);
        }, 300);
    }

    private async searchStoreList(input: string, callback: any): Promise<void> {
        try {
            const res = await this._storeService.search({
                pagination: {
                    page: 0,
                    limit: Setup.recordDefaultLoadLength,
                },
                search: input,
            });

            // const result = this.nestedStoreList(res.data.data.items);
            const result = res.data.data.items.map((a) => ({
                label: a.name?.en,
                value: a.id,
            }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    EmailCheckBox = (fieldName: string, name: string, email: string) => {
        return (
            <div className="component-email-to">
                <div className="app-CHECKBOX mt-n1 prevent-onRowClick">
                    <Field name={fieldName}>
                        {({ field, form }: FieldProps<any>) => {
                            const randId = Math.random().toString();
                            return (
                                <>
                                    <input
                                        className={`app-checkbox native-style2`}
                                        id={randId}
                                        type="checkbox"
                                        {...field}
                                    />
                                    <label htmlFor={randId}></label>
                                </>
                            );
                        }}
                    </Field>
                </div>
                <div className="px-1">
                    <small className="font-weight-bold text-capitalize">
                        {name}
                    </small>
                </div>
                <div>
                    <small className="font-weight-bold">&lt;{email}&gt;</small>
                </div>
            </div>
        );
    };

    protected saveFormBodyRender(
        formikProps: FormikProps<IPurchaseReturnForm>
    ): JSX.Element {
        return (
            <>
                <div className="row">
                    <div className="col-12 col-lg-7">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <h4 className="font-weight-bold text-capitalize">
                                    Purchase Return Information
                                </h4>
                            </div>
                            <div className="col-12">
                                <FormControl<IPurchaseReturnForm>
                                    control={APP_FORM_CONTROL.ASYNCSELECT}
                                    name="supplierId"
                                    label={'supplier'}
                                    icon={
                                        <i className="fa fa-user zoho-icon"></i>
                                    }
                                    required
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    // isClearable={true}
                                    loadOptions={(
                                        inputValue: string,
                                        callback: (options: any) => void
                                    ) =>
                                        this.debounceSearchStoreList(
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
                        </div>
                    </div>
                </div>
                <div className="row mt-3">{this.renderTable(formikProps)}</div>
                <div className="row mt-5">
                    <div className="col-12">
                        <h4 className="font-weight-bold text-capitalize">
                            email to
                        </h4>
                    </div>
                    <div className="col-12">
                        {this.EmailCheckBox(
                            'sendEmail',
                            'Ahmed Mansouri',
                            'Ahmed@gmail.com'
                        )}
                    </div>
                </div>
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
export const PurchaseReturnSave = connect(
    state2props,
    dispatch2props
)(PurchaseReturnSaveComponent);
