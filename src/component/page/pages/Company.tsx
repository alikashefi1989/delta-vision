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

class CompanyComponent<IProps, IState> extends MainStructureComponent {
    bodyRendererFunction(): JSX.Element {
        return (
            <>
                <div className="container company-wrapper">
                    <h2 className="text-capitalize text-center text-white pt-4">
                        {Localization.about_us}
                    </h2>
                    <div className="row part-1">
                        <div className="col-md-6 col-sm-12 desc-side">
                            <div className="desc">
                                <h3 className="text-white text-capitalize">
                                    {Localization.text.company_brand}
                                </h3>
                                <hr className="bg-white" />
                                <p className="text-white">
                                    {Localization.text.about_us_text_1}
                                </p>
                                <hr className="bg-white" />
                                <p className="text-white">
                                    {Localization.text.about_us_text_2}
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12 logo-side">
                            <div className="brand-logo-wrapper">
                                <img
                                    src={
                                        process.env.PUBLIC_URL +
                                        '/static/media/img/logo/dv.png'
                                    }
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row part-2">
                        <div className="col-12 desc-side">
                            <div className="desc">
                                <p className="text-white">
                                    {Localization.text.about_us_text_3}
                                </p>
                            </div>
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
export const Company = connect(state2props, dispatch2props)(CompanyComponent);
