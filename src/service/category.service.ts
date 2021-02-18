import { ICategory, TCategoryCreate, TCategoryUpdate } from '../model/category.model';
import { IAPI_Response } from './base.service';
import { CrudService } from './crud.service';

export class CategoryService extends CrudService<ICategory, TCategoryCreate, TCategoryUpdate> {
    crudBaseUrl = 'category';

    setActivation(id: string, isActive: boolean): Promise<IAPI_Response<ICategory>> {
        return this.axiosTokenInstance.put(`/${this.crudBaseUrl}/activation/${id}`, { isActive });
    }

    getCategoryTree() {
        return this.axiosTokenInstance.get(`/${this.crudBaseUrl}/tree`);
    }
}
