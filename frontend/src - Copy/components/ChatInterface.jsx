import React, { useState, useEffect } from 'react';
import { Download, FileText, X, LogOut, User } from 'lucide-react';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { sendMessage } from '../services/api';
import { downloadPPT } from '../services/pptGenerator';

const ChatInterface = ({ user, token, onLogout }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello, ${user?.name || 'there'}! 👋\n\nWhat do you want me to generate a ppt about?${user?.userType && user.userType !== 'unknown' ? `\n\nI notice you're a ${user.userType}. I'll tailor the presentations to suit your needs!` : ''}`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPresentation, setCurrentPresentation] = useState(null);
  const [showSlidePreview, setShowSlidePreview] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input, sessionId, token, user);

      const assistantMessage = {
        role: 'assistant',
        content: response.message,
        presentationData: response.presentationData,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentPresentation(response.presentationData);
      setShowSlidePreview(true);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format = 'pptx') => {
    if (currentPresentation) {
      if (format === 'pptx') {
        downloadPPT(currentPresentation);
      }
      // Add PDF export functionality if needed
    }
  };

  // Get user type badge color
  const getUserTypeBadge = () => {
    const badges = {
      student: { bg: 'bg-blue-100', text: 'text-blue-700', label: '🎓 Student' },
      corporate: { bg: 'bg-purple-100', text: 'text-purple-700', label: '💼 Corporate' },
      researcher: { bg: 'bg-green-100', text: 'text-green-700', label: '🔬 Researcher' },
      educator: { bg: 'bg-orange-100', text: 'text-orange-700', label: '👨‍🏫 Educator' },
      entrepreneur: { bg: 'bg-red-100', text: 'text-red-700', label: '🚀 Entrepreneur' },
      unknown: { bg: 'bg-gray-100', text: 'text-gray-700', label: '👤 User' }
    };
    return badges[user?.userType || 'unknown'];
  };

  const badge = getUserTypeBadge();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI PowerPoint Generator
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {user?.analytics?.totalPresentations > 0 
                  ? `You've created ${user.analytics.totalPresentations} presentation${user.analytics.totalPresentations > 1 ? 's' : ''} with ${user.analytics.totalSlides} slides!` 
                  : 'Create your first amazing presentation'}
              </p>
            </div>
            
            {/* User Profile Section */}
            <div className="flex items-center gap-4">
              {/* User Type Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
              
              {/* User Info */}
              <div className="flex items-center gap-3 border-l pl-4">
                <img 
                  src={user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff`}
                  alt={user?.name || 'User'} 
                  className="w-10 h-10 rounded-full border-2 border-indigo-200"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff`;
                  }}
                />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <InputBox
              input={input}
              setInput={setInput}
              onSend={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Slide Preview Sidebar */}
      {showSlidePreview && currentPresentation && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Slide Preview</h3>
              <button
                onClick={() => setShowSlidePreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Presentation Info */}
            <div className="mb-3 p-2 bg-indigo-50 rounded-lg">
              <p className="text-xs text-indigo-800 font-medium">{currentPresentation.title}</p>
              <p className="text-xs text-indigo-600 mt-1">{currentPresentation.slides.length} slides</p>
            </div>
            
            {/* Download Options */}
            <div className="space-y-2">
              <button
                onClick={() => handleDownload('pptx')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download as PPTX
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download as PDF
              </button>
            </div>
          </div>

          {/* Slides List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentPresentation.slides.map((slide, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all bg-white"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md mb-2 flex items-center justify-center relative overflow-hidden">
                  {slide.layout === 'title' ? (
                    <div className="text-center px-4">
                      <div className="text-xs font-bold text-gray-700 mb-1">
                        {slide.title}
                      </div>
                      {slide.content && slide.content[0] && (
                        <div className="text-[8px] text-gray-500">
                          {slide.content[0]}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full p-2">
                      <div className="text-[8px] font-bold text-gray-700 mb-1">
                        {slide.title}
                      </div>
                      <div className="space-y-0.5">
                        {slide.content?.slice(0, 3).map((point, idx) => (
                          <div key={idx} className="text-[6px] text-gray-600 flex gap-1">
                            <span>•</span>
                            <span className="line-clamp-1">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-1 right-1 bg-white px-1.5 py-0.5 rounded text-[8px] font-medium text-gray-600 shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-medium truncate">
                  {slide.title}
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="border-t border-gray-200 p-4 bg-gradient-to-br from-gray-50 to-indigo-50">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>💡</span> Pro Tips:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Try: "Change slide 3 title to..."</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Try: "Add more slides about..."</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Try: "Make it more professional"</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;