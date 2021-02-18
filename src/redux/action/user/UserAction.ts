import { Action } from "redux";
import { EACTIONS } from "../../ActionEnum";
import { IUser } from "../../../model/user.model";

export interface UserAction extends Action<EACTIONS> {
    payload: IUser | null;
}