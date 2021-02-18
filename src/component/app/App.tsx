import React from 'react';
import { TInternationalization } from '../../config/setup';
import { Localization } from '../../config/localization/localization';
import { BaseService } from '../../service/base.service';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../redux/app_state';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    HashRouter,
} from 'react-router-dom';
import { RouteLayoutValidUser } from '../layout/valid-user/ValidUser';
import { RouteLayoutAccount } from '../layout/account/Account';
import { Login } from '../page/login/Login';
import { ForgetPassword } from '../page/login/ForgetPass';
import { AppInitService } from '../../service/app-init.service';
import { AppRoute } from '../../config/route';

const appRoutes = (
    <HashRouter>
        <Switch>
            <Route
                exact
                path="/"
                component={() => (
                    <Redirect to={AppRoute.routeData.dashboard.path} />
                )}
            />
            <RouteLayoutValidUser
                exact
                path={AppRoute.routeData.dashboard.path}
            />
            <RouteLayoutValidUser path={AppRoute.routeData.profile.path} />

            <RouteLayoutValidUser
                path={AppRoute.routeData.language.manage.path}
            />
            {/* <RouteLayoutValidUser path={AppRoute.routeData.language.create.path} />
      <RouteLayoutValidUser path={AppRoute.routeData.language.update.path} />
      <RouteLayoutValidUser path={AppRoute.routeData.language.copy.path} />
      <RouteLayoutValidUser path={AppRoute.routeData.language.view.path} /> */}

            <RouteLayoutValidUser path={AppRoute.routeData.brand.manage.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.brand.create.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.brand.update.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.brand.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.brand.view.path} />

            <RouteLayoutValidUser
                path={AppRoute.routeData.category.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.category.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.category.update.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.category.copy.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.category.view.path}
            />

            <RouteLayoutValidUser
                path={AppRoute.routeData.country.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.country.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.country.update.path}
            />
            <RouteLayoutValidUser path={AppRoute.routeData.country.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.country.view.path} />

            <RouteLayoutValidUser path={AppRoute.routeData.store.manage.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.store.create.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.store.update.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.store.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.store.view.path} />

            <RouteLayoutValidUser path={AppRoute.routeData.area.manage.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.area.create.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.area.update.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.area.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.area.view.path} />

            <RouteLayoutValidUser
                path={AppRoute.routeData.warehouse.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.warehouse.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.warehouse.update.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.warehouse.copy.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.warehouse.view.path}
            />

            <RouteLayoutValidUser
                path={AppRoute.routeData.variation.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.variation.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.variation.update.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.variation.copy.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.variation.view.path}
            />

            <RouteLayoutValidUser
                path={AppRoute.routeData.refund.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.refund.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.refund.update.path}
            />
            <RouteLayoutValidUser path={AppRoute.routeData.refund.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.refund.view.path} />

            <RouteLayoutValidUser
                path={AppRoute.routeData.attribute.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.attribute.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.attribute.update.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.attribute.copy.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.attribute.view.path}
            />

            <RouteLayoutValidUser
                path={AppRoute.routeData.product.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.product.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.product.update.path}
            />
            <RouteLayoutValidUser path={AppRoute.routeData.product.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.product.view.path} />
            <RouteLayoutValidUser
                path={AppRoute.routeData.product.skuList.path}
            />

            <RouteLayoutValidUser path={AppRoute.routeData.user.manage.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.user.create.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.user.update.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.user.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.user.view.path} />

            <RouteLayoutValidUser path={AppRoute.routeData.order.manage.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.order.create.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.order.update.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.order.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.order.view.path} />

            <RouteLayoutValidUser path={AppRoute.routeData.tag.manage.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.tag.create.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.tag.update.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.tag.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.tag.view.path} />

            <RouteLayoutValidUser
                path={AppRoute.routeData.coupon.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.coupon.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.coupon.update.path}
            />
            <RouteLayoutValidUser path={AppRoute.routeData.coupon.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.coupon.view.path} />

            <RouteLayoutValidUser path={AppRoute.routeData.badge.manage.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.badge.create.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.badge.update.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.badge.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.badge.view.path} />

            <RouteLayoutValidUser
                path={AppRoute.routeData.docAcc.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.docAcc.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.docAcc.update.path}
            />
            <RouteLayoutValidUser path={AppRoute.routeData.docAcc.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.docAcc.view.path} />

            <RouteLayoutValidUser
                path={AppRoute.routeData.return.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.return.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.return.update.path}
            />
            <RouteLayoutValidUser path={AppRoute.routeData.return.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.return.view.path} />

            <RouteLayoutValidUser
                path={AppRoute.routeData.purshase.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purshase.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purshase.update.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purshase.copy.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purshase.view.path}
            />

            <RouteLayoutValidUser
                path={AppRoute.routeData.purchaseReturn.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purchaseReturn.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purchaseReturn.update.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purchaseReturn.copy.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purchaseReturn.view.path}
            />

            <RouteLayoutValidUser
                path={AppRoute.routeData.contact.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.contact.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.contact.update.path}
            />
            <RouteLayoutValidUser path={AppRoute.routeData.contact.copy.path} />
            <RouteLayoutValidUser path={AppRoute.routeData.contact.view.path} />

            <RouteLayoutValidUser
                path={AppRoute.routeData.adjustment.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.adjustment.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.adjustment.update.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.adjustment.copy.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.adjustment.view.path}
            />

            <RouteLayoutValidUser
                path={AppRoute.routeData.purchaseOrder.manage.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purchaseOrder.create.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purchaseOrder.update.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purchaseOrder.copy.path}
            />
            <RouteLayoutValidUser
                path={AppRoute.routeData.purchaseOrder.view.path}
            />

            <RouteLayoutValidUser path={AppRoute.routeData.test.manage.path} />

            <RouteLayoutAccount
                path={AppRoute.routeData.forgetPassword.path}
                component={ForgetPassword}
            />
            <RouteLayoutAccount
                path={AppRoute.routeData.login.path}
                component={Login}
            />

            <RouteLayoutValidUser />
        </Switch>
    </HashRouter>
);

interface IProps {
    internationalization: TInternationalization;
}
interface IState {
    showConfirmReloadModal: boolean;
}

class AppComponent extends React.Component<IProps, IState> {
    private _appInitService = new AppInitService();
    constructor(props: IProps) {
        super(props);

        Localization.setLanguage(props.internationalization.flag);
        document.title = Localization.app_title;

        if (props.internationalization.rtl) {
            document.body.classList.add('rtl');
        }

        BaseService.check_network_status();
    }

    render() {
        return (
            <>
                <Router>{appRoutes}</Router>
            </>
        );
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {};
};
const state2props = (state: redux_state) => {
    return { internationalization: state.internationalization };
};
export const App = connect(state2props, dispatch2props)(AppComponent);
