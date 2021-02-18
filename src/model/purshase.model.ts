import { BaseModel } from './base.model';

export interface IPurshase extends BaseModel {
    [key: string]: any;
}

export type TPurshaseCreate = Omit<IPurshase, keyof BaseModel>;
export type TPurshaseUpdate = TPurshaseCreate;
