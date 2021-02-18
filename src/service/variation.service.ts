import { ISearchPayload } from '../model/searchPayload.model';
import {
    IVariation,
    IVariationItem,
    IVariationItemCreate,
    TVariationCreate,
    TVariationUpdate,
} from '../model/variation.model';
import { IAPI_Response, IAPI_ResponseList } from './base.service';
import { CrudService } from './crud.service';

export class VariationService extends CrudService<
    IVariation,
    TVariationCreate,
    TVariationUpdate
> {
    crudBaseUrl = 'variation';

    addNewItemToVariation(
        variationId: string,
        item: IVariationItemCreate
    ): Promise<IAPI_Response<IVariationItem>> {
        return this.axiosTokenInstance.post(
            `/${this.crudBaseUrl}/${variationId}/item/add`,
            item
        );
    }

    // need to modify and is not final
    searchItemsOfVariation(
        search: ISearchPayload
    ): Promise<IAPI_ResponseList<IVariationItem>> {
        return this.axiosTokenInstance.post(`variationItem/list`, search);
    }

    setActivation(
        id: string,
        isActive: boolean
    ): Promise<IAPI_Response<IVariation>> {
        return this.axiosTokenInstance.put(
            `/${this.crudBaseUrl}/activation/${id}`,
            { isActive }
        );
    }
}
