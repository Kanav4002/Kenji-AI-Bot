import { Search, Send, Smile, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  darkMode: boolean;
};

// Common emoji categories with popular emojis
const emojiCategories = [
  {
    name: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙"]
  },
  {
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "🤌", "👏", "🙌", "🤲", "🤝", "🙏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👋", "🖐️"]
  },
  {
    name: "People",
    emojis: ["😎", "🤓", "🧐", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕"]
  },
  {
    name: "Animals",
    emojis: ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦆", "🦅", "🦉"]
  },
  {
    name: "Food",
    emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🍆", "🌮", "🍕"]
  },
  {
    name: "Activities",
    emojis: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🏒", "🏑", "🥏", "🏏", "🥊", "🥋", "🎪", "🎨", "🎬", "🎭"]
  },
  {
    name: "Travel",
    emojis: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍️", "🛺", "🚂", "✈️", "🚀"]
  },
  {
    name: "Objects",
    emojis: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🎮", "🎧", "🎤", "🎬", "📷", "📺", "📻", "🔋", "��", "💡", "🔦"]
  },
  {
    name: "Symbols",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️"]
  }
];

export default function ChatInput({ onSendMessage, darkMode }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojis(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add emoji to message
  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  // Filter emojis based on search
  const filteredEmojis = searchTerm 
    ? emojiCategories.flatMap(category => category.emojis).filter(emoji => emoji.includes(searchTerm))
    : emojiCategories[activeCategory].emojis;

  return (
    <div className={`p-2 sm:p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="relative max-w-4xl mx-auto">
        {/* Emoji picker - adjusted for mobile */}
        {showEmojis && (
          <div 
            ref={emojiPickerRef}
            className={`absolute bottom-full mb-2 rounded-lg ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-lg'
            } w-full sm:w-72 left-0 right-0 sm:left-auto sm:right-auto z-50`}
          >
            {/* Picker header */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search emojis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-8 pr-4 py-1.5 rounded ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                  } focus:outline-none text-sm`}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category tabs - scrollable on mobile */}
            {!searchTerm && (
              <div className="flex overflow-x-auto p-1 border-b border-gray-200 dark:border-gray-700">
                {emojiCategories.map((category, index) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(index)}
                    className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
                      activeCategory === index
                        ? darkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-200 text-gray-800'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            {/* Emoji grid - adaptive columns */}
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 p-2 max-h-48 sm:max-h-60 overflow-y-auto">
              {filteredEmojis.map(emoji => (
                <button 
                  key={emoji} 
                  onClick={() => addEmoji(emoji)}
                  className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
              {filteredEmojis.length === 0 && (
                <div className="col-span-8 py-4 text-center text-gray-500">
                  No emojis found
                </div>
              )}
            </div>
          </div>
        )}
      
        {/* Input field with buttons - optimized for mobile */}
        <div className={`flex items-center rounded-full overflow-hidden ${
          darkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-gray-100'
        }`}>
          <button 
            onClick={() => {
              setShowEmojis(!showEmojis);
              setSearchTerm('');
            }}
            className={`p-2 sm:p-3 ${
              darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 bg-transparent ${
              darkMode 
                ? 'text-white placeholder-gray-400' 
                : 'text-gray-800 placeholder-gray-500'
            } focus:outline-none font-medium text-sm sm:text-base`}
          />
          
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className={`p-2 sm:p-3 rounded-r-full ${
              message.trim() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : darkMode 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-gray-200 text-gray-400'
            } transition-colors duration-200`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 