"use client";

import { LogOut, Settings, User } from "lucide-react";
import { useRef, useEffect } from "react";

type ProfileDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  darkMode: boolean;
  isCollapsed?: boolean;
};

export default function ProfileDropdown({ 
  isOpen, 
  onClose, 
  onLogout, 
  onOpenSettings,
  darkMode,
  isCollapsed = false
}: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={`absolute right-0 bottom-16 w-48 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-md shadow-lg border py-1 z-10`}
    >
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile Settings</p>
      </div>
      
      <button 
        onClick={onOpenSettings}
        className={`flex items-center w-full px-4 py-2 text-sm ${
          darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <User className="w-4 h-4 mr-2" />
        Account Settings
      </button>
      
      <button 
        onClick={onOpenSettings}
        className={`flex items-center w-full px-4 py-2 text-sm ${
          darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Settings className="w-4 h-4 mr-2" />
        Preferences
      </button>
      
      <button 
        onClick={onLogout}
        className={`flex items-center w-full px-4 py-2 text-sm ${
          darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
        }`}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>
    </div>
  );
} 