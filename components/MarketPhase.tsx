import React, { useState, useEffect } from 'react';
import { RESOURCE_PRICES, RESOURCE_NAMES, RESOURCE_ICONS } from '../constants';
import { ResourceType } from '../types';

interface MarketPhaseProps {
  gold: number;
  inventory: Record<ResourceType, number>;
  onBuy: (resource: ResourceType, amount: number, cost: number) => void;
  onNext: () => void;
  day: number;
}

const MarketPhase: React.FC<MarketPhaseProps> = ({ gold, inventory, onBuy, onNext, day }) => {
  const [prices, setPrices] = useState<Record<ResourceType, number>>({} as any);

  useEffect(() => {
    // Generate daily prices
    const newPrices: any = {};
    Object.keys(RESOURCE_PRICES).forEach((key) => {
      const k = key as ResourceType;
      const range = RESOURCE_PRICES[k];
      newPrices[k] = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    });
    setPrices(newPrices);
  }, [day]);

  return (
    <div className="flex flex-col h-full bg-stone-800 text-amber-100 p-4 border-4 border-stone-600 rounded-lg shadow-2xl">
      <div className="flex justify-between items-center mb-4 bg-stone-900 p-3 rounded border-2 border-stone-600 shadow-lg">
        <div>
          <h2 className="text-xl text-amber-400 font-bold leading-none">Утренний Рынок</h2>
          <div className="text-xs text-stone-400 mt-1">День {day}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-stone-400">Кошель:</div>
          <div className="text-xl text-yellow-400 font-bold">{gold}g</div>
        </div>
        <button 
          onClick={onNext}
          className="ml-4 bg-green-700 hover:bg-green-600 text-white text-sm py-2 px-4 rounded border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all font-bold uppercase tracking-wide"
        >
          Открыть Таверну &rarr;
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 overflow-y-auto pr-1">
        {(Object.keys(RESOURCE_PRICES) as ResourceType[]).map((res) => (
          <div key={res} className="bg-stone-700 p-2 rounded border-2 border-stone-500 hover:border-amber-500/50 transition-colors flex flex-col justify-between relative group">
            
            <div className="flex justify-between items-start">
               <div className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-200 cursor-help" title={RESOURCE_NAMES[res]}>
                 {RESOURCE_ICONS[res]}
               </div>
               <div className="text-right">
                  <div className="text-[10px] uppercase text-stone-400 font-bold">{RESOURCE_NAMES[res]}</div>
                  <div className="text-xs text-white bg-stone-900/50 px-1 rounded inline-block mt-1">
                    x{inventory[res]}
                  </div>
               </div>
            </div>

            <div className="mt-2 text-center bg-stone-900/30 rounded py-1 mb-2">
              <span className="text-yellow-300 font-bold text-sm">{prices[res]}g</span>
              <span className="text-[10px] text-stone-500 ml-1">/шт</span>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <button 
                disabled={gold < prices[res]}
                onClick={() => onBuy(res, 1, prices[res])}
                className="bg-amber-800 hover:bg-amber-700 disabled:bg-stone-600 disabled:opacity-50 text-white text-xs py-1 rounded border-b-2 border-amber-950 active:border-b-0"
              >
                +1
              </button>
               <button 
                disabled={gold < prices[res] * 5}
                onClick={() => onBuy(res, 5, prices[res] * 5)}
                className="bg-amber-800 hover:bg-amber-700 disabled:bg-stone-600 disabled:opacity-50 text-white text-xs py-1 rounded border-b-2 border-amber-950 active:border-b-0"
              >
                +5
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-[10px] text-stone-500">
        * Цены меняются каждое утро. Запасайтесь заранее!
      </div>
    </div>
  );
};

export default MarketPhase;