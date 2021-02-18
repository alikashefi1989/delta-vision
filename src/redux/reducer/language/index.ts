import { EACTIONS } from "../../ActionEnum";
import { ILanguage_schema, ILanguageAction } from "../../action/language/languageAction";

export function get_reset_language(): ILanguage_schema {
    return {
        list: [],
        defaultLanguage: null
    }
}

export function reducer(state: ILanguage_schema, action: ILanguageAction): ILanguage_schema | null {
    switch (action.type) {
        case EACTIONS.UPDATE_LANGUAGE:
            return action.payload;
        case EACTIONS.RESET_LANGUAGE:
            return get_reset_language();
    }
    if (state) { return state; }
    return get_reset_language();
}