import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import BaseManage, {
    IPropsBaseManage,
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { PurchaseOrderService } from '../../../../service/purchaseOrder.service';
import {
    IPurchaseOrder,
    TPurchaseOrderCreate,
    TPurchaseOrderUpdate,
} from '../../../../model/PurchaseOrder.model';
import { PurchaseType } from '../../../../enum/purchase-type.enum';
import { EmptyPageManage } from '../../../tool/EmptyPageManage/EmptyPageManage';

interface IState extends IStateBaseManage<IPurchaseOrder> {
    filterOutspread: { nameStartWith: string; type: Array<string> };
}

interface IProps extends IPropsBaseManage {}

class PurchaseOrderManageComponent extends BaseManage<
    IPurchaseOrder,
    TPurchaseOrderCreate,
    TPurchaseOrderUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        filterOutspread: {
            ...this.baseState.filterOutspread,
            type: [PurchaseType.CONSIGNMENT, PurchaseType.PURCHASE],
        },
    };

    protected _entityService = new PurchaseOrderService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.purchaseOrder;

    protected filter() {
        let filter = super.filter();

        filter['type'] = { $in: this.state.filterOutspread.type };
        return filter;
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
                createBtnText="create new Purchase"
                titleText="life cycle of Purchase"
                caption={
                    <div className="caption-wrapper mb-5">
                        <h4 className="text-capitalize font-weight-bold mb-4">
                            in the Purchase section, you can:
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
export const PurchaseOrderManage = connect(
    state2props,
    dispatch2props
)(PurchaseOrderManageComponent);
