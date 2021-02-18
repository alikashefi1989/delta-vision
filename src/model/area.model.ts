import { BaseModel } from "./base.model";
import { ICountry } from "./country.model";

export interface IArea extends BaseModel {
  name: { [key: string]: string };
  country?: ICountry;
  isActive: boolean;
  location: [number, number];
}

export type TAreaCreate = Omit<
  IArea,
  keyof BaseModel | "country" | "isActive"
> & {
  countryId: string;
};

export type TAreaUpdate = Omit<IArea, keyof BaseModel | "country"> & {
  countryId: string;
};
