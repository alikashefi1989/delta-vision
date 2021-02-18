import { IReturn, TReturnCreate, TReturnUpdate } from '../model/return.model';
import { CrudService } from './crud.service';

export class ReturnService extends CrudService<
    IReturn,
    TReturnCreate,
    TReturnUpdate
> {
    crudBaseUrl = 'user'; // TODO : this entity APIs isn't complete on the back-end side because of that this route just mock data and should modify after implementation on the back-end side
}
