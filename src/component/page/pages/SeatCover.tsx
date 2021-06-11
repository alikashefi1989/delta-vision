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

class SeatCoverComponent<IProps, IState> extends MainStructureComponent {
    private baseUrl: string =
        'https://res.cloudinary.com/delta-avaran-vision/image/upload/v1622885004/seat_cover/';

    private seatCoversLinksLink: Array<string> = [
        'rokesh_mix_2_mgyhaz.jpg',
        'rokesh_sandali_5_rxm1ry.jpg',
        'rokesh_sandali_3_bxryxx.jpg',
        'rokesh_sandali_6_jo0jxz.jpg',
        // 'rokesh_sandali_4_kr7zbs.jpg',
        'rokesh_sandali_2_lswaj6.jpg',
        'rokesh_sandali_1_zuufrw.jpg',
    ];

    bodyRendererFunction(): JSX.Element {
        return (
            <>
                <div className="container seat-cover-wrapper">
                    <h2 className="text-capitalize text-center text-white- pt-4 pb-4">
                        {Localization.seat_cover}
                    </h2>
                    <div className="row">
                        {this.seatCoversLinksLink.map(
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
                                            <div className="product-code">{`SC - ${
                                                i + 1
                                            }`}</div>
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
export const SeatCover = connect(
    state2props,
    dispatch2props
)(SeatCoverComponent);
