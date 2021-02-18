import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import BaseManage, {
    IPropsBaseManage,
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { PurshaseService } from '../../../../service/purshase.service';
import {
    IPurshase,
    TPurshaseCreate,
    TPurshaseUpdate,
} from '../../../../model/purshase.model';

interface IState extends IStateBaseManage<IPurshase> {}

interface IProps extends IPropsBaseManage {}

class PurshaseManageComponent extends BaseManage<
    IPurshase,
    TPurshaseCreate,
    TPurshaseUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new PurshaseService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.purshase;

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
export const PurshaseManage = connect(
    state2props,
    dispatch2props
)(PurshaseManageComponent);
