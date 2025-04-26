import {useState} from "react"
import {Marker, Popup, useMapEvents} from "react-leaflet"
import { LatLng } from 'leaflet'
import GetSunriseSunset from "./GetSunriseSunset.tsx"

export default function LocationMarker() {
    const [position, setPosition] = useState<LatLng | null>(null)

    // clicking on the map
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound: function (e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })
    if (!position) return null;
    return (
        <Marker position={position}>
            <Popup><GetSunriseSunset position={position} sunrise={""} sunset={""} id={""} /></Popup>
        </Marker>
    )
}