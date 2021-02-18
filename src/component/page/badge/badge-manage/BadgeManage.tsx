import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import BaseManage, {
    IPropsBaseManage,
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { BadgeService } from '../../../../service/badge.service';
import {
    IBadge,
    TBadgeCreate,
    TBadgeUpdate,
} from '../../../../model/badge.model';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';

interface IState extends IStateBaseManage<IBadge> {}

interface IProps extends IPropsBaseManage {
    language: ILanguage_schema;
}

class BadgeManageComponent extends BaseManage<
    IBadge,
    TBadgeCreate,
    TBadgeUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new BadgeService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.badge;

    async componentDidMount() {
        this.handlChangeLazyLoad(true);
        this.fetchFilters();
        this.fetchColumns();
        await this.fetchData();
        this.checkScrollEnded();
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    protected filterOutspread() {
        const filterOutspread = this.state.filterOutspread;
        if (filterOutspread.nameStartWith !== '') {
            return {
                [`title.${this.defaultLangCode}`]: {
                    $regex: `^${filterOutspread.nameStartWith}`,
                    $options: 'i',
                },
            };
        }
    }

    protected removeModalInfoLabel(chosenRow?: IBadge): string | undefined {
        return chosenRow?.id; // TODO: change to readableId
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
export const BadgeManage = connect(
    state2props,
    dispatch2props
)(BadgeManageComponent);
