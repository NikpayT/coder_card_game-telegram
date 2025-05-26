// game_state.js - Определение и управление состоянием игры (gameData)

let gameData = {
    message: "Добро пожаловать в игру!",
    collection: [],
    experience: 0,
    level: 1,
    xpToNextLevel: typeof XP_PER_LEVEL_BASE !== 'undefined' ? XP_PER_LEVEL_BASE : 100, // Зависит от game_config.js
    currentXp: 0,
    totalXpEarned: 0,
    partsSold: 0,
    partsBought: 0,
    lastDailyBonusClaim: 0,
    energy: 10,
    maxEnergy: 10,
    energyRecoveryRate: 1,
    lastEnergyRecovery: Date.now(),
    activeBoosters: [],
    history: [],
    achievements: {
        collect_5_unique: { completed: false, reward: 10, name: 'Первооткрыватель', description: 'Собрать 5 уникальных SQL-функций' },
        collect_10_unique: { completed: false, reward: 20, name: 'Юный Базист', description: 'Собрать 10 уникальных SQL-функций' },
        collect_20_unique: { completed: false, reward: 40, name: 'Мастер Запросов', description: 'Собрать 20 уникальных SQL-функций' },
        collect_all_unique: { completed: false, reward: 100, name: 'Великий Сборщик', description: 'Собрать все уникальные SQL-функции' },
        earn_50_xp: { completed: false, reward: 15, name: 'Опытный Кодер', description: 'Заработать 50 опыта' },
        earn_200_xp: { completed: false, reward: 50, name: 'Гуру SQL', description: 'Заработать 200 опыта' },
        sell_5_parts: { completed: false, reward: 10, name: 'Торговец Данными', description: 'Продать 5 SQL-функций' },
        buy_5_parts: { completed: false, reward: 10, name: 'Опытный Покупатель', description: 'Купить 5 SQL-функций' },
        complete_1_project: { completed: false, reward: 25, name: 'Первый Проект', description: 'Завершить 1 проект' },
        complete_3_projects: { completed: false, reward: 50, name: 'Архитектор Баз Данных', description: 'Завершить 3 проекта' },
    },
    projects: [
        { id: 'proj_basic_select', name: 'Базовая выборка данных', description: 'Извлечь все данные из таблицы Customers.', requirements: ['sql_select', 'sql_from'], completed: false, reward_xp: 20 },
        { id: 'proj_filtered_select', name: 'Выборка с фильтром', description: 'Найти продукты дороже 50.', requirements: ['sql_select', 'sql_from', 'sql_where'], completed: false, reward_xp: 35 },
        { id: 'proj_insert_data', name: 'Вставка новой записи', description: 'Добавить нового пользователя в таблицу.', requirements: ['sql_insert_into', 'sql_values'], completed: false, reward_xp: 25 },
        { id: 'proj_update_record', name: 'Обновление записи', description: 'Изменить данные существующей записи.', requirements: ['sql_update', 'sql_set', 'sql_where'], completed: false, reward_xp: 30 },
        { id: 'proj_delete_record', name: 'Удаление записи', description: 'Удалить запись из таблицы.', requirements: ['sql_delete_from', 'sql_where'], completed: false, reward_xp: 20 },
        { id: 'proj_table_join', name: 'Объединение таблиц', description: 'Соединить данные из Customers и Orders.', requirements: ['sql_select', 'sql_from', 'sql_join'], completed: false, reward_xp: 50 },
        { id: 'proj_create_simple_table', name: 'Создание простой таблицы', description: 'Создать таблицу с ID и именем.', requirements: ['sql_create_table', 'sql_int', 'sql_varchar'], completed: false, reward_xp: 40 },
        { id: 'proj_count_records', name: 'Подсчет записей', description: 'Посчитать количество записей в таблице.', requirements: ['sql_select', 'sql_count', 'sql_from'], completed: false, reward_xp: 20 },
        { id: 'proj_aggregate_data', name: 'Агрегация данных', description: 'Вычислить среднюю цену продуктов, сгруппированных по категории.', requirements: ['sql_select', 'sql_avg', 'sql_group_by'], completed: false, reward_xp: 45 }
    ],
    queryConstructionProgress: {},
    currentDbType: 'universal',
    unlockedDbTypes: ['universal'],
    currentView: 'main'
};

// Функции сохранения и загрузки также относятся к управлению состоянием
function saveGameData() {
    try {
        localStorage.setItem('coderGameData', JSON.stringify(gameData));
    } catch (e) {
        console.error("Error saving game data to localStorage:", e);
        // Можно добавить уведомление для пользователя, если сохранение не удалось
        // Например, через Telegram.WebApp.showAlert(), если доступно
    }
}

function loadGameData() {
    const savedData = localStorage.getItem('coderGameData');
    const initialXpToNextLevel = (typeof XP_PER_LEVEL_BASE !== 'undefined') ? XP_PER_LEVEL_BASE : 100;
    const initialXpMultiplier = (typeof XP_PER_LEVEL_MULTIPLIER !== 'undefined') ? XP_PER_LEVEL_MULTIPLIER : 1.2;

    if (savedData) {
        try {
            const loadedGameData = JSON.parse(savedData);
            
            gameData.message = loadedGameData.message ?? "Добро пожаловать обратно!";
            gameData.collection = []; // Будет заполнено позже, когда ALL_CODE_PARTS будет доступен
            gameData.experience = loadedGameData.experience ?? 0;
            gameData.level = loadedGameData.level ?? 1;
            gameData.xpToNextLevel = loadedGameData.xpToNextLevel ?? Math.floor(initialXpToNextLevel * Math.pow(initialXpMultiplier, (gameData.level -1 || 0)));
            gameData.currentXp = loadedGameData.currentXp ?? 0;
            gameData.totalXpEarned = loadedGameData.totalXpEarned ?? 0;
            gameData.partsSold = loadedGameData.partsSold ?? 0;
            gameData.partsBought = loadedGameData.partsBought ?? 0;
            gameData.lastDailyBonusClaim = loadedGameData.lastDailyBonusClaim ?? 0;
            gameData.energy = loadedGameData.energy ?? 10;
            gameData.maxEnergy = loadedGameData.maxEnergy ?? 10;
            gameData.energyRecoveryRate = loadedGameData.energyRecoveryRate ?? 1;
            gameData.lastEnergyRecovery = loadedGameData.lastEnergyRecovery ?? Date.now();
            gameData.activeBoosters = (loadedGameData.activeBoosters || []).filter(b => b.endsAt > Date.now());
            gameData.history = loadedGameData.history || [];

            // Дефолтные значения для ачивок и проектов, если они добавляются в новых версиях
            const defaultAchievements = {
                collect_5_unique: { completed: false, reward: 10, name: 'Первооткрыватель', description: 'Собрать 5 уникальных SQL-функций' },
                collect_10_unique: { completed: false, reward: 20, name: 'Юный Базист', description: 'Собрать 10 уникальных SQL-функций' },
                collect_20_unique: { completed: false, reward: 40, name: 'Мастер Запросов', description: 'Собрать 20 уникальных SQL-функций' },
                collect_all_unique: { completed: false, reward: 100, name: 'Великий Сборщик', description: 'Собрать все уникальные SQL-функции' },
                earn_50_xp: { completed: false, reward: 15, name: 'Опытный Кодер', description: 'Заработать 50 опыта' },
                earn_200_xp: { completed: false, reward: 50, name: 'Гуру SQL', description: 'Заработать 200 опыта' },
                sell_5_parts: { completed: false, reward: 10, name: 'Торговец Данными', description: 'Продать 5 SQL-функций' },
                buy_5_parts: { completed: false, reward: 10, name: 'Опытный Покупатель', description: 'Купить 5 SQL-функций' },
                complete_1_project: { completed: false, reward: 25, name: 'Первый Проект', description: 'Завершить 1 проект' },
                complete_3_projects: { completed: false, reward: 50, name: 'Архитектор Баз Данных', description: 'Завершить 3 проекта' },
            };
            gameData.achievements = { ...defaultAchievements, ...(loadedGameData.achievements || {}) };
            // Применяем только статус completed из сохраненных данных к дефолтной структуре
            for (const achId in defaultAchievements) {
                if (loadedGameData.achievements && loadedGameData.achievements[achId] !== undefined) {
                    gameData.achievements[achId].completed = loadedGameData.achievements[achId].completed;
                }
            }


            const defaultProjects = [
                { id: 'proj_basic_select', name: 'Базовая выборка данных', description: 'Извлечь все данные из таблицы Customers.', requirements: ['sql_select', 'sql_from'], completed: false, reward_xp: 20 },
                { id: 'proj_filtered_select', name: 'Выборка с фильтром', description: 'Найти продукты дороже 50.', requirements: ['sql_select', 'sql_from', 'sql_where'], completed: false, reward_xp: 35 },
                // ... (и остальные проекты)
                 { id: 'proj_insert_data', name: 'Вставка новой записи', description: 'Добавить нового пользователя в таблицу.', requirements: ['sql_insert_into', 'sql_values'], completed: false, reward_xp: 25 },
                { id: 'proj_update_record', name: 'Обновление записи', description: 'Изменить данные существующей записи.', requirements: ['sql_update', 'sql_set', 'sql_where'], completed: false, reward_xp: 30 },
                { id: 'proj_delete_record', name: 'Удаление записи', description: 'Удалить запись из таблицы.', requirements: ['sql_delete_from', 'sql_where'], completed: false, reward_xp: 20 },
                { id: 'proj_table_join', name: 'Объединение таблиц', description: 'Соединить данные из Customers и Orders.', requirements: ['sql_select', 'sql_from', 'sql_join'], completed: false, reward_xp: 50 },
                { id: 'proj_create_simple_table', name: 'Создание простой таблицы', description: 'Создать таблицу с ID и именем.', requirements: ['sql_create_table', 'sql_int', 'sql_varchar'], completed: false, reward_xp: 40 },
                { id: 'proj_count_records', name: 'Подсчет записей', description: 'Посчитать количество записей в таблице.', requirements: ['sql_select', 'sql_count', 'sql_from'], completed: false, reward_xp: 20 },
                { id: 'proj_aggregate_data', name: 'Агрегация данных', description: 'Вычислить среднюю цену продуктов, сгруппированных по категории.', requirements: ['sql_select', 'sql_avg', 'sql_group_by'], completed: false, reward_xp: 45 }
            ];
            const loadedProjectsMap = new Map((loadedGameData.projects || []).map(p => [p.id, p]));
            gameData.projects = defaultProjects.map(defaultProj => {
                const loadedProj = loadedProjectsMap.get(defaultProj.id);
                return loadedProj ? { ...defaultProj, completed: loadedProj.completed } : defaultProj;
            });

            gameData.queryConstructionProgress = loadedGameData.queryConstructionProgress || {};
            gameData.currentView = loadedGameData.currentView || 'main';
            
            gameData.currentDbType = loadedGameData.currentDbType || 'universal';
            gameData.unlockedDbTypes = loadedGameData.unlockedDbTypes && Array.isArray(loadedGameData.unlockedDbTypes) ? loadedGameData.unlockedDbTypes : ['universal'];
            if (!gameData.unlockedDbTypes.includes(gameData.currentDbType)) {
                gameData.currentDbType = gameData.unlockedDbTypes[0] || 'universal';
            }

            // Загрузка коллекции - важно, чтобы ALL_CODE_PARTS был уже определен
            if (typeof ALL_CODE_PARTS !== 'undefined' && ALL_CODE_PARTS) {
                gameData.collection = (loadedGameData.collection || []).map(item => {
                    const fullItemData = ALL_CODE_PARTS.find(part => part.id === item.id);
                    return fullItemData ? { ...fullItemData, count: item.count || 1 } : null;
                }).filter(item => item !== null);
            } else {
                console.warn("ALL_CODE_PARTS not defined during loadGameData's collection processing. This might be an issue with script loading order.");
                // В качестве запасного варианта, если ALL_CODE_PARTS еще не загружен,
                // можно временно сохранить сырые данные коллекции, чтобы попытаться восстановить их позже.
                // Однако, это указывает на проблему с порядком загрузки скриптов.
                gameData.collection = loadedGameData.collection || [];
            }

        } catch (e) {
            console.error("Error parsing saved game data:", e);
            gameData.xpToNextLevel = initialXpToNextLevel; // Сброс к базовому значению
             // Можно также сбросить gameData к полностью дефолтному состоянию
             // resetToDefaultGameData(); // (эту функцию нужно будет создать)
        }
    } else {
        // Если нет сохраненных данных, устанавливаем начальное значение xpToNextLevel
        gameData.xpToNextLevel = initialXpToNextLevel;
    }
}

// Функция для сброса к дефолтным игровым данным (может быть вызвана из loadGameData при ошибке или из resetGameButton)
function resetToDefaultGameData() {
    const initialXpToNextLevel = (typeof XP_PER_LEVEL_BASE !== 'undefined') ? XP_PER_LEVEL_BASE : 100;
    gameData = {
        message: "Игра начата заново! Добро пожаловать! 🚀",
        collection: [], experience: 0, level: 1, xpToNextLevel: initialXpToNextLevel, currentXp: 0,
        totalXpEarned: 0, partsSold: 0, partsBought: 0, lastDailyBonusClaim: 0, energy: 10, maxEnergy: 10,
        energyRecoveryRate: 1, lastEnergyRecovery: Date.now(), activeBoosters: [], history: [],
        achievements: {
            collect_5_unique: { completed: false, reward: 10, name: 'Первооткрыватель', description: 'Собрать 5 уникальных SQL-функций' },
            collect_10_unique: { completed: false, reward: 20, name: 'Юный Базист', description: 'Собрать 10 уникальных SQL-функций' },
            collect_20_unique: { completed: false, reward: 40, name: 'Мастер Запросов', description: 'Собрать 20 уникальных SQL-функций' },
            collect_all_unique: { completed: false, reward: 100, name: 'Великий Сборщик', description: 'Собрать все уникальные SQL-функции' },
            earn_50_xp: { completed: false, reward: 15, name: 'Опытный Кодер', description: 'Заработать 50 опыта' },
            earn_200_xp: { completed: false, reward: 50, name: 'Гуру SQL', description: 'Заработать 200 опыта' },
            sell_5_parts: { completed: false, reward: 10, name: 'Торговец Данными', description: 'Продать 5 SQL-функций' },
            buy_5_parts: { completed: false, reward: 10, name: 'Опытный Покупатель', description: 'Купить 5 SQL-функций' },
            complete_1_project: { completed: false, reward: 25, name: 'Первый Проект', description: 'Завершить 1 проект' },
            complete_3_projects: { completed: false, reward: 50, name: 'Архитектор Баз Данных', description: 'Завершить 3 проекта' },
        },
        projects: [
            { id: 'proj_basic_select', name: 'Базовая выборка данных', description: 'Извлечь все данные из таблицы Customers.', requirements: ['sql_select', 'sql_from'], completed: false, reward_xp: 20 },
            { id: 'proj_filtered_select', name: 'Выборка с фильтром', description: 'Найти продукты дороже 50.', requirements: ['sql_select', 'sql_from', 'sql_where'], completed: false, reward_xp: 35 },
            { id: 'proj_insert_data', name: 'Вставка новой записи', description: 'Добавить нового пользователя в таблицу.', requirements: ['sql_insert_into', 'sql_values'], completed: false, reward_xp: 25 },
            { id: 'proj_update_record', name: 'Обновление записи', description: 'Изменить данные существующей записи.', requirements: ['sql_update', 'sql_set', 'sql_where'], completed: false, reward_xp: 30 },
            { id: 'proj_delete_record', name: 'Удаление записи', description: 'Удалить запись из таблицы.', requirements: ['sql_delete_from', 'sql_where'], completed: false, reward_xp: 20 },
            { id: 'proj_table_join', name: 'Объединение таблиц', description: 'Соединить данные из Customers и Orders.', requirements: ['sql_select', 'sql_from', 'sql_join'], completed: false, reward_xp: 50 },
            { id: 'proj_create_simple_table', name: 'Создание простой таблицы', description: 'Создать таблицу с ID и именем.', requirements: ['sql_create_table', 'sql_int', 'sql_varchar'], completed: false, reward_xp: 40 },
            { id: 'proj_count_records', name: 'Подсчет записей', description: 'Посчитать количество записей в таблице.', requirements: ['sql_select', 'sql_count', 'sql_from'], completed: false, reward_xp: 20 },
            { id: 'proj_aggregate_data', name: 'Агрегация данных', description: 'Вычислить среднюю цену продуктов, сгруппированных по категории.', requirements: ['sql_select', 'sql_avg', 'sql_group_by'], completed: false, reward_xp: 45 }
        ],
        queryConstructionProgress: {},
        currentDbType: 'universal', unlockedDbTypes: ['universal'], currentView: 'main'
    };
    // Также сбрасываем состояние конструктора запросов, если оно хранится вне gameData
    if (typeof currentQueryTaskId !== 'undefined') currentQueryTaskId = null;
    if (typeof currentConstructedQuery !== 'undefined') currentConstructedQuery = [];
}
