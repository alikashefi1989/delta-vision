import { BaseModel } from './base.model';
import { IBrand } from './brand.model';
import { ICategory } from './category.model';
import { IMedia } from './media.model';
import { ITag } from './tag.model';
import { IVariation, IVariationItem } from './variation.model';

export interface IProduct extends BaseModel {
    name: { [key: string]: string };
    description: { [key: string]: string };
    slug?: string;
    brand?: IBrand;
    categories?: Array<ICategory>;
    tags?: Array<ITag>;
    isActive?: boolean;
    media?: IMedia;
    tax: boolean;
    price?: any;
    variationValuesList?: Array<IVariationValue>;
    skuList?: Array<ISkuOfProduct>;
}

export type TProductCreate = {
    product: {
        name: { [key: string]: string };
        description: { [key: string]: string };
        slug: string;
        brandId: string;
        categoryIds: Array<string> | undefined;
        tagIds: Array<string> | undefined;
        mediaId?: string;
        isActive: boolean;
        tax: boolean;
        variationValuesList: Array<IVariationValueCreateAndUpdate>;
    };
    hasSkuList: boolean;
    price?: number;
    skuList?: Array<ISkuOfProductCreateAndUpdate>;
};
export type TProductUpdate = TProductCreate;

export interface IVariationValue {
    variation: IVariation;
    values: Array<IVariationItem>;
}

export interface IVariationValueCreateAndUpdate {
    variation: string;
    values: Array<string>;
}

export interface ISkuOfProduct {
    sku?: string;
    varianteName: string;
    medias?: Array<IMedia>;
    variations: Array<{
        variation: IVariation;
        item: IVariationItem;
    }>;
    isDiscountable: boolean;
    barcode?: string;
}

export interface ISkuOfProductCreateAndUpdate {
    sku?: string;
    varianteName: string;
    medias?: Array<string>;
    variations: Array<{
        variationId: string;
        itemId: string;
    }>;
    isDiscountable: boolean;
    barcode?: string;
}
