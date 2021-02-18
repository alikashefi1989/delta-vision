import { Action } from "redux";
import { ILanguage } from "../../../model/language.model";
import { EACTIONS } from "../../ActionEnum";

export interface ILanguage_schema {
    list: Array<ILanguage>;
    defaultLanguage: ILanguage | null;
}

export interface ILanguageAction extends Action<EACTIONS> {
    payload: ILanguage_schema;
}