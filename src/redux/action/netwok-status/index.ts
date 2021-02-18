import { INetworkStatusAction } from './NetworkStatusAction';
import { EACTIONS } from '../../ActionEnum';

export function action_set_network_status(
    network_status: string
): INetworkStatusAction {
    return {
        type: EACTIONS.SET_NETWORK_STATUS,
        payload: network_status,
    };
}
