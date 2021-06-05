import React from 'react';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IBaseProps } from '../../_base/BaseComponent';
import MainStructureComponent from '../main/Main';
import { History } from 'history';
import { Setup, TInternationalization } from '../../../config/setup';
import { action_change_app_flag } from '../../../redux/action/internationalization';
import { Localization } from '../../../config/localization/localization';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

interface IProps extends IBaseProps {
    history?: History;
    internationalization: TInternationalization;
    changeLanguage: (payload: TInternationalization) => void;
}

interface IState {}

class ContactComponent<IProps, IState> extends MainStructureComponent {
    bodyRendererFunction(): JSX.Element {
        return (
            <>
                <div className="contact-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 col-sm-12 side-1">
                                <div className="address">
                                    <h3 className="title">
                                        {Localization.text.address}
                                    </h3>
                                    <p className="desc">
                                        {Localization.text.company_address}
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12 side-2">
                                <div className="contact-info">
                                    <h3 className="title">
                                        {Localization.text.contact_info}
                                    </h3>
                                    <p className="item">
                                        <i className="fa fa-phone text-white"></i>
                                        {` ${Localization.text.company_tel}`}
                                    </p>
                                    <p className="item">
                                        <i className="fa fa-globe text-info"></i>
                                        {` www.deltavision.ir`}
                                    </p>
                                    <p className="item">
                                        <a
                                            className="text-white"
                                            href="https://t.me/deltaavision"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="fa fa-telegram text-primary"></i>
                                            {` ${Localization.telegram}`}
                                        </a>
                                        <a
                                            className="text-white mx-2"
                                            href="https://wa.me/989121993039"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="fa fa-whatsapp text-success"></i>
                                            {` ${Localization.whatsapp}`}
                                        </a>
                                        <a
                                            className="text-white"
                                            href="https://instagram.com/deltaavision?igshid=vikw0ihzqzvb"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="fa fa-instagram text-danger"></i>
                                            {` ${Localization.instagram}`}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 map">
                                <div className="map-container">
                                    <div className="map">
                                        <Map
                                            value={[]}
                                            center={
                                                Setup.mapConfig.defaultLocation
                                            }
                                            zoom={Setup.mapConfig.zoom}
                                            zoomControl={true}
                                            scrollWheelZoom={false}
                                            // dragging={false}
                                        >
                                            <TileLayer
                                                // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                attribution=""
                                                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                                                // url=""
                                            />
                                            <Marker
                                                position={
                                                    Setup.mapConfig
                                                        .defaultLocation
                                                }
                                                draggable={false}
                                                icon={
                                                    new Icon({
                                                        iconUrl:
                                                            '/static/media/img/icon/map-marker-icon.png',
                                                    })
                                                }
                                            >
                                                <Popup>
                                                    <span>
                                                        {
                                                            Localization.text
                                                                .company_brand
                                                        }
                                                    </span>
                                                </Popup>
                                            </Marker>
                                        </Map>
                                    </div>
                                </div>
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
export const Contact = connect(state2props, dispatch2props)(ContactComponent);
