import { BaseModel } from './base.model';

export interface IAdjustment extends BaseModel {
    [key: string]: any;
}

export type TAdjustmentCreate = Omit<IAdjustment, keyof BaseModel>;
export type TAdjustmentUpdate = TAdjustmentCreate;
