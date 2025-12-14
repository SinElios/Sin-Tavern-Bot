import { GameEvent, HeroClass, ItemCategory, MenuItem, ResourceType, Upgrade } from "./types";

export const INITIAL_GOLD = 200;
export const DAY_DURATION_MS = 10000; // 10 seconds per day for the simulation
export const TICK_RATE = 100;

export const RESOURCE_PRICES: Record<ResourceType, { min: number, max: number }> = {
  [ResourceType.FLOUR]: { min: 2, max: 5 },
  [ResourceType.MEAT]: { min: 5, max: 10 },
  [ResourceType.VEGETABLES]: { min: 3, max: 6 },
  [ResourceType.FRUITS]: { min: 4, max: 8 },
  [ResourceType.HOPS]: { min: 3, max: 7 },
  [ResourceType.GRAPES]: { min: 5, max: 12 },
  [ResourceType.MAGIC_ESSENCE]: { min: 10, max: 20 },
};

export const RESOURCE_ICONS: Record<ResourceType, string> = {
  [ResourceType.FLOUR]: '🌾',
  [ResourceType.MEAT]: '🥩',
  [ResourceType.VEGETABLES]: '🥕',
  [ResourceType.FRUITS]: '🍎',
  [ResourceType.HOPS]: '🌿',
  [ResourceType.GRAPES]: '🍇',
  [ResourceType.MAGIC_ESSENCE]: '✨',
};

export const RESOURCE_NAMES: Record<ResourceType, string> = {
  [ResourceType.FLOUR]: 'Мука',
  [ResourceType.MEAT]: 'Мясо',
  [ResourceType.VEGETABLES]: 'Овощи',
  [ResourceType.FRUITS]: 'Фрукты',
  [ResourceType.HOPS]: 'Хмель',
  [ResourceType.GRAPES]: 'Виноград',
  [ResourceType.MAGIC_ESSENCE]: 'Эссенция',
};

export const ITEM_ICONS: Record<ItemCategory, string> = {
  [ItemCategory.STARTER]: '🥣',
  [ItemCategory.MAIN]: '🍗',
  [ItemCategory.DESSERT]: '🍰',
  [ItemCategory.DRINK]: '🍺',
};

export const MENU_ITEMS: MenuItem[] = [
  // Первые блюда (Starters)
  { id: 's1', name: 'Черствый хлеб', category: ItemCategory.STARTER, price: 5, cost: { [ResourceType.FLOUR]: 1 }, fameRequirement: 0 },
  { id: 's2', name: 'Луковый суп', category: ItemCategory.STARTER, price: 8, cost: { [ResourceType.VEGETABLES]: 2 }, fameRequirement: 5 },
  { id: 's3', name: 'Чесночный тост', category: ItemCategory.STARTER, price: 10, cost: { [ResourceType.FLOUR]: 1, [ResourceType.VEGETABLES]: 1 }, fameRequirement: 10 },
  { id: 's4', name: 'Вареное яйцо', category: ItemCategory.STARTER, price: 6, cost: { [ResourceType.MEAT]: 1 }, fameRequirement: 0 },
  { id: 's5', name: 'Легкий салат', category: ItemCategory.STARTER, price: 9, cost: { [ResourceType.VEGETABLES]: 2 }, fameRequirement: 5 },
  { id: 's6', name: 'Костный бульон', category: ItemCategory.STARTER, price: 12, cost: { [ResourceType.MEAT]: 2 }, fameRequirement: 15 },
  { id: 's7', name: 'Сырная тарелка', category: ItemCategory.STARTER, price: 15, cost: { [ResourceType.MEAT]: 1, [ResourceType.FRUITS]: 1 }, fameRequirement: 20 },

  // Вторые блюда (Mains)
  { id: 'm1', name: 'Рагу из крысы', category: ItemCategory.MAIN, price: 15, cost: { [ResourceType.MEAT]: 1, [ResourceType.VEGETABLES]: 1 }, fameRequirement: 0 },
  { id: 'm2', name: 'Жареная курица', category: ItemCategory.MAIN, price: 25, cost: { [ResourceType.MEAT]: 2 }, fameRequirement: 10 },
  { id: 'm3', name: 'Овощной пирог', category: ItemCategory.MAIN, price: 20, cost: { [ResourceType.FLOUR]: 2, [ResourceType.VEGETABLES]: 2 }, fameRequirement: 15 },
  { id: 'm4', name: 'Стейк вепря', category: ItemCategory.MAIN, price: 35, cost: { [ResourceType.MEAT]: 3 }, fameRequirement: 25 },
  { id: 'm5', name: 'Рыба и чипсы', category: ItemCategory.MAIN, price: 30, cost: { [ResourceType.MEAT]: 2, [ResourceType.VEGETABLES]: 1 }, fameRequirement: 20 },
  { id: 'm6', name: 'Чили дракона', category: ItemCategory.MAIN, price: 50, cost: { [ResourceType.MEAT]: 3, [ResourceType.MAGIC_ESSENCE]: 1 }, fameRequirement: 40 },
  { id: 'm7', name: 'Пир Короля', category: ItemCategory.MAIN, price: 80, cost: { [ResourceType.MEAT]: 4, [ResourceType.VEGETABLES]: 2, [ResourceType.FRUITS]: 1 }, fameRequirement: 60 },

  // Десерты (Desserts)
  { id: 'd1', name: 'Яблоко', category: ItemCategory.DESSERT, price: 5, cost: { [ResourceType.FRUITS]: 1 }, fameRequirement: 0 },
  { id: 'd2', name: 'Медовик', category: ItemCategory.DESSERT, price: 15, cost: { [ResourceType.FLOUR]: 1, [ResourceType.FRUITS]: 1 }, fameRequirement: 10 },
  { id: 'd3', name: 'Ягодный тарт', category: ItemCategory.DESSERT, price: 18, cost: { [ResourceType.FLOUR]: 1, [ResourceType.FRUITS]: 2 }, fameRequirement: 15 },
  { id: 'd4', name: 'Сладкий рулет', category: ItemCategory.DESSERT, price: 12, cost: { [ResourceType.FLOUR]: 2 }, fameRequirement: 5 },
  { id: 'd5', name: 'Фруктовый салат', category: ItemCategory.DESSERT, price: 14, cost: { [ResourceType.FRUITS]: 2 }, fameRequirement: 10 },
  { id: 'd6', name: 'Пудинг', category: ItemCategory.DESSERT, price: 20, cost: { [ResourceType.FLOUR]: 1, [ResourceType.MAGIC_ESSENCE]: 1 }, fameRequirement: 30 },
  { id: 'd7', name: 'Амброзия', category: ItemCategory.DESSERT, price: 45, cost: { [ResourceType.FRUITS]: 3, [ResourceType.MAGIC_ESSENCE]: 1 }, fameRequirement: 50 },

  // Напитки (Drinks)
  { id: 'dr1', name: 'Грязная вода', category: ItemCategory.DRINK, price: 2, cost: {}, fameRequirement: 0 },
  { id: 'dr2', name: 'Дешевый эль', category: ItemCategory.DRINK, price: 8, cost: { [ResourceType.HOPS]: 1 }, fameRequirement: 0 },
  { id: 'dr3', name: 'Домашнее вино', category: ItemCategory.DRINK, price: 12, cost: { [ResourceType.GRAPES]: 1 }, fameRequirement: 10 },
  { id: 'dr4', name: 'Медовуха', category: ItemCategory.DRINK, price: 15, cost: { [ResourceType.HOPS]: 1, [ResourceType.FRUITS]: 1 }, fameRequirement: 15 },
  { id: 'dr5', name: 'Дворфийский стаут', category: ItemCategory.DRINK, price: 20, cost: { [ResourceType.HOPS]: 3 }, fameRequirement: 25 },
  { id: 'dr6', name: 'Эльфийское вино', category: ItemCategory.DRINK, price: 30, cost: { [ResourceType.GRAPES]: 3 }, fameRequirement: 40 },
  { id: 'dr7', name: 'Зелье маны', category: ItemCategory.DRINK, price: 50, cost: { [ResourceType.MAGIC_ESSENCE]: 2 }, fameRequirement: 50 },
];

export const UPGRADES: Upgrade[] = [
  { id: 'tables', name: 'Доп. Столы', description: 'Увеличивает вместимость на 2', cost: 100, level: 0, maxLevel: 5, type: 'capacity' },
  { id: 'kitchen', name: 'Кух. Утварь', description: 'Быстрее обслуживает клиентов', cost: 150, level: 0, maxLevel: 3, type: 'speed' },
  { id: 'bard', name: 'Нанять Барда', description: 'Привлекает больше клиентов', cost: 200, level: 0, maxLevel: 3, type: 'marketing' },
];

export const HERO_NAMES: Record<HeroClass, string[]> = {
  [HeroClass.WARRIOR]: ['Грог', 'Бьорн', 'Хильда', 'Тормунд', 'Конан'],
  [HeroClass.MAGE]: ['Мерлин', 'Гэндальф', 'Джайна', 'Медив', 'Еннифэр'],
  [HeroClass.ROGUE]: ['Вакс', 'Гаррет', 'Локи', 'Сомбра', 'Альтаир'],
  [HeroClass.CLERIC]: ['Мойра', 'Андуин', 'Мерси', 'Тиранда', 'Клифф']
};

export const EVENTS: GameEvent[] = [
  {
    id: 'bandits',
    title: 'Набег Бандитов!',
    description: 'Бандиты перехватили вашу повозку. Вы потеряли немного мяса и муки.',
    effect: (state) => ({
      inventory: {
        ...state.inventory,
        [ResourceType.MEAT]: Math.max(0, state.inventory[ResourceType.MEAT] - 5),
        [ResourceType.FLOUR]: Math.max(0, state.inventory[ResourceType.FLOUR] - 5),
      },
      dailyLog: [...state.dailyLog, "Бандиты украли припасы!"]
    })
  },
  {
    id: 'festival',
    title: 'Городской Фестиваль',
    description: 'В городе праздник! Слава таверны растет.',
    effect: (state) => ({
      fame: Math.min(100, state.fame + 10),
      dailyLog: [...state.dailyLog, "Фестиваль принес радость и славу."]
    })
  },
  {
    id: 'rat_infestation',
    title: 'Нашествие Крыс',
    description: 'Крысы съели овощи. Гигиена упала (Слава -5).',
    effect: (state) => ({
      fame: Math.max(0, state.fame - 5),
      inventory: {
        ...state.inventory,
        [ResourceType.VEGETABLES]: Math.max(0, state.inventory[ResourceType.VEGETABLES] - 5)
      },
      dailyLog: [...state.dailyLog, "Крысы заполонили кухню."]
    })
  },
  {
    id: 'noble_visit',
    title: 'Визит Дворянина',
    description: 'Богатый дворянин оставил щедрые чаевые.',
    effect: (state) => ({
      gold: state.gold + 50,
      dailyLog: [...state.dailyLog, "Дворянин пожертвовал 50 золотых."]
    })
  }
];