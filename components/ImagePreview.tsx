
import React, { useState, useEffect } from 'react';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!previewUrl) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 p-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg transition-colors duration-300">
      <div className="relative">
        <img src={previewUrl} alt="Preview" className="h-20 w-auto rounded" />
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold hover:bg-red-500"
          aria-label="Remove image"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
