import { Action } from 'redux';
import { EACTIONS } from '../../ActionEnum';

export interface ITokenAction extends Action<EACTIONS> {
    payload: any | null;
}
