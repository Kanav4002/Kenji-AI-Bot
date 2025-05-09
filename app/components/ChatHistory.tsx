"use client";

import { useState } from "react";
import { Calendar, MessageSquare } from "lucide-react";

type ChatHistoryProps = {
  recentChats: {
    id: string;
    title: string;
    preview: string;
    timestamp: string;
  }[];
  onSelectChat: (chatId: string) => void;
  currentChatId: string | null;
};

export default function ChatHistory({ recentChats, onSelectChat, currentChatId }: ChatHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-4">
      <button 
        onClick={toggleExpand}
        className="w-full flex items-center justify-between px-4 py-3 text-white rounded-md hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5" />
          <span>Recent Chats</span>
        </div>
        <span className="text-xs text-gray-400">{recentChats.length}</span>
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-1 pl-2">
          {recentChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full flex items-start gap-2 px-4 py-3 text-left rounded-md transition-colors ${
                currentChatId === chat.id
                  ? "bg-blue-600/20 text-blue-200"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="overflow-hidden">
                <div className="text-sm font-medium truncate">{chat.title}</div>
                <div className="text-xs text-gray-400 truncate">{chat.preview}</div>
                <div className="text-xs text-gray-500 mt-1">{chat.timestamp}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 