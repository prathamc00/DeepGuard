
import React, { useState } from 'react';
import { AnalysisResult, ForensicEvidence, SimilarCase } from '../types';

interface ResultViewProps {
  result: AnalysisResult;
  previewUrl: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, previewUrl, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'forensics' | 'evidence'>('overview');

  const isVideo = result.metadata.fileType.startsWith('video/');
  const isSuspected = result.isDeepfake;
  const confidenceColor = isSuspected ? 'text-rose-500' : 'text-emerald-500';
  const confidenceBg = isSuspected ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30';

  const hasRAGData = result.ragExplanation || result.forensicEvidence;

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
            {hasRAGData && (
              <div className="bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 rounded-full text-[10px] font-bold text-cyan-400">
                RAG ENHANCED
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        {hasRAGData && (
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('forensics')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'forensics' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              Forensics
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'evidence' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              Similar Cases
            </button>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-file-invoice text-zinc-500"></i>
              Forensic Summary
            </h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              {result.ragExplanation?.summary || result.explanation}
            </p>
            {result.ragExplanation?.confidence_reasoning && (
              <div className="pt-4 border-t border-zinc-800">
                <h4 className="text-sm font-bold text-zinc-300 mb-2">Confidence Analysis</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {result.ragExplanation.confidence_reasoning}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Forensics Tab */}
        {activeTab === 'forensics' && result.forensicEvidence && (
          <ForensicsPanel evidence={result.forensicEvidence} findings={result.ragExplanation?.forensic_findings} />
        )}

        {/* Evidence Tab */}
        {activeTab === 'evidence' && (
          <SimilarCasesPanel
            cases={result.similarCases || []}
            summary={result.ragExplanation?.similar_cases_summary}
          />
        )}
      </div>

      {/* Right: Detailed Metrics */}
      <div className="lg:col-span-5 space-y-6">
        <div className={`p-6 rounded-2xl border ${confidenceBg} space-y-4`}>
          <div className="flex justify-between items-end">
            <p className="text-zinc-400 text-sm font-medium">Confidence Score</p>
            <p className={`text-4xl font-bold font-mono ${confidenceColor}`}>{result.confidenceScore.toFixed(1)}%</p>
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${isSuspected ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${result.confidenceScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-zinc-500 italic">
            *This score is enhanced with RAG evidence and forensic analysis.
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-bug text-cyan-500"></i>
              Digital Artifacts
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.artifactsDetected.length > 0 ? (
                result.artifactsDetected.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-zinc-500 text-sm">No significant artifacts detected</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass-location text-amber-500"></i>
              Visual Anomalies
            </h4>
            <div className="space-y-3">
              {result.visualAnomalies.length > 0 ? (
                result.visualAnomalies.map((anomaly, i) => (
                  <div key={i} className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm">
                    <span className="font-bold text-zinc-200 block mb-1">{anomaly.location}</span>
                    <p className="text-zinc-500 text-xs leading-relaxed">{anomaly.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-sm">No visual anomalies detected</p>
              )}
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

// Forensics Panel Component
const ForensicsPanel: React.FC<{ evidence: ForensicEvidence; findings?: string[] }> = ({ evidence, findings }) => {
  const getScoreColor = (score: number, inverted: boolean = false) => {
    const effectiveScore = inverted ? 1 - score : score;
    if (effectiveScore > 0.6) return 'text-rose-500';
    if (effectiveScore > 0.3) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getBarColor = (score: number, inverted: boolean = false) => {
    const effectiveScore = inverted ? 1 - score : score;
    if (effectiveScore > 0.6) return 'bg-rose-500';
    if (effectiveScore > 0.3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <i className="fa-solid fa-microscope text-purple-500"></i>
        Forensic Analysis
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* FFT Analysis */}
        <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">FFT Spectrum</span>
            {evidence.fft_anomaly && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">ANOMALY</span>}
          </div>
          <p className={`text-2xl font-bold font-mono ${getScoreColor(evidence.fft_score)}`}>
            {(evidence.fft_score * 100).toFixed(0)}%
          </p>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(evidence.fft_score)}`} style={{ width: `${evidence.fft_score * 100}%` }}></div>
          </div>
        </div>

        {/* Color Analysis */}
        <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Color Deviation</span>
            {evidence.color_anomaly && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">ANOMALY</span>}
          </div>
          <p className={`text-2xl font-bold font-mono ${getScoreColor(evidence.color_score)}`}>
            {(evidence.color_score * 100).toFixed(0)}%
          </p>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(evidence.color_score)}`} style={{ width: `${evidence.color_score * 100}%` }}></div>
          </div>
        </div>

        {/* Noise Analysis */}
        <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Noise Level</span>
            {evidence.noise_anomaly && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">ANOMALY</span>}
          </div>
          <p className={`text-2xl font-bold font-mono ${getScoreColor(evidence.noise_score, true)}`}>
            {(evidence.noise_score * 100).toFixed(0)}%
          </p>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(evidence.noise_score, true)}`} style={{ width: `${evidence.noise_score * 100}%` }}></div>
          </div>
        </div>

        {/* Compression Analysis */}
        <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Compression</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${evidence.compression_artifacts === 'high'
                ? 'bg-rose-500/20 text-rose-400'
                : evidence.compression_artifacts === 'medium'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
              {evidence.compression_artifacts.toUpperCase()}
            </span>
          </div>
          <p className={`text-2xl font-bold font-mono ${getScoreColor(evidence.compression_score)}`}>
            {(evidence.compression_score * 100).toFixed(0)}%
          </p>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(evidence.compression_score)}`} style={{ width: `${evidence.compression_score * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Findings List */}
      {findings && findings.length > 0 && (
        <div className="pt-4 border-t border-zinc-800">
          <h4 className="text-sm font-bold text-zinc-300 mb-3">Key Findings</h4>
          <ul className="space-y-2">
            {findings.map((finding, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-400">
                <i className="fa-solid fa-circle-dot text-cyan-500 mt-1 text-xs"></i>
                {finding}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Similar Cases Panel Component
const SimilarCasesPanel: React.FC<{ cases: SimilarCase[]; summary?: string }> = ({ cases, summary }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <i className="fa-solid fa-database text-cyan-500"></i>
        Similar Cases from Evidence Database
      </h3>

      {summary && (
        <p className="text-zinc-400 text-sm">{summary}</p>
      )}

      {cases.length > 0 ? (
        <div className="space-y-3 pt-2">
          {cases.map((c, i) => (
            <div key={i} className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.label === 'fake' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                  <i className={`fa-solid ${c.label === 'fake' ? 'fa-mask' : 'fa-user-check'}`}></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{c.dataset}</p>
                  <p className="text-xs text-zinc-500">{c.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold font-mono ${c.label === 'fake' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {(c.similarity * 100).toFixed(0)}%
                </p>
                <p className="text-[10px] text-zinc-500 uppercase">similarity</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fa-solid fa-folder-open text-3xl text-zinc-700 mb-3"></i>
          <p className="text-zinc-500">No similar cases found in the evidence database</p>
          <p className="text-zinc-600 text-xs mt-1">Index more samples to enable similarity matching</p>
        </div>
      )}
    </div>
  );
};

export default ResultView;
