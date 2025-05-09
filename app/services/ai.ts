const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function getAIResponse(messages: Message[]): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost:3000", // Replace with your actual domain in production
        "X-Title": "AI Chat Bot"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-prover-v2",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling AI API:", error);
    return "Sorry, there was an error processing your request. Please try again later.";
  }
} 