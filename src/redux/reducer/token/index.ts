import { EACTIONS } from '../../ActionEnum';
import { ITokenAction } from '../../action/token/tokenAction';

export function reducer(
    state: string | null,
    action: ITokenAction
): string | null {
    switch (action.type) {
        case EACTIONS.SET_TOKEN:
            return action.payload;
        case EACTIONS.REMOVE_TOKEN:
            return action.payload;
    }
    if (state) {
        return state;
    }
    return null;
}
