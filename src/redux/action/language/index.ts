import { EACTIONS } from "../../ActionEnum";
import { ILanguageAction, ILanguage_schema } from "./languageAction";
import { get_reset_language } from '../../reducer/language/index';

export function action_update_language(language: ILanguage_schema): ILanguageAction {
    return {
        type: EACTIONS.UPDATE_LANGUAGE,
        payload: language
    }
}

export function action_reset_language(): ILanguageAction {
    return {
        type: EACTIONS.RESET_LANGUAGE,
        payload: get_reset_language()
    }
}