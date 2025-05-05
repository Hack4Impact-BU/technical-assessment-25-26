import {LatLng} from "leaflet";

export interface Location {
    position: LatLng;
    sunrise: string;
    sunset: string;
    id: string;
}