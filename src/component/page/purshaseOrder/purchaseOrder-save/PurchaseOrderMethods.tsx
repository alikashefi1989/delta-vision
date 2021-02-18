import React from 'react';
import { FormikProps } from 'formik';
import * as Yup from 'yup';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
} from '../../_base/BaseSave/BaseSave';
import {
    IPurchaseOrder,
    TPurchaseOrderCreate,
    TPurchaseOrderUpdate,
} from '../../../../model/PurchaseOrder.model';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { PurchaseOrderService } from '../../../../service/purchaseOrder.service';
import { Localization } from '../../../../config/localization/localization';
import { ISkuPickerValue } from '../../../form/_formik/SkuPicker/SkuPicker';
import { Setup } from '../../../../config/setup';
import { PurchaseType } from '../../../../enum/purchase-type.enum';
import _ from 'lodash';
import { ISku } from '../../../../model/sku.model';
import { SupplierService } from '../../../../service/supplier.service';
import { WarehouseService } from '../../../../service/warehouse.service';
import { SkuService } from '../../../../service/sku.service';

export interface IPurchaseOrderForm {
    date: number;
    supplierId: {
        label: string;
        value: string;
    } | null;
    warehouseId: {
        label: string;
        value: string;
    } | null;
    type: {
        label: string;
        value: string;
    } | null;
    totalPrice: number;
    currencyUnit: string;
    items: Array<{
        photo: string;
        productName: string;
        skuReadableId: string;
        skuId: string;
        qty: number;
        price: number;
        percentage: number;
        sellPrice: number;
        refundType: string;
        sku?: ISku;
    }>;
}

interface IState extends IStateBaseSave<IPurchaseOrder> {
    formData: IPurchaseOrderForm;
    skuPicker: {
        show: boolean;
        value: Array<ISkuPickerValue>;
    };
    typeOptions: Array<{ label: string; value: string }>;
}
interface IProps extends IPropsBaseSave {}

export default abstract class PurchaseOrderMethodsComponent extends BaseSave<
    IPurchaseOrder,
    TPurchaseOrderCreate,
    TPurchaseOrderUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        formData: {
            items: [],
            date: this.calcDate(),
            supplierId: null,
            warehouseId: null,
            type: null,
            totalPrice: 0,
            currencyUnit: 'KD',
        },
        skuPicker: {
            show: false,
            value: [],
        },
        typeOptions: [
            {
                label: PurchaseType.CONSIGNMENT,
                value: PurchaseType.CONSIGNMENT,
            },

            {
                label: PurchaseType.PURCHASE,
                value: PurchaseType.PURCHASE,
            },
        ],
    };

    componentDidMount() {
        super.componentDidMount();
    }

    protected _entityService = new PurchaseOrderService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.purchaseOrder;
    protected _supplierService = new SupplierService();
    protected _warehouseService = new WarehouseService();
    protected _skuService = new SkuService();

    protected _debounceSearchSkuList: any;
    protected debounceSearchSkuList(input: string, callback: any) {
        if (this._debounceSearchSkuList)
            clearTimeout(this._debounceSearchSkuList);
        this._debounceSearchSkuList = setTimeout(() => {
            this.searchSkuList(input, callback);
        }, 300);
    }
    protected async searchSkuList(input: string, callback: any): Promise<void> {
        try {
            const res = await this._skuService.search({
                pagination: {
                    page: 0,
                    limit: 50,
                },
                search: input,
            });

            const result = res.data.data.items.map((a) => ({
                label: a.product.name.en,
                value: a,
            }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    protected _debounceSearchSupplierList: any;
    protected debounceSearchSupplierList(input: string, callback: any) {
        if (this._debounceSearchSupplierList)
            clearTimeout(this._debounceSearchSupplierList);
        this._debounceSearchSupplierList = setTimeout(() => {
            this.searchSupplierList(input, callback);
        }, 300);
    }
    protected async searchSupplierList(
        input: string,
        callback: any
    ): Promise<void> {
        try {
            const res = await this._supplierService.search({
                pagination: {
                    page: 0,
                    limit: Setup.recordDefaultLoadLength,
                },
                search: input,
            });

            // const result = this.nestedsupplierList(res.data.data.items);
            const result = res.data.data.items.map((a) => ({
                label: a.name?.en,
                value: a.id,
            }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    protected _debounceSearchWarehouseList: any;
    protected debounceSearchWarehouseList(input: string, callback: any) {
        if (this._debounceSearchWarehouseList)
            clearTimeout(this._debounceSearchWarehouseList);
        this._debounceSearchWarehouseList = setTimeout(() => {
            this.searchWarehouseList(input, callback);
        }, 300);
    }
    protected async searchWarehouseList(
        input: string,
        callback: any
    ): Promise<void> {
        try {
            const res = await this._warehouseService.search({
                pagination: {
                    page: 0,
                    limit: Setup.recordDefaultLoadLength,
                },
                search: input,
            });

            // const result = this.nestedsupplierList(res.data.data.items);
            const result = res.data.data.items.map((a: any) => ({
                label: a.name?.en,
                value: a.id,
            }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    protected onTotalPriceCalc() {
        let currentPrice = 0;
        let data = this.state.formData;
        if (!_.isEmpty(data.items)) {
            data.items.map((item) => {
                currentPrice += item.price;
                return (data.totalPrice = currentPrice);
            });
        } else {
            data.totalPrice = 0;
        }
        this.setState({ formData: data });
    }

    protected costOnChange(
        value: number,
        index: number,
        formikProps: FormikProps<IPurchaseOrderForm>
    ) {
        let currentValue = formikProps.values;
        currentValue.items[index].price = value;

        formikProps.setFieldValue(`${'items'}[${index}][price]`, value);
        const sellPrice = this.calcSellPrice(
            +value,
            +this.state.formData.items[index].percentage,
            +this.state.formData.items[index].sellPrice
        );
        currentValue.items[index].sellPrice = sellPrice;
        this.setState(
            {
                formData: currentValue,
            },
            () => this.onTotalPriceCalc()
        );
        formikProps.setFieldValue(`${'items'}[${index}][sellPrice]`, sellPrice);
    }

    protected percentageChange(
        value: number,
        index: number,
        formikProps: FormikProps<IPurchaseOrderForm>
    ) {
        console.log(value);
        let currentValue = formikProps.values;
        currentValue.items[index].percentage = value;

        formikProps.setFieldValue(`${'items'}[${index}][percentage]`, value);
        const sellPrice = this.calcSellPrice(
            +formikProps.values.items[index].price,
            +value,
            +formikProps.values.items[index].sellPrice
        );
        currentValue.items[index].sellPrice = sellPrice;
        formikProps.setFieldValue(`${'items'}[${index}][sellPrice]`, sellPrice);
    }

    protected sellPriceOnChange(
        value: number,
        index: number,
        formikProps: FormikProps<IPurchaseOrderForm>
    ) {
        let currentValue = this.state.formData;
        currentValue.items[index].sellPrice = value;

        formikProps.setFieldValue(`${'items'}[${index}][sellPrice]`, value);
        const percentage = this.calcPercentage(
            +this.state.formData.items[index].price,
            +this.state.formData.items[index].percentage,
            +value
        );
        currentValue.items[index].percentage = percentage;
        this.setState({
            formData: currentValue,
        });
        formikProps.setFieldValue(
            `${'items'}[${index}][percentage]`,
            percentage
        );
    }

    protected calcSellPrice(
        cost: number,
        percentage: number,
        sellPrice: number
    ) {
        return (sellPrice = cost + (percentage / 100) * cost);
    }

    protected calcPercentage(
        cost: number,
        percentage: number,
        sellPrice: number
    ) {
        if (cost > 0) {
            return (percentage = (sellPrice - cost) / cost) * 100;
        } else return percentage;
    }
    protected qtyOnChange(
        qty: number,
        index: number,
        formikProps: FormikProps<IPurchaseOrderForm>
    ) {
        let currentValue = this.state.formData;
        currentValue.items[index].qty = qty;
        let products = this.state.skuPicker;
        this.setState({
            formData: currentValue,
        });
        formikProps.setFieldValue(`${'items'}[${index}][qty]`, qty);
        if (!_.isEmpty(products.value) && products.value[index].count) {
            products.value[index].count = qty;
        }
    }

    protected calcDate() {
        let date = new Date();
        let timestamp = date.getTime();
        return timestamp;
    }

    protected removeKey(array: any, key: Array<string>) {
        let arr = array;
        arr.map((item: any) => {
            return key.forEach((e) => delete item[e]);
        });
        return arr;
    }

    protected removeRow(
        index: number,
        formikProps: FormikProps<IPurchaseOrderForm>
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

    protected skuPickerSetValue(formikProps: FormikProps<IPurchaseOrderForm>) {
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

    protected pushItems(
        value: any,
        formikProps: FormikProps<IPurchaseOrderForm>
    ) {
        let values: any = formikProps.values;
        if (value) {
            value.map((item: any, index: number) => {
                return values.items.push({
                    photo: item.sku.medias[0].url,
                    productName: item.sku.product.name.en,
                    skuReadableId: item.sku.readableId,
                    skuId: item.sku.id,
                    qty: item.count,
                    price: item.sku.price?.originalPrice,
                    percentage: 0,
                    sellPrice: item.sku.price?.offPrice,
                    refundType: '601c0a9570151200276c9684',
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

    protected editItems(data: any) {
        let items: any = [];
        if (!_.isEmpty(data)) {
            data.map((i: any) => {
                return items.push({
                    photo: i.sku.medias[0].url,
                    productName: i.sku.product.name.en,
                    skuReadableId: `${i.sku.readableId}`,
                    skuId: i.skuId,
                    qty: +i.qty,
                    price: +i.price,
                    percentage: +i.percentage,
                    sellPrice: this.calcSellPrice(i.price, i.percentage, 0),
                    refundType: i.refundType.id,
                    sku: i.sku,
                });
            });
        }
        return items;
    }

    protected formValidation = Yup.object({
        supplierId: Yup.object()
            .required(Localization.validation.required_field)
            .nullable(),
        type: Yup.object()
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
                    percentage: Yup.string().required(
                        Localization.validation.required_field
                    ),
                })
            )
            .required(Localization.validation.required_field),
    });

    protected form2CreateModel(form: IPurchaseOrderForm): TPurchaseOrderCreate {
        return {
            date: form.date,
            supplierId: form.supplierId?.value,
            warehouseId: form.supplierId?.value,
            type: form.type?.value,
            totalPrice: form.totalPrice,
            currencyUnit: 'KD',
            items: this.removeKey(form.items, [
                'productName',
                'skuReadableId',
                'sellPrice',
                'sku',
                'photo',
            ]),
        };
    }
    protected form2UpdateModel(form: IPurchaseOrderForm): TPurchaseOrderUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IPurchaseOrder): TPurchaseOrderCreate {
        return {
            date: data.date,
            warehouseId: !_.isEmpty(data.supplier)
                ? {
                      value: data.supplier[0].id,
                      label: data.supplier[0].name.en,
                  }
                : undefined,
            supplierId: !_.isEmpty(data.supplier)
                ? {
                      value: data.supplier[0].id,
                      label: data.supplier[0].name.en,
                  }
                : undefined,
            type: {
                value: data.type,
                label: data.type,
            },
            totalPrice: +data.totalPrice,
            currencyUnit: 'KD',
            items: this.editItems(data.items),
        };
    }

    protected async create(formikProps: FormikProps<any>, goBack?: boolean) {
        // TODO: remove all any
        this.setState({ actionBtnLoading: true });
        try {
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

    selectStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            borderBottom: '1px solid #eee',
            color: state.isSelected ? 'blue' : '',
            fontSize: 14,
            backgroundColor: state.isSelected ? '#eee' : '',
            textAlign: 'left',
            cursor: 'pointer',
            ':hover': {
                backgroundColor: '#1f77d0',
                color: '#fff',
            },
        }),
        container: (base: any) => ({
            ...base,
            width: '100%',
        }),
        control: (base: any) => ({
            ...base,
            height: 40,
            minHeight: 32,
            fontSize: 14,
            borderRadius: 0,
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            borderWidth: '0px',
        }),
        dropdownIndicator: (base: any) => ({
            ...base,
            display: 'none',
        }),
        indicatorSeparator: (base: any) => ({
            ...base,
            display: 'none',
        }),
        valueContainer: (base: any) => ({
            ...base,
            padding: 0,
            paddingLeft: 2,
            borderWidth: '0px',
        }),
        menu: (styles: any) => ({
            ...styles,
            backgroundColor: 'white',
            width: '150%',
            borderRadius: '0',
            textAlign: 'center',
            border: '1px solid #dee2e6',
            color: '#707373',
            top: '32px',
            padding: '0',
            boxShadow: '0 !important',
            ':hover': {
                color: '#707373',
            },
        }),
    };

    protected formatOptionLabel = ({ value, label }: any) => (
        <div className="d-flex">
            <div
                className="position-relative "
                style={{ width: '35px', height: '35px' }}
            >
                <div
                    style={{
                        backgroundColor: '#fff',
                        paddingBottom: '100%',
                    }}
                    className="mx-2 position-relative "
                >
                    <img
                        src={value.medias[0].url}
                        alt={label}
                        style={{
                            display: 'block',
                            maxWidth: 'none',
                            maxHeight: 'none',
                            objectFit: 'cover',
                            objectPosition: '50% 50%',
                            top: 0,
                            left: 0,
                        }}
                        className="w-100  position-absolute h-100"
                    />
                </div>
            </div>
            <div className="my-auto">{label}</div>
        </div>
    );
}
