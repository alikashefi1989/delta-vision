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

class PaintingPromaskComponent<IProps, IState> extends MainStructureComponent {
    private baseUrl: string =
        'https://res.cloudinary.com/delta-avaran-vision/image/upload/v1622885132/promask/';

    private paintingPromaskLinks: Array<string> = [
        'promask_naghashi_9_u8vzy3.jpg',
        'promask_naghashi_1_kla99a.jpg',
        'promask_naghashi_8_knd37q.jpg',
        'promask_naghashi_6_ik0azf.jpg',
        'promask_naghashi_7_px5vgl.jpg',
        'promask_naghashi_3_xh5lzv.jpg',
        'promask_naghashi_4_gibeyl.jpg',
        'promask_naghashi_2_mwzu2a.jpg',
        'promask_naghashi_5_elgvtp.jpg',
    ];

    bodyRendererFunction(): JSX.Element {
        return (
            <>
                <div className="container painting-promask-wrapper">
                    <h2 className="text-capitalize text-center text-white pt-4 pb-4">
                        {Localization.painting_promask}
                    </h2>
                    <div className="row">
                        {this.paintingPromaskLinks.map(
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
                                            <div className="product-code">{`P - ${
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
export const PaintingPromask = connect(
    state2props,
    dispatch2props
)(PaintingPromaskComponent);
