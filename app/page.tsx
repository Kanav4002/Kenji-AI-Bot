"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";
import LoginModal from "./components/LoginModal";
import { getAIResponse } from "./services/ai";
import SettingsModal from "./components/SettingsModal";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

type Chat = {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messages: Message[];
};

type User = {
  username: string;
  email: string;
};

// Mock responses for the chatbot
const mockResponses = [
  "This AI chatbot has been developed to optimize communication and simplify work processes, ultimately leading to smoother operations.",
  "I've analyzed your request and found the solution you're looking for.",
  "I can help you with that task. Let me show you the most efficient approach.",
  "Based on your input, here's a suggested implementation that should work well.",
  "I've processed your request and have some relevant information to share."
];

// Sample chats for initial state
const sampleChats: Chat[] = [
  {
    id: "chat1",
    title: "Chatbot Introduction",
    preview: "This is an ai chatbot generated for better...",
    timestamp: "Today, 10:30 AM",
    messages: [
      {
        id: "1",
        content: "Rephrase 'This is an ai chatbot generated for better communication and simpler work flows'",
        isUser: true
      },
      {
        id: "2",
        content: "This AI chatbot has been developed to optimize communication and simplify work processes, ultimately leading to smoother operations.",
        isUser: false
      },
      {
        id: "3",
        content: "Thank You :)",
        isUser: true
      }
    ]
  },
  {
    id: "chat2",
    title: "Code Help",
    preview: "How do I fix this React component?",
    timestamp: "Yesterday, 3:45 PM",
    messages: [
      {
        id: "1",
        content: "How do I fix this React component that's not rendering properly?",
        isUser: true
      },
      {
        id: "2",
        content: "Let's debug your React component. The most common issues are usually related to state management or missing key props. Could you share the component code?",
        isUser: false
      }
    ]
  },
  {
    id: "chat3",
    title: "Marketing Ideas",
    preview: "Need copy for our new product launch",
    timestamp: "Jan 15, 2023",
    messages: [
      {
        id: "1",
        content: "I need help writing marketing copy for our new product launch",
        isUser: true
      },
      {
        id: "2",
        content: "I'd be happy to help with your marketing copy. To create effective copy for your product launch, I'll need some details about your product, target audience, and key selling points.",
        isUser: false
      }
    ]
  },
  {
    id: "prompt1",
    title: "Rephrase text...",
    preview: "Rephrase this text in a more professional tone",
    timestamp: "Sample prompt",
    messages: [
      {
        id: "1",
        content: "Rephrase this text in a more professional tone: 'Hey team, just wanted to let you know that we're gonna be a bit late with the project, stuff came up, sorry!'",
        isUser: true
      }
    ]
  },
  {
    id: "prompt2",
    title: "Fix this code ne...",
    preview: "Fix this code and explain the issues",
    timestamp: "Sample prompt",
    messages: [
      {
        id: "1",
        content: "Fix this code and explain the issues:\n\nfunction getData() {\n  fetch('https://api.example.com/data')\n  .then(response => {\n    return response.json();\n  })\n  .then(data => {\n    console.log(data);\n  })\n}",
        isUser: true
      }
    ]
  },
  {
    id: "prompt3",
    title: "Sample Copy for...",
    preview: "Generate marketing copy for a new product",
    timestamp: "Sample prompt",
    messages: [
      {
        id: "1",
        content: "Generate marketing copy for a new smart home security system that includes AI-powered cameras, motion sensors, and mobile app control.",
        isUser: true
      }
    ]
  }
];

// Simulate a user database
const userDatabase: Record<string, User> = {};

export default function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>(sampleChats);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("system");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();

  // Initialize with saved data
  useEffect(() => {
    // Check for saved login
    const savedUser = localStorage.getItem('chatbot_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsLoggedIn(true);
        if (parsedUser.profileImage) {
          setProfileImage(parsedUser.profileImage);
        }
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('chatbot_user');
      }
    }

    // Load chat history from localStorage if available
    const savedChats = localStorage.getItem('chatbot_chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
      } catch (e) {
        console.error('Failed to parse saved chats', e);
      }
    }

    // Set default chat to first one if available
    if (sampleChats.length > 0) {
      setCurrentChatId(sampleChats[0].id);
      setMessages(sampleChats[0].messages);
      setFilteredMessages(sampleChats[0].messages);
    }
  }, []);

  // Save chats to localStorage when they change
  useEffect(() => {
    localStorage.setItem('chatbot_chats', JSON.stringify(chats));
  }, [chats]);

  // Function to select a chat
  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const selectedChat = chats.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setFilteredMessages(selectedChat.messages);
    }
  };

  // Function to handle sending new messages
  const handleSendMessage = async (content: string) => {
    const newUserMessage = {
      id: Date.now().toString(),
      content,
      isUser: true
    };
    
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    // Update the current chat with the new message
    if (currentChatId) {
      updateChatWithMessages(currentChatId, updatedMessages);
    } else {
      // Create a new chat if there isn't a current one
      const newChatId = `chat_${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        preview: content,
        timestamp: formatTimestamp(new Date()),
        messages: [newUserMessage]
      };
      
      setChats([newChat, ...chats]);
      setCurrentChatId(newChatId);
    }
    
    // Get AI response
    try {
      // Convert messages to the format expected by the AI API
      const messageHistory = updatedMessages.map(msg => ({
        role: msg.isUser ? "user" as const : "assistant" as const,
        content: msg.content
      }));
      
      // Add a loading message
      const loadingMessage = {
        id: `loading_${Date.now()}`,
        content: "Thinking...",
        isUser: false
      };
      
      setMessages([...updatedMessages, loadingMessage]);
      
      // Call the AI API
      const aiResponse = await getAIResponse(messageHistory);
      
      // Remove loading message and add AI response
      const newAIMessage = {
        id: Date.now().toString(),
        content: aiResponse,
        isUser: false
      };
      
      const messagesWithResponse = [...updatedMessages, newAIMessage];
      setMessages(messagesWithResponse);
      
      // Update chat with AI response
      if (currentChatId) {
        updateChatWithMessages(currentChatId, messagesWithResponse);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Remove loading message and add error message
      const errorMessage = {
        id: Date.now().toString(),
        content: "Sorry, there was an error processing your request. Please try again.",
        isUser: false
      };
      
      const messagesWithError = [...updatedMessages, errorMessage];
      setMessages(messagesWithError);
      
      if (currentChatId) {
        updateChatWithMessages(currentChatId, messagesWithError);
      }
    }
  };

  // Helper function to update a chat with new messages
  const updateChatWithMessages = (chatId: string, newMessages: Message[]) => {
    const chatIndex = chats.findIndex(chat => chat.id === chatId);
    if (chatIndex >= 0) {
      const updatedChat = {
        ...chats[chatIndex],
        messages: newMessages,
        preview: newMessages[newMessages.length - 1]?.content.slice(0, 40) + '...',
        timestamp: formatTimestamp(new Date())
      };
      
      const updatedChats = [...chats];
      updatedChats[chatIndex] = updatedChat;
      
      // Move this chat to the top
      if (chatIndex > 0) {
        updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(updatedChat);
      }
      
      setChats(updatedChats);
    }
  };

  // Helper function to format timestamps
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date >= yesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Function to handle copying message content
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        console.log("Message copied to clipboard");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };

  // Function to clear the chat
  const handleClearChat = () => {
    if (currentChatId) {
      // Remove this chat from the list
      const updatedChats = chats.filter(chat => chat.id !== currentChatId);
      setChats(updatedChats);
      
      // Set current chat to the first one or null
      if (updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0].id);
        setMessages(updatedChats[0].messages);
        setFilteredMessages(updatedChats[0].messages);
      } else {
        setCurrentChatId(null);
        setMessages([]);
        setFilteredMessages([]);
      }
    }
  };

  // Function to start a new chat
  const handleNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      title: "New Conversation",
      preview: "Start a new conversation...",
      timestamp: formatTimestamp(new Date()),
      messages: []
    };
    
    setChats([newChat, ...chats]);
    setCurrentChatId(newChatId);
    setMessages([]);
    setFilteredMessages([]);
  };

  // Function to handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(message => 
        message.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  };

  // Function to toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Function to handle login
  const handleLogin = (username: string, password: string) => {
    // Check if user exists
    const user = Object.values(userDatabase).find(user => user.username === username);
    
    if (user) {
      // In a real app, you would verify password hash here
      setCurrentUser(user);
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
      
      // Save login info to localStorage (in a real app, you'd use secure HTTP-only cookies)
      localStorage.setItem('chatbot_user', JSON.stringify(user));
      
      // Notify user
      const welcomeMessage = {
        id: Date.now().toString(),
        content: `Welcome back, ${username}! You've successfully signed in.`,
        isUser: false
      };
      setMessages(prev => [...prev, welcomeMessage]);
      
      // Update current chat with welcome message
      if (currentChatId) {
        const currentMessages = [...messages, welcomeMessage];
        updateChatWithMessages(currentChatId, currentMessages);
      }
    } else {
      // Show error in the modal
      alert("User not found. Please sign up first.");
    }
  };

  // Function to handle signup
  const handleSignup = (username: string, email: string, password: string) => {
    // Check if username already exists
    if (Object.values(userDatabase).some(user => user.username === username)) {
      alert("Username already exists. Please choose a different one.");
      return;
    }
    
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      alert("Username can only contain letters, numbers, and underscores");
      return;
    }
    
    // Validate password requirements
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLength = password.length >= 8;
    
    if (!hasLength || !hasNumber || !hasSpecial) {
      alert("Password must be at least 8 characters and include numbers and special characters");
      return;
    }
    
    // In a real app, you would hash the password and call your backend API
    const newUser = { username, email };
    userDatabase[username] = newUser;
    
    // Log the user in
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    
    // Save login info to localStorage
    localStorage.setItem('chatbot_user', JSON.stringify(newUser));
    
    // Welcome message
    const welcomeMessage = {
      id: Date.now().toString(),
      content: `Welcome, ${username}! Your account has been created successfully.`,
      isUser: false
    };
    
    const updatedMessages = [...messages, welcomeMessage];
    setMessages(updatedMessages);
    
    // Update current chat with welcome message or create a new one
    if (currentChatId) {
      updateChatWithMessages(currentChatId, updatedMessages);
    } else {
      handleNewChat();
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('chatbot_user');
    
    // Logout message
    const logoutMessage = {
      id: Date.now().toString(),
      content: "You have been logged out successfully.",
      isUser: false
    };
    
    const updatedMessages = [...messages, logoutMessage];
    setMessages(updatedMessages);
    
    // Update current chat with logout message
    if (currentChatId) {
      updateChatWithMessages(currentChatId, updatedMessages);
    }
  };

  // Update filtered messages when messages change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMessages(messages);
    } else {
      handleSearch(searchQuery);
    }
  }, [messages, searchQuery]);

  // Function to handle theme change
  const handleThemeChange = (mode: "light" | "dark" | "system") => {
    setThemeMode(mode);
    if (mode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    } else {
      setDarkMode(mode === "dark");
    }
  };

  // Function to update profile
  const handleUpdateProfile = (data: { 
    name?: string; 
    email?: string; 
    phoneNumber?: string;
    profileImage?: string | null;
  }) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        username: data.name || currentUser.username,
        email: data.email || currentUser.email,
        phoneNumber: data.phoneNumber,
        profileImage: data.profileImage !== undefined ? data.profileImage : profileImage
      };
      
      setCurrentUser(updatedUser);
      
      if (data.profileImage !== undefined) {
        setProfileImage(data.profileImage);
      }
      
      // Save to localStorage
      localStorage.setItem('chatbot_user', JSON.stringify(updatedUser));
    }
  };

  // Function to delete account
  const handleDeleteAccount = () => {
    // Delete account logic
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('chatbot_user');
    localStorage.removeItem('chatbot_chats');
    setChats([]);
    setMessages([]);
    setIsSettingsModalOpen(false);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Sidebar */}
      <Sidebar 
        onNewChat={handleNewChat}
        isLoggedIn={isLoggedIn}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        darkMode={darkMode}
        username={currentUser?.username || ""}
        recentChats={chats}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
        profileImage={profileImage}
      />

      {/* Main chat area - will adapt to sidebar width changes */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <ChatHeader 
          onClearChat={handleClearChat} 
          onSearch={handleSearch}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
        />

        {/* Chat messages */}
        <ChatArea 
          messages={filteredMessages} 
          onCopyMessage={handleCopyMessage}
          darkMode={darkMode}
          userProfileImage={profileImage}
        />

        {/* Input area */}
        <ChatInput 
          onSendMessage={handleSendMessage}
          darkMode={darkMode}
        />
      </div>

      {/* Login/Signup Modal */}
      <LoginModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        darkMode={darkMode}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        darkMode={darkMode}
        onToggleTheme={handleThemeChange}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onDeleteAllChats={() => {
          setChats([]);
          setMessages([]);
          localStorage.removeItem('chatbot_chats');
        }}
        onDeleteAccount={handleDeleteAccount}
        onLogout={handleLogout}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
      />
    </div>
  );
}
