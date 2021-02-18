import {
    IContact,
    TContactCreate,
    TContactUpdate,
} from '../model/contact.model';
import { CrudService } from './crud.service';

export class ContactService extends CrudService<
    IContact,
    TContactCreate,
    TContactUpdate
> {
    crudBaseUrl = 'contact'; // TODO : this entity APIs isn't complete on the back-end side because of that this route just mock data and should modify after implementation on the back-end side
}
