import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Camera, CheckCircle2, AlertTriangle, RefreshCw, ArrowRight, ShieldCheck,
  Sparkles, ShieldAlert, Archive, Briefcase, Palette, Check, Image as ImageIcon,
  ImageOff, ServerCrash
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AppState } from '../types';
import type { Goal, Analysis, FollowUpAnswer } from '@organaizer/types';
import { GOALS, DEFAULT_IMAGE, PRIORITY_COLORS } from '../assets/mockData';
import { analyzeImage, sendFollowUp } from '../lib/api';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GoalIcons: Record<Goal, React.ReactNode> = {
  cleaner: <Sparkles className="w-5 h-5" />,
  safer: <ShieldAlert className="w-5 h-5" />,
  storage: <Archive className="w-5 h-5" />,
  work: <Briefcase className="w-5 h-5" />,
  aesthetics: <Palette className="w-5 h-5" />
};

const PRIORITY_SORT_ORDER: Record<string, number> = { high: 3, medium: 2, low: 1 };

// ---------------------------------------------------------------------------
// Error-code → UI mapping (mirrors the API error matrix)
// ---------------------------------------------------------------------------

interface ErrorDescriptor {
  icon: React.ReactNode;
  title: string;
  body: string;
  /** 'retry' re-runs analysis preserving photo+goal; 'choose-another' returns to upload for a new photo (goal kept). */
  action: 'retry' | 'choose-another';
  actionLabel: string;
}

/** Map an API error code to its error-screen descriptor. `rate_limited` never reaches here (it's a toast). */
function describeError(code: string | null | undefined): ErrorDescriptor {
  switch (code) {
    case 'invalid_file':
    case 'image_too_large':
    case 'invalid_goal':
      return {
        icon: <ImageOff className="w-10 h-10 text-ruby" />,
        title: "That photo won't work",
        body: 'Please upload a JPG, PNG, or WebP under 8MB.',
        action: 'choose-another',
        actionLabel: 'Choose another photo',
      };
    case 'ai_unavailable':
    case 'internal_error':
    case 'timeout':
    case 'network':
      return {
        icon: <ServerCrash className="w-10 h-10 text-ruby" />,
        title: 'Something went wrong',
        body: "We couldn't reach the analyzer. Your photo and goal are saved — try again.",
        action: 'retry',
        actionLabel: 'Try again',
      };
    default:
      return {
        icon: <AlertTriangle className="w-10 h-10 text-ruby" />,
        title: "Couldn't analyze this photo",
        body: "I couldn't confidently analyze this image. Try a clearer photo with better lighting.",
        action: 'choose-another',
        actionLabel: 'Choose another photo',
      };
  }
}

const RATE_LIMIT_TOAST =
  "We're getting a lot of requests right now. Please try again in a moment.";

export default function OrganaizerApp() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);

  // Image state: local preview URL (object URL or default) + uploaded File
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API result
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [forceError, setForceError] = useState(false);

  const [chatInput, setChatInput] = useState('');
  // Chat turns derived from followUps array stored locally
  const [chatTurns, setChatTurns] = useState<FollowUpAnswer[]>([]);
  const [chatPending, setChatPending] = useState(false);

  const displayImage = uploadedImage || DEFAULT_IMAGE;

  useEffect(() => {
    return () => {
      if (uploadedImage?.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  // Auto-dismiss transient toasts.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // The zones/checklist from the current analysis (or empty while no result yet)
  const zones = analysis?.zones ?? [];
  const checklist = analysis?.checklist ?? [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedImage((previous) => {
        if (previous?.startsWith('blob:')) {
          URL.revokeObjectURL(previous);
        }
        return URL.createObjectURL(file);
      });
    }
  };

  /**
   * Convert the default hero PNG asset (already resolved as a URL by Vite)
   * into a Blob/File so we can upload it as multipart.
   */
  const fetchDefaultImageAsBlob = useCallback(async (): Promise<File> => {
    const res = await fetch(DEFAULT_IMAGE as string);
    const blob = await res.blob();
    return new File([blob], 'hero.jpg', { type: blob.type || 'image/jpeg' });
  }, []);

  const handleAnalyze = async () => {
    if (!selectedGoal) return;

    // Demo Error mode: skip API and go straight to error state
    if (forceError) {
      setErrorCode('low_confidence');
      setErrorMsg('Low-confidence demo error (local simulation).');
      setAppState('error');
      return;
    }

    setAppState('loading');
    setAnalysis(null);
    setErrorMsg(null);
    setErrorCode(null);
    setChatTurns([]);
    setCompletedTasks(new Set());

    try {
      // Use real file if chosen, else fetch the default hero as a Blob
      const imageFile = uploadedFile ?? (await fetchDefaultImageAsBlob());
      const result = await analyzeImage(imageFile, selectedGoal);
      setAnalysis(result);
      setActiveZoneId(result.zones[0]?.id ?? null);
      setAppState('result');
    } catch (err: unknown) {
      const apiErr = err as { code?: string; message?: string };
      // Rate limit: stay on upload (photo+goal intact) and surface a toast.
      if (apiErr?.code === 'rate_limited') {
        setAppState('upload');
        setToast(RATE_LIMIT_TOAST);
        return;
      }
      setErrorCode(apiErr?.code ?? null);
      setErrorMsg(apiErr?.message ?? 'Unknown error');
      setAppState('error');
    }
  };

  /** Return to upload for a fresh photo, keeping the selected goal. */
  const chooseAnotherPhoto = () => {
    setAppState('upload');
    setErrorCode(null);
    setErrorMsg(null);
    setAnalysis(null);
    if (uploadedImage?.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setUploadedFile(null);
    // selectedGoal intentionally preserved
  };

  const resetApp = () => {
    setAppState('upload');
    setCompletedTasks(new Set());
    setActiveZoneId(null);
    setChatTurns([]);
    setChatInput('');
    setUploadedImage(null);
    setUploadedFile(null);
    setSelectedGoal(null);
    setAnalysis(null);
    setErrorMsg(null);
    setErrorCode(null);
    setToast(null);
  };

  const toggleTask = (idx: number) => {
    const key = String(idx);
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleChatSubmit = async (e?: React.FormEvent, preset?: string) => {
    e?.preventDefault();
    const query = preset || chatInput;
    if (!query.trim() || !analysis) return;
    setChatInput('');
    setChatPending(true);
    try {
      const answer = await sendFollowUp(analysis.id, query);
      setChatTurns(prev => [...prev, answer]);
    } catch {
      // Append a local error turn so the UI doesn't silently fail
      const fallback: FollowUpAnswer = {
        id: crypto.randomUUID(),
        analysisId: analysis.id,
        question: query,
        answer: 'Sorry, something went wrong. Please try again.',
        safetyNote: null,
        createdAt: new Date().toISOString(),
      };
      setChatTurns(prev => [...prev, fallback]);
    } finally {
      setChatPending(false);
    }
  };

  // Suggested follow-up questions derived from API result or static defaults
  const followUpSuggestions = analysis?.followUps?.length
    ? []
    : ['How long will this take?', 'Recommend storage bins'];

  return (
    <div className="min-h-screen bg-canvas-soft flex justify-center text-ink font-sans">
      <div className="w-full max-w-md bg-canvas min-h-screen shadow-sm relative overflow-hidden flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-md border-b border-hairline px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white font-bold text-xs">AI</div>
            <span className="font-medium tracking-tight text-lg">organ<span className="text-primary">AI</span>zer</span>
          </div>
          <label className="flex items-center gap-1 text-xs cursor-pointer text-ink-mute">
            <input
              type="checkbox"
              checked={forceError}
              onChange={(e) => setForceError(e.target.checked)}
              className="rounded border-hairline text-primary focus:ring-primary"
            />
            Demo Error
          </label>
        </header>

        {/* Transient toast (e.g. rate-limit notice) */}
        {toast && (
          <div className="absolute top-20 left-4 right-4 z-50 animate-oai-fade">
            <div className="bg-ink text-white text-sm rounded-xl px-4 py-3 shadow-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-ruby shrink-0 mt-0.5" />
              <span className="leading-snug">{toast}</span>
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col relative overflow-y-auto scrollbar-none pb-28">

          {/* --- UPLOAD STATE --- */}
          {appState === 'upload' && (
            <div className="p-6 flex flex-col gap-6 animate-oai-fade">
              <div className="text-center space-y-2 mb-2">
                <h1 className="text-2xl font-semibold tracking-tight">Improve your space</h1>
                <p className="text-ink-mute">Select your primary goal and upload a photo.</p>
              </div>

              {/* Goal Selector (Vertical Rows) */}
              <div className="flex flex-col gap-2">
                {GOALS.map(goal => {
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-hairline bg-canvas-soft hover:border-primary-subdued hover:bg-canvas"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", isSelected ? "bg-primary text-white" : "bg-canvas text-ink-secondary")}>
                          {GoalIcons[goal.id]}
                        </div>
                        <span className={cn("font-medium", isSelected ? "text-primary-deep" : "text-ink")}>{goal.label}</span>
                      </div>
                      <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center transition-colors", isSelected ? "border-primary bg-primary text-white" : "border-hairline-input")}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Photo Upload Area */}
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                />

                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-hairline cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={uploadedImage || DEFAULT_IMAGE} alt="Space to analyze" className="w-full h-full object-cover" />

                  {!uploadedImage && (
                    <div className="absolute top-3 left-3 bg-brand-dark-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                      Sample photo
                    </div>
                  )}
                </div>

                {/* Persistent Mobile-First Upload Controls */}
                <div className="flex items-center justify-center gap-4 mt-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-canvas-soft border border-hairline text-ink rounded-full font-medium text-sm flex items-center gap-2 shadow-sm hover:bg-canvas transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" /> Replace Photo
                  </button>
                  {uploadedImage && (
                    <button
                      onClick={() => {
                        if (uploadedImage?.startsWith('blob:')) {
                          URL.revokeObjectURL(uploadedImage);
                        }
                        setUploadedImage(null);
                        setUploadedFile(null);
                      }}
                      className="text-primary-soft text-sm font-medium underline"
                    >
                      Use sample
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3 text-xs text-ink-mute bg-canvas-soft p-4 rounded-xl items-start">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>Your photo is used only to generate suggestions. Avoid uploading sensitive personal information.</p>
              </div>
            </div>
          )}

          {/* --- LOADING STATE --- */}
          {appState === 'loading' && (
            <div className="flex flex-col gap-6 animate-oai-fade">
              <div className="relative aspect-[4/3] bg-ink overflow-hidden">
                <img src={displayImage} alt="Analyzing" className="w-full h-full object-cover opacity-40 grayscale" />
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-primary/40 to-primary shadow-[0_4px_24px_rgba(83,58,253,0.6)] animate-oai-scan border-b-2 border-primary z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-canvas/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-primary animate-ping" />
                    <span className="font-medium text-sm">Analyzing space...</span>
                  </div>
                </div>
              </div>
              <div className="px-6 space-y-4">
                <div className="h-24 bg-oai-skel animate-oai-pulse rounded-xl" />
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-oai-skel animate-oai-pulse rounded-full" />
                  <div className="h-8 w-32 bg-oai-skel animate-oai-pulse rounded-full" />
                </div>
                <div className="h-32 bg-oai-skel animate-oai-pulse rounded-xl" />
                <div className="h-32 bg-oai-skel animate-oai-pulse rounded-xl" />
              </div>
            </div>
          )}

          {/* --- RESULT STATE --- */}
          {appState === 'result' && analysis && (
            <div className="flex flex-col animate-oai-fade">

              {/* Annotated Image */}
              <div className="relative aspect-[4/3] bg-ink">
                {/* Use API imageUrl when available, fall back to local preview to avoid flicker */}
                <img
                  src={analysis.imageUrl || displayImage}
                  alt="Analyzed workspace"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = displayImage; }}
                />

                {/* Dashed Box Markers */}
                {zones.map(z => {
                  const isActive = activeZoneId === z.id;
                  return (
                    <button
                      key={z.id}
                      onClick={() => setActiveZoneId(z.id)}
                      aria-label={`View zone ${z.number}`}
                      className={cn(
                        "absolute border-2 transition-all animate-oai-pin group flex items-start justify-start p-1",
                        isActive ? "border-primary bg-primary/20 z-20 shadow-[0_0_15px_rgba(83,58,253,0.4)]" : "border-white border-dashed bg-black/10 hover:bg-white/20 z-10"
                      )}
                      style={{
                        left: `${z.box?.x ?? 10}%`, top: `${z.box?.y ?? 10}%`,
                        width: `${z.box?.width ?? 20}%`, height: `${z.box?.height ?? 20}%`
                      }}
                    >
                      <span className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm",
                        isActive ? "bg-primary scale-110" : "bg-ink/80 group-hover:bg-primary-soft"
                      )}>
                        {z.number}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-6 flex flex-col gap-8 -mt-4 relative z-20">

                {/* Summary Dark Card */}
                <div className="bg-brand-dark-900 text-white rounded-2xl p-5 shadow-lg flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Space Analyzed</h2>
                    <p className="text-primary-subdued text-sm">Found {zones.length} zones to improve your {GOALS.find(g => g.id === selectedGoal)?.label?.toLowerCase()}.</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-primary-soft flex items-center justify-center text-lg font-bold bg-primary-deep shrink-0">
                    {zones.length}
                  </div>
                </div>

                {/* Active Zone Detail Card */}
                {activeZoneId && (
                  <div className="bg-canvas border border-primary/30 shadow-[0_4px_20px_-4px_rgba(83,58,253,0.15)] rounded-2xl p-5 animate-oai-fade">
                    {(() => {
                      const activeZone = zones.find(z => z.id === activeZoneId);
                      if (!activeZone) return null;
                      const pColor = PRIORITY_COLORS[activeZone.priority];
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">{activeZone.number}</span>
                              <h3 className="font-semibold text-lg">{activeZone.label}</h3>
                            </div>
                            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border", pColor.bg, pColor.text, pColor.border)}>
                              {activeZone.priority}
                            </span>
                          </div>
                          <div className="bg-canvas-soft p-3 rounded-lg border border-hairline">
                            <p className="text-sm text-ink-secondary mb-2"><strong className="text-ink">Issue:</strong> {activeZone.issue}</p>
                            <p className="text-sm text-primary-deep font-medium"><strong className="text-ink">Suggestion:</strong> {activeZone.suggestion}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Suggestion Cards (All Zones) */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b border-hairline pb-2">All Suggestions</h3>
                  <div className="flex flex-col gap-3">
                    {[...zones].sort((a, b) => PRIORITY_SORT_ORDER[b.priority] - PRIORITY_SORT_ORDER[a.priority]).map(z => {
                      const pColor = PRIORITY_COLORS[z.priority];
                      return (
                        <button
                          key={z.id}
                          onClick={() => setActiveZoneId(z.id)}
                          className="w-full text-left p-4 rounded-xl border border-hairline bg-canvas hover:border-primary/40 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-ink">{z.number}. {z.label}</h4>
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border", pColor.bg, pColor.text, pColor.border)}>
                              {z.priority}
                            </span>
                          </div>
                          <p className="text-sm text-ink-secondary">{z.suggestion}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Checklist Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-hairline pb-2">
                    <h3 className="font-semibold text-lg">Action Plan</h3>
                    <span className="text-sm font-medium text-ink-mute">{completedTasks.size} of {checklist.length} done</span>
                  </div>
                  <div className="space-y-2">
                    {checklist.map((text, idx) => {
                      const key = String(idx);
                      const isDone = completedTasks.has(key);
                      return (
                        <button
                          key={key}
                          onClick={() => toggleTask(idx)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                            isDone ? "bg-canvas-soft border-hairline opacity-60" : "bg-canvas border-hairline hover:border-primary-subdued"
                          )}
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0",
                            isDone ? "bg-primary text-white" : "border-2 border-hairline-input text-transparent hover:border-primary"
                          )}>
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className={cn("text-sm font-medium", isDone ? "line-through text-ink-mute" : "text-ink")}>{text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Follow up Chat */}
                <div className="mt-2 pt-6 border-t border-hairline">
                  <h4 className="text-sm font-medium mb-3">Ask organ<span className="text-primary">AI</span>zer</h4>

                  {/* Render all chat turns */}
                  {chatTurns.length > 0 && (
                    <div className="mb-4 space-y-4 animate-oai-fade">
                      {chatTurns.map(turn => (
                        <div key={turn.id} className="space-y-3">
                          <div className="flex justify-end">
                            <div className="bg-primary text-white px-4 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-sm">
                              {turn.question}
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <div className="bg-canvas-soft border border-hairline text-ink px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] shadow-sm leading-relaxed">
                              {turn.answer}
                              {turn.safetyNote && (
                                <p className="mt-2 text-xs text-ruby/80 border-t border-hairline pt-2">{turn.safetyNote}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestion chips — show when no turns yet */}
                  {chatTurns.length === 0 && !chatPending && followUpSuggestions.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
                      {followUpSuggestions.map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={(e) => handleChatSubmit(e, suggestion)}
                          className="whitespace-nowrap px-4 py-2 rounded-full bg-canvas border border-hairline text-sm text-ink-secondary hover:border-primary hover:text-primary transition-colors shadow-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {chatPending && (
                    <div className="mb-4 flex justify-start animate-oai-fade">
                      <div className="bg-canvas-soft border border-hairline px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="text-ink-mute text-xs">Thinking...</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleChatSubmit} className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder={chatTurns.length > 0 ? "Ask another question..." : "Type a question..."}
                      className="w-full bg-canvas border border-hairline-input rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || chatPending}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white bg-primary disabled:bg-primary-subdued disabled:text-primary-deep rounded-lg transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* --- ERROR STATE --- */}
          {appState === 'error' && (() => {
            const err = describeError(errorCode);
            const onAction =
              err.action === 'retry' ? () => { void handleAnalyze(); } : chooseAnotherPhoto;
            return (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-oai-fade">
                <div className="w-20 h-20 bg-ruby/10 rounded-full flex items-center justify-center mb-6">
                  {err.icon}
                </div>
                <h2 className="text-2xl font-bold mb-3 text-ink">{err.title}</h2>
                <p className="text-ink-mute mb-4 leading-relaxed">{err.body}</p>
                {errorMsg && (
                  <p className="text-xs text-ink-mute mb-6 font-mono bg-canvas-soft px-3 py-2 rounded-lg max-w-xs break-words">
                    {errorMsg}
                  </p>
                )}
                <button
                  onClick={onAction}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white font-medium hover:bg-ink-secondary transition-colors"
                >
                  {err.action === 'retry' ? <RefreshCw className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  {err.actionLabel}
                </button>
              </div>
            );
          })()}

        </main>

        {/* Footer CTA (Sticky Bottom) - Only show on Upload or Result */}
        {(appState === 'upload' || appState === 'result') && (
          <div className="sticky bottom-0 z-40 bg-canvas/90 backdrop-blur-md border-t border-hairline p-4">
            {appState === 'upload' ? (
              <button
                onClick={() => { void handleAnalyze(); }}
                disabled={!selectedGoal}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/25 disabled:bg-primary-subdued disabled:shadow-none disabled:cursor-not-allowed hover:bg-primary-press transition-all active:translate-y-0"
              >
                {selectedGoal ? "Analyze Space" : "Choose a goal first"}
              </button>
            ) : (
              <button
                onClick={resetApp}
                className="w-full py-3.5 rounded-xl border-2 border-hairline-input text-ink font-semibold flex items-center justify-center gap-2 hover:bg-canvas-soft hover:border-ink transition-colors"
              >
                <Camera className="w-5 h-5" />
                Analyze Another Photo
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
