import {
    BaseService,
    IAPI_ResponseList,
    IAPI_Response,
    IAPI_ResponseMeta,
} from './base.service';
import { ISearchPayload } from '../model/searchPayload.model';
import { IDynamicFilter } from '../model/dynamicFilter.model';
import { IColumn } from '../model/column.model';
import { IEntityRelated } from '../model/related.model';
export interface IAPI_ResponseList_filters {
    data: {
        data: {
            items: Array<IDynamicFilter>;
        };
        meta: IAPI_ResponseMeta;
    };
}

export abstract class CrudService<
    EntityModel,
    EntityModelCreate,
    EntityModelUpdate
> extends BaseService {
    abstract crudBaseUrl: string;

    search(search: ISearchPayload): Promise<IAPI_ResponseList<EntityModel>> {
        return this.axiosTokenInstance.post(
            `/${this.crudBaseUrl}/list`,
            search
        );
    }

    all(limit: number = 1000): Promise<IAPI_ResponseList<EntityModel>> {
        return this.axiosTokenInstance.post(`/${this.crudBaseUrl}/list`, {
            pagination: { page: 0, limit },
        });
    }

    create(create: EntityModelCreate): Promise<IAPI_Response<EntityModel>> {
        return this.axiosTokenInstance.post(`/${this.crudBaseUrl}/add`, create);
    }

    update(
        update: EntityModelUpdate,
        id: string
    ): Promise<IAPI_Response<EntityModel>> {
        return this.axiosTokenInstance.put(
            `/${this.crudBaseUrl}/edit/${id}`,
            update
        );
    }

    remove(id: string): Promise<IAPI_Response<any>> {
        // TODO: check me.
        return this.axiosTokenInstance.delete(
            `/${this.crudBaseUrl}/delete/${id}`
        );
    }

    byId(id: string): Promise<IAPI_Response<EntityModel>> {
        return this.axiosTokenInstance.get(`/${this.crudBaseUrl}/${id}`);
    }

    filters(): Promise<IAPI_ResponseList_filters> {
        // return this.axiosTokenInstance.get(`/${this.crudBaseUrl}/filterOption`);
        return this.axiosTokenInstance.get(
            `/model/filterOptions/${this.crudBaseUrl}`
        );
    }

    columns(): Promise<IAPI_Response<IColumn>> {
        return this.axiosTokenInstance.get(`/model/view/${this.crudBaseUrl}`);
    }

    relatedList(
        id: string
    ): Promise<IAPI_Response<{ related: Array<IEntityRelated> }>> {
        return this.axiosTokenInstance.get(
            `/model/related/${this.crudBaseUrl}/${id}`
        );
    }

    userRelatedList(): Promise<IAPI_Response<{ items: Array<string> }>> {
        return this.axiosTokenInstance.get(
            `/userModelView/getRelated/${this.crudBaseUrl}`
        );
    }

    saveRelatedList(update: {
        items: Array<String>;
    }): Promise<IAPI_Response<IEntityRelated>> {
        return this.axiosTokenInstance.post(
            `userModelView/setRelated/${this.crudBaseUrl}`,
            update
        );
    }

    /**
     * @param search
     * @param relatedId
     * @param entityId
     */
    relatedSearch(
        search: ISearchPayload,
        relatedId: string,
        entityId: string
    ): Promise<IAPI_ResponseList<EntityModel>> {
        const obj = { params: { id: entityId }, ...search };
        return this.axiosTokenInstance.post(
            `/relaitedView/run/${relatedId}`,
            obj
        );
    }
}
