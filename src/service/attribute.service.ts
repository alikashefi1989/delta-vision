import { IAttribute, TAttributeCreate, TAttributeUpdate } from '../model/attribute.model';
import { IAPI_Response } from './base.service';
import { CrudService } from './crud.service';

export class AttributeService extends CrudService<IAttribute, TAttributeCreate, TAttributeUpdate> {
    crudBaseUrl = 'attribute';

    setActivation(id: string, isActive: boolean): Promise<IAPI_Response<IAttribute>> {
        return this.axiosTokenInstance.put(`/${this.crudBaseUrl}/activation/${id}`, { isActive });
    }
}