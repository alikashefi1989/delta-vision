import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import BaseManage, {
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { IUser, TUserCreate, TUserUpdate } from '../../../../model/user.model';
import { UserService } from '../../../../service/user.service';

interface IState extends IStateBaseManage<IUser> {
    filterOutspread: { nameStartWith: string; isCustomer: boolean };
}

interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
}

class UserManageComponent extends BaseManage<
    IUser,
    TUserCreate,
    TUserUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        filterOutspread: {
            ...this.baseState.filterOutspread,
            isCustomer: true,
        },
    };

    protected _entityService = new UserService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.user;
    protected titleBaseCRUD = Localization.customer;

    async componentDidMount() {
        await this.handlChangeLazyLoad(true);
        await this.fetchData();
        this.fetchFilters();
        this.fetchColumns();
        this.checkScrollEnded();
    }

    protected filter() {
        let filter = super.filter();
        // let filter = { ...this.state.filter };
        // /** remove invisible filter */
        // const fv = this.state.filterVisibility;
        // Object.keys(fv).forEach(v => {
        //     if (fv[v] === false) delete filter[this.F2FReplaceSymbolWith(v)];
        // });

        // const filterOutspread = this.state.filterOutspread; // commented this line --> uncomment ME
        // if (filterOutspread.nameStartWith !== '') {
        // filter = { $and: [filter, { isCustomer: filterOutspread.isCustomer }] }; // commented this line --> uncomment ME
        // }

        return filter;
        // return { isCustomer: true }
    }

    protected removeModalInfoLabel(chosenRow?: IUser): string | undefined {
        return chosenRow?.name;
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
export const UserManage = connect(
    state2props,
    dispatch2props
)(UserManageComponent);
