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

class CellophaneComponent<IProps, IState> extends MainStructureComponent {
    private baseUrl: string =
        'https://res.cloudinary.com/delta-avaran-vision/image/upload/v1622884859/selefon/';

    private cellophanesLinksLink: Array<string> = [
        'WhatsApp_Image_2021-06-11_at_21.04.28_xuf8mx.jpg',
        '10_djpghw.jpg',
        '47_pmtje8.jpg',
        '46_sbbwpl.jpg',
        '43_xrxdbh.jpg',
        '45_mmvxgo.jpg',
        '44_ngyfkf.jpg',
        '41_dzmste.jpg',
        '42_eg3ovg.jpg',
        '40_suqtd6.jpg',
        '39_lmgsgp.jpg',
        '38_lvp2id.jpg',
        '35_qpmsje.jpg',
        '36_gw9j3i.jpg',
        '34_zojsal.jpg',
        '33_rftwry.jpg',
        '32_zefbg2.jpg',
        '27_ebiz22.jpg',
        '30_rp3jzu.webp',
        '28_c19ezu.jpg',
        '31_oe8tx3.jpg',
        '29_ekyqod.jpg',
        '26_g0oy4q.jpg',
        '25_d5fmzv.jpg',
        '24_vthaj6.jpg',
        '22_s9cedp.jpg',
        '23_cwfy0t.jpg',
        '21_cb5rob.jpg',
        '20_pbibkl.jpg',
        '13_jfa2r8.jpg',
        '14_hqdr7x.jpg',
        '19_tnw5x8.jpg',
        '17_v0oya0.jpg',
        '16_cavvyy.jpg',
        '15_jynw9u.jpg',
        '9_xec3q6.jpg',
        '12_qdmdan.jpg',
        '7_o8mrfy.jpg',
        '11_se23cr.jpg',
        '6_x2yuqu.jpg',
        '5_lvrtde.jpg',
        '4_grkqev.jpg',
        '3_mn71sg.jpg',
        '1_dldd8d.jpg',
    ];

    bodyRendererFunction(): JSX.Element {
        return (
            <>
                <div className="container cellophane-wrapper">
                    <h2 className="text-capitalize text-center text-white- pt-4 pb-4">
                        {Localization.cellophane}
                    </h2>
                    <div className="row">
                        {this.cellophanesLinksLink.map(
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
                                            <div className="product-code">{`C - ${
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
export const Cellophane = connect(
    state2props,
    dispatch2props
)(CellophaneComponent);
