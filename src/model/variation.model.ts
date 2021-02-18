import { BaseModel } from './base.model';

export interface IVariationItem {
    id: string;
    name: { [key: string]: string };
    values: Array<string>;
}

export interface IVariationItemCreate {
    name: { [key: string]: string };
    values: Array<string>;
}

export interface IVariation extends BaseModel {
    name: { [key: string]: string };
    type: number;
    isActive?: boolean;
    items: Array<IVariationItem>;
    Items: Array<IVariationItem>;
}

export type TVariationCreate = Omit<
    IVariation,
    keyof BaseModel | 'isActive' | 'items' | 'Items'
> & {
    items: Array<Omit<IVariationItem, 'id'>>;
};
export type TVariationUpdate = TVariationCreate;
