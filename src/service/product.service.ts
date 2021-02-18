import {
    IProduct,
    TProductCreate,
    TProductUpdate,
} from '../model/product.model';
import { CrudService } from './crud.service';
import { IAPI_Response } from './base.service';

export class ProductService extends CrudService<
    IProduct,
    TProductCreate,
    TProductUpdate
> {
    crudBaseUrl = 'product';

    create(create: TProductCreate): Promise<IAPI_Response<IProduct>> {
        return this.axiosTokenInstance.post(
            `/${this.crudBaseUrl}/addCompleteProduct`,
            create
        );
    }

    update(
        update: TProductUpdate,
        id: string
    ): Promise<IAPI_Response<IProduct>> {
        return this.axiosTokenInstance.put(
            `/${this.crudBaseUrl}/updateCompleteProduct/${id}`,
            update
        );
    }

    byId(id: string): Promise<IAPI_Response<IProduct>> {
        return this.axiosTokenInstance.get(
            `/${this.crudBaseUrl}/fullDetail/${id}`
        );
    }

    setActivation(
        id: string,
        isActive: boolean
    ): Promise<any> /* TODO: any change to model */ {
        return this.axiosTokenInstance.put(
            `/${this.crudBaseUrl}/activation/${id}`,
            { isActive }
        );
    }

    generateSku(
        product_id: string,
        data: any
    ): Promise<any> /* TODO: any change to model */ {
        return this.axiosTokenInstance.post(
            `/${this.crudBaseUrl}/${product_id}/sku/generate`,
            data
        );
    }

    setDefaultSku(
        product_id: string,
        sku_id: string
    ): Promise<any> /* TODO: any change to model */ {
        return this.axiosTokenInstance.put(
            `/${this.crudBaseUrl}/${product_id}/sku/default/${sku_id}`
        );
    }

    addAttribute(
        product_id: string,
        data: any
    ): Promise<any> /* TODO: any change to model */ {
        return this.axiosTokenInstance.post(
            `/${this.crudBaseUrl}/${product_id}/attribute/add`,
            data
        );
    }

    deleteAnAttribute(
        product_id: string,
        attribute_id: string
    ): Promise<any> /* TODO: any change to model */ {
        return this.axiosTokenInstance.delete(
            `/${this.crudBaseUrl}/${product_id}/attribute/delete/${attribute_id}`
        );
    }

    addProductToCategory(
        product_id: string,
        category_id: string
    ): Promise<any> /* TODO: any change to model */ {
        return this.axiosTokenInstance.put(
            `/${this.crudBaseUrl}/${product_id}/category/add/${category_id}`
        );
    }

    deleteProductFromCategory(
        product_id: string,
        attribute_id: string
    ): Promise<any> /* TODO: any change to model */ {
        return this.axiosTokenInstance.delete(
            `/${this.crudBaseUrl}/${product_id}/category/delete/${attribute_id}`
        );
    }
}
