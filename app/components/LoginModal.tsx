"use client";

import { useState } from "react";
import { X, ArrowRight, AlertTriangle } from "lucide-react";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
  onSignup: (username: string, email: string, password: string) => void;
  darkMode: boolean;
};

export default function LoginModal({ isOpen, onClose, onLogin, onSignup, darkMode }: LoginModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasNumber: false,
    hasSpecial: false
  });
  
  if (!isOpen) return null;

  const validateUsername = (username: string): boolean => {
    // Username can only contain letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters, include a number and special character
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLength = password.length >= 8;
    
    setPasswordStrength({
      length: hasLength,
      hasNumber: hasNumber,
      hasSpecial: hasSpecial
    });
    
    return hasLength && hasNumber && hasSpecial;
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    resetPasswordStrength();
  };
  
  const resetPasswordStrength = () => {
    setPasswordStrength({
      length: false,
      hasNumber: false,
      hasSpecial: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Username validation for both login and signup
    if (!validateUsername(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }
    
    if (isLoginMode) {
      // Login validation
      if (!username || !password) {
        setError("Please enter both username and password");
        return;
      }
      
      // In a real app, you would validate credentials with your backend
      onLogin(username, password);
      resetForm();
    } else {
      // Signup validation
      if (!username || !email || !password) {
        setError("Please fill in all required fields");
        return;
      }
      
      // Password validation
      if (!validatePassword(password)) {
        setError("Password must be at least 8 characters and include numbers and special characters");
        return;
      }
      
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        setError("Please enter a valid email address");
        return;
      }
      
      // In a real app, you would register the user with your backend
      onSignup(username, email, password);
      resetForm();
    }
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    resetPasswordStrength();
    onClose();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLoginMode) {
      validatePassword(newPassword);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {isLoginMode ? 'Sign in to your account' : 'Create your account'}
        </h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="username" 
              className={`flex justify-between mb-2 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              <span>Username</span>
              <span className="text-xs text-gray-400">letters, numbers, underscores only</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          
          {!isLoginMode && (
            <div className="mb-4">
              <label 
                htmlFor="email" 
                className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          )}
          
          <div className="mb-4">
            <label 
              htmlFor="password" 
              className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            
            {!isLoginMode && (
              <div className="mt-2 space-y-1">
                <div className="text-xs text-gray-500">Password requirements:</div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${passwordStrength.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-xs ${passwordStrength.length ? 'text-green-500' : 'text-gray-500'}`}>
                    Minimum 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-xs ${passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                    At least one number
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${passwordStrength.hasSpecial ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-xs ${passwordStrength.hasSpecial ? 'text-green-500' : 'text-gray-500'}`}>
                    At least one special character
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {!isLoginMode && (
            <div className="mb-6">
              <label 
                htmlFor="confirmPassword" 
                className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          )}
          
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={toggleMode}
              className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              {isLoginMode ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
            
            <button
              type="submit"
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {isLoginMode ? 'Sign in' : 'Create account'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 