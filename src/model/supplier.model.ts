import { BaseModel } from './base.model';

export interface ISupplier extends BaseModel {
    address: string;
    countryId?: string;
    name: { [key: string]: string };
    mediaId: string;
    phoneList?: Array<string>;
    isActive?: boolean;
}

export type TSupplierCreate = Omit<
    ISupplier,
    keyof BaseModel | 'media' | 'phoneList' | 'isActive'
> & {
    mediaId?: string;
    phoneList?: Array<{ number: string; typeId: string }>;
    countryId: string;
    defaultPercentage?: number;
};
export type TSupplierUpdate = TSupplierCreate;
