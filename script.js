// script.js - Основная логика игры "SQL Code Collector Game"

// --- Игровая статистика и состояние ---
let gameData = {
    message: "Добро пожаловать в игру!",
    collection: [],
    experience: 0,
    level: 1,
    xpToNextLevel: XP_PER_LEVEL_BASE,
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
    currentView: 'main'
};

// --- DOM-элементы ---
let gameMessageElement, experienceDisplay, levelDisplay, levelProgressBar, energyDisplay,
    mainButtonsContainer, collectButton, viewCollectionButton, createButton, shopButton,
    dailyBonusButton, achievementsButton, statsButton, projectBoardButton, boostersButton,
    marketButton, historyButton, collectionDisplay, collectionHeader, collectionList,
    backFromCollectionButton, createPanel, backFromCreateButton, shopPanel, buyableItemsList,
    backFromShopButton, marketPanel, marketItemsList, backFromMarketButton, dailyBonusPanel,
    dailyBonusMessage, claimDailyBonusButton, backFromDailyBonusButton, achievementsPanel,
    achievementsList, backFromAchievementsButton, statsPanel, statsUniqueCount,
    statsTotalCount, statsExperienceEarned, statsPartsSold, statsPartsBought,
    backFromStatsButton, projectPanel, projectList, backFromProjectBoardButton,
    boostersPanel, boosterList, backFromBoostersButton, historyPanel, historyLog,
    backFromHistoryButton, resetGameButton, partDetailModal, closePartDetailModal,
    modalPartName, modalPartDescription, modalPartType, modalPartExample, modalPartCount,
    modalSellButton, gameVersionDisplay;

// НОВОЕ: Переменные для панели "Создать Запрос"
let createQueryTaskList, createQueryTaskDescription, createQueryAvailableFunctions,
    createQueryConstructionArea, createQuerySubmitButton, createQueryCurrentTaskFeedback;
let currentQueryTaskId = null;
let currentConstructedQuery = [];


function initializeDOMElements() {
    gameMessageElement = document.getElementById('gameMessage');
    experienceDisplay = document.getElementById('experienceDisplay');
    levelDisplay = document.getElementById('levelDisplay');
    levelProgressBar = document.getElementById('levelProgressBar');
    energyDisplay = document.getElementById('energyDisplay');
    mainButtonsContainer = document.getElementById('mainButtons');
    collectButton = document.getElementById('collectButton');
    viewCollectionButton = document.getElementById('viewCollectionButton');
    createButton = document.getElementById('createButton'); // Кнопка для перехода на панель "Создать Запрос"
    shopButton = document.getElementById('shopButton');
    dailyBonusButton = document.getElementById('dailyBonusButton');
    achievementsButton = document.getElementById('achievementsButton');
    statsButton = document.getElementById('statsButton');
    projectBoardButton = document.getElementById('projectBoardButton');
    boostersButton = document.getElementById('boostersButton');
    marketButton = document.getElementById('marketButton');
    historyButton = document.getElementById('historyButton');
    collectionDisplay = document.getElementById('collectionDisplay');
    collectionHeader = document.getElementById('collectionHeader');
    collectionList = document.getElementById('collectionList');
    backFromCollectionButton = document.getElementById('backFromCollection');

    // НОВОЕ: Инициализация элементов панели "Создать Запрос"
    createPanel = document.getElementById('createPanel');
    createQueryTaskList = document.getElementById('createQueryTaskList');
    createQueryTaskDescription = document.getElementById('createQueryTaskDescription');
    createQueryAvailableFunctions = document.getElementById('createQueryAvailableFunctions');
    createQueryConstructionArea = document.getElementById('createQueryConstructionArea');
    createQuerySubmitButton = document.getElementById('createQuerySubmitButton');
    createQueryCurrentTaskFeedback = document.getElementById('createQueryCurrentTaskFeedback');
    backFromCreateButton = document.getElementById('backFromCreate');


    shopPanel = document.getElementById('shopPanel');
    buyableItemsList = document.getElementById('buyableItemsList');
    backFromShopButton = document.getElementById('backFromShop');
    marketPanel = document.getElementById('marketPanel');
    marketItemsList = document.getElementById('marketItemsList');
    backFromMarketButton = document.getElementById('backFromMarket');
    dailyBonusPanel = document.getElementById('dailyBonusPanel');
    dailyBonusMessage = document.getElementById('dailyBonusMessage');
    claimDailyBonusButton = document.getElementById('claimDailyBonusButton');
    backFromDailyBonusButton = document.getElementById('backFromDailyBonus');
    achievementsPanel = document.getElementById('achievementsPanel');
    achievementsList = document.getElementById('achievementsList');
    backFromAchievementsButton = document.getElementById('backFromAchievements');
    statsPanel = document.getElementById('statsPanel');
    statsUniqueCount = document.getElementById('statsUniqueCount');
    statsTotalCount = document.getElementById('statsTotalCount');
    statsExperienceEarned = document.getElementById('statsExperienceEarned');
    statsPartsSold = document.getElementById('statsPartsSold');
    statsPartsBought = document.getElementById('statsPartsBought');
    backFromStatsButton = document.getElementById('backFromStats');
    projectPanel = document.getElementById('projectPanel');
    projectList = document.getElementById('projectList');
    backFromProjectBoardButton = document.getElementById('backFromProjectBoard');
    boostersPanel = document.getElementById('boostersPanel');
    boosterList = document.getElementById('boosterList');
    backFromBoostersButton = document.getElementById('backFromBoosters');
    historyPanel = document.getElementById('historyPanel');
    historyLog = document.getElementById('historyLog');
    backFromHistoryButton = document.getElementById('backFromHistory');
    resetGameButton = document.getElementById('resetGameButton');
    partDetailModal = document.getElementById('partDetailModal');
    closePartDetailModal = document.getElementById('closePartDetailModal');
    modalPartName = document.getElementById('modalPartName');
    modalPartDescription = document.getElementById('modalPartDescription');
    modalPartType = document.getElementById('modalPartType');
    modalPartExample = document.getElementById('modalPartExample');
    modalPartCount = document.getElementById('modalPartCount');
    modalSellButton = document.getElementById('modalSellButton');
    gameVersionDisplay = document.getElementById('gameVersion');
}

// --- Инициализация Telegram Web App SDK ---
if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    console.log('Telegram WebApp initialized.');
} else {
    console.warn('Telegram WebApp script not loaded or not in Telegram environment. Running in standalone mode.');
}

// --- Управление UI и состояниями ---
function updateUI() {
    if (!gameMessageElement) return;

    gameMessageElement.textContent = gameData.message;
    experienceDisplay.textContent = `🌟 Опыт: ${gameData.experience}`;
    levelDisplay.textContent = `⬆️ Уровень: ${gameData.level} (${gameData.currentXp}/${gameData.xpToNextLevel} XP)`;
    const progressPercentage = (gameData.currentXp / gameData.xpToNextLevel) * 100;
    levelProgressBar.style.width = `${progressPercentage}%`;

    updateEnergy();
    energyDisplay.textContent = `⚡️ Энергия: ${gameData.energy}/${gameData.maxEnergy}`;
    if (gameVersionDisplay && typeof GAME_VERSION !== 'undefined') {
        gameVersionDisplay.textContent = GAME_VERSION;
    }

    const allPanels = [
        mainButtonsContainer, collectionDisplay, createPanel, shopPanel,
        dailyBonusPanel, achievementsPanel, statsPanel, projectPanel,
        boostersPanel, historyPanel, marketPanel
    ];
    allPanels.forEach(panel => { if (panel) panel.style.display = 'none'; });
    if (resetGameButton) resetGameButton.style.display = 'block';

    switch (gameData.currentView) {
        case 'main':
            if (mainButtonsContainer) mainButtonsContainer.style.display = 'grid';
            checkDailyBonusAvailability();
            break;
        case 'collection':
            if (collectionDisplay) collectionDisplay.style.display = 'block';
            renderCollection();
            break;
        case 'create': // ИЗМЕНЕНО
            if (createPanel) createPanel.style.display = 'block';
            renderQueryConstructionPanel();
            break;
        case 'shop':
            if (shopPanel) shopPanel.style.display = 'block';
            renderShopItems();
            break;
        case 'market':
            if (marketPanel) marketPanel.style.display = 'block';
            renderMarketItems();
            break;
        case 'daily_bonus':
            if (dailyBonusPanel) dailyBonusPanel.style.display = 'block';
            checkDailyBonusAvailability();
            break;
        case 'achievements':
            if (achievementsPanel) achievementsPanel.style.display = 'block';
            renderAchievements();
            break;
        case 'stats':
            if (statsPanel) statsPanel.style.display = 'block';
            renderStats();
            break;
        case 'projects':
            if (projectPanel) projectPanel.style.display = 'block';
            renderProjects();
            break;
        case 'boosters':
            if (boostersPanel) boostersPanel.style.display = 'block';
            renderBoosters();
            break;
        case 'history':
            if (historyPanel) historyPanel.style.display = 'block';
            renderHistory();
            break;
    }
    if (collectButton) collectButton.disabled = gameData.energy < ENERGY_CONSUMPTION_PER_ACTION;
}

// --- Рендеринг панелей ---
// (renderCollection, showPartDetails, renderShopItems, renderMarketItems, renderAchievements, renderStats, renderProjects, renderBoosters, renderHistory - без изменений, кроме проверок на существование DOM элементов, которые уже были добавлены)
// ... (Эти функции остаются как в предыдущей версии) ...
function renderCollection() {
    if (!collectionHeader || !collectionList) return;
    const uniquePartsCount = gameData.collection.length;
    const totalPartsCount = (typeof ALL_CODE_PARTS !== 'undefined') ? ALL_CODE_PARTS.length : 0;
    collectionHeader.textContent = `Моя коллекция SQL: (${uniquePartsCount}/${totalPartsCount})`;

    if (gameData.collection.length === 0) {
        collectionList.innerHTML = '<p style="text-align: center; width: 100%; color: var(--light-text-color);">Пока ничего нет...</p>';
    } else {
        collectionList.innerHTML = '';
        const sortedCollection = [...gameData.collection].sort((a, b) => a.name.localeCompare(b.name));

        sortedCollection.forEach(item => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-item-main">
                    <span class="list-item-name">${item.emoji || '❓'} ${item.name}</span>
                    <span class="list-item-description">В наличии: x${item.count}</span>
                </div>
                <button class="item-action-button sell-button">Продать (1 🌟)</button>
            `;
            div.querySelector('.list-item-main').onclick = () => showPartDetails(item.id, 'collection');
            const sellBtn = div.querySelector('.sell-button');
            sellBtn.onclick = (event) => {
                 event.stopPropagation();
                 sellPart(item.id);
            };
            collectionList.appendChild(div);
        });
    }
}

function showPartDetails(partId, sourcePanel) {
    if (typeof ALL_CODE_PARTS === 'undefined') return;
    const part = ALL_CODE_PARTS.find(p => p.id === partId);
    const collectedPart = gameData.collection.find(item => item.id === partId);

    if (part && modalPartName) { // Добавил проверку modalPartName
        modalPartName.textContent = `${part.emoji || '❓'} ${part.name}`;
        if (modalPartDescription) modalPartDescription.textContent = part.description || 'Нет описания.';
        if (modalPartType) modalPartType.textContent = part.type || 'Неизвестно';
        if (modalPartExample) modalPartExample.textContent = part.example || 'Пример недоступен.';
        if (modalPartCount) modalPartCount.textContent = collectedPart ? collectedPart.count : 0;

        if (modalSellButton) {
            modalSellButton.onclick = null;
            if (sourcePanel === 'collection' && collectedPart && collectedPart.count > 0) {
                modalSellButton.style.display = 'block';
                modalSellButton.onclick = () => {
                    sellPart(part.id);
                    const updatedCollectedPart = gameData.collection.find(item => item.id === part.id);
                    if (!updatedCollectedPart || updatedCollectedPart.count === 0) {
                        if (partDetailModal) partDetailModal.style.display = 'none';
                    } else {
                        if (modalPartCount) modalPartCount.textContent = updatedCollectedPart.count;
                    }
                    updateUI();
                };
            } else {
                modalSellButton.style.display = 'none';
            }
        }
        if (partDetailModal) partDetailModal.style.display = 'flex';
    } else {
        gameData.message = "Ошибка: Детали функции не найдены или модальное окно не готово.";
        updateUI();
    }
}

if (typeof closePartDetailModal !== 'undefined' && closePartDetailModal) {
    closePartDetailModal.onclick = () => {
        if (partDetailModal) partDetailModal.style.display = 'none';
    };
}
window.onclick = (event) => {
    if (event.target === partDetailModal) {
        if (partDetailModal) partDetailModal.style.display = 'none';
    }
};


function renderShopItems() {
    if (!buyableItemsList || typeof ALL_CODE_PARTS === 'undefined') return;
    const buyableParts = ALL_CODE_PARTS.filter(part => {
        return !gameData.collection.some(item => item.id === part.id);
    });

    if (buyableParts.length === 0) {
        buyableItemsList.innerHTML = '<p style="text-align: center; width: 100%; color: var(--light-text-color);">Все доступные функции собраны! 🏆</p>';
    } else {
        buyableItemsList.innerHTML = '';
        const sortedBuyableParts = [...buyableParts].sort((a, b) => a.name.localeCompare(b.name));

        sortedBuyableParts.forEach(item => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-item-main">
                    <span class="list-item-name">${item.emoji || '❓'} ${item.name}</span>
                    <span class="list-item-description">Тип: ${item.type || 'Неизвестно'}</span>
                </div>
                <button class="item-action-button buy-button" data-item-id="${item.id}">Купить (${PART_PRICE} 🌟)</button>
            `;
            const buyButton = div.querySelector('.buy-button');
            buyButton.disabled = gameData.experience < PART_PRICE;
            buyButton.onclick = (event) => {
                event.stopPropagation();
                buyPart(item.id);
            };
            div.querySelector('.list-item-main').onclick = () => showPartDetails(item.id, 'shop');
            buyableItemsList.appendChild(div);
        });
    }
}

function renderMarketItems() {
    if (!marketItemsList || typeof ALL_CODE_PARTS === 'undefined' || typeof RARITIES === 'undefined') return;
    const rareParts = ALL_CODE_PARTS.filter(part =>
        part.rarity && part.rarity !== 'common' &&
        !gameData.collection.some(item => item.id === part.id)
    );

    if (rareParts.length === 0) {
        marketItemsList.innerHTML = '<p style="text-align: center; width: 100%; color: var(--light-text-color);">На рынке пока нет редких функций, или вы уже собрали их все!</p>';
    } else {
        marketItemsList.innerHTML = '';
        const sortedRareParts = [...rareParts].sort((a, b) => a.name.localeCompare(b.name));

        sortedRareParts.forEach(item => {
            const rarityInfo = RARITIES[item.rarity] || { price: PART_PRICE, chance: 0, name: 'Неизвестная' };
            const marketPrice = rarityInfo.price;

            const div = document.createElement('div');
            div.className = 'list-item market-item';
            div.innerHTML = `
                <div class="list-item-main">
                    <span class="list-item-name">${item.emoji || '❓'} ${item.name}</span>
                    <span class="list-item-description">Редкость: ${rarityInfo.name}</span>
                </div>
                <button class="item-action-button market-buy-button" data-item-id="${item.id}">Купить (${marketPrice} 🌟)</button>
            `;
            const buyButton = div.querySelector('.market-buy-button');
            buyButton.disabled = gameData.experience < marketPrice;
            buyButton.onclick = (event) => {
                event.stopPropagation();
                buyPartFromMarket(item.id, marketPrice);
            };
            div.querySelector('.list-item-main').onclick = () => showPartDetails(item.id, 'market');
            marketItemsList.appendChild(div);
        });
    }
}

function renderAchievements() {
    if (!achievementsList) return;
    achievementsList.innerHTML = '';
    const allAchievements = Object.values(gameData.achievements);
    const sortedAchievements = allAchievements.sort((a, b) => {
        if (a.completed === b.completed) {
            return (a.name || "").localeCompare(b.name || "");
        }
        return a.completed ? 1 : -1;
    });

    sortedAchievements.forEach(ach => {
        const isCompleted = ach.completed;
        const div = document.createElement('div');
        div.className = `achievement-item ${isCompleted ? 'completed' : ''}`;
        div.innerHTML = `
            <div>
                <strong>${ach.name || 'Название достижения'}</strong><br>
                <span>${ach.description || 'Описание отсутствует.'}</span>
            </div>
            ${isCompleted ? '<span>✓ Получено!</span>' : ''}
        `;
        achievementsList.appendChild(div);
    });
    if (allAchievements.length === 0) {
         achievementsList.innerHTML = '<p style="text-align: center; width: 100%; color: var(--light-text-color);">Список достижений пуст.</p>';
    }
}

function renderStats() {
    if (!statsUniqueCount || !statsTotalCount || !statsExperienceEarned || !statsPartsSold || !statsPartsBought) return;
    statsUniqueCount.textContent = gameData.collection.length;
    const totalParts = gameData.collection.reduce((sum, item) => sum + (item.count || 0), 0);
    statsTotalCount.textContent = totalParts;
    statsExperienceEarned.textContent = gameData.totalXpEarned;
    statsPartsSold.textContent = gameData.partsSold;
    statsPartsBought.textContent = gameData.partsBought;
}

function renderProjects() {
    if (!projectList || typeof ALL_CODE_PARTS === 'undefined') return;
    projectList.innerHTML = '';
    const incompleteProjects = gameData.projects.filter(p => !p.completed);
    const completedProjects = gameData.projects.filter(p => p.completed);

    incompleteProjects.sort((a, b) => (a.reward_xp || 0) - (b.reward_xp || 0));

    [...incompleteProjects, ...completedProjects].forEach(project => {
        const div = document.createElement('div');
        div.className = `project-item ${project.completed ? 'completed' : ''}`;

        let requirementsHtml = '<ul>';
        let allRequirementsMet = true;
        (project.requirements || []).forEach(reqId => {
            const requiredPart = ALL_CODE_PARTS.find(p => p.id === reqId);
            const hasPart = gameData.collection.some(item => item.id === reqId && item.count > 0);
            const metClass = hasPart ? 'requirement-met' : '';
            if (!hasPart) allRequirementsMet = false;
            requirementsHtml += `<li class="${metClass}">${(requiredPart && requiredPart.emoji) || '❓'} ${requiredPart ? (requiredPart.name || 'Неизвестно') : 'Неизвестная функция'} ${hasPart ? '✓' : '✗'}</li>`;
        });
        requirementsHtml += '</ul>';

        div.innerHTML = `
            <h4>${project.name || 'Название проекта'}</h4>
            <p>${project.description || 'Описание проекта отсутствует.'}</p>
            <p><strong>Требования:</strong></p>
            ${requirementsHtml}
            <p><strong>Награда:</strong> ${project.reward_xp || 0} 🌟</p>
            ${project.completed ? '<p style="color: var(--primary-color); font-weight: bold;">Проект завершен!</p>' :
            `<button class="project-action-button secondary-button" data-project-id="${project.id}" ${!allRequirementsMet ? 'disabled' : ''}>Завершить проект</button>`}
        `;

        if (!project.completed) {
            const completeButton = div.querySelector('.project-action-button');
            if (completeButton) {
                completeButton.onclick = () => completeProject(project.id);
            }
        }
        projectList.appendChild(div);
    });

    if (gameData.projects.length === 0) {
         projectList.innerHTML = '<p style="text-align: center; width: 100%; color: var(--light-text-color);">Нет доступных проектов.</p>';
    } else if (incompleteProjects.length === 0 && completedProjects.length > 0) {
         projectList.innerHTML += '<p style="text-align: center; width: 100%; color: var(--light-text-color); margin-top: 20px;">Все доступные проекты завершены! Ждите новых!</p>';
    }
}

function renderBoosters() {
    if (!boosterList || typeof BOOSTERS === 'undefined') return;
    boosterList.innerHTML = '';
    if (BOOSTERS.length === 0) {
         boosterList.innerHTML = '<p style="text-align: center; width: 100%; color: var(--light-text-color);">Список бустеров пуст.</p>';
         return;
    }
    BOOSTERS.forEach(booster => {
        const div = document.createElement('div');
        div.className = 'booster-item';
        const isActive = gameData.activeBoosters.some(b => b.id === booster.id && b.endsAt > Date.now());
        const currentBooster = gameData.activeBoosters.find(b => b.id === booster.id);

        div.innerHTML = `
            <div>
                <strong>${booster.name || 'Название бустера'}</strong><br>
                <span>${booster.description || 'Нет описания.'}</span><br>
                ${isActive && currentBooster ? `<span style="color:var(--primary-color); font-weight: bold;">Активен! Осталось: ${formatTime(currentBooster.endsAt - Date.now())}</span>` : ''}
            </div>
            <button data-booster-id="${booster.id}" ${gameData.experience < (booster.cost || 0) || isActive ? 'disabled' : ''}>Купить (${booster.cost || 0} 🌟)</button>
        `;
        const buyButton = div.querySelector('button');
        if (buyButton) {
            buyButton.onclick = () => buyBooster(booster.id);
        }
        boosterList.appendChild(div);
    });
}

function renderHistory() {
    if (!historyLog) return;
    if (gameData.history.length === 0) {
        historyLog.innerHTML = '<p style="text-align: center; width: 100%; color: var(--light-text-color);">Ваша история действий пуста.</p>';
    } else {
        historyLog.innerHTML = '';
        const recentHistory = gameData.history.slice(-20).reverse();
        recentHistory.forEach(entry => {
            const date = new Date(entry.timestamp);
            const timeString = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            const div = document.createElement('div');
            div.className = 'history-entry';
            div.textContent = `[${timeString}] ${entry.message}`;
            historyLog.appendChild(div);
        });
    }
}

// --- Логика игры (продолжение) ---
// (addExperience, checkLevelUp, checkAchievements, buyPart, buyPartFromMarket, sellPart, updateEnergy, checkDailyBonusAvailability, claimDailyBonus, completeProject, buyBooster, cleanExpiredBoosters, addHistoryEntry, formatTime, handleStudyFunction - остаются как в предыдущей полной версии)
// ... (эти функции были в предыдущем полном варианте script.js) ...

function addExperience(amount) {
    let actualAmount = amount;
    const xpBooster = gameData.activeBoosters.find(b => b.id === 'xp_boost' && b.endsAt > Date.now());
    if (xpBooster && xpBooster.effect && typeof xpBooster.effect.value === 'number') {
        actualAmount *= xpBooster.effect.value;
    }
    actualAmount = Math.round(actualAmount); // Округляем опыт

    gameData.experience += actualAmount;
    gameData.currentXp += actualAmount;
    gameData.totalXpEarned += actualAmount;

    checkLevelUp();
    checkAchievements();
}

function checkLevelUp() {
    while (gameData.currentXp >= gameData.xpToNextLevel) {
        gameData.currentXp -= gameData.xpToNextLevel;
        gameData.level++;
        gameData.xpToNextLevel = Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_PER_LEVEL_MULTIPLIER, gameData.level - 1));
        gameData.maxEnergy++;
        gameData.energy = gameData.maxEnergy;
        gameData.message = `Поздравляем! Вы достигли Уровня ${gameData.level}! 🎉 Максимальная энергия увеличена до ${gameData.maxEnergy}!`;
        addHistoryEntry(`Уровень повышен до ${gameData.level}!`);
    }
}

function checkAchievements() {
    if (typeof ALL_CODE_PARTS === 'undefined') return;
    const uniquePartsCount = gameData.collection.length;
    const completedProjectsCount = gameData.projects.filter(p => p.completed).length;

    for (const achId in gameData.achievements) {
        const ach = gameData.achievements[achId];
        if (!ach.completed) {
            let meetsCondition = false;
            const requiredCountMatch = achId.match(/\d+/);
            const requiredCount = requiredCountMatch ? parseInt(requiredCountMatch[0]) : 0;

            switch (achId) {
                case 'collect_5_unique':
                case 'collect_10_unique':
                case 'collect_20_unique':
                    if (uniquePartsCount >= requiredCount) meetsCondition = true;
                    break;
                case 'collect_all_unique':
                    if (uniquePartsCount >= ALL_CODE_PARTS.length) meetsCondition = true;
                    break;
                case 'earn_50_xp':
                case 'earn_200_xp':
                    if (gameData.totalXpEarned >= requiredCount) meetsCondition = true;
                    break;
                case 'sell_5_parts':
                    if (gameData.partsSold >= 5) meetsCondition = true;
                    break;
                case 'buy_5_parts':
                    if (gameData.partsBought >= 5) meetsCondition = true;
                    break;
                case 'complete_1_project':
                case 'complete_3_projects':
                    if (completedProjectsCount >= requiredCount) meetsCondition = true;
                    break;
            }

            if (meetsCondition) {
                ach.completed = true;
                addExperience(ach.reward || 0);
                gameData.message = `Достижение "${ach.name}" получено! (+${ach.reward || 0} 🌟)`;
                addHistoryEntry(`Получено достижение: "${ach.name}"`);
            }
        }
    }
}


function buyPart(partId) {
    if (typeof ALL_CODE_PARTS === 'undefined') return;
    if (gameData.experience < PART_PRICE) {
        gameData.message = 'Недостаточно опыта для покупки! 🚫';
        updateUI();
        return;
    }

    const partToBuy = ALL_CODE_PARTS.find(part => part.id === partId);
    if (!partToBuy) {
        gameData.message = 'Ошибка: функция не найдена.';
        updateUI();
        return;
    }

    const existingPart = gameData.collection.find(item => item.id === partId);

    if (!existingPart) {
        gameData.collection.push({...partToBuy, count: 1});
    } else {
        existingPart.count++;
    }

    gameData.experience -= PART_PRICE;
    gameData.partsBought++;
    gameData.message = `Вы купили ${partToBuy.emoji || '❓'} ${partToBuy.name}! (-${PART_PRICE} 🌟)`;
    addHistoryEntry(`Куплена функция: ${partToBuy.name}`);
    checkAchievements();
    updateUI();
}

function buyPartFromMarket(partId, price) {
    if (typeof ALL_CODE_PARTS === 'undefined') return;
    if (gameData.experience < price) {
        gameData.message = 'Недостаточно опыта для покупки! 🚫';
        updateUI();
        return;
    }

    const partToBuy = ALL_CODE_PARTS.find(part => part.id === partId);
    if (!partToBuy) {
        gameData.message = 'Ошибка: функция не найдена.';
        updateUI();
        return;
    }

    const existingPart = gameData.collection.find(item => item.id === partId);
    if (existingPart) {
         gameData.message = `${partToBuy.emoji || '❓'} ${partToBuy.name} уже есть в вашей коллекции!`;
         updateUI();
         return;
    }

    gameData.collection.push({...partToBuy, count: 1});
    gameData.experience -= price;
    gameData.partsBought++;
    gameData.message = `Вы купили редкую функцию ${partToBuy.emoji || '❓'} ${partToBuy.name} на рынке! (-${price} 🌟)`;
    addHistoryEntry(`Куплена редкая функция: ${partToBuy.name} за ${price} 🌟`);
    checkAchievements();
    updateUI();
}

function sellPart(partId) {
    const existingPartIndex = gameData.collection.findIndex(item => item.id === partId);

    if (existingPartIndex !== -1) {
        const existingPart = gameData.collection[existingPartIndex];
        if (existingPart.count > 1) {
            existingPart.count--;
            gameData.message = `Вы продали ${existingPart.emoji || '❓'} ${existingPart.name}! Теперь у вас их ${existingPart.count}. (+${PART_PRICE} 🌟)`;
        } else {
            gameData.collection.splice(existingPartIndex, 1);
            gameData.message = `Вы продали последнюю ${existingPart.emoji || '❓'} ${existingPart.name}! (+${PART_PRICE} 🌟)`;
        }
        gameData.experience += PART_PRICE;
        gameData.partsSold++;
        addHistoryEntry(`Продана функция: ${existingPart.name}`);
        checkAchievements();
    } else {
        gameData.message = 'Ошибка: этой функции нет в вашей коллекции для продажи.';
    }
    updateUI();
}

function updateEnergy() {
    const now = Date.now();
    const timeElapsed = now - gameData.lastEnergyRecovery;
    const energyToRecover = Math.floor(timeElapsed / ENERGY_RECOVERY_INTERVAL_MS) * gameData.energyRecoveryRate;

    if (energyToRecover > 0) {
        gameData.energy = Math.min(gameData.maxEnergy, gameData.energy + energyToRecover);
        gameData.lastEnergyRecovery += Math.floor(energyToRecover / gameData.energyRecoveryRate) * ENERGY_RECOVERY_INTERVAL_MS;
    }
}

function checkDailyBonusAvailability() {
    const now = Date.now();
    if (!dailyBonusMessage || !claimDailyBonusButton) return;

    if (now - gameData.lastDailyBonusClaim >= DAILY_BONUS_COOLDOWN_MS) {
        dailyBonusMessage.textContent = `Ваш ежедневный бонус готов! Получите ${DAILY_BONUS_AMOUNT} опыта.`;
        claimDailyBonusButton.disabled = false;
    } else {
        const timeLeftMs = DAILY_BONUS_COOLDOWN_MS - (now - gameData.lastDailyBonusClaim);
        dailyBonusMessage.textContent = `Следующий бонус через: ${formatTime(timeLeftMs)}`;
        claimDailyBonusButton.disabled = true;
    }
}

function claimDailyBonus() {
    const now = Date.now();
    if (now - gameData.lastDailyBonusClaim >= DAILY_BONUS_COOLDOWN_MS) {
        addExperience(DAILY_BONUS_AMOUNT);
        gameData.lastDailyBonusClaim = now;
        gameData.message = `Вы получили ежедневный бонус! (+${DAILY_BONUS_AMOUNT} 🌟)`;
        addHistoryEntry(`Получен ежедневный бонус: +${DAILY_BONUS_AMOUNT} 🌟`);
        updateUI();
    } else {
        gameData.message = 'Ежедневный бонус пока недоступен.';
        updateUI();
    }
}

function completeProject(projectId) {
    const project = gameData.projects.find(p => p.id === projectId);
    if (!project || project.completed) {
        gameData.message = 'Ошибка: проект недоступен или уже завершен.';
        updateUI();
        return;
    }

    const allRequirementsMet = (project.requirements || []).every(reqId =>
        gameData.collection.some(item => item.id === reqId && item.count > 0)
    );

    if (allRequirementsMet) {
        project.completed = true;
        addExperience(project.reward_xp || 0);
        gameData.message = `Проект "${project.name}" завершен! Награда: ${project.reward_xp || 0} 🌟!`;
        addHistoryEntry(`Завершен проект: "${project.name}"`);
        checkAchievements();
        updateUI();
    } else {
        gameData.message = 'У вас нет всех необходимых функций для завершения этого проекта.';
        updateUI();
    }
}

function buyBooster(boosterId) {
    if (typeof BOOSTERS === 'undefined') return;
    const booster = BOOSTERS.find(b => b.id === boosterId);
    if (!booster) return;

    if (gameData.experience < (booster.cost || 0)) {
        gameData.message = 'Недостаточно опыта для покупки бустера! 🚫';
        updateUI();
        return;
    }

    if (booster.duration && gameData.activeBoosters.some(b => b.id === booster.id && b.endsAt > Date.now())) {
         gameData.message = `${booster.name} уже активен!`;
         updateUI();
         return;
    }
    if (!booster.duration && booster.effect && booster.effect.type === 'energy_refill' && gameData.energy === gameData.maxEnergy) {
         gameData.message = 'Энергия уже полная, бустер не нужен!';
         updateUI();
         return;
    }

    gameData.experience -= (booster.cost || 0);
    gameData.message = `Вы купили "${booster.name}"! (-${booster.cost || 0} 🌟)`;
    addHistoryEntry(`Куплен бустер: "${booster.name}" за ${booster.cost || 0} 🌟`);


    if (booster.effect && (booster.effect.type === 'xp_multiplier' || booster.effect.type === 'rare_chance') && booster.duration) {
        gameData.activeBoosters.push({
            id: booster.id,
            endsAt: Date.now() + booster.duration,
            effect: booster.effect
        });
        gameData.message += ` Активен ${formatTime(booster.duration)}!`;
    } else if (booster.effect && booster.effect.type === 'energy_refill' && typeof booster.effect.value === 'number') {
        gameData.energy = Math.min(gameData.maxEnergy, gameData.energy + booster.effect.value);
        gameData.message += ` Энергия пополнена на ${booster.effect.value} ⚡️!`;
    }
    updateUI();
}

function cleanExpiredBoosters() {
    gameData.activeBoosters = gameData.activeBoosters.filter(b => b.endsAt > Date.now());
}

function addHistoryEntry(text) {
    gameData.history.push({ timestamp: Date.now(), message: text });
    if (gameData.history.length > 50) {
        gameData.history = gameData.history.slice(gameData.history.length - 50);
    }
}

function formatTime(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}ч ${minutes}м`;
    if (minutes > 0) return `${minutes}м ${seconds}с`;
    return `${seconds}с`;
}

function handleStudyFunction() {
    if (gameData.energy < ENERGY_CONSUMPTION_PER_ACTION) {
        gameData.message = 'Недостаточно энергии для изучения! 😴';
        updateUI();
        return;
    }

    gameData.energy -= ENERGY_CONSUMPTION_PER_ACTION;
    addHistoryEntry(`Использовано ${ENERGY_CONSUMPTION_PER_ACTION} энергии для изучения.`);

    let foundPart = null;
    const rareChanceBooster = gameData.activeBoosters.find(b => b.id === 'find_chance_boost' && b.endsAt > Date.now());
    let currentRareChanceModifier = (rareChanceBooster && rareChanceBooster.effect && typeof rareChanceBooster.effect.value === 'number') ? rareChanceBooster.effect.value : 0;

    const weightedParts = [];
    if (typeof ALL_CODE_PARTS !== 'undefined' && typeof RARITIES !== 'undefined') {
        ALL_CODE_PARTS.forEach(part => {
            const rarityDef = RARITIES[part.rarity] || RARITIES.common;
            let baseChance = rarityDef.chance;
            if (part.rarity && part.rarity !== 'common') {
                baseChance = Math.min(1.0, baseChance + currentRareChanceModifier);
            }
            for (let i = 0; i < Math.round(baseChance * 1000); i++) {
                weightedParts.push(part);
            }
        });
    }

    if (weightedParts.length === 0 && typeof ALL_CODE_PARTS !== 'undefined' && ALL_CODE_PARTS.length > 0) {
        const commonParts = ALL_CODE_PARTS.filter(p => p.rarity === 'common');
        foundPart = commonParts.length > 0 ? commonParts[Math.floor(Math.random() * commonParts.length)] : ALL_CODE_PARTS[0];
    } else if (weightedParts.length > 0) {
        foundPart = weightedParts[Math.floor(Math.random() * weightedParts.length)];
    } else {
         foundPart = { id: 'default_error', name: 'Неизвестная функция', emoji: '❓', description: '', example: '', type: '', rarity: 'common' };
    }

    const existingPart = gameData.collection.find(item => item.id === foundPart.id);

    if (!existingPart) {
        gameData.collection.push({...foundPart, count: 1});
        addExperience(1);
        gameData.message = `Вы изучили новую SQL-функцию! 🎉 ${foundPart.emoji || '❓'} ${foundPart.name} (+1 🌟)`;
        addHistoryEntry(`Изучена новая SQL-функция: ${foundPart.name}`);
    }
    else {
        existingPart.count++;
        addExperience(1);
        gameData.message = `Вы изучили ${foundPart.emoji || '❓'} ${foundPart.name} (уже изучена)! Теперь у вас их ${existingPart.count}. (+1 🌟)`;
        addHistoryEntry(`Повторно изучена функция: ${foundPart.name} (x${existingPart.count})`);
    }
    checkAchievements();
    updateUI();
}


// --- Функции для Механики "Создать Запрос" --- // НОВОЕ / ИЗМЕНЕНО
function renderQueryConstructionPanel() {
    if (!createPanel || typeof QUERY_CONSTRUCTION_TASKS === 'undefined' || typeof ALL_CODE_PARTS === 'undefined') {
        if (createPanel) createPanel.innerHTML = '<p>Ошибка загрузки данных для конструктора запросов.</p>';
        return;
    }
    if (!createQueryTaskList || !createQueryTaskDescription || !createQueryAvailableFunctions || !createQueryConstructionArea || !createQuerySubmitButton || !createQueryCurrentTaskFeedback) {
         // Это сообщение теперь будет в HTML по умолчанию, если элементы не найдены
        console.warn("Не все DOM элементы для конструктора запросов найдены. HTML структура верна?");
        const placeholderDiv = createPanel.querySelector('div'); // Ищем первый div внутри createPanel
        if (placeholderDiv && !placeholderDiv.id.startsWith('createQuery')) { // Убедимся, что это не один из наших целевых div
             placeholderDiv.innerHTML = `<p>Интерфейс создания запросов в разработке. Ожидайте!</p>`;
        } else if (createPanel.firstChild.nodeName === "#text" || createPanel.children.length < 2) { // Если панель почти пуста
            createPanel.innerHTML = '<h3>Создание SQL-запроса:</h3><p>Интерфейс создания запросов в разработке. Ожидайте!</p><button id="backFromCreate" class="secondary-button" style="margin-top: 20px;">Назад</button>';
            // Перепривязываем кнопку "Назад", если она была затерта
            backFromCreateButton = document.getElementById('backFromCreate');
            if (backFromCreateButton) backFromCreateButton.addEventListener('click', () => setGameView('main'));
        }
        return;
    }

    // 1. Отображение списка заданий
    createQueryTaskList.innerHTML = '';
    let hasUncompletedTasks = false;
    QUERY_CONSTRUCTION_TASKS.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'query-task-list-item';
        taskItem.textContent = task.name;
        taskItem.dataset.taskId = task.id;
        if (gameData.queryConstructionProgress[task.id]) {
            taskItem.classList.add('completed-task');
        } else {
            hasUncompletedTasks = true;
        }
        if (task.id === currentQueryTaskId) {
            taskItem.classList.add('active-task');
        }
        taskItem.onclick = () => {
            if (!gameData.queryConstructionProgress[task.id]) { // Можно выбирать только невыполненные или текущее для пересмотра
                currentQueryTaskId = task.id;
                currentConstructedQuery = []; // Сбрасываем собранный запрос при смене задания
                if (createQueryCurrentTaskFeedback) createQueryCurrentTaskFeedback.textContent = ''; // Очищаем фидбек
                if (createQueryCurrentTaskFeedback) createQueryCurrentTaskFeedback.className = '';
                renderQueryConstructionPanel(); // Перерисовать всю панель
            }
        };
        createQueryTaskList.appendChild(taskItem);
    });

    if (!hasUncompletedTasks && QUERY_CONSTRUCTION_TASKS.length > 0) {
        createQueryTaskList.innerHTML += '<p style="text-align:center; margin-top:10px; color:var(--primary-color);">Все задания по созданию запросов выполнены! 🎉</p>';
    }


    // 2. Отображение текущего задания
    const currentTask = QUERY_CONSTRUCTION_TASKS.find(t => t.id === currentQueryTaskId);
    if (currentTask) {
        createQueryTaskDescription.innerHTML = `<h4>${currentTask.name}</h4><p>${currentTask.description}</p>`;
        createQuerySubmitButton.disabled = false;

        // 3. Отображение доступных функций и значений для текущего задания
        createQueryAvailableFunctions.innerHTML = '';
        // Доступные ключевые слова (изученные игроком и подходящие для задания)
        // Для упрощения пока показываем все изученные функции. Позже можно фильтровать по task.requiredFunctions или по контексту.
        gameData.collection.forEach(collectedFunc => {
            const funcData = ALL_CODE_PARTS.find(f => f.id === collectedFunc.id);
            if (funcData) {
                const btn = document.createElement('button');
                btn.className = 'available-function-btn';
                btn.innerHTML = `${funcData.emoji || ''} ${funcData.name}`;
                btn.onclick = () => addElementToQuery('keyword', funcData.name.split('(')[0].trim(), funcData.id); // Берем только сам оператор без ()
                createQueryAvailableFunctions.appendChild(btn);
            }
        });

        // Доступные таблицы (из задания)
        if (currentTask.availableTables && currentTask.availableTables.length > 0) {
            currentTask.availableTables.forEach(tableName => {
                const btn = document.createElement('button');
                btn.className = 'available-value-btn';
                btn.style.backgroundColor = '#61AFEF'; // Голубой для таблиц
                btn.textContent = tableName;
                btn.onclick = () => addElementToQuery('table', tableName);
                createQueryAvailableFunctions.appendChild(btn);
            });
        }
        // Доступные колонки (из задания, для текущей выбранной таблицы, если есть)
        // Это можно усложнить: показывать колонки только после выбора FROM table
        if (currentTask.availableColumns) {
             // Пока упрощенно - все колонки всех таблиц задания
            for (const tableName in currentTask.availableColumns) {
                currentTask.availableColumns[tableName].forEach(columnName => {
                     const btn = document.createElement('button');
                    btn.className = 'available-value-btn';
                    btn.style.backgroundColor = '#98C379'; // Зеленый для колонок
                    btn.textContent = columnName;
                    btn.onclick = () => addElementToQuery('column', columnName);
                    createQueryAvailableFunctions.appendChild(btn);
                });
            }
        }
        // Кнопка для '*'
        const starBtn = document.createElement('button');
        starBtn.className = 'available-value-btn';
        starBtn.textContent = '*';
        starBtn.onclick = () => addElementToQuery('value', '*');
        createQueryAvailableFunctions.appendChild(starBtn);

        // Кнопка для ввода текстового значения (например, для WHERE ... = 'текст')
        const textValueBtn = document.createElement('button');
        textValueBtn.className = 'available-value-btn';
        textValueBtn.textContent = "'текст'";
        textValueBtn.onclick = () => {
            const val = prompt("Введите текстовое значение (без кавычек):");
            if (val !== null && val.trim() !== "") {
                addElementToQuery('value', `'${val.trim()}'`); // Добавляем кавычки
            }
        };
        createQueryAvailableFunctions.appendChild(textValueBtn);

        // Кнопка для ввода числового значения
        const numValueBtn = document.createElement('button');
        numValueBtn.className = 'available-value-btn';
        numValueBtn.textContent = "число";
        numValueBtn.onclick = () => {
            const val = prompt("Введите числовое значение:");
            if (val !== null && !isNaN(parseFloat(val)) && isFinite(val)) {
                addElementToQuery('value', parseFloat(val));
            } else if (val !== null) {
                alert("Пожалуйста, введите корректное число.");
            }
        };
        createQueryAvailableFunctions.appendChild(numValueBtn);


    } else {
        createQueryTaskDescription.innerHTML = `<p>Выберите задание из списка или все задания выполнены.</p>`;
        createQueryAvailableFunctions.innerHTML = '';
        if(createQuerySubmitButton) createQuerySubmitButton.disabled = true;
    }

    // 4. Отображение собираемого запроса
    renderConstructedQuery();
}

function selectQueryTaskFromList(taskId) {
    if (!gameData.queryConstructionProgress[taskId]) {
        currentQueryTaskId = taskId;
        currentConstructedQuery = [];
        if (createQueryCurrentTaskFeedback) {
            createQueryCurrentTaskFeedback.textContent = '';
            createQueryCurrentTaskFeedback.className = '';
        }
        renderQueryConstructionPanel();
    }
}


function selectNextQueryTask() {
    if (typeof QUERY_CONSTRUCTION_TASKS === 'undefined') return;
    // currentQueryTaskId = null; // Не сбрасываем здесь, чтобы при первом заходе не было пусто
    // currentConstructedQuery = []; // Сбрасывается при явном выборе задания

    let firstUncompletedTask = null;
    for (const task of QUERY_CONSTRUCTION_TASKS) {
        if (!gameData.queryConstructionProgress[task.id]) {
            firstUncompletedTask = task;
            break;
        }
    }

    if (firstUncompletedTask) {
        // Если текущее задание уже есть и оно не выполнено, оставляем его.
        // Иначе, если текущего нет или оно выполнено, ставим первое невыполненное.
        if (!currentQueryTaskId || gameData.queryConstructionProgress[currentQueryTaskId]) {
            currentQueryTaskId = firstUncompletedTask.id;
            currentConstructedQuery = []; // Сброс для нового задания
             if (createQueryCurrentTaskFeedback) { // Очистка фидбека при авто-выборе
                createQueryCurrentTaskFeedback.textContent = '';
                createQueryCurrentTaskFeedback.className = '';
            }
        }
    } else {
        // Все задания выполнены
        if (currentQueryTaskId && !gameData.queryConstructionProgress[currentQueryTaskId]) {
            // Остаемся на текущем невыполненном, если такое есть (хотя логика выше должна была это покрыть)
        } else {
            currentQueryTaskId = null; // Явно указываем, что активных нет
            currentConstructedQuery = [];
        }
    }
}

function addElementToQuery(type, value, originalId = null) {
    currentConstructedQuery.push({ type, value, originalId });
    renderConstructedQuery();
}

function renderConstructedQuery() {
    if (!createQueryConstructionArea) return;
    createQueryConstructionArea.innerHTML = currentConstructedQuery.map((el, index) => {
        let displayValue = el.value;
        if (el.type === 'keyword' && el.originalId && typeof ALL_CODE_PARTS !== 'undefined') {
            const funcData = ALL_CODE_PARTS.find(f => f.id === el.originalId);
            displayValue = funcData ? `${funcData.emoji || ''} ${funcData.name.split('(')[0].trim()}` : el.value;
        } else if (Array.isArray(el.value)) {
            displayValue = el.value.join(', ');
        }
        return `<span class="query-element query-element-${el.type}" data-index="${index}" title="Кликните для удаления">${displayValue}</span>`;
    }).join(' ');

    createQueryConstructionArea.querySelectorAll('.query-element').forEach(span => {
        span.onclick = (e) => {
            const index = parseInt(e.target.dataset.index);
            if (!isNaN(index) && index >= 0 && index < currentConstructedQuery.length) {
                currentConstructedQuery.splice(index, 1);
                renderConstructedQuery();
            }
        };
    });
}


function handleSubmitConstructedQuery() {
    if (!currentQueryTaskId || typeof QUERY_CONSTRUCTION_TASKS === 'undefined' || !createQueryCurrentTaskFeedback) {
        if (createQueryCurrentTaskFeedback) {
            createQueryCurrentTaskFeedback.textContent = "Нет активного задания для проверки.";
            createQueryCurrentTaskFeedback.className = 'feedback-error';
        }
        return;
    }
    const task = QUERY_CONSTRUCTION_TASKS.find(t => t.id === currentQueryTaskId);
    if (!task) {
        createQueryCurrentTaskFeedback.textContent = "Ошибка: текущее задание не найдено.";
        createQueryCurrentTaskFeedback.className = 'feedback-error';
        return;
    }

    // Упрощенная логика проверки
    let allRequiredFunctionsUsed = (task.requiredFunctions || []).every(reqFuncId =>
        currentConstructedQuery.some(el => el.originalId === reqFuncId && el.type === 'keyword')
    );

    let structureMatches = true;
    let feedbackMessage = "";

    if (task.targetQueryStructure) {
        let queryPartIndex = 0; // Индекс в currentConstructedQuery
        for (const targetPart of task.targetQueryStructure) {
            const currentQueryPart = currentConstructedQuery[queryPartIndex];

            if (!currentQueryPart || currentQueryPart.value.toUpperCase() !== targetPart.keyword.toUpperCase()) {
                structureMatches = false;
                feedbackMessage = `Ожидался оператор '${targetPart.keyword}', но найден другой или конец запроса.`;
                break;
            }
            queryPartIndex++; // Переходим к значению оператора

            // Проверка значения для оператора
            if (targetPart.value) {
                const valueToMatch = targetPart.value;
                let actualValueParts = [];
                // Собираем все части значения до следующего ключевого слова или конца запроса
                while(queryPartIndex < currentConstructedQuery.length && currentConstructedQuery[queryPartIndex].type !== 'keyword') {
                    actualValueParts.push(currentConstructedQuery[queryPartIndex].value);
                    queryPartIndex++;
                }

                let valueMatched = false;
                if (Array.isArray(valueToMatch)) { // Если ожидается массив значений (например, список столбцов)
                    // Простая проверка: все ли ожидаемые значения присутствуют в фактических
                    valueMatched = valueToMatch.every(vtm => actualValueParts.some(avp => String(avp).toUpperCase() === String(vtm).toUpperCase()));
                    if (!valueMatched) feedbackMessage = `Проверьте значения для оператора '${targetPart.keyword}'. Ожидалось что-то вроде: ${valueToMatch.join(', ')}.`;
                } else { // Если ожидается одно значение
                    const singleActualValue = actualValueParts.join(' '); // Если значение было разбито на части, объединяем
                    if (String(singleActualValue).toUpperCase() === String(valueToMatch).toUpperCase()) {
                        valueMatched = true;
                    } else {
                       feedbackMessage = `Проверьте значение для оператора '${targetPart.keyword}'. Ожидалось: '${valueToMatch}'.`;
                    }
                }
                if (!valueMatched) {
                    structureMatches = false;
                    break;
                }
            }
             // Если у targetPart нет value, значит это просто ключевое слово, и мы его уже проверили.
        }
        // Проверка, что в построенном запросе нет лишних ключевых слов в конце
        if (structureMatches && queryPartIndex < currentConstructedQuery.length && currentConstructedQuery.slice(queryPartIndex).some(el => el.type === 'keyword')) {
            structureMatches = false;
            feedbackMessage = "Кажется, в вашем запросе есть лишние операторы в конце.";
        }

    } else { // Если targetQueryStructure не определен, считаем, что достаточно проверки requiredFunctions
        structureMatches = true; // или false, в зависимости от того, как это должно работать
    }


    if (structureMatches && allRequiredFunctionsUsed) {
        createQueryCurrentTaskFeedback.textContent = `Отлично! Запрос "${task.name}" выполнен! +${task.rewardXp || 0} 🌟`;
        createQueryCurrentTaskFeedback.className = 'feedback-success';
        gameData.queryConstructionProgress[currentQueryTaskId] = true;
        addExperience(task.rewardXp || 0);
        addHistoryEntry(`Задание на создание запроса "${task.name}" выполнено.`);

        const oldTaskId = currentQueryTaskId; // Сохраняем ID выполненного задания
        selectNextQueryTask(); // Выбираем следующее задание

        if (currentQueryTaskId === oldTaskId || !currentQueryTaskId) { // Если следующего задания нет или это было последнее
             // renderQueryConstructionPanel вызовет обновление списка и покажет, что все выполнено
        }
        renderQueryConstructionPanel(); // Обновляем всю панель
    } else {
        createQueryCurrentTaskFeedback.className = 'feedback-error';
        if (!allRequiredFunctionsUsed) {
            createQueryCurrentTaskFeedback.textContent = `Не все необходимые SQL-операторы были использованы. ${feedbackMessage}`;
        } else {
            createQueryCurrentTaskFeedback.textContent = `Запрос не совсем верный. ${feedbackMessage} Попробуйте еще раз!`;
        }
    }
    updateUI();
}


// --- Сохранение/Загрузка игры ---
// ... (Эти функции остаются как в предыдущей версии) ...
function setGameView(view) {
    gameData.currentView = view;
    if (view === 'create') { // ИЗМЕНЕНО: При переходе на панель создания
        if (!currentQueryTaskId || gameData.queryConstructionProgress[currentQueryTaskId]) {
             // Если текущее задание не выбрано ИЛИ текущее задание уже выполнено, выбираем следующее
            selectNextQueryTask();
        }
        // В любом случае, при заходе на вкладку, сбрасываем текущий собираемый запрос и фидбек,
        // если задание уже было выбрано, но пользователь мог уйти и вернуться.
        currentConstructedQuery = [];
        if (createQueryCurrentTaskFeedback) {
            createQueryCurrentTaskFeedback.textContent = '';
            createQueryCurrentTaskFeedback.className = '';
        }
    }
    updateUI();
}

function setupEventListeners() {
    if (!collectButton) return;

    collectButton.addEventListener('click', handleStudyFunction);
    viewCollectionButton.addEventListener('click', () => setGameView('collection'));
    createButton.addEventListener('click', () => setGameView('create'));
    shopButton.addEventListener('click', () => setGameView('shop'));
    dailyBonusButton.addEventListener('click', () => setGameView('daily_bonus'));
    achievementsButton.addEventListener('click', () => setGameView('achievements'));
    statsButton.addEventListener('click', () => setGameView('stats'));
    projectBoardButton.addEventListener('click', () => setGameView('projects'));
    boostersButton.addEventListener('click', () => setGameView('boosters'));
    marketButton.addEventListener('click', () => setGameView('market'));
    historyButton.addEventListener('click', () => setGameView('history'));

    backFromCollectionButton.addEventListener('click', () => setGameView('main'));
    if (backFromCreateButton) backFromCreateButton.addEventListener('click', () => setGameView('main')); // ИЗМЕНЕНО: проверка
    backFromShopButton.addEventListener('click', () => setGameView('main'));
    backFromMarketButton.addEventListener('click', () => setGameView('main'));
    backFromDailyBonusButton.addEventListener('click', () => setGameView('main'));
    backFromAchievementsButton.addEventListener('click', () => setGameView('main'));
    backFromStatsButton.addEventListener('click', () => setGameView('main'));
    backFromProjectBoardButton.addEventListener('click', () => setGameView('main'));
    backFromBoostersButton.addEventListener('click', () => setGameView('main'));
    backFromHistoryButton.addEventListener('click', () => setGameView('main'));

    if (claimDailyBonusButton) claimDailyBonusButton.addEventListener('click', claimDailyBonus);
    // НОВОЕ: слушатель для кнопки проверки запроса
    if (createQuerySubmitButton) createQuerySubmitButton.addEventListener('click', handleSubmitConstructedQuery);


    resetGameButton.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите начать игру заново? Все данные будут удалены!')) {
            localStorage.removeItem('coderGameData');
            const initialXpToNextLevel = (typeof XP_PER_LEVEL_BASE !== 'undefined') ? XP_PER_LEVEL_BASE : 100;
            gameData = {
                message: "Игра начата заново! Добро пожаловать! 🚀",
                collection: [],
                experience: 0,
                level: 1,
                xpToNextLevel: initialXpToNextLevel,
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
                currentView: 'main'
            };
            currentQueryTaskId = null; // Сбрасываем текущее задание при ресете
            currentConstructedQuery = [];
            updateUI();
            if (window.Telegram && window.Telegram.WebApp) {
                window.location.reload();
            } else {
                location.reload();
            }
        }
    });
}

function saveGameData() {
    try {
        localStorage.setItem('coderGameData', JSON.stringify(gameData));
    } catch (e) {
        console.error("Error saving game data to localStorage:", e);
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
            gameData.collection = []; // Будет заполнено ниже, если есть ALL_CODE_PARTS
            gameData.experience = loadedGameData.experience ?? 0;
            gameData.level = loadedGameData.level ?? 1;
            gameData.xpToNextLevel = loadedGameData.xpToNextLevel ?? Math.floor(initialXpToNextLevel * Math.pow(initialXpMultiplier, (gameData.level -1)));
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

            // Загрузка достижений
            const defaultAchievements = JSON.parse(JSON.stringify(gameData.achievements));
            gameData.achievements = defaultAchievements;
            if (loadedGameData.achievements) {
                for (const achId in gameData.achievements) {
                    if (loadedGameData.achievements[achId] !== undefined) {
                        gameData.achievements[achId].completed = loadedGameData.achievements[achId].completed;
                    }
                }
            }

            // Загрузка проектов
            const defaultProjects = JSON.parse(JSON.stringify(gameData.projects));
            const loadedProjectsMap = new Map((loadedGameData.projects || []).map(p => [p.id, p]));
            gameData.projects = defaultProjects.map(defaultProj => {
                const loadedProj = loadedProjectsMap.get(defaultProj.id);
                return loadedProj ? { ...defaultProj, completed: loadedProj.completed } : defaultProj;
            });

            gameData.queryConstructionProgress = loadedGameData.queryConstructionProgress || {};
            gameData.currentView = loadedGameData.currentView || 'main';

            // Загрузка коллекции после того, как ALL_CODE_PARTS точно определен
            if (typeof ALL_CODE_PARTS !== 'undefined') {
                gameData.collection = (loadedGameData.collection || []).map(item => {
                    const fullItemData = ALL_CODE_PARTS.find(part => part.id === item.id);
                    return fullItemData ? { ...fullItemData, count: item.count || 1 } : null;
                }).filter(item => item !== null);
            } else {
                 // Это состояние не должно возникать при правильном порядке загрузки скриптов
                console.warn("ALL_CODE_PARTS not defined during loadGameData's collection processing. Collection will be empty.");
                gameData.collection = [];
            }


        } catch (e) {
            console.error("Error parsing saved game data:", e);
            gameData.xpToNextLevel = initialXpToNextLevel;
        }
    } else {
        gameData.xpToNextLevel = initialXpToNextLevel;
    }
}

// --- Инициализация при старте ---
document.addEventListener('DOMContentLoaded', () => {
    // Порядок важен: сначала данные, потом DOM, потом слушатели, потом UI
    loadGameData();        // Загружаем сохраненные данные ИГРЫ (gameData)
    initializeDOMElements(); // Инициализируем ссылки на DOM элементы
    setupEventListeners();   // Настраиваем слушатели событий (которые могут зависеть от DOM)
    selectNextQueryTask();   // Выбираем первое задание для конструктора, если есть
    updateEnergy();        // Обновляем энергию
    cleanExpiredBoosters();// Очищаем истекшие бустеры
    updateUI();            // Обновляем UI в первый раз

    if (gameMessageElement && gameData.currentView === 'main' && (gameData.message === "Добро пожаловать в игру!" || gameData.message === "Добро пожаловать обратно!")) {
         gameMessageElement.textContent = `Добро пожаловать обратно! У вас ${gameData.experience} 🌟`;
    }
});

// Auto-save and updates
setInterval(saveGameData, 5000);
setInterval(() => {
    updateEnergy();
    cleanExpiredBoosters();
    if (typeof gameMessageElement !== 'undefined' && gameMessageElement) {
        if (['daily_bonus', 'boosters', 'main', 'create'].includes(gameData.currentView)) {
             updateUI();
        } else {
            if (energyDisplay) energyDisplay.textContent = `⚡️ Энергия: ${gameData.energy}/${gameData.maxEnergy}`;
            if (collectButton) collectButton.disabled = gameData.energy < ENERGY_CONSUMPTION_PER_ACTION;
        }
    }
}, 1000);
