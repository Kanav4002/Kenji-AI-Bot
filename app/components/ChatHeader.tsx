import { Search, AlertTriangle, Trash2, Moon, Sun } from "lucide-react";

type ChatHeaderProps = {
  onClearChat: () => void;
  onSearch: (query: string) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
};

export default function ChatHeader({ onClearChat, onSearch, darkMode, onToggleTheme }: ChatHeaderProps) {
  return (
    <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'}`}>
      <div className="w-8"></div> {/* Spacer */}
      <div className="flex items-center gap-4">
        <button className="text-[#ffa78d]">
          <AlertTriangle className="w-5 h-5" />
        </button>

        <button 
          onClick={onClearChat}
          className={darkMode ? "text-gray-300" : "text-gray-500"}
        >
          <Trash2 className="w-5 h-5" />
        </button>
        
        <button 
          onClick={onToggleTheme}
          className={darkMode ? "text-yellow-300" : "text-blue-600"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => onSearch(e.target.value)}
            className={`pl-10 pr-4 py-2 w-64 rounded-full ${
              darkMode 
                ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-[#5b5fc7]'
            } focus:outline-none focus:ring-1`}
          />
        </div>
      </div>
    </div>
  );
} 