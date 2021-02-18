import { TInternationalization } from '../config/setup';
import { ITheme_schema } from './action/theme/themeAction';
import { TAuthentication_schema } from './action/authentication/authenticationAction';
import { ILanguage_schema } from './action/language/languageAction';

export interface redux_state {
    logged_in_user: any | null;
    internationalization: TInternationalization;
    token: any | null;
    // authentication: TAuthentication_schema;
    network_status: any;
    theme: ITheme_schema;
    language: ILanguage_schema;
}
