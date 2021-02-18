import { BaseModel } from './base.model';
import { IMedia } from './media.model';

export interface ICategory extends BaseModel {
    name: { [key: string]: string };
    isActive: boolean;
    attributes?: Array<{ [key: string]: string }>;
    media?: IMedia;
    parentCategory?: ICategory;
    subCategories?: Array<ICategory>;
    storeId?: any;
}

export type TCategoryCreate = Omit<
    ICategory,
    keyof BaseModel | 'media' | 'ParentCategory' | 'SubCategories' | 'isActive'
> & {
    mediaId?: string;
    parentCategoryId?: string;
};

export type TCategoryUpdate = TCategoryCreate;
