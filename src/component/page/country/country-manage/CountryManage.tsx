import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import {
    ICountry,
    TCountryCreate,
    TCountryUpdate,
} from '../../../../model/country.model';
import { CountryService } from '../../../../service/country.service';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import BaseManage, {
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

interface IState extends IStateBaseManage<ICountry> {}
interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
}

class CountryManageComponent extends BaseManage<
    ICountry,
    TCountryCreate,
    TCountryUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new CountryService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.country;
    protected titleBaseCRUD = Localization.country;

    async componentDidMount() {
        await this.handlChangeLazyLoad(true);
        await this.fetchData();
        this.fetchFilters();
        this.fetchColumns();
        this.checkScrollEnded();
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    protected filterOutspread() {
        const filterOutspread = this.state.filterOutspread;
        if (filterOutspread.nameStartWith !== '') {
            return {
                [`name.${this.defaultLangCode}`]: {
                    $regex: `^${filterOutspread.nameStartWith}`,
                    $options: 'i',
                },
            };
        }
    }

    protected removeModalInfoLabel(chosenRow?: ICountry): string | undefined {
        return chosenRow?.name[this.defaultLangCode];
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language,
    };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {};
};
export const CountryManage = connect(
    state2props,
    dispatch2props
)(CountryManageComponent);
