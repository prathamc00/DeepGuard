
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisResult, ScanHistoryItem } from './types';
import { analyzeMedia } from './services/backendService';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import AnalysisView from './components/AnalysisView';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [currentFile, setCurrentFile] = useState<{ url: string; type: string; name: string } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    const url = URL.createObjectURL(file);
    setCurrentFile({ url, type: file.type, name: file.name });
    setState(AppState.ANALYZING);

    try {
      // Direct file upload to backend
      const analysisResult = await analyzeMedia(file);
      setResult(analysisResult);

      // Add to history
      const historyItem: ScanHistoryItem = {
        ...analysisResult,
        id: Math.random().toString(36).substr(2, 9),
        previewUrl: url,
      };
      setHistory(prev => [historyItem, ...prev].slice(0, 10));

      setState(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analysis failed');
      setState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setState(AppState.IDLE);
    setResult(null);
    setCurrentFile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-12">
        {state === AppState.IDLE && (
          <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-1000">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                Detect Deepfakes with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Forensic AI Precision
                </span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                DeepGuard uses state-of-the-art vision models to identify manipulation artifacts,
                frequency inconsistencies, and biometric misalignments in digital media.
              </p>

              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">99.2%</span>
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-tighter">Precision Rate</span>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">&lt; 30s</span>
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-tighter">Analysis Time</span>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">2.5M+</span>
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-tighter">Samples Analyzed</span>
                </div>
              </div>
            </div>

            <UploadZone onFileSelect={handleFileSelect} isProcessing={false} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 mb-4">
                  <i className="fa-solid fa-microscope text-xl"></i>
                </div>
                <h3 className="font-bold text-white mb-2">Micro-Expression Scan</h3>
                <p className="text-zinc-500 text-sm">Analyzes facial muscle movements for unnatural transitions and frozen micro-expressions.</p>
              </div>
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-4">
                  <i className="fa-solid fa-fingerprint text-xl"></i>
                </div>
                <h3 className="font-bold text-white mb-2">Digital Noise Profiling</h3>
                <p className="text-zinc-500 text-sm">Detects inconsistencies in sensor noise and compression patterns unique to GANs and Diffusion models.</p>
              </div>
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                  <i className="fa-solid fa-eye-low-vision text-xl"></i>
                </div>
                <h3 className="font-bold text-white mb-2">Iris Inconsistency</h3>
                <p className="text-zinc-500 text-sm">Evaluates light reflections in the pupils, often missed by standard deepfake generation techniques.</p>
              </div>
            </div>
          </div>
        )}

        {state === AppState.ANALYZING && currentFile && (
          <AnalysisView previewUrl={currentFile.url} fileType={currentFile.type} />
        )}

        {state === AppState.RESULT && result && currentFile && (
          <ResultView result={result} previewUrl={currentFile.url} onReset={handleReset} />
        )}

        {state === AppState.ERROR && (
          <div className="max-w-md mx-auto text-center space-y-6 py-20">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto border border-rose-500/30">
              <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Forensic Scan Failed</h3>
              <p className="text-zinc-500 mt-2">{error}</p>
            </div>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* History Section (visible when not analyzing) */}
        {state !== AppState.ANALYZING && history.length > 0 && (
          <section className="mt-20 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <i className="fa-solid fa-clock-rotate-left text-zinc-500"></i>
                Recent Investigations
              </h3>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Clear History</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {history.map((item) => (
                <div key={item.id} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all cursor-pointer">
                  <div className="aspect-video relative overflow-hidden bg-black">
                    <img src={item.previewUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="History" />
                    <div className="absolute top-2 right-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${item.isDeepfake ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'}`}>
                        {item.isDeepfake ? 'FAKE' : 'REAL'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-zinc-300 font-medium truncate mb-1">{item.metadata.fileName}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">{new Date(item.metadata.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-black border-t border-zinc-900 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-4 max-w-xs">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              DEEPGUARD
            </h1>
            <p className="text-zinc-500 text-sm">
              Protecting digital truth in the age of generative synthetic media. DeepGuard provides verifiable forensic analysis for enterprises and individuals.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Platform</h4>
              <ul className="text-sm text-zinc-500 space-y-2">
                <li><a href="#" className="hover:text-cyan-400">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400">Security</a></li>
                <li><a href="#" className="hover:text-cyan-400">API Access</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Company</h4>
              <ul className="text-sm text-zinc-500 space-y-2">
                <li><a href="#" className="hover:text-cyan-400">About</a></li>
                <li><a href="#" className="hover:text-cyan-400">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-zinc-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
          <p>© 2024 DeepGuard Laboratories. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400">X (Twitter)</a>
            <a href="#" className="hover:text-zinc-400">GitHub</a>
            <a href="#" className="hover:text-zinc-400">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
