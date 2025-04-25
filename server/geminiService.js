const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getDayLengthHours(sunrise, sunset) {
    try {
        const rise = new Date(sunrise);
        let set = new Date(sunset);

        if (set < rise) {
            // Add 1 day if sunset is before sunrise
            set.setDate(set.getDate() + 1);
        }

        if (isNaN(rise) || isNaN(set)) {
            console.warn("Invalid sunrise or sunset date:", sunrise, sunset);
            return null;
        }

        const hours = (set - rise) / (1000 * 60 * 60); // Convert milliseconds to hours
        return hours;
    } catch (error) {
        console.error("Error calculating day length:", error);
        return null;
    }
}


async function findSimilarLocation(sunriseISO, sunsetISO, lat, lng) {
    const daylightHours = getDayLengthHours(sunriseISO, sunsetISO);
    const date = new Date(sunriseISO).toDateString();

    if (daylightHours === null) {
        return 'Could not calculate daylight duration. Please try again.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
The sunrise time at the given location is ${sunriseISO}, and the sunset time is ${sunsetISO}, resulting in roughly ${daylightHours.toFixed(1)} hours of daylight.
The coordinates are approximately latitude: ${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, longitude: ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}.
The Date is Date: ${date}

Please suggest a location around the world that currently experience similar daylight duration (approximately ${daylightHours} hours), preferably in their own local time zones.
Focus on a city or region with similar latitudes and in the same season (e.g., spring or summer). Avoid repeating common suggestions if possible.
consider the Earth's tilt and current season for this date and hemisphere.
Use current seasonal daylight patterns as a guide. Ensure diversity in continent/country.
Try to pick a location in the **opposite hemisphere** when appropriate, but be aware of topographical and timezone limitations.
Only give the location in the format: (city, region) and specifically and breifly explain your reasoning just after a dash (-).
`.trim();

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        console.log('\n Gemini Suggested Locations:\n' + responseText + '\n');

        return responseText;
    } catch (error) {
        console.error('Gemini API Error:', error.message || error);
        return 'Could not fetch similar location.';
    }
}

module.exports = { findSimilarLocation, getDayLengthHours };
