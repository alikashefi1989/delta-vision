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

class FenderCoverComponent<IProps, IState> extends MainStructureComponent {
    private baseUrl: string =
        'https://res.cloudinary.com/delta-avaran-vision/image/upload/v1622885258/fender_cover/';

    private fenderCoversLinksLink: Array<string> = [
        'ro_gelgir_meghnatis_2_ckdvgi.jpg',
        'ro_gelgir_meghnatis_3_byhwfo.jpg',
        'ro_gelgir_meghnatis_4_ypgp3t.jpg',
        'ro_gelgir_meghnatis_1_kmnjsn.jpg',
    ];

    bodyRendererFunction(): JSX.Element {
        return (
            <>
                <div className="container fender-cover-wrapper">
                    <h2 className="text-capitalize text-center text-white pt-4 pb-4">
                        {Localization.fender_cover}
                    </h2>
                    <div className="row">
                        {this.fenderCoversLinksLink.map(
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
                                            <div className="product-code">{`FC - ${
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
export const FenderCover = connect(
    state2props,
    dispatch2props
)(FenderCoverComponent);
