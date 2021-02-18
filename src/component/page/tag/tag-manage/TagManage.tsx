import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import BaseManage, {
    IPropsBaseManage,
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { TagService } from '../../../../service/tag.service';
import { ITag, TTagCreate, TTagUpdate } from '../../../../model/tag.model';
import { TInternationalization } from '../../../../config/setup';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';

interface IState extends IStateBaseManage<ITag> {}

interface IProps extends IPropsBaseManage {
    internationalization: TInternationalization;
    language: ILanguage_schema;
}

class TagManageComponent extends BaseManage<
    ITag,
    TTagCreate,
    TTagUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new TagService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.tag;

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

    protected removeModalInfoLabel(chosenRow?: ITag): string | undefined {
        return chosenRow?.title[this.defaultLangCode];
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
export const TagManage = connect(
    state2props,
    dispatch2props
)(TagManageComponent);
