
import React, { useState, useCallback, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Sidebar } from './components/Sidebar';
import { type Message } from './types';
import { callGemini } from './services/geminiService';
import { SaveIcon } from './components/icons/SaveIcon';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';
import { MenuIcon } from './components/icons/MenuIcon';


const initialMessages: Message[] = [
  {
    role: 'model',
    text: "Yo, gue Liminilo, tentor math lu. Sesi baru nih! Punya 'Kunci Ingatan' dari sesi sebelumnya? Muat dari menu di kiri atas, atau tempel di sini. Kalo nggak ada, langsung kirim foto soal atau ketik pertanyaan lu. Kalo mau nyimpen obrolan kita nanti, tinggal bilang 'Save obrolan' ya!",
  },
];

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [savedKeys, setSavedKeys] = useState<string[]>([]);
  
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (storedTheme) return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (document.compatMode !== 'CSS1Compat') {
      console.warn(
        "Liminilo mendeteksi masalah render (Quirks Mode). Jika rumus matematika tidak tampil, coba hard refresh (Ctrl+Shift+R)."
      );
    }
    // Load saved keys from localStorage on initial render
    try {
      const keysFromStorage = JSON.parse(localStorage.getItem('liminiloMemoryKeys') || '[]');
      setSavedKeys(keysFromStorage);
    } catch (e) {
      console.error("Gagal memuat Kunci Ingatan dari localStorage:", e);
      setSavedKeys([]);
    }
  }, []);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSendMessage = useCallback(async (text: string, image: File | null) => {
    if (!text && !image) return;

    // FIX: Pass the history without the current message to `callGemini`
    // to avoid duplicating the user's turn. The user message is added to the
    // state for UI rendering, and `callGemini` constructs the new turn itself.
    if(text) setMessages(prev => [...prev, { role: 'user', text }]);
    
    setIsLoading(true);

    try {
      const modelResponse = await callGemini(text, image, messages);
      const modelMessage: Message = { role: 'model', text: modelResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      const errorMessageObject: Message = { role: 'model', text: `Waduh, ada error nih: ${errorMessage}. Coba lagi ya.`};
      setMessages(prev => [...prev, errorMessageObject]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const handleSaveChat = async () => {
    if (messages.length <= 1) return;

    setIsLoading(true);
    try {
      const summaryResponse = await callGemini('Save obrolan', null, messages);

      const updatedKeys = [...savedKeys, summaryResponse];
      localStorage.setItem('liminiloMemoryKeys', JSON.stringify(updatedKeys));
      setSavedKeys(updatedKeys);

      setMessages([
          ...initialMessages,
          {
              role: 'model',
              text: `✅ **Obrolan berhasil disimpan!** Kunci Ingatan lu udah aman di browser ini. Siap buat soal berikutnya?`
          }
      ]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      const errorMsg: Message = { role: 'model', text: `Gagal menyimpan obrolan: ${errorMessage}. Coba lagi ya.`};
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadHistory = (key: string) => {
    setMessages(initialMessages);
    // Directly call handleSendMessage to process the loaded key
    handleSendMessage(key, null);
    setIsSidebarOpen(false);
  };

  const handleDeleteHistory = (index: number) => {
    const updatedKeys = savedKeys.filter((_, i) => i !== index);
    setSavedKeys(updatedKeys);
    localStorage.setItem('liminiloMemoryKeys', JSON.stringify(updatedKeys));
  };


  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        historyKeys={savedKeys}
        onLoadHistory={handleLoadHistory}
        onDeleteHistory={handleDeleteHistory}
      />
      <div className={`flex flex-col flex-1 h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64 md:ml-72' : 'ml-0'}`}>
        <header className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-lg flex items-center justify-between transition-colors duration-300 z-10">
            <div className="flex items-center space-x-2 w-16">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label="Buka History"
              >
                <MenuIcon />
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-center text-cyan-600 dark:text-cyan-400">Liminilo Tentor Math</h1>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">Your AI Math Sidekick</p>
            </div>
            <div className="flex items-center space-x-2 w-16 justify-end">
              <button
                onClick={handleSaveChat}
                disabled={isLoading || messages.length <= 1}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Simpan Obrolan"
              >
                <SaveIcon />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>
        </header>
        <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
        />
    </div>
    </div>
  );
};

export default App;
