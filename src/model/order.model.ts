import { IArea } from './area.model';
import { BaseModel } from './base.model';
import { ICountry } from './country.model';
import { ICoupon } from './coupon.model';
import { ISku } from './sku.model';
import { IUser } from './user.model';

export interface IOrderDetail {
    Avenue: string;
    Block: string;
    Building: string;
    Floor: string;
    Note: string;
    PhoneNumber: string;
    Street: string;
}

export interface IItem {
    reasonId: string;
    price: number;
    qty: number;
    percentage: number;
    skuId: string;
    sku: ISku;
}

export interface IOrder extends BaseModel {
    shipping: number;
    currencySymbol: string;
    normalId: string;
    readableId: string;
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
    subTotal: number;
    items: IItem[];
}

export type TOrderCreate = Omit<
    IOrder,
    | keyof BaseModel
    | 'shipping'
    | 'currencySymbol'
    | 'normalId'
    | 'items'
    | 'subTotal'
>;
export type TOrderUpdate = TOrderCreate;
