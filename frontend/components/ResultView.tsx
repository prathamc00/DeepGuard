
import React from 'react';
import { AnalysisResult } from '../types';

interface ResultViewProps {
  result: AnalysisResult;
  previewUrl: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, previewUrl, onReset }) => {
  const isVideo = result.metadata.fileType.startsWith('video/');
  const isSuspected = result.isDeepfake;
  const confidenceColor = isSuspected ? 'text-rose-500' : 'text-emerald-500';
  const confidenceBg = isSuspected ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30';

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Left: Media Preview */}
      <div className="lg:col-span-7 space-y-6">
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black aspect-video flex items-center justify-center">
          {isVideo ? (
            <video src={previewUrl} className="w-full h-full object-contain" controls />
          ) : (
            <img src={previewUrl} className="w-full h-full object-contain" alt="Analyzed media" />
          )}
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <div className={`px-4 py-2 rounded-full border backdrop-blur-md ${confidenceBg} flex items-center gap-2`}>
              <i className={`fa-solid ${isSuspected ? 'fa-triangle-exclamation' : 'fa-circle-check'} ${confidenceColor}`}></i>
              <span className={`font-bold uppercase tracking-widest text-sm ${confidenceColor}`}>
                {isSuspected ? 'Manipulation Detected' : 'Authentic Media'}
              </span>
            </div>
            <div className="bg-black/60 px-3 py-1 rounded text-[10px] font-mono text-zinc-400">
              REF_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-file-invoice text-zinc-500"></i>
            Forensic Summary
          </h3>
          <p className="text-zinc-400 leading-relaxed text-sm">
            {result.explanation}
          </p>
        </div>
      </div>

      {/* Right: Detailed Metrics */}
      <div className="lg:col-span-5 space-y-6">
        <div className={`p-6 rounded-2xl border ${confidenceBg} space-y-4`}>
          <div className="flex justify-between items-end">
            <p className="text-zinc-400 text-sm font-medium">Confidence Score</p>
            <p className={`text-4xl font-bold font-mono ${confidenceColor}`}>{result.confidenceScore}%</p>
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${isSuspected ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${result.confidenceScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-zinc-500 italic">
            *This score represents the statistical probability of AI involvement based on identified artifacts.
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-bug text-cyan-500"></i>
              Digital Artifacts
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.artifactsDetected.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass-location text-amber-500"></i>
              Visual Anomalies
            </h4>
            <div className="space-y-3">
              {result.visualAnomalies.map((anomaly, i) => (
                <div key={i} className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm">
                  <span className="font-bold text-zinc-200 block mb-1">{anomaly.location}</span>
                  <p className="text-zinc-500 text-xs leading-relaxed">{anomaly.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={onReset}
          className="w-full py-4 rounded-xl bg-zinc-100 text-black font-bold hover:bg-white transition-all flex items-center justify-center gap-2 group"
        >
          <i className="fa-solid fa-rotate-left group-hover:rotate-180 transition-transform duration-500"></i>
          Analyze New Media
        </button>
      </div>
    </div>
  );
};

export default ResultView;
