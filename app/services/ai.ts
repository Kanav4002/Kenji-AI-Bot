const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function getAIResponse(messages: Message[]): Promise<string> {
  try {
    // Add a system message to instruct proper formatting
    const messagesWithSystem = [
      {
        role: "system" as const,
        content: "You are an AI assistant. Only use code blocks with ```language syntax when sharing actual code snippets. For regular text responses, do not use code formatting."
      },
      ...messages
    ];
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost:3000"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: messagesWithSystem,
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