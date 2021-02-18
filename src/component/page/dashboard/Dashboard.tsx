import React from "react";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../redux/app_state";
import { TInternationalization } from "../../../config/setup";
import { BaseComponent } from "../../_base/BaseComponent";
import { History } from "history";
import { Localization } from "../../../config/localization/localization";
import { ToastContainer } from "react-toastify";
// import { Store2 } from "../../../redux/store";
// import { IUser } from "../../../model/user.model";
// import { CmpUtility } from "../../_base/CmpUtility";

interface IProps {
  internationalization: TInternationalization;
  history: History;
  // logged_in_user: IUser|null;
}

interface IState {
}

class DashboardComponent extends BaseComponent<IProps, IState> {
  componentDidMount() {
    // CmpUtility.documentTitle = Localization.dashboard;
  }

  componentWillUnmount() {
    // CmpUtility.resetDocumentTitle();
  }

  render() {
    return (
      <>
        <div className="animated fadeInDown">
          <div className="text-muted mt-4 h6">modish admin dashboard</div>
          <div className="text-muted h6">{Localization.version}: {process.env.REACT_APP_VERSION}</div>

          {/* <h1>{JSON.stringify(Store2.getState().language.list, null, 2)}</h1> */}

          {/* <h1 className="text-danger">{this.props.logged_in_user?.name}</h1> */}
        </div>
        <ToastContainer {...this.getNotifyContainerConfig()} />
      </>

    );
  }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => { return {}; };
const state2props = (state: redux_state) => {
  return {
    internationalization: state.internationalization,
    // logged_in_user: state.logged_in_user
  };
};
export const Dashboard = connect(state2props, dispatch2props)(DashboardComponent);