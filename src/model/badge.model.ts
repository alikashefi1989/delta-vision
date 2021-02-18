import { BaseModel } from "./base.model";

export interface IBadge extends BaseModel {
  [key: string]: any;
}

export type TBadgeCreate = Omit<IBadge, keyof BaseModel>;
export type TBadgeUpdate = TBadgeCreate;