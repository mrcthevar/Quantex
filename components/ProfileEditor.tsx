import React from 'react';
import { Profile, Theme } from '../types';
import { Card } from './ui/Card';
import { User, Search, Plus, X, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface ProfileEditorProps {
  title: string;
  profile: Profile | null;
  onChange: (profile: Profile | null) => void;
  isNullable?: boolean;
  type: 'target' | 'viewer';
  theme: Theme;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ title, profile, onChange, isNullable = false, type, theme }) => {
  const defaultProfile: Profile = {
    id: `user_${type}`,
    name: '',
    role: '',
    context: '',
    goals: []
  };

  const [localProfile, setLocalProfile] = React.useState<Profile>(profile || defaultProfile);

  React.useEffect(() => {
    if (profile) setLocalProfile(profile);
  }, [profile]);

  const handleChange = (field: keyof Profile, value: any) => {
    const updated = { ...localProfile, [field]: value };
    setLocalProfile(updated);
    if (type === 'target') {
      onChange(updated);
    }
  };

  const handleArrayChange = (field: keyof Profile, value: string) => {
    const arr = value.split(',').map(s => s.trim()).filter(Boolean);
    setLocalProfile(prev => ({ ...prev, [field]: arr }));
  };

  const save = () => {
    onChange(localProfile);
  };

  const toggleNull = () => {
    if (profile) {
      onChange(null);
    } else {
      onChange(localProfile);
    }
  };

  // Special "Add Viewer" State
  if (!profile && isNullable) {
    return (
      <button 
        onClick={toggleNull}
        className={clsx(
            "group w-full h-24 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all duration-300",
            theme.border,
            theme.primary.replace('text-', 'text-opacity-60 text-'), // hacky but works for now to lighten text
            `hover:bg-${theme.id}-50/50 hover:border-current hover:text-opacity-100`
        )}
      >
        <div className={clsx("p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300", theme.primary)}>
            <Plus className="w-5 h-5" />
        </div>
        <span className="font-bold text-sm">Add Context</span>
      </button>
    );
  }

  // Playful inputs with dynamic theme focus
  const inputClass = clsx(
      "w-full text-[15px] bg-slate-50 rounded-xl px-4 py-3 text-brand-text placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-2 border border-transparent",
      theme.ring,
      `focus:${theme.border}`
  );
  
  const labelClass = "block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1";

  if (type === 'target') {
    return (
      <Card className="p-8 relative overflow-hidden" hover={false} theme={theme}>
        {/* Colorful Blob Background based on theme */}
        <div className={clsx("absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20", theme.bgSoft.replace('bg-', 'bg-'))}></div>
        <div className={clsx("absolute top-20 -left-10 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20", theme.bgSoft.replace('bg-', 'bg-'))}></div>

        <div className="relative">
            <h3 className="font-bold text-2xl text-brand-dark mb-6 flex items-center gap-3 tracking-tight">
            <div className={clsx(
                "p-2 rounded-xl text-white shadow-lg transform -rotate-3",
                `bg-gradient-to-br ${theme.gradient}`,
                theme.shadow
            )}>
                <Search className="w-5 h-5" />
            </div>
            {title}
            </h3>
            
            <div className="space-y-6">
            <div>
                <label className={labelClass}>Name to Search</label>
                <input 
                type="text" 
                value={localProfile.name} 
                onChange={e => handleChange('name', e.target.value)}
                className={inputClass}
                placeholder="e.g. Sam Altman"
                />
            </div>
            
            <div>
                <label className={labelClass}>Context Hint</label>
                <input 
                type="text" 
                value={localProfile.role || ''} 
                onChange={e => handleChange('role', e.target.value)}
                className={inputClass}
                placeholder="e.g. CEO of OpenAI"
                />
                <p className={clsx("text-[12px] font-medium mt-2 ml-1 flex items-center gap-1.5 opacity-90", theme.primary)}>
                    <Sparkles className="w-3.5 h-3.5" /> Helps AI find the right person
                </p>
            </div>
            </div>
        </div>
      </Card>
    );
  }

  // Viewer Editor
  return (
    <Card className="p-8" theme={theme}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-brand-dark text-lg flex items-center gap-3 tracking-tight">
          <div className={clsx("p-2 rounded-xl", theme.iconBg)}>
            <User className="w-5 h-5" />
          </div>
          {title}
        </h3>
        {isNullable && (
          <button onClick={toggleNull} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-5">
         <div>
            <label className={labelClass}>Your Name / Role</label>
            <input 
              type="text" 
              value={localProfile.name} 
              onChange={e => handleChange('name', e.target.value)}
              className={inputClass}
              placeholder="e.g. Alex, Designer"
            />
         </div>
         <div>
            <label className={labelClass}>Your Goals</label>
            <input 
              type="text" 
              value={(localProfile.goals || []).join(', ')} 
              onChange={e => handleArrayChange('goals', e.target.value)}
              className={inputClass}
              placeholder="e.g. mentorship, sales..."
            />
         </div>
          <div className="flex justify-end pt-2">
            <button 
              onClick={save}
              className={clsx("text-xs font-bold px-3 py-1.5 rounded-lg transition-colors", theme.iconBg, "hover:opacity-80")}
            >
              Update Context
            </button>
         </div>
      </div>
    </Card>
  );
};