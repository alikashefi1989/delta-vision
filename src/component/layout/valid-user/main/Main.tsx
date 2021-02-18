import React from 'react';
import { Route } from 'react-router-dom';
import { LayoutMainHeader } from './header/Header';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../redux/app_state';
import { History } from 'history';
import { TInternationalization } from '../../../../config/setup';
import { BaseComponent } from '../../../_base/BaseComponent';
import { AppRoute } from '../../../../config/route';
import { Localization } from '../../../../config/localization/localization';
import { CmpUtility } from '../../../_base/CmpUtility';

export const RouteLayoutMain = ({
    component: Component,
    ...rest
}: {
    [key: string]: any;
}) => {
    return (
        <Route
            {...rest}
            render={(matchProps) => (
                <LayoutMain {...matchProps}>
                    <Component {...matchProps} />
                </LayoutMain>
            )}
        />
    );
};

interface IProps {
    history: History;
    match: any;
    internationalization: TInternationalization;
}

interface IState {}

class LayoutMainComponent extends BaseComponent<IProps, IState> {
    historyUnlisten: () => void = () => {};
    componentDidMount() {
        this.handleHeaderTitleListener();
    }
    componentWillUnmount() {
        // CmpUtility.resetDocumentTitle();
        this.historyUnlisten();
    }

    private handleHeaderTitleListener() {
        this.setHeaderTitle(this.props.history.location.pathname);
        this.historyUnlisten = this.props.history.listen((location, action) => {
            this.setHeaderTitle(location.pathname);
        });
    }
    private setHeaderTitle(pathname: string) {
        const route = AppRoute.getRouteByPath(pathname);
        if (route) {
            CmpUtility.documentTitle = (Localization as any)[route.name];
        } else {
            CmpUtility.resetDocumentTitle();
        }
    }

    render() {
        return (
            <>
                <LayoutMainHeader {...this.props} />

                <div className="container-fluid">
                    <div className="page-body">{this.props.children}</div>
                </div>
            </>
        );
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {};
};

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
    };
};

export const LayoutMain = connect(
    state2props,
    dispatch2props
)(LayoutMainComponent);
