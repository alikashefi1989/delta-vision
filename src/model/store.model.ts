import { BaseModel } from './base.model';
import { ICountry } from './country.model';
import { IMedia } from './media.model';
import { IPhoneLabel } from './phoneLabel.model';

export interface IStore extends BaseModel {
    name: { [key: string]: string };
    media?: IMedia;
    phoneList?: Array<{ number: string; type: IPhoneLabel }>;
    isActive?: boolean;
    country: ICountry;
    defaultPercentage?: number;
}

export type TStoreCreate = Omit<
    IStore,
    keyof BaseModel | 'media' | 'phoneList' | 'isActive'
> & {
    mediaId?: string;
    phoneList?: Array<{ number: string; typeId: string }>;
    countryId: string;
    defaultPercentage?: number;
};
export type TStoreUpdate = TStoreCreate;
