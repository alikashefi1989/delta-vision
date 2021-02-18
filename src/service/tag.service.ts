import { ITag, TTagCreate, TTagUpdate } from '../model/tag.model';
import { CrudService } from './crud.service';

export class TagService extends CrudService<ITag, TTagCreate, TTagUpdate> {
    crudBaseUrl = 'tag';
}
