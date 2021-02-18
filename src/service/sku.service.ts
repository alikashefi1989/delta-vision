import { ISku } from '../model/sku.model';
import { CrudService } from './crud.service';

export class SkuService extends CrudService<ISku, any, any> {
    crudBaseUrl = 'sku';

    setActivation(id: string, isActive: boolean): Promise<any> /* TODO: any change to model */ {
        return this.axiosTokenInstance.put(`/${this.crudBaseUrl}/activation/${id}`, { isActive });
    }

    addImage(sku_Id : string , data : {image : string, order : number}): Promise<any> /* TODO: any change to model */{
        return this.axiosTokenInstance.post(`/${this.crudBaseUrl}/${sku_Id}/image/add`, data);
    }

    removeImage(sku_Id : string , data : {imageName : string}): Promise<any> /* TODO: any change to model */{
        return this.axiosTokenInstance.delete(`/${this.crudBaseUrl}/${sku_Id}/image/delete`,{data});
    }
}
