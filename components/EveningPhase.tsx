import React from 'react';
import { UPGRADES } from '../constants';
import { GameState } from '../types';

interface EveningPhaseProps {
  state: GameState;
  onUpgrade: (upgradeId: string) => void;
  onNext: () => void;
}

const EveningPhase: React.FC<EveningPhaseProps> = ({ state, onUpgrade, onNext }) => {
  return (
    <div className="flex flex-col h-full bg-stone-900 text-amber-50 p-8 border-4 border-amber-900 overflow-y-auto">
      <h2 className="text-3xl text-center text-amber-400 mb-8 border-b-2 border-amber-800 pb-4">
        Вечерний Отчет - День {state.day}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-stone-800 p-6 rounded border-2 border-stone-600">
          <h3 className="text-xl text-amber-300 mb-4">Журнал дня</h3>
          <ul className="space-y-2 text-sm text-stone-300 font-mono h-48 overflow-y-auto bg-stone-900 p-2 rounded">
            {state.dailyLog.length === 0 ? <li>Ничего интересного не произошло.</li> : state.dailyLog.map((log, i) => (
              <li key={i}>&gt; {log}</li>
            ))}
          </ul>
        </div>

        <div className="bg-stone-800 p-6 rounded border-2 border-stone-600">
          <h3 className="text-xl text-amber-300 mb-4">Статус</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-900 p-3 rounded">
              <span className="block text-xs text-stone-500">Золото</span>
              <span className="text-xl text-yellow-400">{state.gold}g</span>
            </div>
            <div className="bg-stone-900 p-3 rounded">
              <span className="block text-xs text-stone-500">Слава</span>
              <span className="text-xl text-purple-400">{state.fame}</span>
            </div>
            <div className="bg-stone-900 p-3 rounded">
               <span className="block text-xs text-stone-500">Места</span>
               <span className="text-xl text-blue-400">{state.capacity}</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-2xl text-amber-400 mb-4">Улучшения Гильдии</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {UPGRADES.map(upgrade => {
          const currentLevel = state.upgrades[upgrade.id] || 0;
          const isMaxed = currentLevel >= upgrade.maxLevel;
          const cost = Math.floor(upgrade.cost * Math.pow(1.5, currentLevel));
          
          return (
            <div key={upgrade.id} className="bg-stone-800 p-4 rounded border-2 border-stone-600 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-lg text-amber-200">{upgrade.name}</h4>
                <p className="text-xs text-stone-400 mb-2">{upgrade.description}</p>
                <div className="text-xs mb-2">Ур: {currentLevel} / {upgrade.maxLevel}</div>
              </div>
              
              {isMaxed ? (
                 <button disabled className="w-full bg-stone-600 text-stone-400 py-2 rounded font-bold cursor-not-allowed">
                  МАКС
                </button>
              ) : (
                <button 
                  disabled={state.gold < cost}
                  onClick={() => onUpgrade(upgrade.id)}
                  className="w-full bg-blue-800 hover:bg-blue-700 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-white py-2 rounded font-bold border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all"
                >
                  Улучшить ({cost}g)
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto text-center">
        <button 
          onClick={onNext}
          className="bg-amber-600 hover:bg-amber-500 text-black font-bold py-4 px-12 rounded text-xl border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 transition-all"
        >
          Спать и Начать Новый День
        </button>
      </div>
    </div>
  );
};

export default EveningPhase;