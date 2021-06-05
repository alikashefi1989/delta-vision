import React from 'react';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IBaseProps } from '../../_base/BaseComponent';
import MainStructureComponent from '../main/Main';
import { History } from 'history';
import { TInternationalization } from '../../../config/setup';
import { action_change_app_flag } from '../../../redux/action/internationalization';
import ImageGallery from 'react-image-gallery';
import { Localization } from '../../../config/localization/localization';
import { AppRoute } from '../../../config/route';

interface IProps extends IBaseProps {
    history?: History;
    internationalization: TInternationalization;
    changeLanguage: (payload: TInternationalization) => void;
}

interface IState {}

class HomeComponent<IProps, IState> extends MainStructureComponent {
    baseAddressOfProductSidebarInHomePage: string =
        'https://res.cloudinary.com/delta-avaran-vision/image/upload/v1622880738/home_slides_image/';
    baseAddressOfCustomersSidebarInHomePage: string =
        'https://res.cloudinary.com/delta-avaran-vision/image/upload/v1622880738/customers_logo/';

    images = [
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '0_uxe9wf.png',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '0_uxe9wf.png',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '1_dnjobe.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '1_dnjobe.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '2_jwkozt.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '2_jwkozt.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '3_eilcgw.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '3_eilcgw.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '4_klhubs.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '4_klhubs.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '5_t3ifkd.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '5_t3ifkd.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '6_xfozjb.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '6_xfozjb.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '7_qjbn5s.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '7_qjbn5s.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '8_tunkeb.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '8_tunkeb.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '9_zjha9e.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '9_zjha9e.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '10_sidziq.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '10_sidziq.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '11_wzxvdt.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '11_wzxvdt.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '12_cx0ojp.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '12_cx0ojp.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '13_opntic.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '13_opntic.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '14_e8evx3.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '14_e8evx3.jpg',
        },
        {
            original:
                this.baseAddressOfProductSidebarInHomePage + '15_wrg61z.jpg',
            thumbnail:
                this.baseAddressOfProductSidebarInHomePage + '15_wrg61z.jpg',
        },
    ];

    customers = [
        {
            original:
                this.baseAddressOfCustomersSidebarInHomePage +
                'irankhodro_eechv9.png',
            thumbnail:
                this.baseAddressOfCustomersSidebarInHomePage +
                'irankhodro_eechv9.png',
        },
        {
            original:
                this.baseAddressOfCustomersSidebarInHomePage +
                'isaco_g95nef.png',
            thumbnail:
                this.baseAddressOfCustomersSidebarInHomePage +
                'isaco_g95nef.png',
        },
        {
            original:
                this.baseAddressOfCustomersSidebarInHomePage + 'mvm_suqdhi.jpg',
            thumbnail:
                this.baseAddressOfCustomersSidebarInHomePage + 'mvm_suqdhi.jpg',
        },
        {
            original:
                this.baseAddressOfCustomersSidebarInHomePage +
                'pershakhodro_yfxmxz.png',
            thumbnail:
                this.baseAddressOfCustomersSidebarInHomePage +
                'pershakhodro_yfxmxz.png',
        },
        {
            original:
                this.baseAddressOfCustomersSidebarInHomePage +
                'saypayadak_p8jhb7.jpg',
            thumbnail:
                this.baseAddressOfCustomersSidebarInHomePage +
                'saypayadak_p8jhb7.jpg',
        },
    ];

    bodyRendererFunction(): JSX.Element {
        return (
            <>
                <div className="home container">
                    <div className="d-flex justify-content-center home-slider-container">
                        <div className="home-slider">
                            <ImageGallery
                                items={this.images}
                                showThumbnails={true}
                                infinite={true}
                                thumbnailPosition={
                                    this.props.internationalization.rtl
                                        ? 'left'
                                        : 'right'
                                }
                                showFullscreenButton={true}
                                isRTL={
                                    this.props.internationalization.rtl
                                        ? true
                                        : false
                                }
                                autoPlay={true}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-sm-12 vedio-1">
                            <video className="v-1" controls muted>
                                <source
                                    src="https://res.cloudinary.com/delta-avaran-vision/video/upload/v1622839972/samples/SQHZ2776_gssfrz.mp4"
                                    type="video/mp4"
                                />
                            </video>
                            <video className="v-2" controls muted>
                                <source
                                    src="https://res.cloudinary.com/delta-avaran-vision/video/upload/v1622839994/samples/SZUF2455_orsjdc.mp4"
                                    type="video/mp4"
                                />
                            </video>
                        </div>
                        <div className="col-md-6 col-sm-12 customers">
                            <div
                                className="text-center text-white cursor-pointer my-2 slider-title"
                                onClick={() =>
                                    this.props.history?.push(
                                        AppRoute.routeData.customers.path
                                    )
                                }
                            >
                                {Localization.customers}
                            </div>
                            <ImageGallery
                                items={this.customers}
                                showThumbnails={false}
                                infinite={true}
                                showFullscreenButton={false}
                                isRTL={
                                    this.props.internationalization.rtl
                                        ? true
                                        : false
                                }
                                autoPlay={true}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 vedio-2">
                            <video className="v-3" controls muted>
                                <source
                                    src="https://res.cloudinary.com/delta-avaran-vision/video/upload/v1622839972/samples/VOXZ3464_x0n5gr.mp4"
                                    type="video/mp4"
                                />
                            </video>
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
export const Home = connect(state2props, dispatch2props)(HomeComponent);
