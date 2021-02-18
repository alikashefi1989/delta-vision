import { EACTIONS } from '../../ActionEnum';
import { ITokenAction } from './tokenAction';

export function action_set_token(token: any): ITokenAction {
    return {
        type: EACTIONS.SET_TOKEN,
        payload: token,
    };
}

export function action_remove_token(): ITokenAction {
    return {
        type: EACTIONS.REMOVE_TOKEN,
        payload: null,
    };
}
