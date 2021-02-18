import { IWarehouse, TWarehouseCreate, TWarehouseUpdate } from '../model/warehouse.model';
import { IAPI_Response } from './base.service';
import { CrudService } from './crud.service';

export class WarehouseService extends CrudService<IWarehouse, TWarehouseCreate, TWarehouseUpdate> {
    crudBaseUrl = 'warehouse';

    setActivation(id: string, isActive: boolean): Promise<IAPI_Response<IWarehouse>> {
        return this.axiosTokenInstance.put(`/${this.crudBaseUrl}/activation/${id}`, { isActive });
    }
}
