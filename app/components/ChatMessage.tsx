import { Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

type MessageProps = {
  content: string;
  isUser: boolean;
  onCopy: (content: string) => void;
  darkMode: boolean;
  userProfileImage?: string | null;
};

export default function ChatMessage({ 
  content, 
  isUser, 
  onCopy, 
  darkMode,
  userProfileImage
}: MessageProps) {
  // Add state to track if content is being hovered (for copy button visibility)
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract code from message if it exists
  const extractCodeFromMessage = (content: string, language: string): string => {
    const codeRegex = new RegExp(`\`\`\`${language}\\n([\\s\\S]*?)\`\`\``, 'g');
    const match = codeRegex.exec(content);
    return match ? match[1].trim() : content;
  };
  
  // Function to detect code blocks and format them
  const formatContent = () => {
    // Check if content contains code
    if (content.includes("```")) {
      const parts = content.split(/```(\w*)\n/);
      return (
        <>
          {parts.map((part, index) => {
            // Every third element is the code content (after the language and the opening ```)
            if (index % 3 === 2) {
              const language = parts[index - 1] || "text";
              const codeContent = part.trim();
              
              return (
                <div key={index} className="my-2 relative">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <div>{language}</div>
                    <button 
                      onClick={() => onCopy(codeContent)}
                      className="px-2 py-0.5 rounded hover:bg-gray-700 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="max-w-full md:max-w-[90%] lg:max-w-[70%] overflow-x-auto thin-scrollbar">
                    <SyntaxHighlighter 
                      language={language} 
                      style={atomOneDark}
                      customStyle={{
                        borderRadius: '0.375rem',
                        padding: '0.75rem',
                        fontSize: '0.75rem',
                        width: '100%',
                      }}
                      wrapLongLines={false}
                    >
                      {codeContent}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            } else if (index % 3 === 0 && part.trim()) {
              // Regular text
              return <p key={index} className="mb-2">{part}</p>;
            }
            return null; // Language identifier or empty parts
          })}
        </>
      );
    }
    
    // Check for inline code
    const inlineCodeRegex = /`([^`]+)`/g;
    if (inlineCodeRegex.test(content)) {
      const parts = content.split(inlineCodeRegex);
      return (
        <>
          {parts.map((part, index) => {
            // Every odd element is code
            if (index % 2 === 1) {
              return (
                <code
                  key={index}
                  className={`px-1.5 py-0.5 rounded ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  {part}
                </code>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </>
      );
    }
    
    // Regular text with paragraph breaks
    return content.split("\n\n").map((paragraph, i) => (
      <p key={i} className="mb-2">
        {paragraph.split("\n").map((line, j) => (
          <span key={j}>
            {line}
            {j < paragraph.split("\n").length - 1 && <br />}
          </span>
        ))}
      </p>
    ));
  };

  return isUser ? (
    <div className="flex items-start gap-2 sm:gap-4 max-w-full sm:max-w-3xl ml-auto">
      <div className="flex-1">
        <div 
          className={`${darkMode ? 'bg-blue-900 text-white' : 'bg-[#f2f6fa] text-gray-800'} p-2 sm:p-4 rounded-lg relative`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-full break-words text-sm sm:text-base">
            {formatContent()}
          </div>
          {isHovered && !content.includes("```") && (
            <button 
              onClick={() => onCopy(content)}
              className="absolute top-2 right-2 bg-gray-700 bg-opacity-50 p-1 rounded hover:bg-opacity-70 transition-all"
            >
              <Copy className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md overflow-hidden">
          {userProfileImage ? (
            <img src={userProfileImage} alt="User avatar" className="w-full h-full object-cover" />
          ) : (
            <Image src="/placeholder.svg" alt="User avatar" width={32} height={32} />
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-start gap-2 sm:gap-4 max-w-full sm:max-w-2xl">
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md overflow-hidden bg-[#96e7e5] flex items-center justify-center">
        <span className="text-[#082567] text-xs">Kai</span>
      </div>
      <div className="flex-1">
        <div 
          className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-2 sm:p-4 rounded-lg relative`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`${darkMode ? 'text-gray-100' : 'text-gray-700'} w-full break-words text-sm sm:text-base`}>
            {formatContent()}
          </div>
          {isHovered && !content.includes("```") && (
            <button 
              onClick={() => onCopy(content)}
              className="absolute top-2 right-2 bg-gray-700 bg-opacity-50 p-1 rounded hover:bg-opacity-70 transition-all"
            >
              <Copy className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 