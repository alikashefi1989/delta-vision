import { IUser } from '../model/user.model';
import { TInternationalization } from '../config/setup';
import { IToken } from '../model/token.model';
import { NETWORK_STATUS } from '../enum/network-status.enum';
import { ITheme_schema } from './action/theme/themeAction';
import { TAuthentication_schema } from './action/authentication/authenticationAction';
import { ILanguage_schema } from './action/language/languageAction';

export interface redux_state {
    logged_in_user: IUser | null;
    internationalization: TInternationalization;
    token: IToken | null;
    // authentication: TAuthentication_schema;
    network_status: NETWORK_STATUS;
    theme: ITheme_schema;
    language: ILanguage_schema;
}
