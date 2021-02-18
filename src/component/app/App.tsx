import React from 'react';
import { TInternationalization } from '../../config/setup';
import { Localization } from '../../config/localization/localization';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../redux/app_state';
import { BrowserRouter as Router, Switch, HashRouter } from 'react-router-dom';
import { RouteLayoutAccount } from '../layout/account/Account';
import { Login } from '../page/login/Login';
import { AppRoute } from '../../config/route';

const appRoutes = (
    <HashRouter>
        <Switch>
            <RouteLayoutAccount
                path={AppRoute.routeData.login.path}
                component={Login}
            />
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
    return {};
};
const state2props = (state: redux_state) => {
    return { internationalization: state.internationalization };
};
export const App = connect(state2props, dispatch2props)(AppComponent);
