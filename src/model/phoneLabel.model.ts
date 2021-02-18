import { BaseModel } from "./base.model";

export interface IPhoneLabel extends BaseModel {
    id: string;
    style?: { [key: string]: any } | string;
    title?: { [key: string]: string; };
}

export type TPhoneLabelCreate = Omit<IPhoneLabel, 'id'>;
export type TPhoneLabelUpdate = TPhoneLabelCreate;
