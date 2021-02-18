import { BaseModel } from "./base.model";

export interface IWarehouse extends BaseModel {
    name: { [key: string]: string; };
    country?: IWarehouse;
    isActive: boolean;
    code: string;
    // location
    isInternational: boolean;
}

export type TWarehouseCreate = Omit<
    IWarehouse, keyof BaseModel | 'country'  | 'isActive' | 'code' // | 'isInternational'
> & {
    countryId: string;
    location?: [number, number];
    
    // TODO
    isActive?: boolean;
    code?: string;
    // isInternational?: boolean;
};

export type TWarehouseUpdate = TWarehouseCreate;
