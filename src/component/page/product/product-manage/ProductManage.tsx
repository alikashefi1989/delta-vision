import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import {
    IProduct,
    TProductCreate,
    TProductUpdate,
} from '../../../../model/product.model';
import { ProductService } from '../../../../service/product.service';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import BaseManage, {
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { EmptyPageManage } from '../../../tool/EmptyPageManage/EmptyPageManage';

interface IState extends IStateBaseManage<IProduct> {}
interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
}

class ProductManageComponent extends BaseManage<
    IProduct,
    TProductCreate,
    TProductUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new ProductService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.product;
    protected titleBaseCRUD = Localization.product;

    async componentDidMount() {
        await this.handlChangeLazyLoad(true);
        await this.fetchData();
        this.fetchFilters();
        this.fetchColumns();
        this.checkScrollEnded();
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    protected filterOutspread() {
        const filterOutspread = this.state.filterOutspread;
        if (filterOutspread.nameStartWith !== '') {
            return {
                [`name.${this.defaultLangCode}`]: {
                    $regex: `^${filterOutspread.nameStartWith}`,
                    $options: 'i',
                },
            };
        }
    }

    protected removeModalInfoLabel(chosenRow?: IProduct): string | undefined {
        return chosenRow?.name[this.defaultLangCode];
    }

    protected emptyManagePage() {
        return (
            <EmptyPageManage
                lifeCycleImageUrl={
                    '/static/media/img/entity-life-cycle/product.png'
                }
                onCreateClicked={() => this.goToCreate()}
                createBtnText="create new product"
                titleText="life cycle of products"
                caption={
                    <div className="caption-wrapper mb-5">
                        <h4 className="text-capitalize font-weight-bold mb-4">
                            in the products section, you can:
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
export const ProductManage = connect(
    state2props,
    dispatch2props
)(ProductManageComponent);
