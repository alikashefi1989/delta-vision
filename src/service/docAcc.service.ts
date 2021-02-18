import { IDocAcc, TDocAccCreate, TDocAccUpdate } from '../model/docAcc.model';
import { CrudService } from './crud.service';

export class DocAccService extends CrudService<IDocAcc, TDocAccCreate, TDocAccUpdate> {
    crudBaseUrl = 'docAcc';
}
