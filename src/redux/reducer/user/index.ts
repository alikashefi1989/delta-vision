import { UserAction } from '../../action/user/UserAction';
import { EACTIONS } from '../../ActionEnum';

export function reducer(
    state: any | null | undefined,
    action: UserAction
): any | null {
    switch (action.type) {
        case EACTIONS.LOGGED_IN:
            return action.payload;
        case EACTIONS.LOGGED_OUT:
            return action.payload;
    }
    if (state) {
        return state;
    }
    return null;
}
