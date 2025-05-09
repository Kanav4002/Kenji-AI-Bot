"use client";

import { LogOut, Settings, User, Github, Mail, Linkedin } from "lucide-react";
import { useRef, useEffect } from "react";

type ProfileDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  darkMode: boolean;
  isCollapsed?: boolean;
  isMobile?: boolean;
};

export default function ProfileDropdown({ 
  isOpen, 
  onClose, 
  onLogout, 
  onOpenSettings, 
  darkMode,
  isCollapsed,
  isMobile
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
    <div ref={dropdownRef} className="relative">
      <div className={`w-64 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-md shadow-lg border py-1 z-50`}>
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
        
        <div className="px-4 py-2 border-t border-b border-gray-200 dark:border-gray-700">
          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact Us</p>
        </div>
        
        <a 
          href="https://github.com/Kanav4002" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex items-center w-full px-4 py-2 text-sm ${
            darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Github className="w-4 h-4 mr-2" />
          GitHub
        </a>
        
        <a 
          href="mailto:kumarkanav5753@gmail.com"
          className={`flex items-center w-full px-4 py-2 text-sm ${
            darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </a>
        
        <a 
          href="https://www.linkedin.com/in/kanav-kumar-9170602aa/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex items-center w-full px-4 py-2 text-sm ${
            darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </a>
        
        <button 
          onClick={onLogout}
          className={`flex items-center w-full px-4 py-2 text-sm border-t border-gray-200 dark:border-gray-700 ${
            darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
          }`}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
        
        {/* Arrow pointing down to profile */}
        <div className="absolute left-1/2 bottom-0 -mb-3 transform -translate-x-1/2">
          <div className={`w-4 h-4 rotate-45 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
        </div>
      </div>
    </div>
  );
} 