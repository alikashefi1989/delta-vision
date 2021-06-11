import React, { Fragment } from 'react';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IBaseProps } from '../../_base/BaseComponent';
import MainStructureComponent from '../main/Main';
import { History } from 'history';
import { TInternationalization } from '../../../config/setup';
import { action_change_app_flag } from '../../../redux/action/internationalization';
import { Localization } from '../../../config/localization/localization';

interface IProps extends IBaseProps {
    history?: History;
    internationalization: TInternationalization;
    changeLanguage: (payload: TInternationalization) => void;
}

interface IState {}

class CustomersComponent<IProps, IState> extends MainStructureComponent {
    private baseUrl: string =
        'https://res.cloudinary.com/delta-avaran-vision/image/upload/v1622882491/customers_logo/';

    private customersLinksLink: Array<string> = [
        'pershakhodro_yfxmxz.png',
        'saypayadak_p8jhb7.jpg',
        'mvm_suqdhi.jpg',
        'neginkhodro_ry0acw.jpg',
        'mehrkampars_rfyzub.png',
        'isaco_g95nef.png',
        'mediamotor2_tmwbrv.jpg',
        'kermanmotor_lbrbui.jpg',
        'irankhodro_eechv9.png',
        'hamgamkhodro_wid4lc.png',
        'bamkhodro_kelfe9.png',
        'bahmanmotor_me1c7m.png',
        'arianmotor_dwpxts.jpg',
        'azimkhodro_artrkp.jpg',
        'ramak_khodro_iqpha6.jpg',
        // 'irtoya_xqa9qo.png',
        // 'rigankhodro_qdptne.jpg',
    ];

    bodyRendererFunction(): JSX.Element {
        return (
            <>
                <div className="container customer-wrapper">
                    <h2 className="text-capitalize text-center text-white- pt-4 pb-4">
                        {Localization.customers}
                    </h2>
                    <div className="row">
                        {this.customersLinksLink.map(
                            (item: string, i: number) => {
                                return (
                                    <Fragment key={i}>
                                        <div className="col-md-4 col-sm-12 p-4">
                                            <div className="image-wrapper">
                                                <img
                                                    src={this.baseUrl + item}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </Fragment>
                                );
                            }
                        )}
                    </div>
                </div>
            </>
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
    return {
        changeLanguage: (payload: TInternationalization) =>
            dispatch(action_change_app_flag(payload)),
    };
};
export const Customers = connect(
    state2props,
    dispatch2props
)(CustomersComponent);
