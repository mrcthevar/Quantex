import React, { useState } from 'react';
import { Profile, DashboardResponse, Theme } from './types';
import { generateInsights } from './services/gemini';
import { ProfileEditor } from './components/ProfileEditor';
import { InsightsDisplay } from './components/InsightsDisplay';
import { Sparkles, Zap, Command, Palette } from 'lucide-react';
import clsx from 'clsx';

const EMPTY_TARGET: Profile = {
  id: 'target_new',
  name: '',
  role: '',
  context: '',
};

const THEMES: Theme[] = [
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'from-green-600 via-emerald-600 to-teal-600',
    textGradient: 'bg-gradient-to-r from-green-600 to-teal-600',
    primary: 'text-green-600',
    bgSoft: 'bg-green-50',
    border: 'border-green-200',
    shadow: 'shadow-green-600/30',
    ring: 'focus:ring-green-500/20',
    iconBg: 'bg-green-100 text-green-600'
  }
];

const App: React.FC = () => {
  const [viewerProfile, setViewerProfile] = useState<Profile | null>(null);
  const [targetProfile, setTargetProfile] = useState<Profile>(EMPTY_TARGET);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Defaulting to the Green theme
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);

  const handleGenerate = async () => {
    if (!targetProfile.name) return;
    setIsLoading(true);
    setDashboardData(null); 
    setError(null);
    try {
      const result = await generateInsights(targetProfile, viewerProfile);
      setDashboardData(result);
    } catch (err: any) {
      console.error(err);
      // Display specific error message if available, otherwise generic
      setError(err.message || "Failed to generate dashboard. Please check API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onTargetChange = (p: Profile | null) => {
    if (p) setTargetProfile(p);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-green-100 selection:text-green-900">
      
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transform rotate-3 hover:rotate-6 transition-transform",
              `bg-gradient-to-br ${currentTheme.gradient}`,
              currentTheme.shadow
            )}>
              <Sparkles className="w-6 h-6" />
            </div>
            <span className={clsx("text-2xl font-bold text-transparent bg-clip-text tracking-tight", currentTheme.textGradient)}>
              Quantex
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold px-4 py-2 bg-slate-100/50 rounded-full text-slate-500 border border-slate-200/50">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               Intelligence Engine v2.0
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Controls */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
            
            <ProfileEditor 
              title="Search Person" 
              type="target"
              profile={targetProfile} 
              onChange={onTargetChange}
              theme={currentTheme}
            />

            <ProfileEditor 
              title="Your Context" 
              type="viewer"
              profile={viewerProfile} 
              onChange={setViewerProfile} 
              isNullable={true}
              theme={currentTheme}
            />

            {/* Vibrant Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !targetProfile.name}
              className={clsx(
                "group w-full py-4 text-white rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-[0.98]",
                `bg-gradient-to-r ${currentTheme.gradient}`,
                currentTheme.shadow,
                "disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none"
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">Thinking...</span>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-white" /> Generate
                </>
              )}
            </button>
          </div>

          {/* Main Content: Dashboard */}
          <div className="lg:col-span-9 min-h-[600px]">
             {error && (
               <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-3 animate-fade-in shadow-sm">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 {error}
               </div>
             )}

             {!dashboardData && !isLoading && !error && (
               <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/40 backdrop-blur-sm relative overflow-hidden group">
                 <div className={clsx(
                   "absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 group-hover:opacity-10 group-hover:bg-gradient-to-br transition-all duration-700",
                   currentTheme.gradient
                 )}></div>
                 
                 <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-slate-200 border-4 border-white relative z-10 group-hover:scale-110 transition-transform duration-500">
                   <Command className={clsx("w-10 h-10 transition-colors", currentTheme.primary)} />
                 </div>
                 <h2 className="text-4xl font-extrabold text-brand-dark mb-4 tracking-tight relative z-10">Ready to Analyze</h2>
                 <p className="text-slate-500 max-w-md leading-relaxed text-lg font-medium relative z-10">
                   Enter a name to unlock a <span className={clsx("text-transparent bg-clip-text font-bold", currentTheme.textGradient)}>hyper-visual</span> intelligence report.
                 </p>
               </div>
             )}

             {(dashboardData || isLoading) && (
                <InsightsDisplay 
                  data={dashboardData}
                  isLoading={isLoading}
                  theme={currentTheme}
                />
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;