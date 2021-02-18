import { MapControl, withLeaflet } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

class Search extends MapControl {
    createLeafletElement() {
        return new GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            style: 'bar',
            showMarker: false,
            retainZoomLevel: true,
            animateZoom: true,
            autoClose: false,
            searchLabel: 'search'
            // showMarker: true,
            // showPopup: true,
            // keepResult: true,
        });
    }
}


export default withLeaflet(Search);