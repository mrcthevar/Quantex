import React, { useEffect, useState } from 'react';
import { Search, BrainCircuit, PenTool, Globe, Sparkles } from 'lucide-react';
import { Theme } from '../types';
import clsx from 'clsx';

const STEPS = [
  { icon: Globe, text: "Scanning public sources..." },
  { icon: Search, text: "Verifying identity & role..." },
  { icon: BrainCircuit, text: "Analyzing career trajectory..." },
  { icon: Sparkles, text: "Calculating compatibility fit..." },
  { icon: PenTool, text: "Drafting conversation strategies..." },
];

export const LoadingState: React.FC<{ theme?: Theme }> = ({ theme }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800); // Switch text every 1.8s
    return () => clearInterval(interval);
  }, []);

  const current = STEPS[currentStep];
  const ActiveIcon = current.icon;

  // Use theme colors if available, otherwise default
  const activeColor = theme ? theme.primary : "text-purple-600";
  const activeBg = theme ? theme.bgSoft : "bg-purple-50";
  const gradient = theme ? theme.gradient : "from-purple-600 to-pink-600";

  return (
    <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center animate-fade-in">
      <div className="relative mb-10">
        <div className={clsx("absolute inset-0 blur-3xl rounded-full animate-pulse transition-colors duration-500", activeBg.replace('bg-', 'bg-opacity-50 bg-'))}></div>
        <div className="relative w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform duration-500 hover:scale-105">
          <ActiveIcon className={clsx("w-10 h-10 animate-bounce-subtle transition-colors duration-500", activeColor)} />
        </div>
      </div>
      
      <h3 className="text-3xl font-extrabold text-brand-dark tracking-tight mb-3">
        Gathering Intelligence
      </h3>
      
      <div className="h-8 overflow-hidden relative w-full max-w-sm mx-auto">
        <p key={currentStep} className="text-slate-500 font-bold animate-slideUp text-[16px]">
          {current.text}
        </p>
      </div>

      <div className="mt-12 flex gap-2 justify-center">
        {STEPS.map((_, idx) => (
          <div 
            key={idx} 
            className={clsx(
              "h-2 rounded-full transition-all duration-500 ease-out",
              idx <= currentStep 
                ? `w-10 bg-gradient-to-r ${gradient}` 
                : 'w-2 bg-slate-200'
            )} 
          />
        ))}
      </div>
    </div>
  );
};