import { Action } from "redux";
import { EACTIONS } from "../../ActionEnum";
import { IToken } from "../../../model/token.model";

export interface ITokenAction extends Action<EACTIONS> {
    payload: IToken| null;
}