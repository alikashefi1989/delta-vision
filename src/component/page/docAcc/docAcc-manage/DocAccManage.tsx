import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import BaseManage, {
    IPropsBaseManage,
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { DocAccService } from '../../../../service/docAcc.service';
import {
    IDocAcc,
    TDocAccCreate,
    TDocAccUpdate,
} from '../../../../model/docAcc.model';

interface IState extends IStateBaseManage<IDocAcc> {}

interface IProps extends IPropsBaseManage {}

class DocAccManageComponent extends BaseManage<
    IDocAcc,
    TDocAccCreate,
    TDocAccUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new DocAccService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.docAcc;

    async componentDidMount() {
        this.handlChangeLazyLoad(true);
        this.fetchFilters();
        this.fetchColumns();
        await this.fetchData();
        this.checkScrollEnded();
    }
}

const state2props = (state: redux_state) => {
    return { internationalization: state.internationalization };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {};
};
export const DocAccManage = connect(
    state2props,
    dispatch2props
)(DocAccManageComponent);
