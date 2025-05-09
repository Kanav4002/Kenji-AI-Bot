"use client";

import { useState } from "react";
import { MessageSquare, Clock } from "lucide-react";

// Make sure to include the Chat type definition
type Chat = {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messages: Array<{
    id: string;
    content: string;
    isUser: boolean;
  }>;
};

type ChatHistoryProps = {
  recentChats: Chat[];
  onSelectChat: (chatId: string) => void;
  currentChatId: string | null;
  isMobile?: boolean;
};

export default function ChatHistory({ recentChats, onSelectChat, currentChatId, isMobile }: ChatHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Filter out sample prompts that were removed
  const chatsToShow = recentChats.filter(chat => 
    !chat.id.startsWith("prompt")
  );

  return (
    <div className="pt-2">
      {chatsToShow.length > 0 && (
        <div className="mb-2">
          <div 
            className={`flex items-center justify-between px-2 py-2 ${isMobile ? 'py-3' : ''} text-sm text-gray-400 cursor-pointer rounded-md hover:bg-[#12152a]/50`}
            onClick={toggleExpand}
          >
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className={isMobile ? 'text-base' : ''}>Recent chats</span>
            </div>
            <div>
              {isExpanded ? '−' : '+'}
            </div>
          </div>
          
          {isExpanded && (
            <div className={`mt-2 space-y-${isMobile ? '2' : '1'}`}>
              {chatsToShow.map((chat) => (
                <button 
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left px-4 ${isMobile ? 'py-4' : 'py-3'} text-white rounded-md hover:bg-white/5 ${
                    currentChatId === chat.id ? "bg-blue-600/20 text-blue-200" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className={`truncate font-medium ${isMobile ? 'text-base' : ''}`}>{chat.title}</div>
                      <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-400 truncate mt-1`}>{chat.preview}</div>
                      <div className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-500 mt-1`}>{chat.timestamp}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 