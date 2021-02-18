import { IPhoneLabel, TPhoneLabelCreate, TPhoneLabelUpdate } from '../model/phoneLabel.model';
import { CrudService } from './crud.service';

export class PhoneLabelService extends CrudService<IPhoneLabel, TPhoneLabelCreate, TPhoneLabelUpdate> {
    crudBaseUrl = 'phoneType';
}
