import {
    ISupplier,
    TSupplierCreate,
    TSupplierUpdate,
} from '../model/supplier.model';
import { IAPI_Response } from './base.service';
import { CrudService } from './crud.service';

export class SupplierService extends CrudService<
    ISupplier,
    TSupplierCreate,
    TSupplierUpdate
> {
    crudBaseUrl = 'supplier';

    setActivation(
        id: string,
        isActive: boolean
    ): Promise<IAPI_Response<ISupplier>> {
        return this.axiosTokenInstance.put(
            `/${this.crudBaseUrl}/activation/${id}`,
            { isActive }
        );
    }
}
