"use client";

import { Menu, Plus, History, ChevronUp, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import ChatHistory from "./ChatHistory";

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

type SidebarProps = {
  onNewChat: () => void;
  isLoggedIn: boolean;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  darkMode: boolean;
  username: string;
  recentChats: Chat[];
  onSelectChat: (chatId: string) => void;
  currentChatId: string | null;
  profileImage?: string | null;
};

export default function Sidebar({ 
  onNewChat, 
  isLoggedIn, 
  onOpenAuthModal,
  onLogout,
  onOpenSettings,
  darkMode,
  username,
  recentChats,
  onSelectChat,
  currentChatId,
  profileImage
}: SidebarProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showSamplePrompts, setShowSamplePrompts] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleProfileDropdown = () => {
    if (!isLoggedIn) {
      onOpenAuthModal();
    } else {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }
  };

  const toggleSamplePrompts = () => {
    setShowSamplePrompts(!showSamplePrompts);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setIsProfileDropdownOpen(false);
  };

  const samplePrompts = [
    { id: "prompt1", title: "Rephrase text...", preview: "Rephrase this text in a more professional tone" },
    { id: "prompt2", title: "Fix this code ne...", preview: "Fix this code and explain the issues" },
    { id: "prompt3", title: "Sample Copy for...", preview: "Generate marketing copy for a new product" }
  ];

  const handleSamplePrompt = (prompt: string) => {
    console.log(`Selected prompt: ${prompt}`);
    onSelectChat(prompt);
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-[#02040f] flex flex-col relative transition-all duration-300`}>
      {/* Logo and hamburger menu */}
      <div className="p-4 flex items-center justify-between border-b border-[#282934]/30">
        {/* Logo */}
        {!isCollapsed && (
          <div className="flex-1 flex justify-start items-center py-2">
            <Image
              src="/logo.png"
              alt="KENJI"
              width={120}
              height={45}
              className="object-contain"
            />
          </div>
        )}
        
        {/* Toggle button */}
        <button 
          className={`p-2 rounded border border-white/20 ${isCollapsed ? 'mx-auto' : ''}`}
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Sidebar menu items */}
      <div className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
        <button
          onClick={onNewChat}
          className={`w-full flex items-center gap-3 px-4 py-3 text-white rounded-md hover:bg-white/5 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span>New Chat</span>}
        </button>

        {/* Recent Chats Section - Only show when expanded */}
        {!isCollapsed && (
          <ChatHistory 
            recentChats={recentChats}
            onSelectChat={onSelectChat}
            currentChatId={currentChatId}
          />
        )}

        {/* Sample Prompts Section - Only show when expanded */}
        {!isCollapsed && (
          <div className="pt-2">
            {samplePrompts.map((prompt) => (
              <button 
                key={prompt.id}
                onClick={() => handleSamplePrompt(prompt.id)}
                className={`w-full text-left px-4 py-3 text-white rounded-md hover:bg-white/5 ${
                  currentChatId === prompt.id ? "bg-blue-600/20 text-blue-200" : ""
                }`}
              >
                <div className="truncate">{prompt.title}</div>
                <div className="text-xs text-gray-400 truncate mt-1">{prompt.preview}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User profile */}
      <div className="p-4 border-t border-[#282934]/30 relative">
        <div 
          onClick={toggleProfileDropdown}
          className={`flex items-center gap-3 p-2 bg-[#0a0c19] rounded-md cursor-pointer hover:bg-[#12152a] transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="relative w-8 h-8 flex-shrink-0">
            {profileImage ? (
              <img
                src={profileImage}
                alt="User avatar"
                className="w-8 h-8 rounded-md object-cover"
              />
            ) : (
              <Image
                src="/placeholder.svg"
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-md"
              />
            )}
          </div>
          
          {!isCollapsed && (
            <>
              <div className="flex-1">
                <div className="text-xs text-gray-400">
                  {isLoggedIn ? "Welcome back," : "Not logged in"}
                </div>
                <div className="text-sm font-medium text-white">
                  {isLoggedIn ? username : "Sign in"}
                </div>
              </div>
              
              {isLoggedIn && (
                <button>
                  {isProfileDropdownOpen ? (
                    <ChevronUp className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white" />
                  )}
                </button>
              )}
            </>
          )}
        </div>

        {isLoggedIn && isProfileDropdownOpen && (
          <div className="absolute z-50 left-full top-0 ml-2">
            <ProfileDropdown 
              isOpen={isProfileDropdownOpen}
              onClose={() => setIsProfileDropdownOpen(false)}
              onLogout={onLogout}
              onOpenSettings={onOpenSettings}
              darkMode={darkMode}
              isCollapsed={isCollapsed}
            />
          </div>
        )}
      </div>
    </div>
  );
} 