import { Action } from 'redux';
import { EACTIONS } from '../../ActionEnum';

export interface INetworkStatusAction extends Action<EACTIONS> {
    payload: any;
}
