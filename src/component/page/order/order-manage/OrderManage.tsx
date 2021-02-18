import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import TopBarProgress from 'react-topbar-progress-indicator';
import BaseManage, { IPropsBaseManage, IStateBaseManage } from '../../_base/BaseManage/BaseManage';
import { TAppColumn } from '../../../tool/AppGrid';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { OrderService } from '../../../../service/order.service';
import { IOrder, TOrderCreate, TOrderUpdate } from '../../../../model/order.model';

interface IState extends IStateBaseManage<IOrder> {
}

interface IProps extends IPropsBaseManage {
}

class OrderManageComponent extends BaseManage<
    IOrder, TOrderCreate, TOrderUpdate,
    IProps, IState
    > {

    state: IState = {
        ...this.baseState,
    };

    columns: Array<TAppColumn<any>> = [];

    protected _entityService = new OrderService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.order;

    async componentDidMount() {
        this.handlChangeLazyLoad(true)
        this.fetchFilters();
        this.fetchColumns();
        await this.fetchData();
        this.checkScrollEnded();
    }

    render() {
        return (
            <>
                {this.pageManageWrapper()}

                <ToastContainer {...this.getNotifyContainerConfig()} />
                {this.state.gridLoading && <TopBarProgress />}
            </>
        )
    }
}

const state2props = (state: redux_state) => { return { internationalization: state.internationalization } };
const dispatch2props = (dispatch: Dispatch) => { return {} };
export const OrderManage = connect(state2props, dispatch2props)(OrderManageComponent);
