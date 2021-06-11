import React from 'react';
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

class BagComponent<IProps, IState> extends MainStructureComponent {
    bodyRendererFunction(): JSX.Element {
        return (
            <>
                <div className="container bag-wrapper">
                    <h2 className="text-capitalize text-center text-white- pt-4 pb-4">
                        {Localization.bag}
                    </h2>
                    <div className="d-flex justify-content-center">
                        <div className="image-wrapper">
                            <img
                                src="https://res.cloudinary.com/delta-avaran-vision/image/upload/v1622926210/other_images/coming-soon_uvo1ft.jpg"
                                alt=""
                            />
                        </div>
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
export const Bag = connect(state2props, dispatch2props)(BagComponent);
