import { BaseModel } from './base.model';
import { IMedia } from './media.model';

export interface IBrand extends BaseModel {
    name: { [key: string]: string };
    media?: IMedia;
}

export type TBrandCreate = Omit<IBrand, keyof BaseModel | 'media'> & {
    mediaId?: string;
};
export type TBrandUpdate = TBrandCreate;
