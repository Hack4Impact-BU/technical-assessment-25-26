const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `TBD`,
});

const generateResponse = async (req, res) => {
    const userInput = req.body.userInput;
    let responseMessage;
    try {
        const result = await model.generateContent(userInput);
        responseMessage = result.response.text();
    } catch (error) {
        console.error('Error generating Gemini response:', error);
        responseMessage = 'Oops, something went wrong!';
    }
    res.json({
        message: responseMessage,
    });
};

module.exports = {
    generateResponse,
}; 