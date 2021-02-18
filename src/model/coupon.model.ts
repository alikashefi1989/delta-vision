import { BaseModel } from "./base.model";

export interface ICoupon extends BaseModel {
  [key: string]: any;
}

export type TCouponCreate = Omit<ICoupon, keyof BaseModel>;
export type TCouponUpdate = TCouponCreate;