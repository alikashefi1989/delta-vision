import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import BaseManage, {
    IPropsBaseManage,
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { CouponService } from '../../../../service/coupon.service';
import {
    ICoupon,
    TCouponCreate,
    TCouponUpdate,
} from '../../../../model/coupon.model';

interface IState extends IStateBaseManage<ICoupon> {}

interface IProps extends IPropsBaseManage {}

class CouponManageComponent extends BaseManage<
    ICoupon,
    TCouponCreate,
    TCouponUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new CouponService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.coupon;

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
export const CouponManage = connect(
    state2props,
    dispatch2props
)(CouponManageComponent);
