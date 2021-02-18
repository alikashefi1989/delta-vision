import React from 'react';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { IUser } from '../../../model/user.model';
import { History } from 'history';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    HashRouter,
} from 'react-router-dom';
import { Dashboard } from '../../page/dashboard/Dashboard';
import { Profile } from '../../page/profile/Profile';
import { RouteLayoutMain } from './main/Main';
import { LayoutNoWrapNotFound } from './no-wrap/not-found/NotFound';
import { RouteLayoutNoWrap } from './no-wrap/NoWrap';
import { LanguageManage } from '../../page/language/language-manage/LanguageManage';
// import { LanguageSave } from '../../page/language/language-save/LanguageSave';
import { AppRoute } from '../../../config/route';
import { BrandManage } from '../../page/brand/brand-manage/BrandManage';
import { BrandSave } from '../../page/brand/brand-save/BrandSave';
import { LanguageService } from '../../../service/language.service';
import { Store2 } from '../../../redux/store';
import { action_update_language } from '../../../redux/action/language';
import { CategoryManage } from '../../page/category/category-manage/CategoryManage';
import { CategorySave } from '../../page/category/category-save/CategorySave';
import { CountryManage } from '../../page/country/country-manage/CountryManage';
import { CountrySave } from '../../page/country/country-save/CountrySave';
import { StoreManage } from '../../page/store/store-manage/StoreManage';
import { StoreSave } from '../../page/store/store-save/StoreSave';
import { AreaManage } from '../../page/area/area-manage/AreaManage';
import { AreaSave } from '../../page/area/area-save/AreaSave';
import { WarehouseManage } from '../../page/warehouse/warehouse-manage/WarehouseManage';
import { WarehouseSave } from '../../page/warehouse/warehouse-save/WarehouseSave';
import { VariationManage } from '../../page/variation/variation-manage/VariationManage';
import { VariationSave } from '../../page/variation/variation-save/VariationSave';
import { TestPage } from '../../page/test_page/TestPage';
import { AttributeManage } from '../../page/attribute/attribute-manage/AttributeManage';
import { AttributeSave } from '../../page/attribute/attribute-save/AttributeSave';
import { ProductManage } from '../../page/product/product-manage/ProductManage';
import { ProductSave } from '../../page/product/product-save/ProductSave';
import { ILanguage } from '../../../model/language.model';
import { ProductSkuList } from '../../page/product/product-manage/ProductSkuList/ProductSkuList';
import { UserManage } from '../../page/user/user-manage/UserManage';
import { UserSave } from '../../page/user/user-save/UserSave';
import { UserView } from '../../page/user/user-view/UserView';
import { CategoryView } from '../../page/category/category-view/CategoryView';
import { StoreView } from '../../page/store/store-view/StoreView';
import { OrderManage } from '../../page/order/order-manage/OrderManage';
import { OrderSave } from '../../page/order/order-save/OrderSave';
import { TagManage } from '../../page/tag/tag-manage/TagManage';
import { TagSave } from '../../page/tag/tag-save/TagSave';
import { TagView } from '../../page/tag/tag-view/TagView';
import { OrderView } from '../../page/order/order-view/OrderView';
import { CouponManage } from '../../page/coupon/coupon-manage/CouponManage';
import { CouponSave } from '../../page/coupon/coupon-save/CouponSave';
import { CouponView } from '../../page/coupon/coupon-view/CouponView';
import { BadgeManage } from '../../page/badge/badge-manage/BadgeManage';
import { BadgeSave } from '../../page/badge/badge-save/BadgeSave';
import { BadgeView } from '../../page/badge/badge-view/BadgeView';
import { DocAccManage } from '../../page/docAcc/docAcc-manage/DocAccManage';
import { DocAccSave } from '../../page/docAcc/docAcc-save/DocAccSave';
import { DocAccView } from '../../page/docAcc/docAcc-view/DocAccView';
import { ProductView } from '../../page/product/product-view/ProductView';
import { AttributeView } from '../../page/attribute/attribute-view/AttributeView';
import { VariationView } from '../../page/variation/variation-view/VariationView';
import { WarehouseView } from '../../page/warehouse/warehouse-view/WarehouseView';
import { AreaView } from '../../page/area/area-view/AreaView';
import { CountryView } from '../../page/country/country-view/CountryView';
import { BrandView } from '../../page/brand/brand-view/BrandView';
import { ReturnManage } from '../../page/return/return-manage/ReturnManage';
import { ReturnSave } from '../../page/return/return-save/ReturnSave';
import { ReturnView } from '../../page/return/return-view/ReturnView';
import { PurshaseManage } from '../../page/purshase/purshase-manage/PurshaseManage';
import { PurshaseSave } from '../../page/purshase/purshase-save/PurshaseSave';
import { PurshaseView } from '../../page/purshase/purshase-view/PurshaseView';
import { PurchaseReturnManage } from '../../page/purshaseReturn/purchaseReturn-manage/PurchaseReturnManage';
import { PurchaseReturnSave } from '../../page/purshaseReturn/purchaseReturn-save/PurchaseReturnSave';
import { PurchaseReturnView } from '../../page/purshaseReturn/purchaseReturn-view/PurchaseReturnView';
import { ContactManage } from '../../page/contact/contact-manage/ContactManage';
import { ContactSave } from '../../page/contact/contact-save/ContactSave';
import { ContactView } from '../../page/contact/contact-view/ContactView';
import { AdjustmentManage } from '../../page/adjustment/adjustment-manage/AdjustmentManage';
import { AdjustmentSave } from '../../page/adjustment/adjustment-save/AdjustmentSave';
import { AdjustmentView } from '../../page/adjustment/adjustment-view/AdjustmentView';
import { RefundManage } from '../../page/refund/refund-manage/RefundManage';
import { RefundSave } from '../../page/refund/refund-save/RefundSave';
import { RefundView } from '../../page/refund/refund-view/RefundView';
import { PurchaseOrderManage } from '../../page/purshaseOrder/purchaseOrder-manage/PurchaseOrderManage';
import { PurchaseOrderSave } from '../../page/purshaseOrder/purchaseOrder-save/PurchaseOrderSave';
import { PurchaseOrderView } from '../../page/purshaseOrder/purchaseOrder-view/PurchaseOrderView';

const appValidUserRoutes = (
    <HashRouter>
        <Switch>
            <Route
                exact
                path="/"
                component={() => (
                    <Redirect to={AppRoute.routeData.dashboard.path} />
                )}
            />
            <RouteLayoutMain
                exact
                path={AppRoute.routeData.dashboard.path}
                component={Dashboard}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.profile.path}
                component={Profile}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.language.manage.path}
                component={LanguageManage}
            />
            {/* <RouteLayoutMain path={AppRoute.routeData.language.create.path} component={LanguageSave} />
            <RouteLayoutMain path={AppRoute.routeData.language.update.path} component={LanguageSave} />
            <RouteLayoutMain path={AppRoute.routeData.language.copy.path} component={LanguageSave} />
            <RouteLayoutMain path={AppRoute.routeData.language.view.path} component={LanguageSave} /> */}

            <RouteLayoutMain
                path={AppRoute.routeData.brand.manage.path}
                component={BrandManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.brand.create.path}
                component={BrandSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.brand.update.path}
                component={BrandSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.brand.copy.path}
                component={BrandSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.brand.view.path}
                component={BrandView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.category.manage.path}
                component={CategoryManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.category.create.path}
                component={CategorySave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.category.update.path}
                component={CategorySave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.category.copy.path}
                component={CategorySave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.category.view.path}
                component={CategoryView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.country.manage.path}
                component={CountryManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.country.create.path}
                component={CountrySave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.country.update.path}
                component={CountrySave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.country.copy.path}
                component={CountrySave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.country.view.path}
                component={CountryView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.store.manage.path}
                component={StoreManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.store.create.path}
                component={StoreSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.store.update.path}
                component={StoreSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.store.copy.path}
                component={StoreSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.store.view.path}
                component={StoreView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.area.manage.path}
                component={AreaManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.area.create.path}
                component={AreaSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.area.update.path}
                component={AreaSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.area.copy.path}
                component={AreaSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.area.view.path}
                component={AreaView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.refund.manage.path}
                component={RefundManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.refund.create.path}
                component={RefundSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.refund.update.path}
                component={RefundSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.refund.copy.path}
                component={RefundSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.refund.view.path}
                component={RefundView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.warehouse.manage.path}
                component={WarehouseManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.warehouse.create.path}
                component={WarehouseSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.warehouse.update.path}
                component={WarehouseSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.warehouse.copy.path}
                component={WarehouseSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.warehouse.view.path}
                component={WarehouseView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.variation.manage.path}
                component={VariationManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.variation.create.path}
                component={VariationSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.variation.update.path}
                component={VariationSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.variation.copy.path}
                component={VariationSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.variation.view.path}
                component={VariationView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.attribute.manage.path}
                component={AttributeManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.attribute.create.path}
                component={AttributeSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.attribute.update.path}
                component={AttributeSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.attribute.copy.path}
                component={AttributeSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.attribute.view.path}
                component={AttributeView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.product.manage.path}
                component={ProductManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.product.create.path}
                component={ProductSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.product.update.path}
                component={ProductSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.product.copy.path}
                component={ProductSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.product.view.path}
                component={ProductView}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.product.skuList.path}
                component={ProductSkuList}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.user.manage.path}
                component={UserManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.user.create.path}
                component={UserSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.user.update.path}
                component={UserSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.user.copy.path}
                component={UserSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.user.view.path}
                component={UserView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.order.manage.path}
                component={OrderManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.order.create.path}
                component={OrderSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.order.update.path}
                component={OrderSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.order.copy.path}
                component={OrderSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.order.view.path}
                component={OrderView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.tag.manage.path}
                component={TagManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.tag.create.path}
                component={TagSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.tag.update.path}
                component={TagSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.tag.copy.path}
                component={TagSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.tag.view.path}
                component={TagView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.coupon.manage.path}
                component={CouponManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.coupon.create.path}
                component={CouponSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.coupon.update.path}
                component={CouponSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.coupon.copy.path}
                component={CouponSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.coupon.view.path}
                component={CouponView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.badge.manage.path}
                component={BadgeManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.badge.create.path}
                component={BadgeSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.badge.update.path}
                component={BadgeSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.badge.copy.path}
                component={BadgeSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.badge.view.path}
                component={BadgeView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.docAcc.manage.path}
                component={DocAccManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.docAcc.create.path}
                component={DocAccSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.docAcc.update.path}
                component={DocAccSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.docAcc.copy.path}
                component={DocAccSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.docAcc.view.path}
                component={DocAccView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.return.manage.path}
                component={ReturnManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.return.create.path}
                component={ReturnSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.return.update.path}
                component={ReturnSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.return.copy.path}
                component={ReturnSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.return.view.path}
                component={ReturnView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.purshase.manage.path}
                component={PurshaseManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purshase.create.path}
                component={PurshaseSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purshase.update.path}
                component={PurshaseSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purshase.copy.path}
                component={PurshaseSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purshase.view.path}
                component={PurshaseView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.purchaseReturn.manage.path}
                component={PurchaseReturnManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purchaseReturn.create.path}
                component={PurchaseReturnSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purchaseReturn.update.path}
                component={PurchaseReturnSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purchaseReturn.copy.path}
                component={PurchaseReturnSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purchaseReturn.view.path}
                component={PurchaseReturnView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.contact.manage.path}
                component={ContactManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.contact.create.path}
                component={ContactSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.contact.update.path}
                component={ContactSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.contact.copy.path}
                component={ContactSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.contact.view.path}
                component={ContactView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.adjustment.manage.path}
                component={AdjustmentManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.adjustment.create.path}
                component={AdjustmentSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.adjustment.update.path}
                component={AdjustmentSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.adjustment.copy.path}
                component={AdjustmentSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.adjustment.view.path}
                component={AdjustmentView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.purchaseOrder.manage.path}
                component={PurchaseOrderManage}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purchaseOrder.create.path}
                component={PurchaseOrderSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purchaseOrder.update.path}
                component={PurchaseOrderSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purchaseOrder.copy.path}
                component={PurchaseOrderSave}
            />
            <RouteLayoutMain
                path={AppRoute.routeData.purchaseOrder.view.path}
                component={PurchaseOrderView}
            />

            <RouteLayoutMain
                path={AppRoute.routeData.test.manage.path}
                component={TestPage}
            />

            {/* keep "cmp LayoutNoWrapNotFound" last */}
            <RouteLayoutNoWrap component={LayoutNoWrapNotFound} />
        </Switch>
    </HashRouter>
);

export const RouteLayoutValidUser = ({ ...rest }: { [key: string]: any }) => {
    return (
        <Route
            {...rest}
            render={(matchProps) => <LayoutValidUser {...matchProps} />}
        />
    );
};

interface IProps {
    logged_in_user: IUser | null;
    history: History;
    match: any;
}

class LayoutValidUserComponent extends React.Component<IProps> {
    componentDidMount() {
        if (!this.props.logged_in_user) {
            this.props.history.push(AppRoute.routeData.login.url());
        } else {
            this.fetchAllLanguage();
        }
    }

    private async fetchAllLanguage() {
        try {
            const res = await new LanguageService().all();
            this.storeAllLanguage(res.data.data.items);
        } catch (e) {}
    }

    private storeAllLanguage(allLanguage: Array<ILanguage>) {
        const defaultLanguage =
            allLanguage.find((lang) => lang.isDefault === true) || null;
        Store2.dispatch(
            action_update_language({ list: allLanguage, defaultLanguage })
        );
    }

    shouldComponentUpdate() {
        if (!this.props.logged_in_user) {
            this.props.history.push(AppRoute.routeData.login.url());
            return false;
        }
        return true;
    }

    render() {
        if (!this.props.logged_in_user) return <></>;
        return <Router>{appValidUserRoutes}</Router>;
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {};
};
const state2props = (state: redux_state) => {
    return { logged_in_user: state.logged_in_user };
};
export const LayoutValidUser = connect(
    state2props,
    dispatch2props
)(LayoutValidUserComponent);
