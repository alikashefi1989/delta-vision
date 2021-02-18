import { ILanguage, ILanguageNCS, TLanguageCreate, TLanguageUpdate } from '../model/language.model';
import { IAPI_Response, IAPI_ResponseList } from './base.service';
import { CrudService } from './crud.service';

export class LanguageService extends CrudService<ILanguage, TLanguageCreate, TLanguageUpdate> {
    crudBaseUrl = 'lang';

    setActivation(id: string, isActive: boolean): Promise<IAPI_Response<ILanguage>> {
        return this.axiosTokenInstance.put(`/${this.crudBaseUrl}/activation/${id}`, { isActive });
    }

    setAsDefault(id: string): Promise<IAPI_Response<ILanguage>> {
        return this.axiosTokenInstance.put(`/${this.crudBaseUrl}/setDefault/${id}`);
    }

    languageList() : Promise<IAPI_ResponseList<ILanguageNCS>> {
        return this.axiosTokenInstance.get(`https://api.ncs.nizek.com/localization/com.nizek.modish`);
    }
}
