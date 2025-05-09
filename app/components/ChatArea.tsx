import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

type ChatAreaProps = {
  messages: Message[];
  onCopyMessage: (content: string) => void;
  darkMode: boolean;
  userProfileImage?: string | null;
};

export default function ChatArea({ messages, onCopyMessage, darkMode, userProfileImage }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {messages.map((message) => (
        <ChatMessage 
          key={message.id}
          content={message.content}
          isUser={message.isUser}
          onCopy={onCopyMessage}
          darkMode={darkMode}
          userProfileImage={userProfileImage}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 