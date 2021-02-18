import { Action } from 'redux';
import { EACTIONS } from '../../ActionEnum';

export interface ILanguage_schema {
    list: Array<any>;
    defaultLanguage: any | null;
}

export interface ILanguageAction extends Action<EACTIONS> {
    payload: ILanguage_schema;
}
