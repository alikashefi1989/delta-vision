import {
    combineReducers,
    createStore,
    ReducersMapObject,
    AnyAction,
} from 'redux';
import { redux_state } from './app_state';
import { reducer as UserReducer } from './reducer/user';
import { reducer as InternationalizationReducer } from './reducer/internationalization';
import { Reducer } from 'redux';
import { TInternationalization } from '../config/setup';
import { reducer as TokenReducer } from './reducer/token';
// import { reducer as AuthenticationReducer } from './reducer/authentication';
import { reducer as NetworkStatusReducer } from './reducer/network-status';
import { reducer as ThemeReducer } from './reducer/theme';
import { reducer as LanguageReducer } from './reducer/language';
//
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { ITheme_schema } from './action/theme/themeAction';
// import { TAuthentication_schema } from './action/authentication/authenticationAction';
import { ILanguage_schema } from './action/language/languageAction';

const reducers: ReducersMapObject<redux_state, AnyAction> = {
    logged_in_user: UserReducer as Reducer<any | null, AnyAction>,
    internationalization: InternationalizationReducer as Reducer<
        TInternationalization,
        AnyAction
    >,
    token: TokenReducer as Reducer<any | null, AnyAction>,
    // authentication: AuthenticationReducer as Reducer<TAuthentication_schema, AnyAction>,
    network_status: NetworkStatusReducer as Reducer<any, AnyAction>,
    theme: ThemeReducer as Reducer<ITheme_schema, AnyAction>,
    language: LanguageReducer as Reducer<ILanguage_schema, AnyAction>,
};

const main_reducer = combineReducers(reducers);

const persistConfig = {
    key: 'root',
    storage,
    // blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, main_reducer);

export const Store2 = createStore(persistedReducer);
export const persistor = persistStore(Store2);
