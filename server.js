import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public")); // serve index.html

// Test route
app.get("/", (req, res) => {
    res.send("Revolt AI Chatbot is running!");
});

// 🔹 Chat route (connects to Gemini)
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
            process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: userMessage }] }],
                }),
            }
        );

        const data = await response.json();
        const botReply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn’t understand.";

        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ reply: "Error talking to AI." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
