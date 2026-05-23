
import React, { useState, useRef, useLayoutEffect } from 'react';
import { type Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { ImagePreview } from './ImagePreview';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { SendIcon } from './icons/SendIcon';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string, image: File | null) => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || imageFile) {
      onSendMessage(text, imageFile);
      setText('');
      setImageFile(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
           <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-lg flex items-center space-x-2">
              <span className="text-sm">Liminilo lagi mikir...</span>
              <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <button type="button" onClick={triggerFileInput} className="p-2 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <PaperclipIcon />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <div className="flex-1 relative">
            {imageFile && <ImagePreview file={imageFile} onRemove={() => setImageFile(null)} />}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      handleSubmit(e);
                  }
              }}
              placeholder="Tanya apa aja soal matematika..."
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-300 resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '200px' }}
              onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </div>
          <button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-full disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};
