import { BaseModel } from "./base.model";

export interface ICountry extends BaseModel {
    name: { [key: string]: string; };
    currency: { [key: string]: string; };
    code: string;
    location: [number, number];
    currencySymbol: string;
}

export type TCountryCreate = Omit<ICountry, keyof BaseModel >;
export type TCountryUpdate = TCountryCreate;
