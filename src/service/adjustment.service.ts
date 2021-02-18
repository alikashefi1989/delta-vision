import {
    IAdjustment,
    TAdjustmentCreate,
    TAdjustmentUpdate,
} from '../model/adjustment.model';
import { CrudService } from './crud.service';

export class AdjustmentService extends CrudService<
    IAdjustment,
    TAdjustmentCreate,
    TAdjustmentUpdate
> {
    crudBaseUrl = 'adjustment';
}
