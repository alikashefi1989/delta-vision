import React from 'react';
import { TInternationalization } from '../../config/setup';
import { Localization } from '../../config/localization/localization';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../redux/app_state';
import {
    BrowserRouter as Router,
    Switch,
    HashRouter,
    Route,
    useHistory,
} from 'react-router-dom';
import { RouteLayoutAccount } from '../layout/account/Account';
import { AppRoute } from '../../config/route';
import { LayoutNoWrapNotFound } from '../page/not-found/NotFound';
import { Home } from '../page/pages/Home';
import { action_change_app_flag } from '../../redux/action/internationalization';
import { Cellophane } from '../page/pages/Cellophane';
import { Bag } from '../page/pages/Bag';
import { Shrink } from '../page/pages/Shrink';
import { SeatCover } from '../page/pages/SeatCover';
import { Feethold } from '../page/pages/Feethold';
import { SteeringWheelCover } from '../page/pages/SteeringWheelCover';
import { PaintingPromask } from '../page/pages/PaintingPromask';
import { FenderCover } from '../page/pages/FenderCover';
import { Company } from '../page/pages/Company';
import { Customers } from '../page/pages/Customers';
import { Contact } from '../page/pages/Contact';

const appRoutes = (
    <HashRouter>
        <Switch>
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.home.path}
                component={() => <Home history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.cellophane.path}
                component={() => <Cellophane history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.bag.path}
                component={() => <Bag history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.shrink.path}
                component={() => <Shrink history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.seat_cover.path}
                component={() => <SeatCover history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.feethold.path}
                component={() => <Feethold history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.steering_wheel_cover.path}
                component={() => <SteeringWheelCover history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.painting_promask.path}
                component={() => <PaintingPromask history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.fender_cover.path}
                component={() => <FenderCover history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.company.path}
                component={() => <Company history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.customers.path}
                component={() => <Customers history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.contact.path}
                component={() => <Contact history={useHistory()} />}
            />
            <RouteLayoutAccount
                exact
                path={AppRoute.routeData.redirect.path}
                component={() => <Home history={useHistory()} />}
            />
            <Route
                path={undefined}
                component={() => <LayoutNoWrapNotFound />}
            ></Route>
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
    constructor(props: IProps) {
        super(props);

        Localization.setLanguage(props.internationalization.flag);
        document.title = Localization.app_title;

        if (props.internationalization.rtl) {
            document.body.classList.add('rtl');
        }
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
    return {
        changeLanguage: (payload: TInternationalization) =>
            dispatch(action_change_app_flag(payload)),
    };
};
const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
    };
};
export const App = connect(state2props, dispatch2props)(AppComponent);
