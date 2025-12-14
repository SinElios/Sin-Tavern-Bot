import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GamePhase, 
  GameState, 
  ResourceType, 
  Customer, 
  HeroClass, 
  MenuItem, 
  ItemCategory 
} from './types';
import { 
  INITIAL_GOLD, 
  MENU_ITEMS, 
  EVENTS, 
  HERO_NAMES, 
  UPGRADES,
  TICK_RATE
} from './constants';

import MarketPhase from './components/MarketPhase';
import DayPhase from './components/DayPhase';
import EveningPhase from './components/EveningPhase';
import CookingGame from './components/CookingGame';

const INITIAL_STATE: GameState = {
  day: 1,
  phase: GamePhase.START,
  gold: INITIAL_GOLD,
  fame: 10,
  resources: {
    [ResourceType.FLOUR]: 0,
    [ResourceType.MEAT]: 0,
    [ResourceType.VEGETABLES]: 0,
    [ResourceType.FRUITS]: 0,
    [ResourceType.HOPS]: 0,
    [ResourceType.GRAPES]: 0,
    [ResourceType.MAGIC_ESSENCE]: 0,
  },
  inventory: {
    [ResourceType.FLOUR]: 5,
    [ResourceType.MEAT]: 5,
    [ResourceType.VEGETABLES]: 5,
    [ResourceType.FRUITS]: 5,
    [ResourceType.HOPS]: 5,
    [ResourceType.GRAPES]: 5,
    [ResourceType.MAGIC_ESSENCE]: 0,
  },
  capacity: 4,
  customers: [],
  upgrades: {},
  activeEvent: null,
  dayTime: 0,
  dailyLog: [],
  cookingSession: null,
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const gameLoopRef = useRef<number | null>(null);

  // --- Helpers ---
  const addLog = (msg: string) => {
    setGameState(prev => ({
      ...prev,
      dailyLog: [...prev.dailyLog, msg]
    }));
  };

  const createCustomer = (id: string): Customer => {
    const classes = Object.values(HeroClass);
    const heroClass = classes[Math.floor(Math.random() * classes.length)];
    const names = HERO_NAMES[heroClass];
    const name = names[Math.floor(Math.random() * names.length)];
    
    return {
      id,
      name,
      heroClass,
      status: 'waiting',
      patience: 100,
      maxPatience: 100,
      seatIndex: -1,
    };
  };

  // --- Game Loop Logic ---

  const processDayTick = useCallback(() => {
    setGameState(prev => {
      // 1. Time Progression - Slowed down by 5x (0.5 -> 0.1)
      const newTime = prev.dayTime + 0.1; 
      if (newTime >= 100) {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        return { ...prev, phase: GamePhase.EVENING, dayTime: 100, cookingSession: null };
      }

      let newCustomers = [...prev.customers];
      let newFame = prev.fame;
      let newLog = [...prev.dailyLog];
      let newCookingSession = prev.cookingSession;

      // 2. Spawn Customers (Random chance based on fame)
      const spawnChance = 0.02 + (prev.fame / 1000); 
      if (Math.random() < spawnChance && newCustomers.length < 10) { 
         newCustomers.push(createCustomer(`c_${prev.day}_${Date.now()}_${Math.random()}`));
      }

      // 3. Process Customers
      newCustomers = newCustomers.map(customer => {
        // Decrease Patience Logic
        let patienceDecay = 0.1;
        if (customer.status === 'waiting') patienceDecay = 0.2;
        if (customer.status === 'seated_ready') patienceDecay = 0.3; // Impatient when seated waiting for service

        if (customer.status !== 'leaving') {
            customer.patience -= patienceDecay;
        }

        // --- Status Transitions ---

        // A. Waiting in Queue -> Seated
        if (customer.status === 'waiting') {
          if (customer.seatIndex === -1) {
            const emptyTable = Array.from({length: prev.capacity}).findIndex((_, i) => 
               !newCustomers.some(c => c.seatIndex === i && c.status !== 'leaving')
            );
            
            if (emptyTable !== -1) {
              customer.seatIndex = emptyTable;
              customer.status = 'seated_ready'; // Changed: Wait for player click
              customer.bubbleText = "Меню!";
              customer.patience = 100; // Reset patience upon seating
              customer.maxPatience = 100;
            } else if (customer.patience <= 0) {
               customer.status = 'leaving';
               customer.bubbleText = "Слишком тесно!";
               newFame = Math.max(0, newFame - 1);
            }
          }
        } 
        // B. Seated -> Angry leaving (if ignored too long)
        else if (customer.status === 'seated_ready') {
            if (customer.patience <= 0) {
                customer.status = 'leaving';
                customer.bubbleText = "Игнор?! Я ухожу!";
                newFame = Math.max(0, newFame - 3);
                newLog.push(`${customer.name} ушел необслуженным.`);
                
                // Close cooking session if it was for this customer
                if (newCookingSession?.customerId === customer.id) {
                    newCookingSession = null;
                }
            }
        }
        // C. Eating -> Leaving (Done)
        else if (customer.status === 'eating') {
           // We do not decrement patience here using decay, we treat patience as "ticks left to eat"
           // However, to keep it simple, we decrement by 1 (which is faster than patience decay)
           // Eating takes roughly 40-50 ticks.
           // Note: customer.patience is decremented by decay above (0.1). Let's subtract 0.9 more to make it 1.0 per tick.
           customer.patience -= 0.9;
           
           if (customer.patience <= 0) {
             // Finished eating
             customer.status = 'leaving';
             customer.bubbleText = "Вкусно!";
           }
        }

        return customer;
      });

      // Cleanup leaving customers
      newCustomers = newCustomers.filter(c => c.status !== 'leaving');

      return {
        ...prev,
        dayTime: newTime,
        customers: newCustomers,
        fame: newFame,
        dailyLog: newLog.length > prev.dailyLog.length ? newLog : prev.dailyLog,
        cookingSession: newCookingSession
      };
    });
  }, []);

  // --- Actions ---

  const handleCustomerClick = (customerId: string) => {
      setGameState(prev => {
          if (prev.cookingSession) return prev; // Already cooking

          const customer = prev.customers.find(c => c.id === customerId);
          if (!customer || customer.status !== 'seated_ready') return prev;

          // Determine preferred item immediately
          let desiredCategory = ItemCategory.MAIN;
          if (customer.heroClass === HeroClass.MAGE) desiredCategory = ItemCategory.DESSERT;
          if (customer.heroClass === HeroClass.ROGUE) desiredCategory = ItemCategory.DRINK;

          // Pick a random recipe from that category, OR any if category empty, ignoring stock for now (stock checked in minigame)
          const categoryItems = MENU_ITEMS.filter(i => i.category === desiredCategory);
          const possibleItems = categoryItems.length > 0 ? categoryItems : MENU_ITEMS;
          const targetItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];

          return {
              ...prev,
              cookingSession: {
                  customerId,
                  targetItem,
                  addedIngredients: {},
                  isComplete: false
              }
          };
      });
  };

  const handleCookingAddIngredient = (res: ResourceType) => {
      setGameState(prev => {
          if (!prev.cookingSession) return prev;
          
          const newInventory = { ...prev.inventory };
          if (newInventory[res] > 0) {
              newInventory[res]--;
              
              const newAdded = { ...prev.cookingSession.addedIngredients };
              newAdded[res] = (newAdded[res] || 0) + 1;

              return {
                  ...prev,
                  inventory: newInventory,
                  cookingSession: {
                      ...prev.cookingSession,
                      addedIngredients: newAdded
                  }
              };
          }
          return prev;
      });
  };

  const handleCookingComplete = () => {
      setGameState(prev => {
          if (!prev.cookingSession) return prev;
          
          const { customerId, targetItem } = prev.cookingSession;
          const customers = [...prev.customers];
          const idx = customers.findIndex(c => c.id === customerId);
          
          let newGold = prev.gold;
          let newFame = prev.fame;
          let newLog = [...prev.dailyLog];

          if (idx !== -1) {
              const customer = { ...customers[idx] };
              customer.order = targetItem;
              customer.status = 'eating';
              // Eating duration: 50 ticks
              customer.patience = 50; 
              customer.maxPatience = 50; 
              customer.bubbleText = `Ем: ${targetItem.name}`;
              
              newGold += targetItem.price;
              newFame = Math.min(100, newFame + 1);
              newLog.push(`${customer.name} обслужен: ${targetItem.name} (+${targetItem.price}g)`);
              
              customers[idx] = customer;
          }

          return {
              ...prev,
              customers,
              gold: newGold,
              fame: newFame,
              dailyLog: newLog,
              cookingSession: null // Close minigame
          };
      });
  };

  const handleCookingCancel = () => {
      // Return ingredients? For hard mode: No. For now: Yes, let's refund to be nice.
      setGameState(prev => {
          if (!prev.cookingSession) return prev;
          
          const refundedInventory = { ...prev.inventory };
          Object.entries(prev.cookingSession.addedIngredients).forEach(([res, amt]) => {
              refundedInventory[res as ResourceType] += amt;
          });

          return {
              ...prev,
              inventory: refundedInventory,
              cookingSession: null
          };
      });
  };

  // --- Phase Transitions ---

  const startMorning = () => {
    const eventRoll = Math.random();
    let activeEvent = null;

    if (eventRoll < 0.3) {
       activeEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    }

    let newState = {
      ...gameState,
      phase: GamePhase.MORNING,
      dayTime: 0,
      activeEvent,
      dailyLog: [],
      customers: [],
      cookingSession: null
    };

    if (activeEvent) {
       const effects = activeEvent.effect(gameState);
       newState = { ...newState, ...effects };
    }

    setGameState(newState);
  };

  const startDaySimulation = () => {
    setGameState(prev => ({ ...prev, phase: GamePhase.DAY }));
    gameLoopRef.current = window.setInterval(processDayTick, TICK_RATE);
  };

  const startNextDay = () => {
    setGameState(prev => ({
      ...prev,
      day: prev.day + 1,
      phase: GamePhase.START,
    }));
    startMorning();
  };

  const handleBuyResource = (res: ResourceType, amount: number, cost: number) => {
    setGameState(prev => ({
      ...prev,
      gold: prev.gold - cost,
      inventory: {
        ...prev.inventory,
        [res]: prev.inventory[res] + amount
      }
    }));
  };

  const handleUpgrade = (upgradeId: string) => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    setGameState(prev => {
      const currentLevel = prev.upgrades[upgradeId] || 0;
      const cost = Math.floor(upgrade.cost * Math.pow(1.5, currentLevel));
      
      let newCapacity = prev.capacity;
      if (upgrade.type === 'capacity') {
        newCapacity += 2;
      }
      
      return {
        ...prev,
        gold: prev.gold - cost,
        capacity: newCapacity,
        upgrades: {
          ...prev.upgrades,
          [upgradeId]: currentLevel + 1
        },
        dailyLog: [...prev.dailyLog, `Куплено улучшение: ${upgrade.name}`]
      };
    });
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  // --- Render ---

  if (gameState.phase === GamePhase.START) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center font-[Press Start 2P]">
        <div className="text-center p-8 border-4 border-amber-600 rounded bg-stone-800 shadow-2xl max-w-lg">
          <h1 className="text-4xl text-amber-400 mb-6 drop-shadow-md">Гильдия: Таверна</h1>
          <p className="text-stone-300 mb-8 text-sm leading-6">
            Добро пожаловать, Трактирщик. Гильдии нужно место для отдыха.
            Закупай припасы, управляй хаосом и создай самую легендарную таверну в королевстве.
          </p>
          <button 
            onClick={startMorning}
            className="bg-green-700 hover:bg-green-600 text-white text-xl py-4 px-8 rounded border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all"
          >
            Открыть Таверну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white font-[Press Start 2P] flex flex-col items-center p-4">
      {gameState.activeEvent && gameState.phase === GamePhase.MORNING && (
        <div className="mb-4 bg-red-900/80 border-2 border-red-500 p-4 rounded text-center w-full max-w-2xl animate-pulse">
           <h3 className="text-yellow-300 mb-1">{gameState.activeEvent.title}</h3>
           <p className="text-xs">{gameState.activeEvent.description}</p>
        </div>
      )}

      <div className="w-full max-w-6xl h-[85vh] relative">
        {gameState.phase === GamePhase.MORNING && (
          <MarketPhase 
            gold={gameState.gold} 
            inventory={gameState.inventory} 
            onBuy={handleBuyResource} 
            onNext={startDaySimulation}
            day={gameState.day}
          />
        )}

        {gameState.phase === GamePhase.DAY && (
          <>
            <DayPhase state={gameState} onCustomerClick={handleCustomerClick} />
            {gameState.cookingSession && (
              <CookingGame 
                session={gameState.cookingSession}
                inventory={gameState.inventory}
                onAddIngredient={handleCookingAddIngredient}
                onComplete={handleCookingComplete}
                onCancel={handleCookingCancel}
              />
            )}
          </>
        )}

        {gameState.phase === GamePhase.EVENING && (
          <EveningPhase 
            state={gameState} 
            onUpgrade={handleUpgrade} 
            onNext={startNextDay}
          />
        )}
      </div>
      
      <div className="mt-4 text-xs text-stone-600">
        Симулятор Таверны Гильдии v1.0 | React + Tailwind
      </div>
    </div>
  );
}