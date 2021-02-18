import React from 'react';
import { Field, FieldProps } from 'formik';
import { FormElementBase, IFormElementBaseProps } from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL } from '../FormControl/FormControl';
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from 'leaflet';
import { Setup } from '../../../../config/setup';
import Search from './SearchControl';






export interface IProps<T> extends IFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.MAP;
}

interface IState { }

export class AppMap<T> extends FormElementBase<T, IProps<T>, IState>{
    protected fieldRender() {
        const { name, ...rest } = this.props;


        return <Field name={name}>
            {({ form, field }: FieldProps<{ lat: number, lng: number } | null, T>) => {
                const { setFieldValue } = form;
                const { value } = field;

                return (

                    <Map
                        {...field}
                        {...rest}
                        value={value}
                        center={Setup.mapConfig.defaultLocation}
                        zoom={Setup.mapConfig.zoom}
                        zoomControl={true}
                        onClick={(v: any) => {
                            setFieldValue(name as string, v.latlng)
                        }}
                        scrollWheelZoom={false}
                    // dragging
                    >
                        <TileLayer
                            // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            attribution=""
                            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        // url=""
                        />
                        <Marker
                            position={value ? [value.lat, value.lng] : Setup.mapConfig.defaultLocation}
                            draggable={true}
                            ondragend={(e) => {
                                setFieldValue(name as string, e.target._latlng)
                            }}
                            icon={new Icon({
                                iconUrl: "/static/media/img/icon/map-marker-icon.png"
                            })}
                        >
                            <Popup>
                                <span>
                                    {value?.lat}
                                    <br /> {value?.lng}
                                </span>
                            </Popup>
                        </Marker>
                        <Search />
                    </Map>

                )
            }}
        </Field>
    }
}

