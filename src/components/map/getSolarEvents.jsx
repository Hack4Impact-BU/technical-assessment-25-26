import { getSunrise, getSunset } from 'sunrise-sunset-js';

function getSolarEvents(latitude, longitude) {
    const today = new Date();
    const sunrise = getSunrise(latitude, longitude, today);
    const sunset = getSunset(latitude, longitude, today);

    return {
        sunrise: sunrise ? sunrise.toLocaleTimeString() : 'N/A',
        sunset: sunset ? sunset.toLocaleTimeString() : 'N/A',
    };
}

export default getSolarEvents;