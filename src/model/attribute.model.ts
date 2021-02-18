import { BaseModel } from "./base.model";

export interface IAttribute extends BaseModel {
    name: { [key: string]: string; };
    value: { [key: string]: string; };
    isActive?: boolean;
}

export type TAttributeCreate = Omit<IAttribute, keyof BaseModel | 'isActive'>;
export type TAttributeUpdate = TAttributeCreate