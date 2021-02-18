import { Action } from 'redux';
import { EACTIONS } from '../../ActionEnum';

export interface UserAction extends Action<EACTIONS> {
    payload: any | null;
}
