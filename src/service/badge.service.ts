import { IBadge, TBadgeCreate, TBadgeUpdate } from '../model/badge.model';
import { CrudService } from './crud.service';

export class BadgeService extends CrudService<IBadge, TBadgeCreate, TBadgeUpdate> {
    crudBaseUrl = 'badge';
}