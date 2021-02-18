import { IBrand, TBrandCreate, TBrandUpdate } from '../model/brand.model';
import { IAPI_Response } from './base.service';
import { CrudService } from './crud.service';

export class BrandService extends CrudService<IBrand, TBrandCreate, TBrandUpdate> {
    crudBaseUrl = 'brand';

    setActivation(id: string, isActive: boolean): Promise<IAPI_Response<IBrand>> {
        return this.axiosTokenInstance.put(`/${this.crudBaseUrl}/activation/${id}`, { isActive });
    }
}
