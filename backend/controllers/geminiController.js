const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
        You will receive a geographical coordinate (latitude and longitude) along with the corresponding sunrise and sunset times for that location, and today’s date. Your task is to:
            1.	Identify a location in a completely different geographical region (i.e., not nearby) that experiences similar sunrise and sunset times.
            2.	Return the following details in JSON format for the identified location:
            •	Location Name
            •	Latitude and Longitude
            •	Sunrise Time and Sunset Time

        **IMPORTANT:** Respond with _only_ the raw JSON object—no markdown fences, no backticks, no commentary.

        Ensure that the returned location is distinctly different from the original one while maintaining the similarity in daylight timings. Reprompt yourself if you are not sure about the answer.

        Additional Considerations:
        When comparing sunrise and sunset times, please factor in the following elements:
            •	Latitude: Evaluate the influence of latitude on the day length and ensure that the selected location has a similar effect on sunrise/sunset times.
            •	Longitude: Consider differences in longitude to account for potential time zone shifts.
            •	Time Zone: Ensure local time zone differences (including any DST adjustments) do not affect the overall similarity of daylight timings.
            •	Altitude: If available, consider the altitude of the location, as it can slightly alter the observed sunrise and sunset times.
            •	Season: Take into account the current season, as the period of daylight varies between the summer and winter solstices.
            •	Daylight Saving Time (DST): Adjust for any DST-related changes that might shift the clock and thus affect sunrise or sunset times.
    `,
});

const generateResponse = async (req, res) => {
  const { originalLocation, originalSunrise, originalSunset } = req.body;
  const date = new Date().toISOString().split("T")[0];

  try {
    const prompt = `Original location: ${originalLocation}, originalSunrise: ${originalSunrise}, originalSunet: ${originalSunset}; Date: ${date}.`;

    const result = await model.generateContent(prompt);

    const text = await result.response.text();
    const raw = JSON.parse(text);
    const transformed = {
      name: raw["Location Name"],
      latitude: raw["Latitude"],
      longitude: raw["Longitude"],
      sunriseTime: raw["Sunrise Time"],
      sunsetTime: raw["Sunset Time"],
    };

    await fetch("http://localhost:3000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: transformed.latitude,
        longitude: transformed.longitude,
        googleGeminiResponse: JSON.stringify(transformed)
      }),
    });

    res.json(transformed);
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    responseMessage = "Oops, something went wrong!";
  }
};

module.exports = { generateResponse };
