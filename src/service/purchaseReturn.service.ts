import {
    IPurchaseReturn,
    TPurchaseReturnCreate,
    TPurchaseReturnUpdate,
} from '../model/purchaseReturn.model';
import { CrudService } from './crud.service';

export class PurchaseReturnService extends CrudService<
    IPurchaseReturn,
    TPurchaseReturnCreate,
    TPurchaseReturnUpdate
> {
    crudBaseUrl = 'docAcc'; // TODO : this entity APIs isn't complete on the back-end side because of that this route just mock data and should modify after implementation on the back-end side
}
