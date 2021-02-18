import { IStore, TStoreCreate, TStoreUpdate } from '../model/store.model';
import { IAPI_Response } from './base.service';
import { CrudService } from './crud.service';

export class StoreService extends CrudService<IStore, TStoreCreate, TStoreUpdate> {
    crudBaseUrl = 'store';

    setActivation(id: string, isActive: boolean): Promise<IAPI_Response<IStore>> {
        return this.axiosTokenInstance.put(`/${this.crudBaseUrl}/activation/${id}`, { isActive });
    }
}
