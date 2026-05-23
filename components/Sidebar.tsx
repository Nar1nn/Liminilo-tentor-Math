
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  historyKeys: string[];
  onLoadHistory: (key: string) => void;
  onDeleteHistory: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, historyKeys, onLoadHistory, onDeleteHistory }) => {
  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent triggering onLoadHistory
    onDeleteHistory(index);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 md:w-72 bg-white dark:bg-gray-800 shadow-xl z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">History Ingatan</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Tutup History"
            >
              <CloseIcon />
            </button>
          </header>

          <nav className="flex-1 p-2 overflow-y-auto">
            {historyKeys.length > 0 ? (
              <ul className="space-y-1">
                {historyKeys.map((key, index) => (
                  <li key={index}>
                    <button
                      onClick={() => onLoadHistory(key)}
                      className="w-full text-left p-2 group flex justify-between items-center rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <span className="truncate flex-1 pr-2">{key}</span>
                      <span 
                        onClick={(e) => handleDelete(e, index)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1"
                        aria-label="Hapus ingatan"
                      >
                        <TrashIcon />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Belum ada 'Kunci Ingatan' yang disimpan.</p>
                <p className="mt-2">Selesaikan satu sesi dan klik 'Save' untuk memulai history-mu!</p>
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
};
