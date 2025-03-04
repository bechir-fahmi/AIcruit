const OpenAI = require("openai");

// Create a client instance with a fallback for missing API key
const openai = process.env.OPENAI_API_KEY 
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : {
        chat: {
            completions: {
                create: async () => ({
                    choices: [{ message: { content: "This is a placeholder response from OpenAI." } }]
                })
            }
        }
    };

module.exports = openai;
