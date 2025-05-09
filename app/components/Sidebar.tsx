"use client";

import { Menu, Plus, ChevronUp, ChevronDown, ChevronRight, ChevronLeft, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
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
  onClose?: () => void;
  isMobile?: boolean;
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
  profileImage,
  onClose,
  isMobile
}: SidebarProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isMobile && isClient) {
      setIsCollapsed(false);
    }
  }, [isMobile, isClient]);

  const toggleProfileDropdown = () => {
    if (!isLoggedIn) {
      onOpenAuthModal();
    } else {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setIsProfileDropdownOpen(false);
  };

  return (
    <div className={`h-full flex flex-col relative transition-all duration-300 ${
      isMobile 
        ? 'bg-[#02040f] w-full max-w-[280px]'
        : `bg-[#02040f] ${isCollapsed && !isMobile && isClient ? 'w-20' : 'w-64'}`
    }`}>
      {/* Mobile header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-[#282934]/30">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#96e7e5] to-[#5b5fc7] bg-clip-text text-transparent font-sora">
            Kai
          </h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-md border border-gray-600 text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Desktop header - make logo clickable */}
      {!isMobile && (
        <div className="p-4 flex items-center justify-between border-b border-[#282934]/30">
          {/* Clickable logo */}
          <button
            onClick={toggleSidebar}
            className="flex items-center space-x-3"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <h1 className={`${isCollapsed ? 'text-xl' : 'text-2xl'} font-bold bg-gradient-to-r from-[#96e7e5] to-[#5b5fc7] bg-clip-text text-transparent font-sora`}>
              Kai
            </h1>
          </button>
          
          {/* Only show close button when sidebar is expanded */}
          {!isCollapsed && !isMobile && (
            <button 
              className="p-2 rounded-md border border-gray-600 text-white"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* New Chat button - bigger target area on mobile */}
      <div className={`px-3 py-4 ${isMobile ? 'py-5' : ''}`}>
        <button
          onClick={onNewChat}
          className={`w-full flex items-center gap-3 ${isMobile ? 'py-4' : 'py-3'} px-4 text-white rounded-md bg-[#12152a] hover:bg-[#1a1c2a] transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Plus className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'}`} />
          {(!isCollapsed || isMobile) && <span className={isMobile ? 'text-base' : 'text-sm'}>New Chat</span>}
        </button>
      </div>

      {/* Chat History - better spacing on mobile */}
      <div className="flex-1 px-3 overflow-y-auto">
        {(!isCollapsed || isMobile) && (
          <ChatHistory 
            recentChats={recentChats}
            onSelectChat={onSelectChat}
            currentChatId={currentChatId}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* User profile - better spacing for mobile */}
      <div className={`p-4 ${isMobile ? 'p-5' : ''} border-t border-[#282934]/30 relative`}>
        <div 
          onClick={toggleProfileDropdown}
          className={`flex items-center gap-3 p-3 bg-[#0a0c19] rounded-md cursor-pointer hover:bg-[#12152a] transition-colors ${
            isCollapsed && !isMobile ? 'justify-center' : ''
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
              <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center text-white">
                {username ? username.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
          
          {(!isCollapsed || isMobile) && (
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
                <button className="p-1">
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

        {/* Profile dropdown - updated positioning */}
        {isLoggedIn && isProfileDropdownOpen && (
          <div className="relative">
            <div className="absolute bottom-full mb-3">
              <ProfileDropdown 
                isOpen={isProfileDropdownOpen}
                onClose={() => setIsProfileDropdownOpen(false)}
                onLogout={onLogout}
                onOpenSettings={onOpenSettings}
                darkMode={darkMode}
                isCollapsed={isCollapsed && !isMobile}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 