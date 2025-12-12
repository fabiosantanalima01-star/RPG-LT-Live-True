import React, { useState } from 'react';
import { ArrowRight, Brain, AlertTriangle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (goals: string[]) => void;
}

const GOAL_OPTIONS = [
  "Melhorar Condicionamento", "Aprender um Idioma", "Crescimento de Carreira", 
  "Liberdade Financeira", "Melhorar o Sono", "Clareza Mental", 
  "Socializar Mais", "Aprender Programação", "Ler Mais"
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(prev => prev.filter(g => g !== goal));
      if (showWarning && selectedGoals.length <= 5) setShowWarning(false);
    } else {
      const newGoals = [...selectedGoals, goal];
      setSelectedGoals(newGoals);
      if (newGoals.length > 4) {
        setShowWarning(true);
      }
    }
  };

  const handleContinue = () => {
    onComplete(selectedGoals);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <Brain className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Defina Sua Jornada
          </h1>
          <p className="text-gray-400 mt-2">Selecione seus objetivos principais para calibrar o algoritmo.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {GOAL_OPTIONS.map(goal => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                selectedGoals.includes(goal)
                  ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/30 transform scale-105'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>

        {showWarning && (
          <div className="mb-6 bg-orange-900/40 border border-orange-500/40 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-orange-300 font-bold text-sm">O Mito da Multitarefa</h4>
              <p className="text-orange-200/80 text-xs mt-1">
                A neurociência sugere que focar em mais de 4 grandes objetivos dilui recursos cognitivos e resposta de dopamina. Prosseguir com cautela?
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={selectedGoals.length === 0}
          className="w-full py-4 bg-gradient-to-r from-quest-gold to-yellow-600 rounded-xl font-bold text-black flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Iniciar Jornada <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;