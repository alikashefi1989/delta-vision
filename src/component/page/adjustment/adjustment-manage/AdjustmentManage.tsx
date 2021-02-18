import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import TopBarProgress from 'react-topbar-progress-indicator';
import BaseManage, {
    IPropsBaseManage,
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { TAppColumn } from '../../../tool/AppGrid';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { AdjustmentService } from '../../../../service/adjustment.service';
import {
    IAdjustment,
    TAdjustmentCreate,
    TAdjustmentUpdate,
} from '../../../../model/adjustment.model';

interface IState extends IStateBaseManage<IAdjustment> {}

interface IProps extends IPropsBaseManage {}

class AdjustmentManageComponent extends BaseManage<
    IAdjustment,
    TAdjustmentCreate,
    TAdjustmentUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    columns: Array<TAppColumn<any>> = [];

    protected _entityService = new AdjustmentService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.adjustment;

    async componentDidMount() {
        this.handlChangeLazyLoad(true);
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
        );
    }
}

const state2props = (state: redux_state) => {
    return { internationalization: state.internationalization };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {};
};
export const AdjustmentManage = connect(
    state2props,
    dispatch2props
)(AdjustmentManageComponent);
