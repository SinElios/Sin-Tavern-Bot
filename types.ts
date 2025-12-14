export enum GamePhase {
  START = 'START',
  MORNING = 'MORNING', // Market
  DAY = 'DAY', // Simulation
  EVENING = 'EVENING', // Upgrades & Stats
  GAME_OVER = 'GAME_OVER'
}

export enum ResourceType {
  FLOUR = 'flour',
  MEAT = 'meat',
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits',
  HOPS = 'hops', // For Ale
  GRAPES = 'grapes', // For Wine
  MAGIC_ESSENCE = 'magic_essence' // For special drinks
}

export enum ItemCategory {
  STARTER = 'starter',
  MAIN = 'main',
  DESSERT = 'dessert',
  DRINK = 'drink'
}

export enum HeroClass {
  WARRIOR = 'Warrior',
  MAGE = 'Mage',
  ROGUE = 'Rogue',
  CLERIC = 'Cleric'
}

export interface MenuItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number; // Selling price
  cost: Partial<Record<ResourceType, number>>; // Resource cost
  fameRequirement: number;
}

export interface Customer {
  id: string;
  name: string;
  heroClass: HeroClass;
  order?: MenuItem;
  status: 'waiting' | 'seated_ready' | 'eating' | 'leaving';
  patience: number;
  maxPatience: number;
  seatIndex: number; // -1 if waiting in line
  bubbleText?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  effect: (state: GameState) => Partial<GameState>;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  type: 'capacity' | 'speed' | 'marketing';
}

export interface CookingSession {
  customerId: string;
  targetItem: MenuItem;
  addedIngredients: Partial<Record<ResourceType, number>>;
  isComplete: boolean;
}

export interface GameState {
  day: number;
  phase: GamePhase;
  gold: number;
  fame: number; // 1-100
  resources: Record<ResourceType, number>;
  inventory: Record<ResourceType, number>; // What we currently have
  capacity: number;
  customers: Customer[];
  upgrades: Record<string, number>; // upgradeId -> level
  activeEvent: GameEvent | null;
  dayTime: number; // 0 to 100
  dailyLog: string[];
  cookingSession: CookingSession | null;
}