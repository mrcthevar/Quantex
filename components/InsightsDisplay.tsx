import React, { useState } from 'react';
import { DashboardResponse, Theme } from '../types';
import { Card } from './ui/Card';
import { LoadingState } from './LoadingState';
import { 
  MapPin, Globe, Link as LinkIcon, 
  Briefcase, Award, TrendingUp, AlertCircle, MessageSquare, Zap, Clock, Shield,
  CheckCircle2, Copy, ExternalLink, Hash, Star
} from 'lucide-react';
import clsx from 'clsx';

interface InsightsDisplayProps {
  data: DashboardResponse | null;
  isLoading?: boolean;
  theme: Theme;
}

const IconMap: Record<string, React.ReactNode> = {
  briefcase: <Briefcase className="w-4 h-4" />,
  award: <Award className="w-4 h-4" />,
  globe: <Globe className="w-4 h-4" />,
  user: <Briefcase className="w-4 h-4" />,
  clock: <Clock className="w-4 h-4" />
};

export const InsightsDisplay: React.FC<InsightsDisplayProps> = ({ data, isLoading, theme }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading) {
    return <LoadingState theme={theme} />;
  }

  if (!data || !data.identity_snapshot) {
     return (
       <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
         <div className="bg-orange-50 p-4 rounded-full mb-4">
           <AlertCircle className="w-8 h-8 text-orange-500" />
         </div>
         <h3 className="text-lg font-bold text-slate-900">Incomplete Data</h3>
         <p className="text-slate-500 mt-2 max-w-md">The AI response was incomplete. Please try generating again.</p>
       </div>
     );
  }

  const { 
    identity_snapshot, 
    career_and_work, 
    public_presence, 
    recent_activity,
    viewer_relevance,
    interaction_suggestions,
    uncertainties_and_gaps
  } = data;

  const tags = identity_snapshot.tags || [];
  
  const currentRoles = career_and_work?.current_roles || [];
  const pastHighlights = career_and_work?.past_highlights || [];
  const coreSkills = career_and_work?.core_skills || [];
  
  const onlineHandles = public_presence?.online_handles || { website: [], linkedin: [], twitter: [], instagram: [], youtube: [], github: [], other: [] };
  const allHandles = [
    ...(onlineHandles.website || []),
    ...(onlineHandles.linkedin || []),
    ...(onlineHandles.twitter || []),
    ...(onlineHandles.github || []),
    ...(onlineHandles.youtube || []),
    ...(onlineHandles.instagram || []),
    ...(onlineHandles.other || [])
  ];

  const authoritySignals = public_presence?.authority_signals || [];
  const recentItems = recent_activity?.recent_items || [];
  const relevanceReasons = viewer_relevance?.relevance_reasons || [];
  const relevanceScore = viewer_relevance?.relevance_score ?? null;
  const conversationStarters = interaction_suggestions?.conversation_starters || [];
  const waysToAddValue = interaction_suggestions?.ways_to_add_value || [];
  const recommendedTone = interaction_suggestions?.recommended_tone || 'Professional';
  const uncertainties = uncertainties_and_gaps?.uncertainties || [];

  // Helper for random vibrant colors
  const getRandomColorClass = (index: number) => {
    const colors = [
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-pink-100 text-pink-700 border-pink-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200',
      'bg-orange-100 text-orange-700 border-orange-200',
      'bg-lime-100 text-lime-700 border-lime-200',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      
      {/* HEADER: Identity & Fit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Card (8 cols) */}
        <Card className="lg:col-span-8 p-10 relative overflow-hidden" hover theme={theme}>
          {/* Mesh Gradient Background */}
          <div className={clsx("absolute inset-0 bg-gradient-to-br via-white to-white opacity-100", theme.gradient.replace('to-', 'from-white/50 to-'))} />
          <div className={clsx("absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none", theme.gradient.split(' ')[0])} />
          
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div 
              className={clsx(
                "w-32 h-32 rounded-[2rem] flex items-center justify-center text-5xl font-bold text-white shadow-2xl shrink-0 border-4 border-white rotate-3",
                `bg-gradient-to-br ${theme.gradient}`
              )}
            >
              {(identity_snapshot.canonical_name || '?').charAt(0)}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight leading-none mb-2">
                  {identity_snapshot.canonical_name}
                </h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">{identity_snapshot.headline}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-700">
                 {identity_snapshot.primary_location && (
                   <span className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-full shadow-sm text-slate-600">
                     <MapPin className={clsx("w-4 h-4", theme.primary)} />
                     {identity_snapshot.primary_location}
                   </span>
                 )}
                 {allHandles.slice(0, 3).map((h, i) => (
                    <a key={i} href={h.url} target="_blank" rel="noreferrer" className={clsx("transition-colors flex items-center gap-1.5 px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md", `hover:${theme.primary}`)}>
                      <LinkIcon className="w-4 h-4" /> {h.label}
                    </a>
                 ))}
              </div>

              <p className="text-slate-600 leading-relaxed max-w-2xl text-[16px]">
                {identity_snapshot.short_bio}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5",
                      getRandomColorClass(i)
                    )}
                  >
                    <Hash className="w-3 h-3 opacity-50" />
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Fit Score Card (4 cols) - DARK VARIANT */}
        <Card className="lg:col-span-4 p-8 flex flex-col justify-between relative overflow-hidden" variant="dark" hover theme={theme}>
           {/* Dark Gradient BG */}
           <div className="absolute inset-0 bg-[#0F172A]" />
           <div className={clsx("absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t to-transparent opacity-50", theme.gradient.split(' ')[0])} />
          
          <div className="relative z-10">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Compatibility
            </h3>
            
            {relevanceScore !== null ? (
              <div className="flex items-baseline gap-1 mb-8">
                <span className={clsx("text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r", theme.gradient)}>
                  {Math.round(relevanceScore * 100)}
                </span>
                <span className="text-3xl text-slate-500 font-bold">%</span>
              </div>
            ) : (
              <div className="text-slate-500 italic mb-8 font-medium">Add your context to see score</div>
            )}
            
            <div className="space-y-4">
              {relevanceReasons.slice(0, 3).map((r, i) => (
                <div key={i} className="flex gap-3 text-[14px] text-slate-300 leading-snug font-medium">
                   <div className={clsx("w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5", theme.iconBg.replace('text-', 'text-opacity-0 text-').replace('bg-', 'bg-opacity-20 bg-'))}>
                     <CheckCircle2 className={clsx("w-3.5 h-3.5", theme.primary)} />
                   </div>
                   {r}
                </div>
              ))}
            </div>
          </div>
          
          {relevanceScore !== null && (
             <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
               <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                 <div 
                   className={clsx("h-full bg-gradient-to-r", theme.gradient)} 
                   style={{ width: `${relevanceScore * 100}%` }} 
                 />
               </div>
             </div>
          )}
        </Card>
      </div>

      {/* BENTO GRID: Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Career */}
        <div className="space-y-8">
           <Card className="p-8 h-full" hover theme={theme}>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Briefcase className={clsx("w-4 h-4", theme.primary)} /> Professional Focus
              </h4>
              
              <div className="space-y-6">
                {currentRoles.map((role, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className={clsx("mt-1 p-3 bg-slate-50 rounded-2xl text-slate-700 transition-colors", `group-hover:${theme.iconBg}`)}>
                      {IconMap[role.icon] || <Briefcase className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-bold text-brand-dark text-[15px]">{role.title}</div>
                      <div className="text-sm text-slate-500 mt-1">{role.context}</div>
                    </div>
                  </div>
                ))}
              </div>

              {pastHighlights.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase mb-4">Timeline</h5>
                  <div className="space-y-4 relative pl-3">
                    {/* Vertical line for timeline */}
                    <div className="absolute left-[24px] top-2 bottom-2 w-[2px] bg-slate-100"></div>
                    {pastHighlights.map((item, i) => (
                      <div key={i} className="flex items-baseline gap-4 text-sm group relative z-10">
                        <span 
                          className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-500 bg-white border border-slate-200 min-w-[48px] text-center shadow-sm"
                        >
                          {item.year || 'Past'}
                        </span>
                        <span className={clsx("text-slate-800 transition-colors font-semibold", `group-hover:${theme.primary}`)}>{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
           </Card>
        </div>

        {/* Column 2: Digital Presence & Skills */}
        <div className="space-y-8">
           <Card className="p-8" hover theme={theme}>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Globe className={clsx("w-4 h-4", theme.primary)} /> Digital Signals
              </h4>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {coreSkills.map((skill, i) => (
                  <span key={i} className={clsx(
                      "px-3 py-1.5 text-[13px] font-bold rounded-lg transition-transform hover:scale-105 cursor-default",
                      getRandomColorClass(i + 2)
                    )}>
                    {skill}
                  </span>
                ))}
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase mb-3">Authority Markers</h5>
                <ul className="space-y-3">
                  {authoritySignals.length > 0 ? authoritySignals.map((sig, i) => (
                    <li key={i} className="text-[13px] text-slate-700 flex items-start gap-3">
                      <div className={clsx("w-1.5 h-1.5 rounded-full mt-2 shrink-0", theme.primary.replace('text-', 'bg-'))} />
                      {sig}
                    </li>
                  )) : <li className="text-xs text-slate-400 italic">None detected</li>}
                </ul>
              </div>
           </Card>
           
           <Card className="p-8" hover theme={theme}>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp className={clsx("w-4 h-4", theme.primary)} /> Recent Activity
              </h4>
               <div className="space-y-5">
                 {recentItems.map((item, i) => (
                   <div key={i} className="flex items-center gap-4 text-sm group">
                      <div className={clsx("w-2 h-2 rounded-full ring-4 transition-transform group-hover:scale-125", theme.bgSoft.replace('bg-', 'ring-'), theme.primary.replace('text-', 'bg-'))}></div>
                      <span className="text-brand-dark font-bold truncate flex-1">{item.title}</span>
                      <span className="text-xs text-slate-400 font-bold shrink-0 bg-slate-100 px-2 py-1 rounded-md">{item.year}</span>
                   </div>
                 ))}
                 {recentItems.length === 0 && <span className="text-slate-400 text-sm italic">No recent data found.</span>}
               </div>
           </Card>
        </div>

        {/* Column 3: Action Plan (Interactive) */}
        <div className="space-y-8">
           <Card className={clsx("p-8 bg-gradient-to-b to-white", theme.bgSoft.replace('bg-', 'from-'))} hover theme={theme}>
              <h4 className={clsx("text-xs font-extrabold uppercase tracking-widest mb-6 flex items-center gap-2", theme.primary)}>
                <MessageSquare className="w-4 h-4" /> Openers
              </h4>
              
              <div className={clsx("mb-6 flex items-center justify-between text-xs bg-white px-4 py-2.5 rounded-xl shadow-sm border", theme.primary, theme.border)}>
                 <span className="font-bold uppercase opacity-70">Tone Strategy</span>
                 <span className="font-extrabold">"{recommendedTone}"</span>
              </div>

              <div className="space-y-4">
                {conversationStarters.map((starter, i) => (
                  <button 
                    key={i}
                    onClick={() => copyToClipboard(starter, i)}
                    className={clsx(
                        "w-full text-left group relative p-5 bg-white border border-transparent rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1",
                        `hover:bg-gradient-to-r ${theme.gradient}`
                    )}
                  >
                    <p className="text-[13px] text-slate-700 group-hover:text-white leading-relaxed pr-6 font-medium">"{starter}"</p>
                    <div className="absolute top-5 right-4 text-slate-300 group-hover:text-white transition-colors">
                      {copiedIndex === i ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>
           </Card>

           <Card className="p-8" hover theme={theme}>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6">Value Adds</h4>
              <ul className="space-y-4">
                {waysToAddValue.map((way, i) => (
                  <li key={i} className="text-[13px] text-slate-700 flex items-start gap-3 font-medium">
                    <span className={clsx("text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md mt-[-2px]", theme.primary.replace('text-', 'bg-').replace('600', '400'))}>+</span> {way}
                  </li>
                ))}
              </ul>
           </Card>
        </div>
      </div>

      {/* Footer: Ambiguities */}
      {uncertainties.length > 0 && (
        <div className="flex items-start gap-4 p-6 rounded-3xl bg-slate-100/50 border border-slate-200 text-xs text-slate-500 max-w-3xl mx-auto">
           <Shield className="w-5 h-5 text-slate-400 shrink-0" />
           <div className="flex-1">
             <span className="font-bold text-slate-800 block mb-1 text-[13px]">Data Confidence Notes</span>
             <p className="leading-relaxed opacity-90">{uncertainties.join(' ')}</p>
           </div>
        </div>
      )}

    </div>
  );
};