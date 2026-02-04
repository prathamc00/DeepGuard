
import React, { useRef, useState } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto h-64 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center cursor-pointer group
        ${isDragging ? 'border-cyan-500 bg-cyan-500/5' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/50'}
        ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleInputChange} 
        className="hidden" 
        accept="image/*,video/*"
      />
      
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
          <i className="fa-solid fa-cloud-arrow-up text-zinc-400 text-2xl group-hover:text-cyan-400"></i>
        </div>
        <div>
          <p className="text-lg font-semibold text-zinc-100">
            {isDragging ? 'Drop forensic sample now' : 'Drag & Drop Media'}
          </p>
          <p className="text-zinc-500 text-sm mt-1">
            Analyze images or videos for AI manipulation artifacts (Max 20MB)
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono uppercase">Images</span>
          <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono uppercase">Videos</span>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
