const { GoogleGenerativeAI } = require("@google/generative-ai");
const gemini_api_key = "AIzaSyC2Hppz0TE-oUWGHxk1c2UYjUL0A0S_O-M";
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generate = async (question) => {
  try {
    const result = await geminiModel.generateContent(question);
    return result.response.text();
  } catch (error) {
    console.error("Response error:", error);
    return "Error processing request.";
  }
};

exports.chatBot = async (req, res) => {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
    const result = await generate(question);
    res.json({ result });
  };
