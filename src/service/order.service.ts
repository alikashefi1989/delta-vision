import { IOrder, TOrderCreate, TOrderUpdate } from '../model/order.model';
import { CrudService } from './crud.service';

export class OrderService extends CrudService<IOrder, TOrderCreate, TOrderUpdate> {
    crudBaseUrl = 'order';
}
