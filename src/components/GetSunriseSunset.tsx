import { getSunrise, getSunset } from 'sunrise-sunset-js'
//import { LatLng } from 'leaflet';
import DiffLocation from "./DiffLocation.tsx";
import { Location } from "@/types"

export default function GetSunriseSunset( {position}: Location) {
    const date = new Date()
    const sunset = getSunset(position.lat, position.lng)
    const sunrise = getSunrise(position.lat, position.lng, date)
    console.log(sunrise, sunset, date)

    // return today's sunrise and sunset @ user's location
    return(
        <>
            <p>Sunrise today: {sunrise.toLocaleTimeString()} <br/>
            Sunset today: {sunset.toLocaleTimeString()} </p>
            <DiffLocation position={position} sunrise={sunrise.toLocaleTimeString()} sunset={sunset.toLocaleTimeString()}
                id={""} />
        </>
        )
}