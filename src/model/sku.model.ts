import { BaseModel } from './base.model';
import { IMedia } from './media.model';
import { IProduct } from './product.model';
import { IVariationItem } from './variation.model';

export interface ISku extends BaseModel {
    barcode?: string;
    medias: Array<IMedia>;
    defaultSkuImage?: Array<IMedia>;
    isActive: boolean;
    isDeleted?: boolean;
    sku: string;
    isDiscountable?: boolean;
    variantName?: string;
    // ['product.name']: { [key: string]: string };
    product: IProduct;
    variations: Array<{
        id: string;
        name: { [key: string]: string };
        item: IVariationItem;
    }>;
    productId?: string;
    flowStatus?: string;
    readableId: string;
    price?: {
        expire_at: number;
        offPrice: number;
        originalPrice: number;
        title: string;
    };
    varis?: {
        Color: string;
        Size: string;
    };
    skuId?: string;
    skuReadableId?: string;
}
