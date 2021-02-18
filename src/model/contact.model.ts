import { BaseModel } from './base.model';

export interface IContact extends BaseModel {
    name: string;
    phoneNumber: string;
    mobileNumber: string;
    email: string;
    title: string;
    readableId: string;
}

export type TContactCreate = Omit<IContact, keyof BaseModel | 'readableId'> & {
    countryId: string;
};
export type TContactUpdate = TContactCreate;
