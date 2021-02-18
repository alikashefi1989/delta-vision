import { IArea, TAreaCreate, TAreaUpdate } from '../model/area.model';
import { IAPI_Response } from './base.service';
import { CrudService } from './crud.service';

export class AreaService extends CrudService<IArea, TAreaCreate, TAreaUpdate> {
    crudBaseUrl = 'area';

    setActivation(id: string, isActive: boolean): Promise<IAPI_Response<IArea>> {
        return this.axiosTokenInstance.put(`/${this.crudBaseUrl}/activation/${id}`, { isActive });
    }
}
