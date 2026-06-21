import { useState, useRef } from 'react';
import { 
  Camera, CheckCircle2, AlertTriangle, RefreshCw, ArrowRight, ShieldCheck, 
  Sparkles, ShieldAlert, Archive, Briefcase, Palette, Check, Image as ImageIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AppState } from '../types';
import type { Goal } from '@organaizer/types';
import { GOALS, DEFAULT_IMAGE, mockZones, mockChecklist, PRIORITY_COLORS } from '../assets/mockData';

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

export default function OrganaizerApp() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [forceError, setForceError] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [chatTurn, setChatTurn] = useState<{ q: string, a: string } | null>(null);

  const displayImage = uploadedImage || DEFAULT_IMAGE;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const simulateUpload = () => {
    if (!selectedGoal) return;
    setAppState('loading');
    setTimeout(() => {
      if (forceError) {
        setAppState('error');
      } else {
        setAppState('result');
        setActiveZoneId(mockZones[0].id);
      }
    }, 2500);
  };

  const resetApp = () => {
    setAppState('upload');
    setCompletedTasks(new Set());
    setActiveZoneId(null);
    setChatTurn(null);
    setChatInput('');
    setUploadedImage(null);
    setSelectedGoal(null);
  };

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleChatSubmit = (e?: React.FormEvent, preset?: string) => {
    e?.preventDefault();
    const query = preset || chatInput;
    if (!query.trim()) return;
    setChatInput('');
    setChatTurn({ q: query, a: "I recommend using clear, stackable bins for loose items to maximize your vertical shelf space while keeping everything visible." });
  };

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
                
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-hairline group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={uploadedImage || DEFAULT_IMAGE} alt="Space to analyze" className="w-full h-full object-cover" />
                  
                  {!uploadedImage && (
                    <div className="absolute top-3 left-3 bg-brand-dark-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                      Sample photo
                    </div>
                  )}

                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="px-4 py-2 bg-white text-ink rounded-full font-medium text-sm flex items-center gap-2 shadow-sm"
                    >
                      <ImageIcon className="w-4 h-4" /> Replace Photo
                    </button>
                    {uploadedImage && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                        className="text-white text-xs underline"
                      >
                        Use sample instead
                      </button>
                    )}
                  </div>
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
          {appState === 'result' && (
            <div className="flex flex-col animate-oai-fade">
              
              {/* Annotated Image */}
              <div className="relative aspect-[4/3] bg-ink">
                <img src={displayImage} alt="Analyzed workspace" className="w-full h-full object-cover" />
                
                {/* Dashed Box Markers */}
                {mockZones.map(z => {
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
                        left: `${z.box?.x}%`, top: `${z.box?.y}%`, 
                        width: `${z.box?.width}%`, height: `${z.box?.height}%` 
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
                    <p className="text-primary-subdued text-sm">Found {mockZones.length} zones to improve your {GOALS.find(g => g.id === selectedGoal)?.label?.toLowerCase()}.</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-primary-soft flex items-center justify-center text-lg font-bold bg-primary-deep shrink-0">
                    {mockZones.length}
                  </div>
                </div>

                {/* Active Zone Detail Card */}
                {activeZoneId && (
                  <div className="bg-canvas border border-primary/30 shadow-[0_4px_20px_-4px_rgba(83,58,253,0.15)] rounded-2xl p-5 animate-oai-fade">
                    {(() => {
                      const activeZone = mockZones.find(z => z.id === activeZoneId);
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

                {/* Checklist Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-hairline pb-2">
                    <h3 className="font-semibold text-lg">Action Plan</h3>
                    <span className="text-sm font-medium text-ink-mute">{completedTasks.size} of {mockChecklist.length} done</span>
                  </div>
                  <div className="space-y-2">
                    {mockChecklist.map(task => {
                      const isDone = completedTasks.has(task.id);
                      return (
                        <button 
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
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
                          <span className={cn("text-sm font-medium", isDone ? "line-through text-ink-mute" : "text-ink")}>{task.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Suggestion Cards (All Zones) */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b border-hairline pb-2">All Suggestions</h3>
                  <div className="flex flex-col gap-3">
                    {mockZones.map(z => {
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
                      )
                    })}
                  </div>
                </div>

                {/* Follow up Chat */}
                <div className="mt-2 pt-6 border-t border-hairline">
                  <h4 className="text-sm font-medium mb-3">Ask organ<span className="text-primary">AI</span>zer</h4>
                  
                  {chatTurn && (
                    <div className="mb-4 space-y-4 animate-oai-fade">
                      <div className="flex justify-end">
                        <div className="bg-primary text-white px-4 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-sm">
                          {chatTurn.q}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-canvas-soft border border-hairline text-ink px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] shadow-sm leading-relaxed">
                          {chatTurn.a}
                        </div>
                      </div>
                    </div>
                  )}

                  {!chatTurn && (
                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
                      <button onClick={(e) => handleChatSubmit(e, "How long will this take?")} className="whitespace-nowrap px-4 py-2 rounded-full bg-canvas border border-hairline text-sm text-ink-secondary hover:border-primary hover:text-primary transition-colors shadow-sm">
                        How long will this take?
                      </button>
                      <button onClick={(e) => handleChatSubmit(e, "Recommend storage bins")} className="whitespace-nowrap px-4 py-2 rounded-full bg-canvas border border-hairline text-sm text-ink-secondary hover:border-primary hover:text-primary transition-colors shadow-sm">
                        Recommend storage bins
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleChatSubmit} className="relative">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder={chatTurn ? "Ask another question..." : "Type a question..."}
                      className="w-full bg-canvas border border-hairline-input rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim()}
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
          {appState === 'error' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-oai-fade">
              <div className="w-20 h-20 bg-ruby/10 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-ruby" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-ink">Couldn't analyze this photo</h2>
              <p className="text-ink-mute mb-8 leading-relaxed">
                I could not confidently analyze this image. Try a clearer photo with better lighting and more of the space visible.
              </p>
              <button 
                onClick={resetApp}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white font-medium hover:bg-ink-secondary transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

        </main>

        {/* Footer CTA (Sticky Bottom) - Only show on Upload or Result */}
        {(appState === 'upload' || appState === 'result') && (
          <div className="sticky bottom-0 z-40 bg-canvas/90 backdrop-blur-md border-t border-hairline p-4">
            {appState === 'upload' ? (
              <button 
                onClick={simulateUpload}
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
