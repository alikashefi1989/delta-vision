import {
    IPurchaseOrder,
    TPurchaseOrderCreate,
    TPurchaseOrderUpdate,
} from '../model/PurchaseOrder.model';
import { CrudService } from './crud.service';

export class PurchaseOrderService extends CrudService<
    IPurchaseOrder,
    TPurchaseOrderCreate,
    TPurchaseOrderUpdate
> {
    crudBaseUrl = 'docAcc'; // TODO : this entity APIs isn't complete on the back-end side because of that this route just mock data and should modify after implementation on the back-end side
}
