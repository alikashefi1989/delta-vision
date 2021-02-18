import { Action } from "redux";
import { EACTIONS } from "../../ActionEnum";
import { NETWORK_STATUS } from "../../../enum/network-status.enum";

export interface INetworkStatusAction extends Action<EACTIONS> {
    payload: NETWORK_STATUS;
}