import { BaseModel } from './base.model';

export interface IRefundReason extends BaseModel {
    countryId: string;
    flowStatus: string;
    isActive: boolean;
    isDeleted: boolean;
    isUsable: boolean;
    name: { [key: string]: string };
    readableId: number;
    storeId: string;
    type: string;
}

export type TRefundReasonCreate = Omit<IRefundReason, keyof BaseModel>;
export type TRefundReasonUpdate = TRefundReasonCreate;
