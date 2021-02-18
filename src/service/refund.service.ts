import { CrudService } from './crud.service';
import { IRefund, TRefundCreate, TRefundUpdate } from '../model/refund.model';

export class RefundService extends CrudService<
    IRefund,
    TRefundCreate,
    TRefundUpdate
> {
    crudBaseUrl = 'refund';
}
