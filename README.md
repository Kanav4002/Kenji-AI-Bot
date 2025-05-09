# Kai AI Chat Bot

A modern, feature-rich AI chat application built with Next.js and React, offering a clean and intuitive interface for interacting with AI assistants.

![Kai Chat Bot](https://github.com/yourusername/ai-chat-bot/raw/main/public/screenshot.png)

## Features

- **AI-Powered Chat**: Engage with an AI assistant named "Kai" that can help with a variety of tasks
- **User Authentication**: Secure login and signup functionality with localStorage persistence
- **Profile Management**: Update user profile information and upload profile pictures
- **Chat History**: Save and manage chat conversations
- **Code Highlighting**: Automatic syntax highlighting for code snippets in chat
- **Emoji Support**: Custom emoji picker with search functionality
- **Dark Mode**: Toggle between light, dark, and system theme settings
- **Responsive Design**: Fully responsive layout that works on desktop and mobile devices
- **Message Search**: Search through your chat history
- **Copy to Clipboard**: Easily copy messages and code snippets

## Tech Stack

- **Framework**: Next.js 14 with React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Syntax Highlighting**: react-syntax-highlighter
- **AI Integration**: OpenRouter API

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-chat-bot.git
   cd ai-chat-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Local Setup Guide

Here's a detailed guide to get the Kai Chat Bot running on your local machine:

1. **System Requirements Check**:
   - Ensure you have Node.js installed (v18.0+)
   - Check with: `node -v`
   - If not installed, download from [nodejs.org](https://nodejs.org/)

2. **Get the Code**:
   - Open your terminal/command prompt
   - Navigate to your preferred directory: `cd path/to/your/projects/folder`
   - Clone the repository: `git clone https://github.com/yourusername/ai-chat-bot.git`
   - Enter the project directory: `cd ai-chat-bot`

3. **Install Dependencies**:
   - Run: `npm install`
   - This will install all required packages defined in package.json

4. **Configure Environment (Optional)**:
   - If you want to use your own AI API:
     - Create a `.env.local` file in the root directory
     - Add your API key: `NEXT_PUBLIC_OPENROUTER_API_KEY=your_api_key_here`

5. **Start the Development Server**:
   - Run: `npm run dev`
   - The terminal will show a message when the server is ready

6. **Access the Application**:
   - Open your web browser
   - Navigate to: [http://localhost:3000](http://localhost:3000)
   - You should see the Kai Chat Bot interface

7. **Create an Account**:
   - Click "Sign Up" on the login screen
   - Enter your details to create a local account
   - Your account data will be stored in localStorage

8. **Start Chatting**:
   - Click "New Chat" to start a conversation with Kai
   - Type your message and press Enter to send

9. **Troubleshooting**:
   - If you encounter any issues:
     - Check the console (F12 in most browsers) for errors
     - Ensure all dependencies were installed correctly
     - Try restarting the development server

## Project Structure

```
ai-chat-bot/
├── app/
│   ├── components/
│   │   ├── ChatArea.tsx       # Main chat display area
│   │   ├── ChatHeader.tsx     # Header with search and settings
│   │   ├── ChatHistory.tsx    # Displays chat history
│   │   ├── ChatInput.tsx      # Message input with emoji picker
│   │   ├── ChatMessage.tsx    # Individual message component
│   │   ├── LoginModal.tsx     # Authentication modal
│   │   ├── ProfileDropdown.tsx # User profile dropdown
│   │   ├── SettingsModal.tsx  # User settings and preferences
│   │   └── Sidebar.tsx        # Navigation sidebar
│   ├── services/
│   │   └── ai.ts              # AI API integration
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # App layout
│   └── page.tsx               # Main application page
├── public/                    # Static assets
├── next.config.js             # Next.js configuration
├── package.json               # Project dependencies
└── tailwind.config.js         # Tailwind CSS configuration
```

## Key Features Explained

### Authentication System

The application provides a complete authentication system with signup and login functionality. User data is stored in localStorage for persistence across sessions.

### Chat Interface

The chat interface supports various message types, including:
- Regular text
- Code blocks with syntax highlighting
- Inline code formatting

### User Settings

Users can customize their experience through the settings modal:
- Update profile information
- Upload profile pictures (with automatic resizing and compression)
- Change theme preferences
- Delete account data

### AI Integration

The application connects to the OpenRouter AI API to provide intelligent responses to user queries.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Lucide React](https://lucide.dev/) - For icons
- [OpenRouter](https://openrouter.ai/) - For AI API access

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
