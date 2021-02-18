import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Localization } from '../../../../config/localization/localization';
import { TInternationalization } from '../../../../config/setup';
import {
    IRefund,
    TRefundCreate,
    TRefundUpdate,
} from '../../../../model/refund.model';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { redux_state } from '../../../../redux/app_state';
import { RefundService } from '../../../../service/refund.service';
import BaseManage, {
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { EmptyPageManage } from '../../../tool/EmptyPageManage/EmptyPageManage';

interface IState extends IStateBaseManage<IRefund> {
    filterOutspread: { nameStartWith: string; status: string };
}

interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
}

class RefundManageComponent extends BaseManage<
    IRefund,
    TRefundCreate,
    TRefundUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        filterOutspread: {
            ...this.baseState.filterOutspread,
            status: 'return',
        },
    };

    protected _entityService = new RefundService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.refund;
    protected titleBaseCRUD = Localization.refund;

    async componentDidMount() {
        await this.handlChangeLazyLoad(true);
        await this.fetchData();
        this.fetchFilters();
        this.fetchColumns();
        this.checkScrollEnded();
    }
    protected filter() {
        let filter = super.filter();

        filter['status'] = this.state.filterOutspread.status;

        return filter;
    }

    protected removeModalInfoLabel(chosenRow?: IRefund): string | undefined {
        return chosenRow?.readableId;
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
                createBtnText="create new Sales Return"
                titleText="life cycle of Sales Return"
                caption={
                    <div className="caption-wrapper mb-5">
                        <h4 className="text-capitalize font-weight-bold mb-4">
                            in the Sales Return section, you can:
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
    return {
        internationalization: state.internationalization,
        language: state.language,
    };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {};
};
export const RefundManage = connect(
    state2props,
    dispatch2props
)(RefundManageComponent);
