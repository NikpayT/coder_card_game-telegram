// game_config.js - Конфигурация и константы игры

const PART_PRICE = 1;
const XP_PER_LEVEL_BASE = 100;
const XP_PER_LEVEL_MULTIPLIER = 1.2;
const DAILY_BONUS_AMOUNT = 5;
const DAILY_BONUS_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const ENERGY_CONSUMPTION_PER_ACTION = 1;
const ENERGY_RECOVERY_INTERVAL_MS = 60 * 1000;

const RARITIES = {
    common: { chance: 0.5, price: 1, name: 'Обычная' },
    uncommon: { chance: 0.3, price: 3, name: 'Необычная' },
    rare: { chance: 0.15, price: 5, name: 'Редкая' },
    epic: { chance: 0.04, price: 10, name: 'Эпическая' },
    legendary: { chance: 0.01, price: 20, name: 'Легендарная' }
};

const BOOSTERS = [
    { id: 'xp_boost', name: 'Бустер опыта (x2)', description: 'Удвоенный опыт за изучение на 5 минут.', cost: 5, duration: 5 * 60 * 1000, effect: { type: 'xp_multiplier', value: 2 } },
    { id: 'energy_boost', name: 'Бустер энергии', description: 'Мгновенное восстановление 5 энергии.', cost: 3, effect: { type: 'energy_refill', value: 5 } },
    { id: 'find_chance_boost', name: 'Бустер удачи (+10% редких)', description: 'Повышает шанс найти редкие функции на 10% на 5 минут.', cost: 7, duration: 5 * 60 * 1000, effect: { type: 'rare_chance', value: 0.1 } }
];

const GAME_VERSION = "0.6.4"; // Обновим версию

// НОВОЕ: Типы баз данных
const DATABASE_TYPES = [
    { id: 'universal', name: 'Стандарт SQL', emoji: '🌍', description: 'Функции, общие для большинства СУБД.' },
    { id: 'postgresql', name: 'PostgreSQL', emoji: '🐘', description: 'Функции и особенности PostgreSQL.' },
    { id: 'mysql', name: 'MySQL', emoji: '🐬', description: 'Функции и особенности MySQL.' },
    { id: 'sqlserver', name: 'SQL Server', emoji: '🪟', description: 'Функции и особенности MS SQL Server.' },
    { id: 'oracle', name: 'Oracle', emoji: '🅾️', description: 'Функции и особенности Oracle Database.' }
];
