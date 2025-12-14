import React from 'react';
import { ResourceType, MenuItem, CookingSession } from '../types';
import { RESOURCE_ICONS, RESOURCE_NAMES, ITEM_ICONS } from '../constants';
import { motion } from 'framer-motion';

interface CookingGameProps {
  session: CookingSession;
  inventory: Record<ResourceType, number>;
  onAddIngredient: (res: ResourceType) => void;
  onComplete: () => void;
  onCancel: () => void;
}

const CookingGame: React.FC<CookingGameProps> = ({ session, inventory, onAddIngredient, onComplete, onCancel }) => {
  const { targetItem, addedIngredients } = session;

  // Calculate missing ingredients
  const requirements = Object.entries(targetItem.cost) as [ResourceType, number][];
  const isReadyToCook = requirements.every(([res, amount]) => (addedIngredients[res] || 0) >= amount);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-stone-800 border-4 border-amber-700 rounded-lg p-6 max-w-lg w-full shadow-2xl relative"
      >
        <button onClick={onCancel} className="absolute top-2 right-2 text-stone-500 hover:text-white">✕</button>

        <h2 className="text-center text-xl text-amber-400 font-bold mb-4 flex items-center justify-center gap-2">
           <span>{ITEM_ICONS[targetItem.category]}</span>
           <span>Готовка: {targetItem.name}</span>
        </h2>

        {/* Recipe Display */}
        <div className="bg-stone-900 p-4 rounded mb-6 border-2 border-stone-700 flex flex-col items-center">
          <div className="text-sm text-stone-400 mb-2">Рецепт:</div>
          <div className="flex gap-4">
            {requirements.map(([res, amount]) => {
              const current = addedIngredients[res] || 0;
              const isFilled = current >= amount;
              return (
                <div key={res} className={`flex flex-col items-center p-2 rounded ${isFilled ? 'bg-green-900/50' : 'bg-stone-800'}`}>
                  <div className="text-2xl mb-1">{RESOURCE_ICONS[res]}</div>
                  <div className={`text-xs font-bold ${isFilled ? 'text-green-400' : 'text-stone-300'}`}>
                    {current}/{amount}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pot / Action Area */}
        <div className="flex justify-center mb-6">
           {isReadyToCook ? (
             <button 
               onClick={onComplete}
               className="bg-green-600 hover:bg-green-500 text-white text-lg py-3 px-8 rounded animate-bounce font-bold shadow-[0_4px_0_rgb(20,83,45)] active:shadow-none active:translate-y-1"
             >
               ПОДАТЬ БЛЮДО!
             </button>
           ) : (
             <div className="text-stone-500 text-sm animate-pulse">Добавьте ингредиенты...</div>
           )}
        </div>

        {/* Inventory Selection */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {(Object.keys(inventory) as ResourceType[]).map((res) => {
            const count = inventory[res];
            const isNeeded = requirements.some(([r]) => r === res);
            const neededAmount = targetItem.cost[res] || 0;
            const currentAmount = addedIngredients[res] || 0;
            const isFull = currentAmount >= neededAmount;

            // Simple visual logic: dim if 0 count or if this ingredient slot is already full for this recipe
            // (Allowing overfill is a design choice, let's block overfill for simplicity)
            const isDisabled = count <= 0 || (isNeeded && isFull) || (!isNeeded); 

            return (
              <button
                key={res}
                disabled={isDisabled}
                onClick={() => onAddIngredient(res)}
                className={`
                  relative p-2 rounded border-2 flex flex-col items-center justify-center transition-all
                  ${!isNeeded ? 'opacity-30 border-stone-800' : 'border-stone-500 bg-stone-700 hover:bg-stone-600'}
                  ${isDisabled ? 'cursor-not-allowed opacity-50' : 'active:scale-95'}
                  ${isNeeded && !isFull && !isDisabled ? 'ring-2 ring-amber-500/50' : ''}
                `}
                title={RESOURCE_NAMES[res]}
              >
                <div className="text-xl">{RESOURCE_ICONS[res]}</div>
                <div className="text-[10px] mt-1 font-bold">{count}</div>
              </button>
            );
          })}
        </div>

      </motion.div>
    </div>
  );
};

export default CookingGame;