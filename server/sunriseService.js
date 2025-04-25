const { getSunrise, getSunset } = require('sunrise-sunset-js');

function getSunriseSunset(lat, lng) {
    const date = new Date(); // Today's date

    const sunriseDate = getSunrise(lat, lng, date);
    const sunsetDate = getSunset(lat, lng, date);

    // Formatted strings for display
    const sunriseStr = sunriseDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const sunsetStr = sunsetDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return {
        sunrise: sunriseStr,      // for frontend display
        sunset: sunsetStr,
        sunriseISO: sunriseDate.toISOString(),  // for Gemini logic
        sunsetISO: sunsetDate.toISOString(),
    };
}

module.exports = { getSunriseSunset };
