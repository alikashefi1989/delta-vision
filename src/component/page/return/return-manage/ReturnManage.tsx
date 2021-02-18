import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import BaseManage, {
    IPropsBaseManage,
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { ReturnService } from '../../../../service/return.service';
import {
    IReturn,
    TReturnCreate,
    TReturnUpdate,
} from '../../../../model/return.model';

interface IState extends IStateBaseManage<IReturn> {}

interface IProps extends IPropsBaseManage {}

class ReturnManageComponent extends BaseManage<
    IReturn,
    TReturnCreate,
    TReturnUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new ReturnService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.return;

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
export const ReturnManage = connect(
    state2props,
    dispatch2props
)(ReturnManageComponent);
