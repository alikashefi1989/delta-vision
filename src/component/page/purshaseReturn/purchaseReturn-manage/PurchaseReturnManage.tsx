import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import BaseManage, {
    IPropsBaseManage,
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { PurchaseReturnService } from '../../../../service/purchaseReturn.service';
import {
    IPurchaseReturn,
    TPurchaseReturnCreate,
    TPurchaseReturnUpdate,
} from '../../../../model/purchaseReturn.model';
import { EmptyPageManage } from '../../../tool/EmptyPageManage/EmptyPageManage';

interface IState extends IStateBaseManage<IPurchaseReturn> {
    filterOutspread: { nameStartWith: string; type: string };
}

interface IProps extends IPropsBaseManage {}

class PurchaseReturnManageComponent extends BaseManage<
    IPurchaseReturn,
    TPurchaseReturnCreate,
    TPurchaseReturnUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        filterOutspread: {
            ...this.baseState.filterOutspread,
            type: 'return',
        },
    };

    protected _entityService = new PurchaseReturnService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.purchaseReturn;

    protected filter() {
        let filter = super.filter();

        filter['type'] = this.state.filterOutspread.type;

        return filter;
        // return { isCustomer: true }
    }

    async componentDidMount() {
        this.handlChangeLazyLoad(true);
        this.fetchFilters();
        this.fetchColumns();
        await this.fetchData();
        this.checkScrollEnded();
    }

    protected showEmptyPage(): boolean {
        const f = this.filter();
        if (Object.keys(f).length > 1) return false;
        if (this.state.data.length) return false;
        if (this.state.gridLoading) return false;
        return true;
    }

    protected emptyManagePage() {
        return (
            <EmptyPageManage
                lifeCycleImageUrl={
                    '/static/media/img/entity-life-cycle/product.png'
                }
                onCreateClicked={() => this.goToCreate()}
                createBtnText="create new Purchase Return"
                titleText="life cycle of Purchase Return"
                caption={
                    <div className="caption-wrapper mb-5">
                        <h4 className="text-capitalize font-weight-bold mb-4">
                            in the Purchase Return section, you can:
                        </h4>
                        <h5 className="font-weight-bold">
                            <i className="fa fa-check-circle-o text-info mr-2"></i>
                            <span>
                                Issue refunds and credits to your customers and
                                apply them to invoices
                            </span>
                        </h5>
                        <h5 className="font-weight-bold">
                            <i className="fa fa-check-circle-o text-info mr-2"></i>
                            <span>
                                Record and manage excess payments as credits.
                            </span>
                        </h5>
                    </div>
                }
            />
        );
    }
}

const state2props = (state: redux_state) => {
    return { internationalization: state.internationalization };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {};
};
export const PurchaseReturnManage = connect(
    state2props,
    dispatch2props
)(PurchaseReturnManageComponent);
