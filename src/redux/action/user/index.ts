import { UserAction } from './UserAction';
import { EACTIONS } from '../../ActionEnum';

export function action_user_logged_in(user: any): UserAction {
    return {
        type: EACTIONS.LOGGED_IN,
        payload: user,
    };
}

export function action_user_logged_out(): UserAction {
    return {
        type: EACTIONS.LOGGED_OUT,
        payload: null,
    };
}
