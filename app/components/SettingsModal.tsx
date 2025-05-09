"use client";

import { useState, useEffect, useRef } from "react";
import { X, Languages, Moon, Sun, User, Info, Check, ChevronDown, Upload, Edit } from "lucide-react";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleTheme: (mode: "light" | "dark" | "system") => void;
  currentUser: {
    username: string;
    email: string;
    phoneNumber?: string;
  } | null;
  onUpdateProfile: (data: { 
    name?: string; 
    email?: string; 
    phoneNumber?: string;
    profileImage?: string | null;
  }) => void;
  onDeleteAllChats: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
  profileImage?: string | null;
  setProfileImage?: (image: string | null) => void;
};

type Tab = "general" | "profile" | "about";

export default function SettingsModal({
  isOpen,
  onClose,
  darkMode,
  onToggleTheme,
  currentUser,
  onUpdateProfile,
  onDeleteAllChats,
  onDeleteAccount,
  onLogout,
  profileImage,
  setProfileImage
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [themeOption, setThemeOption] = useState<"light" | "dark" | "system">(
    darkMode ? "dark" : "light"
  );
  const [languageOption, setLanguageOption] = useState<string>("system");
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [name, setName] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [profileImageState, setProfileImageState] = useState<string | null>(profileImage || null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.username);
      setEmail(currentUser.email);
      setPhoneNumber(currentUser.phoneNumber || "");
      setProfileImageState(profileImage || null);
    }
  }, [currentUser, profileImage]);

  if (!isOpen) return null;

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setThemeOption(theme);
    onToggleTheme(theme);
    setIsThemeDropdownOpen(false);
  };

  const handleLanguageChange = (language: string) => {
    setLanguageOption(language);
    setIsLanguageDropdownOpen(false);
  };

  const handleSaveProfile = () => {
    onUpdateProfile({
      name,
      email,
      phoneNumber,
      profileImage: profileImageState
    });
    setIsEditingEmail(false);
    setIsEditingPhone(false);
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("Image is too large. Please select an image under 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate the new dimensions (max 300px width/height)
          const maxSize = 300;
          if (width > height) {
            if (width > maxSize) {
              height = Math.round(height * (maxSize / width));
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round(width * (maxSize / height));
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw the resized image
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get compressed image as a data URL
            const compressedImage = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with 70% quality
            
            // Set the compressed image
            setProfileImageState(compressedImage);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAllChats = () => {
    if (window.confirm("Are you sure you want to delete all chats? This action cannot be undone.")) {
      onDeleteAllChats();
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      onDeleteAccount();
    }
  };

  const handleSave = () => {
    onUpdateProfile({
      name,
      email,
      phoneNumber,
      profileImage: profileImageState
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg shadow-lg bg-gray-800 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-3 text-center ${
              activeTab === "general" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700/50"
            } transition rounded-tl-lg`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-center ${
              activeTab === "profile" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700/50"
            } transition`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 py-3 text-center ${
              activeTab === "about" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700/50"
            } transition rounded-tr-lg`}
          >
            About
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <label className="text-lg">Language</label>
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md"
                  >
                    <span>{languageOption === "system" ? "System" : languageOption}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isLanguageDropdownOpen && (
                    <div 
                      ref={languageDropdownRef}
                      className="absolute right-0 mt-1 w-36 bg-gray-700 rounded-md shadow-lg z-20 top-full"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleLanguageChange("system")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center justify-between"
                        >
                          <span>System</span>
                          {languageOption === "system" && <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleLanguageChange("English")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center justify-between"
                        >
                          <span>English</span>
                          {languageOption === "English" && <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleLanguageChange("Spanish")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center justify-between"
                        >
                          <span>Spanish</span>
                          {languageOption === "Spanish" && <Check className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-lg">Theme</label>
                <div className="relative">
                  <button
                    onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md"
                  >
                    <span>{themeOption === "system" ? "System" : themeOption === "dark" ? "Dark" : "Light"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isThemeDropdownOpen && (
                    <div 
                      ref={themeDropdownRef}
                      className="absolute right-0 mt-1 w-36 bg-gray-700 rounded-md shadow-lg z-20 top-full"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleThemeChange("system")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center justify-between"
                        >
                          <span>System</span>
                          {themeOption === "system" && <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleThemeChange("light")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center justify-between"
                        >
                          <span>Light</span>
                          {themeOption === "light" && <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleThemeChange("dark")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center justify-between"
                        >
                          <span>Dark</span>
                          {themeOption === "dark" && <Check className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              {/* Profile Picture */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                    {profileImageState ? (
                      <img src={profileImageState} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleProfileImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <div className="flex justify-between items-center px-3 py-2 bg-gray-700 rounded-md">
                  <span>{name}</span>
                  {currentUser?.username && (
                    <div className="bg-gray-600 rounded p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="inline-block">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email address</label>
                {isEditingEmail ? (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button 
                      onClick={() => {
                        handleSaveProfile();
                        setIsEditingEmail(false);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div 
                    className="flex justify-between items-center px-3 py-2 bg-gray-700 rounded-md cursor-pointer"
                    onClick={() => setIsEditingEmail(true)}
                  >
                    <span>
                      {email.replace(/(.{3})(.*)(@.*)/, function(_, start, middle, end) {
                        return start + middle.replace(/./g, '*') + end;
                      })}
                    </span>
                    <Edit className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone number</label>
                {isEditingPhone ? (
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button 
                      onClick={() => {
                        handleSaveProfile();
                        setIsEditingPhone(false);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div 
                    className="flex justify-between items-center px-3 py-2 bg-gray-700 rounded-md cursor-pointer"
                    onClick={() => setIsEditingPhone(true)}
                  >
                    <span>{phoneNumber || "-"}</span>
                    <Edit className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Delete all chats</label>
                <button
                  onClick={handleDeleteAllChats}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                >
                  Delete all
                </button>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Log out of all devices</label>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
                >
                  Log out
                </button>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Delete account</label>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <label className="text-lg">Terms of Use</label>
                <button
                  className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
                >
                  View
                </button>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-lg">Privacy Policy</label>
                <button
                  className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
                >
                  View
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">AI Chat Bot v1.0.0</p>
                <p className="text-xs text-gray-500 mt-1">© 2023 All Rights Reserved</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 