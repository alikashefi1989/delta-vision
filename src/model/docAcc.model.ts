import { BaseModel } from "./base.model";

export interface IDocAcc extends BaseModel {
  [key: string]: any;
}

export type TDocAccCreate = Omit<IDocAcc, keyof BaseModel>;
export type TDocAccUpdate = TDocAccCreate;