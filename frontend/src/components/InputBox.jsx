import React from 'react';
import { Send } from 'lucide-react';

const InputBox = ({ input, setInput, onSend, isLoading }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Start with a topic, we'll help to the slides!"
        className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent min-h-[56px] max-h-32 text-gray-800 placeholder:text-gray-400"
        rows={1}
        disabled={isLoading}
      />
      <button
        onClick={onSend}
        disabled={isLoading || !input.trim()}
        className="absolute right-2 bottom-2 bg-gray-900 text-white p-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default InputBox;