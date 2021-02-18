import { ICountry, TCountryCreate, TCountryUpdate } from '../model/country.model';
import { CrudService } from './crud.service';

export class CountryService extends CrudService<ICountry, TCountryCreate, TCountryUpdate> {
    crudBaseUrl = 'country';
}