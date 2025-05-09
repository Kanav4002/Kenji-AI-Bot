import { Send, Smile } from "lucide-react";
import { useState } from "react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  darkMode: boolean;
};

export default function ChatInput({ onSendMessage, darkMode }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <button className={`p-2 ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}>
          <Smile className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={`w-full p-3 pr-10 rounded-lg ${
              darkMode 
                ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#5b5fc7]'
            } focus:outline-none focus:ring-1`}
          />
        </div>
        <button 
          onClick={handleSend}
          className="p-2 text-[#5b5fc7] hover:text-[#4a4eb3]"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 