import { BaseModel } from './base.model';
import { IRefundReason } from './refundReason.model';
import { ISku } from './sku.model';
import { ISupplier } from './supplier.model';

export interface IPurchaseReturn extends BaseModel {
    currencyUnit: string;
    date: number;
    isActive: boolean;
    supplierId: string;
    isDeleted: boolean;
    type: string;
    totalPrice: number;
    invoiceType: string;
    readableId: string;
    status: string;
    supplier: Array<ISupplier>;
    items: Array<{
        productName?: string;
        skuId: string;
        skuReadableId: string;
        qty: number;
        price: number;
        refundTypeId: string;
        refundType: IRefundReason;
        sku?: ISku;
    }>;
}

export type TPurchaseReturnCreate = {
    date: number;
    type: string;
    totalPrice: number;
    currencyUnit: string;
    returnFromDocAccountId?: string;
    items: [
        {
            skuId: string;
            skuReadableId?: string;
            qty: number;
            price: number;
            refundType: string;
            productName?: string;
            sku?: ISku;
        }
    ];
    supplierId:
        | string
        | undefined
        | {
              label: string;
              value: string;
          };
};

export type TPurchaseReturnUpdate = TPurchaseReturnCreate;
