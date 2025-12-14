import React from 'react';
import { Customer, GameState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface DayPhaseProps {
  state: GameState;
  onCustomerClick: (id: string) => void;
}

const ProgressBar: React.FC<{ current: number; max: number; type: 'patience' | 'eating' }> = ({ current, max, type }) => {
  const percent = Math.max(0, Math.min(100, (current / max) * 100));
  
  // Colors based on type
  let colorClass = 'bg-green-500';
  if (type === 'patience') {
    if (percent < 30) colorClass = 'bg-red-600 animate-pulse';
    else if (percent < 60) colorClass = 'bg-yellow-500';
  } else {
    colorClass = 'bg-blue-500';
  }

  return (
    <div className="w-12 h-2 bg-stone-900 border border-stone-600 rounded-full mt-1 overflow-hidden relative">
      <div 
        className={`h-full transition-all duration-300 ${colorClass}`} 
        style={{ width: `${percent}%` }}
      />
      {/* Icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow-md leading-none">
        {type === 'eating' ? '🍔' : '⏳'}
      </div>
    </div>
  );
};

const HeroSprite: React.FC<{ customer: Customer, onClick: () => void }> = ({ customer, onClick }) => {
  // Simple pixel art representation using colors/divs
  const classColors = {
    'Warrior': 'bg-red-700 border-red-900',
    'Mage': 'bg-blue-700 border-blue-900',
    'Rogue': 'bg-green-700 border-green-900',
    'Cleric': 'bg-yellow-100 border-yellow-300'
  };

  const bg = classColors[customer.heroClass] || 'bg-gray-500';
  const isInteractable = customer.status === 'seated_ready';

  return (
    <div 
      className={`relative flex flex-col items-center ${isInteractable ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      onClick={onClick}
    >
      <AnimatePresence>
        {customer.bubbleText && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-14 z-20 bg-white text-black text-[10px] p-2 rounded shadow border border-black whitespace-nowrap"
          >
            {customer.bubbleText}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Alert Icon for Interaction */}
      {isInteractable && (
          <div className="absolute -top-8 animate-bounce z-10 text-red-500 text-xl font-bold drop-shadow-md">
            !
          </div>
      )}

      {/* Timer Bar */}
      {(customer.status === 'waiting' || customer.status === 'seated_ready') && (
        <div className="absolute -top-4 z-10">
           <ProgressBar current={customer.patience} max={customer.maxPatience} type="patience" />
        </div>
      )}
      {customer.status === 'eating' && (
        <div className="absolute -top-4 z-10">
           <ProgressBar current={customer.patience} max={customer.maxPatience} type="eating" />
        </div>
      )}

      {/* Character Body */}
      <div className={`w-12 h-12 ${bg} border-4 rounded-sm flex items-center justify-center relative shadow-lg`}>
        {/* Eyes */}
        <div className="absolute top-3 left-3 w-1 h-1 bg-black"></div>
        <div className="absolute top-3 right-3 w-1 h-1 bg-black"></div>
        {/* Mouth */}
        {customer.status === 'eating' ? (
           <div className="absolute bottom-3 w-4 h-2 bg-pink-300 animate-pulse rounded"></div>
        ) : (
           <div className="absolute bottom-3 w-4 h-1 bg-black opacity-30"></div>
        )}
      </div>
      
      {/* Name Tag */}
      <div className="mt-1 bg-black/50 text-white text-[8px] px-1 rounded">
        {customer.name}
      </div>
      
       {/* Order Indicator */}
       {customer.order && customer.status !== 'waiting' && customer.status !== 'seated_ready' && (
        <div className="absolute -right-2 top-0 bg-amber-200 border border-amber-600 rounded-full w-6 h-6 flex items-center justify-center text-[10px]" title={customer.order.name}>
          еда
        </div>
      )}
    </div>
  );
};

const DayPhase: React.FC<DayPhaseProps> = ({ state, onCustomerClick }) => {
  // Generate tables based on capacity
  const tables = Array.from({ length: state.capacity });

  return (
    <div className="relative h-full bg-stone-900 overflow-hidden flex flex-col">
      {/* Top HUD */}
      <div className="bg-stone-950 p-2 flex justify-between items-center border-b-4 border-stone-800 z-10">
        <div className="flex gap-4 text-xs md:text-sm text-stone-300">
           <span>День: <span className="text-white">{state.day}</span></span>
           <span>Золото: <span className="text-yellow-400">{state.gold}</span></span>
           <span>Слава: <span className="text-purple-400">{state.fame}</span></span>
        </div>
        <div className="flex-1 mx-4 h-4 bg-stone-800 rounded-full overflow-hidden border border-stone-600">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-300 ease-linear"
            style={{ width: `${state.dayTime}%` }}
          />
        </div>
        <div className="text-xs text-stone-500">{Math.floor(state.dayTime)}%</div>
      </div>

      {/* Tavern Floor */}
      <div className="flex-1 relative p-8 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-amber-900">
         {/* Grid Layout for Tables */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {tables.map((_, idx) => {
              const customer = state.customers.find(c => c.seatIndex === idx);
              return (
                <div key={idx} className="flex flex-col items-center justify-center bg-amber-950/30 p-4 rounded-xl border-4 border-amber-950/50 min-h-[120px]">
                  {/* Table Graphic */}
                  <div className="absolute w-24 h-16 bg-amber-800 rounded-lg border-b-8 border-amber-950 shadow-xl mb-4 transform translate-y-4"></div>
                  
                  {/* Chair/Customer */}
                  <div className="z-10 transform -translate-y-2">
                    {customer ? (
                      <HeroSprite customer={customer} onClick={() => onCustomerClick(customer.id)} />
                    ) : (
                      <div className="text-stone-500/50 text-xs">Пусто</div>
                    )}
                  </div>
                </div>
              );
            })}
         </div>

         {/* Queue / Door Area */}
         <div className="absolute bottom-0 left-0 w-full h-24 bg-stone-900/90 border-t-4 border-stone-700 flex items-center px-4 gap-4 overflow-x-auto">
            <div className="text-stone-500 text-xs w-16 text-center font-bold">ОЧЕРЕДЬ</div>
            {state.customers.filter(c => c.seatIndex === -1 && c.status === 'waiting').map(c => (
              <div key={c.id} className="opacity-70 scale-75 grayscale hover:grayscale-0 transition-all ml-4">
                <HeroSprite customer={c} onClick={() => {}} />
              </div>
            ))}
         </div>
      </div>
      
      {/* Log Overlay */}
      <div className="absolute top-16 right-4 w-64 h-32 pointer-events-none flex flex-col justify-end items-end gap-1">
          {state.dailyLog.slice(-3).map((log, i) => (
             <motion.div 
               key={`${log}-${i}`} 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm"
             >
               {log}
             </motion.div>
          ))}
      </div>
    </div>
  );
};

export default DayPhase;