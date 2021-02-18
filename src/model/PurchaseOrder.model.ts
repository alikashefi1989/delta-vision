import { BaseModel } from './base.model';
import { ISku } from './sku.model';
import { ISupplier } from './supplier.model';

export interface IPurchaseOrder extends BaseModel {
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
        photo?: string;
        price: number;
        qty: number;
        percentage: number;
        skuId: string;
        sku: ISku;
    }>;
}

export type TPurchaseOrderCreate = {
    date: number;
    type:
        | string
        | undefined
        | {
              label: string;
              value: string;
          };
    totalPrice: number;
    currencyUnit: string;
    items: [
        {
            photo?: string;
            skuId: string;
            skuReadableId?: string;
            qty: number;
            price: number;
            percentage: number;
            refundType: string;
            productName?: string;
            sellPrice?: string;
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
    warehouseId:
        | string
        | undefined
        | {
              label: string;
              value: string;
          };
};
export type TPurchaseOrderUpdate = TPurchaseOrderCreate;
