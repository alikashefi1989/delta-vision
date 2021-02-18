import { EACTIONS } from '../../ActionEnum';
import { INetworkStatusAction } from '../../action/netwok-status/NetworkStatusAction';
// import { BaseService } from "../../../service/service.base";

export function reducer(state: any, action: INetworkStatusAction): any {
    switch (action.type) {
        case EACTIONS.SET_NETWORK_STATUS:
            return action.payload;
    }
    if (state) {
        return state;
    }
    return 'ONLINE';
    /* if (BaseService.isAppOffline) {
        return NETWORK_STATUS.OFFLINE;
    } else {
        return NETWORK_STATUS.ONLINE;
    } */
}
