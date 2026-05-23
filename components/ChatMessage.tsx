
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { type Message } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  
  return (
    <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="w-8 h-8 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300">
          <BotIcon />
        </div>
      )}
      <div 
        className={`rounded-lg p-3 max-w-lg lg:max-w-2xl xl:max-w-3xl transition-colors duration-300 ${
          isModel ? 'bg-gray-200 dark:bg-gray-700' : 'bg-cyan-500 dark:bg-cyan-600 text-white'
        }`}
      >
        <div className="prose prose-p:my-2 prose-pre:bg-gray-800 dark:prose-invert break-words max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {message.text}
            </ReactMarkdown>
        </div>
      </div>
      {!isModel && (
        <div className="w-8 h-8 flex-shrink-0 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-300">
          <UserIcon />
        </div>
      )}
    </div>
  );
};
