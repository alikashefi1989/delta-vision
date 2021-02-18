import { CrudService } from './crud.service';
import {
    IRefundReason,
    TRefundReasonCreate,
    TRefundReasonUpdate,
} from '../model/refundReason.model';

export class RefundReasonService extends CrudService<
    IRefundReason,
    TRefundReasonCreate,
    TRefundReasonUpdate
> {
    crudBaseUrl = 'refundReason';
}
