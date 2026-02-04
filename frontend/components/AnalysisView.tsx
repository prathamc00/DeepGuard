
import React from 'react';

interface AnalysisViewProps {
  previewUrl: string;
  fileType: string;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ previewUrl, fileType }) => {
  const isVideo = fileType.startsWith('video/');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black aspect-video flex items-center justify-center">
        {isVideo ? (
          <video src={previewUrl} className="w-full h-full object-contain" autoPlay muted loop />
        ) : (
          <img src={previewUrl} className="w-full h-full object-contain" alt="Sample" />
        )}
        
        {/* Scanning Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="scanning-line absolute w-full left-0 z-20"></div>
          <div className="absolute inset-0 bg-cyan-500/10 opacity-30"></div>
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded border border-cyan-500/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Active Scanning</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: 'fa-brain', label: 'Neural Texture Check', status: 'In Progress...' },
          { icon: 'fa-eye', label: 'Biometric Alignment', status: 'Queued' },
          { icon: 'fa-wave-square', label: 'Noise Pattern Analysis', status: 'Queued' },
        ].map((item, idx) => (
          <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400">
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">{item.label}</p>
              <p className="text-xs text-zinc-500 font-mono italic">{item.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-6">
        <p className="text-zinc-400 flex items-center justify-center gap-2">
          <i className="fa-solid fa-spinner fa-spin text-cyan-500"></i>
          AI is decomposing spatial frequencies and biometric markers...
        </p>
      </div>
    </div>
  );
};

export default AnalysisView;
