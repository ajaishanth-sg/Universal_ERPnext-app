import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your UniverserERP assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/message', {
        message: userMessage.content,
        conversation_id: 'default'
      });

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: response.data.response || 'I apologize, but I couldn\'t generate a response.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);

      let errorMessage = 'I apologize, but I encountered an error. Please try again.';
      let shouldShowError = true;

      if (err.response?.status === 404) {
        errorMessage = 'Chatbot service is not available yet. Please restart the backend server to enable chatbot functionality.';
      } else if (err.response?.status === 503) {
        // 503 means Ollama is available but model isn't found - use contextual fallback
        shouldShowError = false;

        // Generate contextual response based on user message
        const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

        if (['payment', 'pay', 'invoice', 'bill'].some(word => userMessage.includes(word))) {
          errorMessage = "I can help you with payment-related questions in your UniverserERP system. You can access payment features through the Financial Dashboard or Accounting sections. Would you like me to guide you to the payment modules?";
        } else if (['help', 'support', 'assist'].some(word => userMessage.includes(word))) {
          errorMessage = "I'm here to help! I can assist you with navigating UniverserERP features, answering questions about the system, or guiding you to specific modules. What would you like to know?";
        } else if (['dashboard', 'main', 'home'].some(word => userMessage.includes(word))) {
          errorMessage = "The main dashboard gives you an overview of all your ERP modules including Financial, HR, Operations, and Fleet Management. You can access different sections through the sidebar navigation.";
        } else if (['report', 'analytics', 'data'].some(word => userMessage.includes(word))) {
          errorMessage = "UniverserERP provides comprehensive reporting across all modules. You can generate financial reports, payroll reports, fleet analytics, and maintenance reports from their respective dashboard sections.";
        } else {
          errorMessage = "I'm currently running in demo mode since the AI model isn't available. To enable full AI capabilities, please pull a model like 'llama2' using: ollama pull llama2";
        }
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to backend server. Please ensure the backend is running.';
      }

      if (shouldShowError) {
        setError(errorMessage);
      }

      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: errorMessage,
        timestamp: new Date(),
        isError: shouldShowError
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m your UniverserERP assistant. How can I help you today?',
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
          title="Open Chat Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">UniverserERP Assistant</h3>
              <p className="text-xs text-blue-100">Powered by Ollama</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="text-blue-100 hover:text-white p-1 transition-colors"
              title="Clear Chat"
            >
              <AlertCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-blue-100 hover:text-white p-1 transition-colors"
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white p-1 transition-colors"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.isError
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && (
                        <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                      {message.type === 'user' && (
                        <User className="w-4 h-4 mt-1 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg max-w-xs">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isLoading || !inputMessage.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Minimized View */}
        {isMinimized && (
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full text-left text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Chat with UniverserERP Assistant...
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;