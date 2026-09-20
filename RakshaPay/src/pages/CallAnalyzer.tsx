import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  FileAudio,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Activity,
  CheckCircle2,
  ArrowRight,
  Volume2,
  VolumeX,
  FileText,
  Trash2,
  Users,
  Eye,
  Check,
  PhoneCall,
  Sliders
} from 'lucide-react';
import { ActiveView, CallAnalysisResult, CommunityReport } from '../types';
import { callAnalysisService, PRESET_CALL_SCENARIOS, PresetCallScenario } from '../services/callAnalysisService';
import { authService } from '../services/authService';
import { userDataService } from '../services/userDataService';
import { RiskBadge } from '../components/common/RiskBadge';
import { InnovationInsights } from '../components/common/InnovationInsights';
import { ReportDetailModal } from '../components/community/ReportDetailModal';

interface CallAnalyzerProps {
  onNavigate: (view: ActiveView) => void;
}

const SUPPORTED_FORMATS = ['MP3', 'WAV', 'M4A', 'OGG'];

export const CallAnalyzer: React.FC<CallAnalyzerProps> = ({ onNavigate }) => {
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('call_recording_anydesk_kyc.mp3');
  const [fileSize, setFileSize] = useState<string>('2.4 MB');
  const [fileFormat, setFileFormat] = useState<string>('MP3');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('call-anydesk-kyc');
  const [isDragOver, setIsDragOver] = useState(false);
  // Hidden native file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(74); // 74s default for AnyDesk
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null);

  // Processing & Stages state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [result, setResult] = useState<CallAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Community inspection modal state
  const [selectedReportForModal, setSelectedReportForModal] = useState<CommunityReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Clean up object URLs when unmounting or changing files
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Audio simulation timer for preset scenarios if no real audio file is attached
  useEffect(() => {
    let timer: any;
    if (isPlaying && !audioUrl) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, duration, playbackSpeed, audioUrl]);

  // Handle actual audio element sync
  const handleAudioTimeUpdate = () => {
    if (audioElementRef.current) {
      setCurrentTime(Math.floor(audioElementRef.current.currentTime));
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioElementRef.current) {
      const dur = Math.floor(audioElementRef.current.duration) || 74;
      setDuration(dur);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Helper to format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Process File selection (from file picker or drop)
  const processAudioFile = (file: File) => {
    setErrorMessage(null);

    // Validate audio extension
    const extension = file.name.split('.').pop()?.toUpperCase() || '';
    const isSupported = SUPPORTED_FORMATS.includes(extension) || file.type.startsWith('audio/');

    if (!isSupported) {
      setErrorMessage(`Unsupported format .${extension}. Please select an MP3, WAV, M4A, or OGG file.`);
      return;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const newUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setFileName(file.name);
    setFileFormat(extension || 'MP3');
    setAudioUrl(newUrl);

    // Calculate human-readable size
    const sizeInMB = file.size / (1024 * 1024);
    const sizeStr = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    setFileSize(sizeStr);

    // Reset player state & results
    setIsPlaying(false);
    setCurrentTime(0);
    setResult(null);

    // Reset preset selector
    setSelectedPresetId('');
  };

  // Native File Picker trigger
  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudioFile(file);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAudioFile(file);
    }
  };

  // Load a preset audio sample
  const handleSelectPreset = (preset: PresetCallScenario) => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setSelectedFile(null);
    setSelectedPresetId(preset.id);
    setFileName(`${preset.id}.mp3`);
    setFileSize('2.4 MB');
    setFileFormat('MP3');
    setDuration(preset.id === 'call-dubai-fraud' ? 54 : preset.id === 'call-electricity-threat' ? 65 : 74);
    setCurrentTime(0);
    setIsPlaying(false);
    setResult(null);
    setErrorMessage(null);
  };

  // Clear selected file
  const handleRemoveFile = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setSelectedFile(null);
    setResult(null);
    setIsPlaying(false);
    setCurrentTime(0);
    // Revert to first preset default
    const defaultPreset = PRESET_CALL_SCENARIOS[0];
    setSelectedPresetId(defaultPreset.id);
    setFileName(`${defaultPreset.id}.mp3`);
    setFileSize('2.4 MB');
    setFileFormat('MP3');
    setDuration(74);
  };

  // Toggle Play/Pause
  const togglePlay = () => {
    if (audioUrl && audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // If browser restricts autoplay
          setIsPlaying(true);
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Seek audio position
  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (audioUrl && audioElementRef.current) {
      audioElementRef.current.currentTime = newTime;
    }
  };

  // Toggle playback speed
  const cyclePlaybackSpeed = () => {
    const speeds = [1, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackSpeed(nextSpeed);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = nextSpeed;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioElementRef.current) {
      audioElementRef.current.muted = nextMuted;
    }
  };

  // Start analysis workflow:
  // Transcribing -> Analyzing Conversation -> Detecting Scam Indicators -> Matching Community Patterns -> Results
  const handleStartAnalysis = async () => {
    setIsProcessing(true);
    setResult(null);
    setErrorMessage(null);
    setProgressPercent(0);

    try {
      const res = await callAnalysisService.analyzeAudioFile(
        selectedFile || fileName,
        selectedPresetId || undefined,
        (stage, percent) => {
          setCurrentStage(stage);
          setProgressPercent(percent);
        }
      );
      setResult(res);

      // Log in history if user is authenticated
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        userDataService.addHistoryItem(currentUser.id, {
          type: 'Call',
          query: `Audio Scan: ${fileName}`,
          title: `Audio Scan: ${fileName}`,
          riskLevel: res.riskLevel,
          riskScore: res.riskScore,
          category: res.scamCategory || res.detectedSignals[0] || 'Fraudulent Phone Call',
          actionTaken: res.riskLevel === 'high' ? 'Call Flagged & Blocked' : 'Call Verified Safe',
        });
        await authService.updateProfile({
          analysesCount: (currentUser.analysesCount || 0) + 1,
          confirmedThreatsCount:
            res.riskLevel === 'high'
              ? (currentUser.confirmedThreatsCount || 0) + 1
              : currentUser.confirmedThreatsCount,
        }).catch(() => { /* keep call result visible */ });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to analyze this call.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInspectCommunityReport = (report: CommunityReport) => {
    setSelectedReportForModal(report);
    setIsReportModalOpen(true);
  };

  const handleTimelineClick = (timestamp: string) => {
    setActiveTimestamp(timestamp);
    // Parse timestamp mm:ss to seconds
    const parts = timestamp.split(':');
    if (parts.length === 2) {
      const secs = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      handleSeek(secs);
    }
  };

  // Staged workflow stages for visual indicator
  const workflowStages = [
    { key: 'Transcribing', label: 'Transcribing Speech' },
    { key: 'Analyzing Conversation', label: 'Analyzing Conversation' },
    { key: 'Detecting Scam Indicators', label: 'Detecting Scam Indicators' },
    { key: 'Matching Community Patterns', label: 'Matching Community Patterns' }
  ];

  return (
    <div id="call-analyzer-page" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase">
          <PhoneCall className="w-4 h-4" />
          <span>Acoustic & Telephony Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Call Audio Recording Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Upload recorded phone calls to extract acoustic transcripts, uncover coercive psychological manipulation, identify impersonation markers, and cross-match with the verified community scam registry.
        </p>
      </div>

      {/* Hidden native HTML audio element for local files */}
      {audioUrl && (
        <audio
          ref={audioElementRef}
          src={audioUrl}
          onTimeUpdate={handleAudioTimeUpdate}
          onLoadedMetadata={handleAudioLoadedMetadata}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {/* Hidden file input for native file selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".mp3,.wav,.m4a,.ogg,audio/mp3,audio/mpeg,audio/wav,audio/x-wav,audio/x-m4a,audio/mp4,audio/ogg"
        className="hidden"
        id="audio-file-picker-input"
      />

      {/* Main Upload & File Management Section */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-xs space-y-6">
        
        {/* Sample Audio Presets Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileAudio className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Try Pre-loaded Test Audio:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_CALL_SCENARIOS.map((preset) => (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedPresetId === preset.id
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* WORKFLOW STEP 1: Upload Audio (Prominent Button & Drag-and-Drop Area) */}
        <div
          id="audio-drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-7 sm:p-9 text-center transition-all ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 scale-[1.005]'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/40 dark:bg-slate-950/30'
          }`}
        >
          <div className="max-w-md mx-auto space-y-4">
            {/* Upload Icon */}
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>

            {/* Title & Instructions */}
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Select or Drop Call Recording
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose an audio file from your device or drag and drop it here.
              </p>
            </div>

            {/* MANDATORY: Clearly Visible "Upload Audio" Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                type="button"
                id="upload-audio-btn"
                onClick={handleUploadButtonClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Audio</span>
              </button>
            </div>

            {/* Supported Formats Badges */}
            <div className="pt-2 flex items-center justify-center gap-2">
              <span className="text-[11px] font-medium text-slate-400">Supported formats:</span>
              <div className="flex items-center gap-1.5">
                {SUPPORTED_FORMATS.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* WORKFLOW STEP 2: File Selected Details */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileAudio className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono truncate max-w-xs sm:max-w-md">
                  {fileName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {fileFormat}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>Size: {fileSize}</span>
                <span>•</span>
                <span>Est. Duration: {formatTime(duration)}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready for Analysis
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleUploadButtonClick}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Change File
            </button>
            <button
              onClick={handleRemoveFile}
              title="Reset Audio File"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WORKFLOW STEP 3: Audio Preview Player */}
        <div id="audio-preview-card" className="p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Interactive Audio Preview & Waveform
              </h4>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-900 dark:text-white">{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Equalizer Waveform Visualizer */}
          <div className="flex items-end justify-center gap-1 sm:gap-1.5 h-14 px-2 py-1 bg-slate-100/70 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden">
            {[25, 45, 70, 30, 85, 95, 60, 40, 80, 55, 90, 35, 65, 80, 45, 95, 75, 40, 60, 85, 50, 70, 30, 60, 90, 45, 75].map((h, i) => {
              const isActive = (i / 27) <= (currentTime / duration);
              return (
                <span
                  key={i}
                  className={`w-1.5 sm:w-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-t from-indigo-600 to-cyan-400 dark:from-indigo-500 dark:to-cyan-300'
                      : 'bg-slate-300 dark:bg-slate-800'
                  }`}
                  style={{
                    height: isPlaying
                      ? `${Math.max(20, Math.min(100, Math.round(h * (0.6 + Math.random() * 0.7))))}%`
                      : `${h * 0.8}%`
                  }}
                />
              );
            })}
          </div>

          {/* Scrubber Seek Bar */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 74}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Audio Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="audio-play-pause-btn"
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => handleSeek(0)}
                title="Rewind to start"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback Speed Switcher */}
              <button
                type="button"
                onClick={cyclePlaybackSpeed}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {playbackSpeed}x Speed
              </button>

              {/* WORKFLOW STEP 4: Analyze Recording Button */}
              <button
                type="button"
                id="analyze-recording-btn"
                onClick={handleStartAnalysis}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Call...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Recording</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* WORKFLOW STEPS 5-8: Real-time Multi-stage Progress Visualizer */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/80 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                  Processing Recording: {currentStage}
                </span>
              </div>
              <span className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                {progressPercent}%
              </span>
            </div>

            {/* Smooth animated progress bar */}
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* 4 Required Staged Steps Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
              {workflowStages.map((stage, idx) => {
                const stageTargetPercent = (idx + 1) * 25;
                const isDone = progressPercent >= stageTargetPercent;
                const isCurrent = currentStage.toLowerCase().includes(stage.key.toLowerCase());

                return (
                  <div
                    key={stage.key}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                      isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : isCurrent
                        ? 'bg-indigo-100 dark:bg-indigo-900/60 border-indigo-400 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-bold'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px] shrink-0">
                        {idx + 1}
                      </span>
                    )}
                    <span className="truncate">{stage.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      <InnovationInsights scamDna={(result as any)?.scamDna} multiEvidenceMatch={(result as any)?.multiEvidenceMatch} />

      {/* WORKFLOW STEP 9: Analysis Results */}
      <AnimatePresence>
        {result && !isProcessing && (
          <motion.div
            id="call-analysis-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* 1. Header Banner: Risk Level, Risk Score, Scam Category */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                result.riskLevel === 'high'
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                  : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <RiskBadge level={result.riskLevel} score={result.riskScore} size="lg" />
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    Audio Duration: {result.duration}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase tracking-wide">
                    {result.riskLevel === 'high' ? 'High Risk Threat' : 'Caution Advised'}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
                    Detected Scam Category:
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {result.scamCategory || 'Remote Access & Bank Impersonation Scam'}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Threat Signals Overview */}
              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200/80 dark:border-rose-900/80 flex flex-col gap-2 shrink-0 md:min-w-[260px]">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Threat Signals Detected:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.detectedSignals.map((sig, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    >
                      {sig}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Suspicious Conversation Indicators Grid */}
            {result.suspiciousIndicators && result.suspiciousIndicators.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                      Suspicious Conversation Indicators
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {result.suspiciousIndicators.length} Coercive Signals Flagged
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {result.suspiciousIndicators.map((ind) => (
                    <div
                      key={ind.id}
                      className="p-4 rounded-xl border border-rose-200/70 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ind.severity === 'high'
                                ? 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100'
                                : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100'
                            }`}
                          >
                            {ind.severity} Severity
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {ind.label}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {ind.description}
                        </p>
                      </div>

                      {ind.quote && (
                        <div className="pt-2 border-t border-rose-200/50 dark:border-rose-900/40">
                          <p className="text-[11px] font-mono italic text-rose-800 dark:text-rose-300 line-clamp-2">
                            "{ind.quote}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Highlighted Suspicious Statements Bar */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Highlighted Suspicious Statements Uttered by Caller:</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.transcript
                  .filter((t) => t.isSuspicious)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          Timestamp: {item.timestamp}
                        </span>
                        {item.highlightCategory && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                            ⚠️ {item.highlightCategory}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        "{item.text}"
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* 4. Interactive Timeline & Transcript Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Timeline (5 Cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                      Conversation Timeline
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400">Click to jump audio</span>
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {result.timeline.map((event, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleTimelineClick(event.timestamp)}
                      className={`relative cursor-pointer group p-3 rounded-xl border transition-all ${
                        activeTimestamp === event.timestamp
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 shadow-xs'
                          : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                      }`}
                    >
                      <span className="absolute -left-[27px] top-3.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-white dark:ring-slate-900" />
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {event.timestamp}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 uppercase">
                          {event.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                        "{event.snippet}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acoustic Transcript (7 Cols) */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                        Full Acoustic Transcript & Risk Annotations
                      </h3>
                    </div>
                    <button
                      onClick={togglePlay}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlaying ? 'Pause Audio' : 'Play Audio'}</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {result.transcript.map((line, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl transition-all ${
                          line.isSuspicious
                            ? 'bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60'
                            : 'bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800'
                        } ${activeTimestamp === line.timestamp ? 'ring-2 ring-indigo-500' : ''}`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                line.speaker === 'Caller'
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {line.speaker === 'Caller' ? '🔴 Caller (Imposter)' : '👤 Victim (User)'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {line.highlightCategory && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-200/70 dark:bg-rose-900 text-rose-900 dark:text-rose-200 font-semibold uppercase">
                                ⚠️ {line.highlightCategory}
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-slate-400">
                              {line.timestamp}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                          {line.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Directives Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Recommended: {result.recommendedAction}
                  </span>
                  <button
                    onClick={() => onNavigate('report-scam')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Submit Incident to Community</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Similar Community Reports Section */}
            {result.similarReports && result.similarReports.length > 0 && (
              <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                      Correlated Community Incident Reports
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    PATTERN MATCH CONFIDENCE 96%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.similarReports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => handleInspectCommunityReport(report)}
                      className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                            {report.ticketNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {report.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {report.relativeTime || '1 day ago'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {report.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {report.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-500 text-[11px]">
                          Reported by {report.reporter?.name || 'Verified Citizen'}
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 group-hover:underline text-xs">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Report</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Report Detail Modal */}
      <ReportDetailModal
        isOpen={isReportModalOpen}
        report={selectedReportForModal}
        onClose={() => setIsReportModalOpen(false)}
        matchConfidence={96}
        onNavigateToFeed={() => onNavigate('community-feed')}
      />
    </div>
  );
};
