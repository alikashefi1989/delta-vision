import { IArea } from './area.model';
import { BaseModel } from './base.model';
import { ICountry } from './country.model';
import { ICoupon } from './coupon.model';
import { IOrderDetail } from './order.model';
import { IRefundReason } from './refundReason.model';
import { ISku } from './sku.model';
import { IUser } from './user.model';

export enum PurchaseType {
    WALLET = 'wallet',
    CASH = 'cash',
}

export interface IItem {
    reasonId: string;
    reason: IRefundReason;
    price: number;
    qty: number;
    percentage: number;
    skuId: string;
    sku: ISku;
}

export interface IRefund extends BaseModel {
    addressId: string;
    currencyRate: number;
    deleteStatus: string;
    extraDetail: {
        customer: IUser;
        coupon: ICoupon;
        address: {
            area: IArea;
            country: ICountry;
            createdAt: number;
            detail: IOrderDetail;
            flowStatus: string;
            id: string;
            isActive: boolean;
            isDeleted: boolean;
            name: string;
            postalCode: string;
            updatedAt: number;
        };
    };
    flowStatus: string;
    isActive: boolean;
    isDeleted: boolean;
    items: IItem[];
    normalId: number;
    returnPaymentType: PurchaseType;
    qrcode: string;
    readableId: string;
    returnAmount: number;
    returnOrderId: string;
    returnStatus: string;
    status: string;
    subTotal: number;
    userId: string;
}

export type TRefundCreate = {
    orderId: string;
    items: {
        skuId: string;
        qty: number;
        price: number;
        reason: string;
    }[];
    amount: number;
    type: PurchaseType;
};
export type TRefundUpdate = TRefundCreate;
