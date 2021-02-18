import {
    IPurshase,
    TPurshaseCreate,
    TPurshaseUpdate,
} from '../model/purshase.model';
import { CrudService } from './crud.service';

export class PurshaseService extends CrudService<
    IPurshase,
    TPurshaseCreate,
    TPurshaseUpdate
> {
    crudBaseUrl = 'docAcc'; // TODO : this entity APIs isn't complete on the back-end side because of that this route just mock data and should modify after implementation on the back-end side
}
