import { DIRECTION } from "../enum/direction.enum";
import { BaseModel } from "./base.model";

export interface ILanguage extends BaseModel {
    name: string;
    direction: DIRECTION,
    // code: string;
    identifier: string;
    isActive: boolean;
    isDefault: boolean;
}

export type TLanguageCreate = Omit<ILanguage, keyof BaseModel | 'isActive' | 'isDefault'>;
export type TLanguageUpdate = TLanguageCreate;

export interface ILanguageNCS {
    direction: DIRECTION;
    displayOrder: number;
    // google: string;
    id: number;
    identifier: string;
    name: string;
}
