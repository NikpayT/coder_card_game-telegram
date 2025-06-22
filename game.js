import { competitors, simulateCompetitors } from './competitors.js';
import {
    COMPONENTS,
    COLORS,
    SPECIAL_FEATURES,
    BUNDLED_ACCESSORIES,
    STANDALONE_ACCESSORIES,
    RESEARCH_PROJECTS,
    MARKETING_CAMPAIGNS,
    ALL_TRENDS
} from './gameData.js';

document.addEventListener('DOMContentLoaded', () => {

    const SAVE_KEY = 'phoneTycoonSave';

    const initialGameState = {
        money: 100000,
        date: new Date(2023, 0, 1),
        phones: [],
        standaloneAccessories: [],
        retailPartnerships: [],
        brandAwareness: 5,
        totalProfit: 0,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        xpMultiplier: 1.0,
        logoLevel: 0,
        brandAwarenessBonus: 0,
        activeCampaigns: [],
        trends: { current: [], upcoming: [] },
        maxSalesLifecycle: 70,
        research: { activeProject: null, progress: 0, completed: [] },
        unlockedTech: { cpu: 1, ram: 1, storage: 1, screen: 1, mainCamera: 1, battery: 1, body: 1 },
        activeScreenId: 'design-screen',
        competitionSort: { key: 'money', direction: 'desc' },
        currentAccessoryId: null,
    };

    let gameState = { ...initialGameState };
    let gameInterval = null;


    let moneyEl, dateEl, screens, navButtons,
        componentSelectorsEl, accessoryCheckboxesEl,
        salesListEl, accessoriesListEl, researchListEl, statsContentEl, trendsContentEl,
        phoneColorSelect, specialFeatureSelect,
        preview, salesInfo, campaignsListEl, partnershipsListEl,
        modalOverlays, productionModalOverlay, partnershipModalOverlay, accessoryProductionModalOverlay,
        productionQuantityInput, phonePriceInput, totalProductionCostEl, confirmProductionBtn,
        playerLevelEl, playerXpEl, playerXpNextEl, xpBarEl, logoDisplayEl,
        competitionTableBody, competitionTableHeader,
        settingsScreen, saveGameBtn, loadGameBtn, resetGameBtn, saveStatusEl,
        showProductionModalBtn, openPartnershipModalBtn, confirmPartnershipBtn; // Добавлены переменные для кнопок модалок


    let simulationTick = 0;

    function init() {
        moneyEl = document.getElementById('money');
        dateEl = document.getElementById('date');
        screens = document.querySelectorAll('.screen');
        navButtons = document.querySelectorAll('.nav-btn');

        componentSelectorsEl = document.getElementById('component-selectors');
        accessoryCheckboxesEl = document.getElementById('accessory-checkboxes');
        phoneColorSelect = document.getElementById('phone-color');
        specialFeatureSelect = document.getElementById('special-feature');
        preview = {
            performance: document.getElementById('preview-performance'),
            camera: document.getElementById('preview-camera'),
            battery: document.getElementById('preview-battery'),
            design: document.getElementById('preview-design'),
            cost: document.getElementById('preview-cost'),
        };
        showProductionModalBtn = document.getElementById('show-production-modal-btn'); // Находим кнопку

        salesListEl = document.getElementById('sales-list');
        salesInfo = {
            totalProfit: document.getElementById('total-profit'),
            brandAwareness: document.getElementById('brand-awareness'),
        };
        openPartnershipModalBtn = document.getElementById('open-partnership-modal-btn'); // Находим кнопку

        accessoriesListEl = document.getElementById('accessories-list');

        campaignsListEl = document.getElementById('campaigns-list');
        partnershipsListEl = document.getElementById('partnerships-list');

        statsContentEl = document.getElementById('stats-content');
        logoDisplayEl = document.getElementById('logo-display');

        trendsContentEl = document.getElementById('trends-content');

        researchListEl = document.getElementById('research-list');
        // document.getElementById('current-research-status');

        competitionTableBody = document.querySelector('#competition-table tbody');
        competitionTableHeader = document.querySelector('#competition-table thead');

        settingsScreen = document.getElementById('settings-screen');
        saveGameBtn = document.getElementById('save-game-btn');
        loadGameBtn = document.getElementById('load-game-btn');
        resetGameBtn = document.getElementById('reset-game-btn');
        saveStatusEl = document.getElementById('save-status');


        modalOverlays = document.querySelectorAll('.modal-overlay');
        productionModalOverlay = document.getElementById('production-modal-overlay');
        partnershipModalOverlay = document.getElementById('partnership-modal-overlay');
        accessoryProductionModalOverlay = document.getElementById('accessory-production-modal-overlay');

        productionQuantityInput = document.getElementById('production-quantity');
        phonePriceInput = document.getElementById('phone-price');
        totalProductionCostEl = document.getElementById('total-production-cost');
        confirmProductionBtn = document.getElementById('confirm-production-btn');
        confirmPartnershipBtn = document.getElementById('confirm-partnership-btn'); // Находим кнопку подтверждения партнерства

        playerLevelEl = document.getElementById('player-level');
        playerXpEl = document.getElementById('player-xp');
        playerXpNextEl = document.getElementById('player-xp-next');
        xpBarEl = document.getElementById('xp-bar');


        const loaded = loadGame();

        if (!loaded) {
            updateTrends();
            const defaultScreen = document.getElementById('design-screen');
            const defaultNavBtn = document.querySelector('.nav-btn[data-screen="design-screen"]');
            if(defaultScreen) defaultScreen.classList.add('active');
            if(defaultNavBtn) defaultNavBtn.classList.add('active');
        } else {
             const activeScreen = document.getElementById(gameState.activeScreenId);
             if(activeScreen) {
                 screens.forEach(s => s.classList.remove('active'));
                 activeScreen.classList.add('active');
                 navButtons.forEach(b => {
                     b.classList.remove('active');
                     if (b.dataset.screen === gameState.activeScreenId) {
                         b.classList.add('active');
                     }
                 });
             } else {
                 console.warn(`Saved screen ID "${gameState.activeScreenId}" not found. Defaulting to design screen.`);
                 const defaultScreen = document.getElementById('design-screen');
                 const defaultNavBtn = document.querySelector('.nav-btn[data-screen="design-screen"]');
                 if(defaultScreen) defaultScreen.classList.add('active');
                 if(defaultNavBtn) defaultNavBtn.classList.add('active');
                 gameState.activeScreenId = 'design-screen';
             }
        }

        populateAllSelectors();
        setupEventListeners(); // Теперь слушатели модалок и меню привязываются здесь
        renderUI();
        startGameLoop();
    }

     function saveGame() {
        try {
            const currentActiveScreen = document.querySelector('.screen.active');
             if (currentActiveScreen) {
                 gameState.activeScreenId = currentActiveScreen.id;
             } else {
                 gameState.activeScreenId = 'design-screen';
             }

            const accessoryModalTitle = accessoryProductionModalOverlay ? accessoryProductionModalOverlay.querySelector('h3') : null;
             gameState.currentAccessoryId = (accessoryProductionModalOverlay && accessoryProductionModalOverlay.style.display === 'flex' && accessoryModalTitle) ?
                                            accessoryModalTitle.dataset.accessoryId :
                                            null;


            const stateToSave = {
                ...gameState,
                date: gameState.date.toISOString(),
            };

            localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));

            if (saveStatusEl) {
                saveStatusEl.textContent = `Игра сохранена: ${new Date().toLocaleTimeString('ru-RU')}`;
                saveStatusEl.style.color = var_to_css_color('--success-color');
            }
            console.log("Игра сохранена успешно!");
        } catch (e) {
             if (saveStatusEl) {
                 saveStatusEl.textContent = `Ошибка сохранения: ${e.message}`;
                 saveStatusEl.style.color = var_to_css_color('--error-color');
             }
            console.error("Ошибка сохранения игры:", e);
            alert("Ошибка при сохранении игры. Возможно, недостаточно места в хранилище браузера.");
        }
     }

     function loadGame() {
        try {
            const savedState = localStorage.getItem(SAVE_KEY);

            if (!savedState) {
                console.log("Сохранение не найдено. Начинаем новую игру.");
                 if (saveStatusEl) {
                     saveStatusEl.textContent = 'Сохранение не найдено.';
                     saveStatusEl.style.color = var_to_css_color('--text-secondary-color');
                 }
                return false;
            }

            const loadedState = JSON.parse(savedState);

            loadedState.date = new Date(loadedState.date);

            gameState = { ...initialGameState, ...loadedState };

            if (!gameState.competitionSort) {
                gameState.competitionSort = { key: 'money', direction: 'desc' };
            }


            console.log("Игра загружена успешно!", gameState);
             if (saveStatusEl) {
                 saveStatusEl.textContent = `Игра загружена: ${new Date().toLocaleTimeString('ru-RU')}`;
                 saveStatusEl.style.color = var_to_css_color('--success-color');
             }
            return true;

        } catch (e) {
            console.error("Ошибка загрузки игры:", e);
            alert("Ошибка при загрузке игры. Возможно, файл сохранения поврежден. Будет начата новая игра.");
            localStorage.removeItem(SAVE_KEY);
             if (saveStatusEl) {
                  saveStatusEl.textContent = 'Ошибка загрузки. Сохранение удалено.';
                  saveStatusEl.style.color = var_to_css_color('--error-color');
             }
            gameState = { ...initialGameState };
            return false;
        }
     }

     function resetGame() {
        const confirmed = confirm("Вы уверены, что хотите сбросить все сохранения? Все ваш прогресс будет потерян!");

        if (confirmed) {
            try {
                localStorage.removeItem(SAVE_KEY);
                 if (saveStatusEl) {
                      saveStatusEl.textContent = 'Сохранение удалено.';
                      saveStatusEl.style.color = var_to_css_color('--success-color');
                 }
                alert("Все сохранения удалены. Игра будет перезагружена.");
                window.location.reload();
            } catch (e) {
                 if (saveStatusEl) {
                     saveStatusEl.textContent = `Ошибка сброса: ${e.message}`;
                     saveStatusEl.style.color = var_to_css_color('--error-color');
                 }
                 console.error("Ошибка сброса игры:", e);
                 alert("Произошла ошибка при сбросе сохранений.");
            }
        }
     }


    function startGameLoop() {
        if (!gameInterval) {
             gameInterval = setInterval(update, 500);
        }
    }

    function update() {
        gameState.date.setDate(gameState.date.getDate() + 1);
        simulationTick++;
        updateMarketing(); updateResearch();
        calculatePhoneSales(); calculateAccessorySales(); calculatePartnershipSales();
        if (simulationTick % 7 === 0) {
             simulateCompetitors();
             if (document.getElementById('competition-screen') && document.getElementById('competition-screen').classList.contains('active')) {
                renderCompetitionScreen();
             }
        }
        gameState.phones.forEach(phone => { if (phone.isActive) { phone.daysOnMarket++; if (phone.daysOnMarket > gameState.maxSalesLifecycle) phone.isActive = false; } });
        if (gameState.date.getDate() === 1 && [0, 3, 6, 9].includes(gameState.date.getMonth())) updateTrends();
        renderUI();
        if (simulationTick % 30 === 0) {
             saveGame();
        }
    }

    function updateResearch() {
        if (!gameState.research.activeProject) {
            return;
        }
        gameState.research.progress++;
        const project = RESEARCH_PROJECTS.find(p => p.id === gameState.research.activeProject);
         if (!project) {
              console.error(`Active research project with ID "${gameState.research.activeProject}" not found.`);
              gameState.research.activeProject = null;
              gameState.research.progress = 0;
              return;
         }
        if (gameState.research.progress >= project.time) {
            completeResearch(project);
        }
    }

    function calculatePhoneSales() {
        gameState.phones.forEach(phone => {
            if (!phone.isActive || phone.stock <= 0) {
                return;
            }
            const idealPrice = phone.totalCost * 2;
            const priceFactor = Math.pow(idealPrice / phone.price, 2);
            const baseDemand = (gameState.brandAwareness / 5) * priceFactor;
            const qualityScore = (phone.performance + phone.camera + phone.battery + phone.design) / 4;
            const qualityFactor = Math.max(0.1, qualityScore / 70);
            let trendBonus = 1.0;
            gameState.trends.current.forEach(trend => {
                 if (trend && typeof trend.check === 'function' && typeof trend.strength === 'number') {
                    if (trend.check(phone)) {
                        trendBonus += trend.strength;
                    }
                 }
            });
             const dailyDemandVariation = Math.random() * 0.4 + 0.8;
            let unitsSold = Math.floor(baseDemand * qualityFactor * trendBonus * dailyDemandVariation);
            const actualUnitsSold = Math.min(unitsSold, phone.stock);
            if (actualUnitsSold > 0) {
                const revenue = actualUnitsSold * phone.price;
                const profit = actualUnitsSold * (phone.price - phone.totalCost);
                gameState.money += revenue;
                gameState.totalProfit += profit;
                phone.stock -= actualUnitsSold;
                phone.sales.units += actualUnitsSold;
                phone.sales.revenue += revenue;
                phone.sales.profit += profit;
                addXP(actualUnitsSold * phone.totalCost / 10 * gameState.xpMultiplier);
            }
        });
    }

    function calculateAccessorySales() {
        gameState.standaloneAccessories.forEach(acc => {
            if (!acc.stock || acc.stock <= 0) {
                return;
            }
            const accData = STANDALONE_ACCESSORIES.find(a => a.id === acc.id);
            if (!accData) {
                 console.error("Accessory data not found for ID in STANDALONE_ACCESSORIES:", acc.id);
                 return;
            }
            const idealPrice = accData.cost * 2.5;
            const priceFactor = Math.pow(idealPrice / acc.price, 2);
            const baseDemand = (gameState.brandAwareness / 10) * priceFactor * (accData.demand || 1);
             const dailyDemandVariation = Math.random() * 0.5 + 0.75;
            let unitsSold = Math.floor(baseDemand * dailyDemandVariation);
            const actualUnitsSold = Math.min(unitsSold, acc.stock);
            if (actualUnitsSold > 0) {
                const revenue = actualUnitsSold * acc.price;
                const profit = actualUnitsSold * (acc.price - accData.cost);
                gameState.money += revenue;
                gameState.totalProfit += profit;
                acc.stock -= actualUnitsSold;
                addXP(actualUnitsSold * accData.cost / 15 * gameState.xpMultiplier);
            }
        });
    }

    function calculatePartnershipSales() {
        gameState.retailPartnerships.forEach(deal => {
            if (deal.stock <= 0) {
                return;
            }
            const phone = gameState.phones.find(p => p.id === deal.phoneId);
            if (!phone) {
                deal.stock = 0;
                console.warn(`Partnership deal for phone ID ${deal.phoneId} found, but phone does not exist. Ending deal.`);
                return;
            }
            // Use the price defined in the deal, not the current phone price
            const dealPrice = deal.phonePrice || phone.price;
            const idealPrice = phone.totalCost * 2; // Ideal price based on phone cost
            const priceFactor = Math.pow(idealPrice / dealPrice, 2); // Price factor based on deal price
            const qualityScore = (phone.performance + phone.camera + phone.battery + phone.design) / 4;
            const qualityFactor = Math.max(0.1, qualityScore / 70);
            const RETAIL_BONUS = 1.5;
            let baseDemand = (gameState.brandAwareness / 5) * priceFactor * RETAIL_BONUS;
             const dailyDemandVariation = Math.random() * 0.5 + 0.75;
            let unitsSold = Math.floor(baseDemand * qualityFactor * dailyDemandVariation);
            const actualUnitsSold = Math.min(unitsSold, deal.stock);
            if(actualUnitsSold > 0) {
                const grossRevenue = actualUnitsSold * dealPrice;
                const commissionPaid = grossRevenue * (deal.commission / 100);
                const netRevenue = grossRevenue - commissionPaid;
                const profit = actualUnitsSold * (dealPrice * (1 - deal.commission / 100) - phone.totalCost);
                gameState.money += netRevenue;
                gameState.totalProfit += profit;
                deal.stock -= actualUnitsSold;
                deal.unitsSold += actualUnitsSold;
                addXP(actualUnitsSold * phone.totalCost / 10 * gameState.xpMultiplier);
            }
        });
    }

    function addXP(amount) {
        if (amount <= 0) {
            return;
        }
        gameState.xp += amount;
        while (gameState.xp >= gameState.xpToNextLevel) {
            gameState.xp -= gameState.xpToNextLevel;
            gameState.level++;
            gameState.xpToNextLevel = Math.floor(gameState.xpToNextLevel * 1.5);
            alert(`🎉 Поздравляем! Вы достигли ${gameState.level} уровня! Проверьте, не открылись ли новые компоненты и аксессуары.`);
            populateAllSelectors();
        }
    }

    function completeResearch(project) {
        alert(`Исследование "${project.name}" завершено!`);
        gameState.research.completed.push(project.id);
        if (project.unlocks.type === 'logo') {
            gameState.logoLevel = Math.max(gameState.logoLevel, project.unlocks.level);
            // Only add awareness bonus once per logo level unlock
            if (project.unlocks.level === 1 && gameState.brandAwarenessBonus < 0.02) {
                 gameState.brandAwarenessBonus += 0.02;
            } else if (project.unlocks.level === 2 && gameState.brandAwarenessBonus < 0.05) { // Assuming 0.02 from level 1 + 0.03 from level 2 = 0.05 total
                 gameState.brandAwarenessBonus = 0.05;
            }
        } else if (project.unlocks.type === 'lifecycle') {
             gameState.maxSalesLifecycle += project.unlocks.value;
        } else if (project.unlocks.type === 'xp_multiplier') {
            gameState.xpMultiplier += project.unlocks.value;
        }
        else {
            const { category, level } = project.unlocks;
            if (gameState.unlockedTech.hasOwnProperty(category)) {
                gameState.unlockedTech[category] = Math.max(gameState.unlockedTech[category], level);
            } else {
                console.warn(`Attempted to unlock unknown tech category: ${category}`);
            }
        }
        gameState.research.activeProject = null;
        gameState.research.progress = 0;
        populateAllSelectors();
        renderUI();
    }

    function renderUI() {
        if (moneyEl) moneyEl.textContent = `$${Math.floor(gameState.money).toLocaleString()}`;
        if (dateEl) dateEl.textContent = gameState.date.toLocaleDateString('ru-RU');
        if (playerLevelEl) playerLevelEl.textContent = gameState.level;
        if (playerXpEl) playerXpEl.textContent = Math.floor(gameState.xp);
        if (playerXpNextEl) playerXpNextEl.textContent = Math.floor(gameState.xpToNextLevel);
        if (xpBarEl) xpBarEl.style.width = `${(gameState.xp / gameState.xpToNextLevel) * 100}%`;

        const activeScreen = document.querySelector('.screen.active');
        const activeScreenId = activeScreen ? activeScreen.id : null;

        // Optimized rendering: Only update content for the active screen
        switch (activeScreenId) {
            case 'design-screen':
                updatePhonePreview();
                break;
            case 'sales-screen':
                renderSales();
                break;
            case 'accessories-screen':
                renderAccessoriesScreen();
                break;
            case 'stats-screen':
                renderStatsScreen();
                break;
            case 'marketing-screen':
                renderMarketingScreen();
                break;
            case 'competition-screen':
                 // Competition screen is rendered weekly, no need to render every tick
                 // renderCompetitionScreen();
                break;
            case 'trends-screen':
                renderTrends();
                break;
            case 'rnd-screen':
                renderResearch();
                break;
            case 'settings-screen':
                // Settings screen is static
                break;
            default:
                 // Handle default or initial state
                 if (!activeScreenId) {
                     const defaultScreen = document.getElementById('design-screen');
                     if (defaultScreen && defaultScreen.classList.contains('active')) {
                         updatePhonePreview();
                     }
                 }
                 break;
        }


    }

    function populateAllSelectors() {
        let componentHtml = '';
        for (const category in COMPONENTS) {
            const data = COMPONENTS[category];
            // Use unlockedTech level OR default to 0 if category doesn't exist in unlockedTech
            const techLevel = gameState.unlockedTech.hasOwnProperty(category) ? gameState.unlockedTech[category] : 0;
            const availableItems = data.items.filter(item => item.tech <= techLevel && item.requiredLevel <= gameState.level);
            componentHtml += `<div class="form-group"><label>${data.name}</label><select id="select-${category}" data-category="${category}">`;
            if (availableItems.length > 0) {
                 availableItems.forEach(item => {
                     componentHtml += `<option value="${item.id}">${item.name} (L${item.requiredLevel}) - $${item.cost}</option>`;
                 });
            } else {
                 // Add a disabled option if nothing is available
                 componentHtml += `<option value="" disabled selected>Повысьте уровень / исследуйте</option>`;
            }
             componentHtml += `</select></div>`;
        }
        if(componentSelectorsEl) componentSelectorsEl.innerHTML = componentHtml;
        if(componentSelectorsEl) componentSelectorsEl.querySelectorAll('select').forEach(sel => {
            // Remove existing listeners before adding new ones to prevent duplicates
            // This is a simple way, a more robust approach might use .removeEventListener
            sel.replaceWith(sel.cloneNode(true));
        });
         if(componentSelectorsEl) componentSelectorsEl.querySelectorAll('select').forEach(sel => {
             sel.addEventListener('change', updatePhonePreview);
         });


        let colorHtml = '';
        const availableColors = COLORS.filter(c => c.requiredLevel <= gameState.level);
         if (availableColors.length > 0) {
             availableColors.forEach(c => {
                  colorHtml += `<option value="${c.id}">${c.name}</option>`;
             });
         } else {
             colorHtml += `<option value="" disabled selected>Повысьте уровень</option>`;
         }

        if(phoneColorSelect) phoneColorSelect.innerHTML = colorHtml;
         if(phoneColorSelect) {
             // Remove existing listener before adding new one
             phoneColorSelect.replaceWith(phoneColorSelect.cloneNode(true));
         }
        if(phoneColorSelect) phoneColorSelect.addEventListener('change', updatePhonePreview);


        let featureHtml = '';
        const availableFeatures = SPECIAL_FEATURES.filter(f => f.requiredLevel <= gameState.level);
         if (availableFeatures.length > 0) {
             availableFeatures.forEach(f => {
                  featureHtml += `<option value="${f.id}">${f.name} ($${f.cost})</option>`;
             });
         } else {
             featureHtml += `<option value="" disabled selected>Повысьте уровень</option>`;
         }

        if(specialFeatureSelect) specialFeatureSelect.innerHTML = featureHtml;
         if(specialFeatureSelect) {
             // Remove existing listener before adding new one
             specialFeatureSelect.replaceWith(specialFeatureSelect.cloneNode(true));
         }
        if(specialFeatureSelect) specialFeatureSelect.addEventListener('change', updatePhonePreview);


        let bundledAccHtml = '';
        const availableBundled = BUNDLED_ACCESSORIES.filter(acc => acc.requiredLevel <= gameState.level);
        if (availableBundled.length === 0) {
             bundledAccHtml = '<p class="text-small">Повышайте уровень, чтобы открывать аксессуары в комплекте.</p>';
        } else {
             availableBundled.forEach(acc => {
                 bundledAccHtml += `<div class="accessory-item"><input type="checkbox" id="acc-${acc.id}" data-id="${acc.id}"><label for="acc-${acc.id}">${acc.name} (L${acc.requiredLevel}) - $${acc.cost}</label></div>`;
             });
        }
        if(accessoryCheckboxesEl) accessoryCheckboxesEl.innerHTML = bundledAccHtml;
         if(accessoryCheckboxesEl) {
             // Remove existing listeners by cloning and replacing
             accessoryCheckboxesEl.querySelectorAll('input[type="checkbox"]').forEach(box => {
                 box.replaceWith(box.cloneNode(true));
             });
         }
        if(accessoryCheckboxesEl) accessoryCheckboxesEl.querySelectorAll('input[type="checkbox"]').forEach(box => {
             box.addEventListener('change', updatePhonePreview);
        });


        updatePhonePreview();
    }

    function updatePhonePreview() {
        const stats = calculatePhoneStats();
        // Check if components are selected before displaying stats
        const componentSelectors = componentSelectorsEl ? componentSelectorsEl.querySelectorAll('select') : [];
        const allComponentsSelected = Array.from(componentSelectors).every(select => select.value !== '');

        if (!stats || !allComponentsSelected) {
            if(preview && preview.performance) preview.performance.textContent = 'N/A';
            if(preview && preview.camera) preview.camera.textContent = 'N/A';
            if(preview && preview.battery) preview.battery.textContent = 'N/A';
            if(preview && preview.design) preview.design.textContent = 'N/A';
            if(preview && preview.cost) preview.cost.textContent = 'N/A';
            if (showProductionModalBtn) {
                showProductionModalBtn.disabled = true;
                showProductionModalBtn.textContent = 'Выберите все компоненты';
            }
            return;
        } else {
             if (showProductionModalBtn) {
                showProductionModalBtn.disabled = false;
                showProductionModalBtn.textContent = 'Выпустить модель';
            }
        }

        if(preview && preview.performance) preview.performance.textContent = stats.performance.toFixed(0);
        if(preview && preview.camera) preview.camera.textContent = stats.camera.toFixed(0);
        if(preview && preview.battery) preview.battery.textContent = stats.battery.toFixed(0);
        if(preview && preview.design) preview.design.textContent = stats.design.toFixed(0);
        if(preview && preview.cost) preview.cost.textContent = `$${stats.totalCost.toFixed(2)}`;
    }

    function calculatePhoneStats() {
        const components = getSelectedComponents();
         // getSelectedComponents already checks if all are selected and returns null if not
        if (!components) {
            return null;
        }
        // Ensure color and feature selections have a value before proceeding
        const color = COLORS.find(c => c.id === (phoneColorSelect ? phoneColorSelect.value : null));
        const feature = SPECIAL_FEATURES.find(f => f.id === (specialFeatureSelect ? specialFeatureSelect.value : null));

         if (!color || !feature) {
             return null; // Return null if color or feature are not selected (e.g., disabled options)
         }

        const bundledAccessories = getSelectedBundledAccessories();
        let totalCost = color.cost + feature.cost;
        let design = feature.designBonus || 0;
        let performance = feature.performanceBonus || 0;
        let batteryPenalty = feature.batteryPenalty || 0;

        Object.values(components).forEach(c => {
            totalCost += c.cost;
            performance += c.performance || 0;
            design += c.design || 0;
        });

        const powerConsumption = (components.cpu ? components.cpu.power || 0 : 0) + (components.screen ? components.screen.power || 0 : 0) + batteryPenalty;
        // Ensure battery capacity and power consumption are positive to avoid NaN or Infinity
        const batteryCapacity = components.battery ? components.battery.capacity || 0 : 0;
        const calculatedBattery = (batteryCapacity / Math.max(1, powerConsumption)) * 24;
        const battery = Math.max(1, calculatedBattery);


        const camera = (components.mainCamera ? components.mainCamera.quality || 0 : 0);

        bundledAccessories.forEach(acc => {
            totalCost += acc.cost;
            design += acc.designBonus || 0;
        });

        return { performance, camera, battery, design, totalCost };
    }

    function getSelectedComponents() {
        const selected = {};
        const selectElements = componentSelectorsEl ? componentSelectorsEl.querySelectorAll('select') : [];
        if (selectElements.length === 0) return null;

        let allSelected = true;
        selectElements.forEach(selectEl => {
            const category = selectEl.dataset.category;
            const selectedValue = selectEl.value;

            if (selectedValue) {
                 const item = COMPONENTS[category]?.items.find(i => i.id === selectedValue);
                 if (item) {
                     selected[category] = item;
                 } else {
                     console.warn(`Selected item ID "${selectedValue}" not found in category "${category}".`);
                     allSelected = false;
                 }
            } else {
                 // If any select has no value selected (e.g., the disabled "select" option)
                 allSelected = false;
            }
        });

        // Return null if not all selectors are present or not all have valid selections
        if (Object.keys(selected).length !== selectElements.length || !allSelected) {
             return null;
        }

        return selected;
    }


    function getSelectedBundledAccessories() {
        const selected = [];
        if (!accessoryCheckboxesEl) return selected;
        accessoryCheckboxesEl.querySelectorAll('input[type="checkbox"]:checked').forEach(box => {
            const accData = BUNDLED_ACCESSORIES.find(a => a.id === box.dataset.id);
            if (accData) {
                selected.push(accData);
            }
        });
        return selected;
    }

    function renderAccessoriesScreen() {
        let html = '';
        const availableAcc = STANDALONE_ACCESSORIES.filter(a => a.requiredLevel <= gameState.level);

        if (availableAcc.length === 0) {
            if (accessoriesListEl) accessoriesListEl.innerHTML = '<p class="text-small">Повышайте уровень, чтобы открывать новые аксессуары для продажи отдельно.</p>';
            return;
        }

        availableAcc.forEach(accData => {
            const myAcc = gameState.standaloneAccessories.find(a => a.id === accData.id);
            html += `
                <div class="card">
                    <h3>${accData.name || 'N/A'} (L${accData.requiredLevel || 0})</h3>
                    <div class="spec-line">
                        <span>Себестоимость:</span>
                        <span>$${accData.cost || 0}</span>
                    </div>
                    <div class="spec-line">
                        <span>На складе:</span>
                        <span>${myAcc ? (myAcc.stock || 0).toLocaleString() : 0} шт.</span>
                    </div>
                     <div class="spec-line">
                        <span>Цена продажи:</span>
                        <span>$${myAcc ? (myAcc.price || 0) : 'N/A'}</span>
                    </div>
                    <button class="produce-accessory-btn secondary mt-20" data-id="${accData.id}">
                        ${myAcc ? 'Управление' : 'Начать производство'}
                    </button>
                </div>
            `;
        });

        if (accessoriesListEl) accessoriesListEl.innerHTML = html;
    }

    function renderMarketingScreen() {
        let campaignsHtml = '';
        MARKETING_CAMPAIGNS.forEach(c => {
            const active = gameState.activeCampaigns.find(ac => ac.id === c.id);
            const disabled = gameState.money < (c.cost || 0) || active;
            campaignsHtml += `
                <div class="card">
                    <h3>${c.name || 'N/A'}</h3>
                    <p class="text-small">${c.duration || 0} дней, +${c.effect || 0} к узнаваемости</p>
                    <div class="spec-line">
                        <span>Стоимость:</span>
                        <span class="text-error">$${(c.cost || 0).toLocaleString()}</span>
                    </div>
                    ${active ?
                        `<button disabled>Активно (осталось ${active.daysLeft || 0} д.)</button>` :
                        `<button class="start-campaign-btn secondary" data-id="${c.id}" ${disabled ? 'disabled' : ''}>Запустить</button>`
                    }
                </div>
            `;
        });
        if (campaignsListEl) campaignsListEl.innerHTML = campaignsHtml;

        let partnershipHtml = '';
        gameState.retailPartnerships.forEach(deal => {
            const phone = gameState.phones.find(p => p.id === deal.phoneId);
            // Only show deals for existing phones that had initial stock
            if (!phone || (deal.initialQuantity || 0) <= 0) return;

             partnershipHtml += `
                 <div class="card">
                     <h3>Сделка по модели "${phone.name || 'N/A'}"</h3>
                     <div class="spec-line">
                         <span>Ритейлер:</span>
                         <span>Партнер ${deal.id || 'N/A'}</span>
                     </div>
                      <div class="spec-line">
                         <span>Отправлено ритейлеру:</span>
                         <span>${(deal.initialQuantity || 0).toLocaleString()} шт.</span>
                     </div>
                     <div class="spec-line">
                         <span>Остаток на полках:</span>
                         <span>${(deal.stock || 0).toLocaleString()} шт.</span>
                     </div>
                      <div class="spec-line">
                         <span>Всего продано по сделке:</span>
                         <span>${(deal.unitsSold || 0).toLocaleString()} шт.</span>
                     </div>
                     <div class="spec-line">
                         <span>Цена ритейлера:</span>
                         <span>$${deal.phonePrice || 0}</span>
                     </div>
                     <div class="spec-line">
                         <span>Комиссия магазину:</span>
                         <span class="text-error">${deal.commission || 0}%</span>
                     </div>
                 </div>
             `;
        });
        if (partnershipsListEl) partnershipsListEl.innerHTML = partnershipHtml || '<p class="text-small">Нет активных сделок.</p>';
    }

     function renderStatsScreen() {
        if (gameState.phones.length === 0) {
            if(statsContentEl) statsContentEl.innerHTML = '<p>Вы еще не выпустили ни одной модели.</p>';
        } else {
            let bestPhone = null, bestseller = null, mostProfitable = null;
            let bestScore = -1, maxUnits = -1, maxProfit = -Infinity;
            let totalUnits = 0, totalRevenue = 0;

            gameState.phones.forEach(phone => {
                const score = (phone.performance || 0) + (phone.camera || 0) + (phone.battery || 0) + (phone.design || 0);
                if (score > bestScore) {
                    bestScore = score;
                    bestPhone = phone;
                }
                if ((phone.sales && phone.sales.units || 0) > maxUnits) {
                    maxUnits = (phone.sales && phone.sales.units || 0);
                    bestseller = phone;
                }
                 if ((phone.sales && phone.sales.profit || 0) > maxProfit) {
                    maxProfit = (phone.sales && phone.sales.profit || 0);
                    mostProfitable = phone;
                }
                totalUnits += (phone.sales && phone.sales.units || 0);
                totalRevenue += (phone.sales && phone.sales.revenue || 0);
            });

            const avgPrice = totalUnits > 0 ? (totalRevenue / totalUnits) : 0;

            if(statsContentEl) statsContentEl.innerHTML = `
                <div class="card">
                    <h3>🏆 Лучшая модель (по рейтингу)</h3>
                    ${bestPhone ? `
                    <div class="spec-line"><span>Название:</span> <span class="value">${bestPhone.name || 'N/A'}</span></div>
                    <div class="spec-line"><span>Рейтинг:</span> <span class="value">${Math.round(bestScore)}</span></div>
                    ` : '<p class="text-small">Нет данных.</p>'}
                </div>
                <div class="card">
                    <h3>🔥 Бестселлер (по продажам)</h3>
                    ${bestseller ? `
                    <div class="spec-line"><span>Название:</span> <span class="value">${bestseller.name || 'N/A'}</span></div>
                    <div class="spec-line"><span>Продано:</span> <span class="value">${maxUnits.toLocaleString()} шт.</span></div>
                    ` : '<p class="text-small">Нет данных.</p>'}
                </div>
                <div class="card">
                    <h3>💰 Самая прибыльная модель</h3>
                     ${mostProfitable ? `
                     <div class="spec-line"><span>Название:</span> <span class="value">${mostProfitable.name || 'N/A'}</span></div>
                     <div class="spec-line"><span>Прибыль:</span> <span class="value text-success">$${Math.floor(mostProfitable.sales && mostProfitable.sales.profit || 0).toLocaleString()}</span></div>
                     ` : '<p class="text-small">Нет данных.</p>'}
                </div>
                <h3 class="section-title">Общие показатели</h3>
                 <div class="card">
                     <div class="spec-line"><span>Всего продано единиц:</span> <span class="value">${totalUnits.toLocaleString()}</span></div>
                     <div class="spec-line"><span>Общая выручка:</span> <span class="value text-success">$${Math.floor(totalRevenue).toLocaleString()}</span></div>
                     <div class="spec-line"><span>Средняя цена продажи:</span> <span class="value">$${avgPrice.toFixed(2)}</span></div>
                 </div>
                 <h3 class="section-title">Бренд</h3>
                  <div class="card">
                      <div class="spec-line"><span>Уровень бренда:</span> <span class="value">${gameState.level}</span></div>
                       <div class="spec-line"><span>Узнаваемость бренда:</span> <span class="value">${gameState.brandAwareness.toFixed(1)} %</span></div>
                      <div class="spec-line"><span>Бонус логотипа:</span> <span class="value">${(gameState.brandAwarenessBonus * 100).toFixed(1)} %</span></div>
                  </div>
            `;
        }

        if(logoDisplayEl) {
             switch (gameState.logoLevel) {
                 case 0:
                     logoDisplayEl.innerHTML = `Pixel Perfect`;
                     logoDisplayEl.style.cssText = `font-family: Arial, sans-serif; font-size: 2em;`;
                     break;
                 case 1:
                     logoDisplayEl.innerHTML = `<strong>PIXEL</strong> PERFECT`;
                     logoDisplayEl.style.cssText = `font-family: Verdana, sans-serif; font-size: 2em;`;
                     break;
                 case 2:
                      logoDisplayEl.innerHTML = `<span style="color:var(--secondary-color)">P</span>P`;
                      logoDisplayEl.style.cssText = `font-family: Impact, sans-serif; font-size: 3em;`;
                     break;
                 default: // Fallback for any other levels
                      logoDisplayEl.innerHTML = `Pixel Perfect`;
                      logoDisplayEl.style.cssText = `font-family: Arial, sans-serif; font-size: 2em;`;
                      break;
             }
         }
     }

    function showProductionModal() {
        const nameInput = document.getElementById('phone-name');
        const name = nameInput ? nameInput.value.trim() : '';

        if (!name) {
             alert("Пожалуйста, введите название модели!");
             if (nameInput) nameInput.focus();
             return;
         }

        const stats = calculatePhoneStats();
        if (!stats) {
            // This should ideally not happen if the button isn't disabled, but as a fallback:
            alert("Не удалось рассчитать характеристики. Возможно, не все компоненты выбраны или нет доступных компонентов на текущем уровне.");
            return;
        }

        const quantity = 1000; // Default quantity
        const price = Math.ceil(stats.totalCost * 2); // Default price based on cost
        if(productionQuantityInput) productionQuantityInput.value = quantity;
        if(phonePriceInput) phonePriceInput.value = price;

        const calculatedTotalCost = quantity * stats.totalCost;
        if (totalProductionCostEl) {
             totalProductionCostEl.textContent = `$${calculatedTotalCost.toLocaleString()}`;
        }

        if (productionModalOverlay) productionModalOverlay.style.display = 'flex';
    }

    function launchPhoneProduction() {
        const nameInput = document.getElementById('phone-name');
        const name = nameInput ? nameInput.value.trim() : '';
        const price = phonePriceInput ? parseFloat(phonePriceInput.value) : NaN;
        const quantity = productionQuantityInput ? parseInt(productionQuantityInput.value) : NaN;
        const stats = calculatePhoneStats();

        if (!stats) {
             // Should not happen if calculatePhoneStats was checked before showing modal
             alert("Ошибка расчета характеристик.");
             return;
        }

        const totalCost = quantity * stats.totalCost;

        if (!name || name === 'Введите название модели' || isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
            alert("Пожалуйста, введите корректное название, цену и количество.");
            return;
        }

        if (totalCost > gameState.money) {
            alert("Недостаточно средств для производства этой партии! Необходимо: $" + totalCost.toLocaleString());
            return;
        }

        gameState.money -= totalCost;

        const newPhone = {
            id: Date.now(), // Simple unique ID
            name,
            price,
            stock: quantity,
            daysOnMarket: 0,
            isActive: true,
            sales: { units: 0, revenue: 0, profit: 0 },
            // Copy stats properties directly
            performance: stats.performance,
            camera: stats.camera,
            battery: stats.battery,
            design: stats.design,
            totalCost: stats.totalCost, // Keep total cost for restocking calculation
            color: phoneColorSelect ? phoneColorSelect.value : (COLORS.length > 0 ? COLORS[0].id : 'default'), // Ensure a color is saved
            // Save component IDs and accessory IDs
            components: Object.fromEntries(Object.entries(getSelectedComponents() || {}).map(([cat, item]) => [cat, item.id])),
            accessories: getSelectedBundledAccessories().map(acc => acc.id)
        };

        gameState.phones.push(newPhone);

        // Clear design screen after launch
        if (nameInput) nameInput.value = '';
        // Optional: reset component/color/feature selectors to default or first option
        if (componentSelectorsEl) {
            componentSelectorsEl.querySelectorAll('select').forEach(select => {
                 if (select.options.length > 0) select.value = select.options[0].value;
            });
        }
         if (phoneColorSelect && phoneColorSelect.options.length > 0) phoneColorSelect.value = phoneColorSelect.options[0].value;
         if (specialFeatureSelect && specialFeatureSelect.options.length > 0) specialFeatureSelect.value = specialFeatureSelect.options[0].value;
         if (accessoryCheckboxesEl) {
             accessoryCheckboxesEl.querySelectorAll('input[type="checkbox"]').forEach(box => box.checked = false);
         }
        updatePhonePreview(); // Update preview with cleared/default selections


        if (productionModalOverlay) productionModalOverlay.style.display = 'none';

         // Switch to sales screen automatically
         const salesNavButton = document.querySelector('.nav-btn[data-screen="sales-screen"]');
         if (salesNavButton) {
             handleNavClick(salesNavButton); // Use the existing nav handler
         } else {
             renderUI();
         }
    }

    function handleNavClick(btn) {
        const screenId = btn.dataset.screen;

        // Save current active screen before switching
        const currentActiveScreen = document.querySelector('.screen.active');
         if (currentActiveScreen) {
             gameState.activeScreenId = currentActiveScreen.id;
         } else {
             gameState.activeScreenId = 'design-screen'; // Fallback
         }


        if (screens) screens.forEach(s => s.classList.remove('active'));
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
             targetScreen.classList.add('active');
        } else {
             console.error(`Screen with ID "${screenId}" not found.`);
             // Fallback to default screen if target not found
             const defaultScreen = document.getElementById('design-screen');
             const defaultNavBtn = document.querySelector('.nav-btn[data-screen="design-screen"]');
             if(defaultScreen) defaultScreen.classList.add('active');
             if(defaultNavBtn) defaultNavBtn.classList.add('active');
             gameState.activeScreenId = 'design-screen'; // Update state
        }

        if (navButtons) navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        renderUI(); // Render the newly active screen
    }

    function setupEventListeners() {
        // Navigation
         if (navButtons) navButtons.forEach(btn => {
             btn.addEventListener('click', () => handleNavClick(btn));
         });

         // Modals and related buttons
         if (showProductionModalBtn) {
             showProductionModalBtn.addEventListener('click', showProductionModal);
         }
         if (openPartnershipModalBtn) {
             openPartnershipModalBtn.addEventListener('click', openPartnershipModal);
         }
         if (confirmProductionBtn) confirmProductionBtn.addEventListener('click', launchPhoneProduction);
         if (confirmPartnershipBtn) confirmPartnershipBtn.addEventListener('click', startPartnership); // Listener for partnership confirmation
         if (document.getElementById('confirm-accessory-production-btn')) document.getElementById('confirm-accessory-production-btn').addEventListener('click', produceAccessory);


        // Modal Inputs
        if (productionQuantityInput) productionQuantityInput.addEventListener('input', () => {
            const stats = calculatePhoneStats(); // Recalculate stats based on current design selections
            if (!stats) return; // Only update cost if stats are valid
            const quantity = parseInt(productionQuantityInput.value) || 0;
            const totalCost = quantity * stats.totalCost;
            if(totalProductionCostEl) totalProductionCostEl.textContent = `$${totalCost.toLocaleString()}`;
        });

         if (document.getElementById('accessory-production-quantity')) {
              document.getElementById('accessory-production-quantity').addEventListener('input', () => {
                   const accData = STANDALONE_ACCESSORIES.find(a => a.id === gameState.currentAccessoryId);
                   if (!accData) return;
                   const quantity = parseInt(document.getElementById('accessory-production-quantity').value) || 0;
                   const totalCost = quantity * (accData.cost || 0); // Safety check for cost
                   if(document.getElementById('accessory-total-production-cost')) document.getElementById('accessory-total-production-cost').textContent = `$${totalCost.toLocaleString()}`;
              });
         }

        // Close Modals
        if (modalOverlays) document.querySelectorAll('.cancel-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Find the closest modal overlay parent and hide it
                const modal = btn.closest('.modal-overlay');
                if (modal) {
                     modal.style.display = 'none';
                     // Special handling for accessory modal
                     if (modal.id === 'accessory-production-modal-overlay') {
                         gameState.currentAccessoryId = null;
                     }
                } else {
                    // Fallback: hide all if button not inside a specific modal
                    if (modalOverlays) modalOverlays.forEach(m => m.style.display = 'none');
                     gameState.currentAccessoryId = null; // Assume accessory modal was open
                }
            });
        });

        // Partnership Modal Specifics
        const commissionSlider = document.getElementById('partnership-commission');
        const commissionOutput = document.getElementById('partnership-commission-value');
        if (commissionSlider && commissionOutput) {
             commissionSlider.oninput = () => {
                  commissionOutput.textContent = `${commissionSlider.value}%`;
             };
        }

        // Screen specific action listeners (Delegation)
        if (salesListEl) salesListEl.addEventListener('click', handleSalesActions);
        if (researchListEl) researchListEl.addEventListener('click', handleResearchActions);
        if (campaignsListEl) campaignsListEl.addEventListener('click', handleMarketingActions);
        if (accessoriesListEl) accessoriesListEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('produce-accessory-btn')) {
                openAccessoryModal(e.target.dataset.id);
            }
        });


        // Competition screen sorting
        if (competitionTableHeader) {
             competitionTableHeader.addEventListener('click', (e) => {
                if (e.target.tagName === 'TH') {
                    const sortKey = e.target.dataset.sort;
                    if (sortKey) {
                        if (gameState.competitionSort.key === sortKey) {
                            gameState.competitionSort.direction = gameState.competitionSort.direction === 'asc' ? 'desc' : 'asc';
                        } else {
                            gameState.competitionSort.key = sortKey;
                            gameState.competitionSort.direction = 'desc';
                        }
                        renderCompetitionScreen();
                    }
                }
            });
        }

        // Settings buttons
        if (saveGameBtn) saveGameBtn.addEventListener('click', saveGame);
        if (loadGameBtn) loadGameBtn.addEventListener('click', () => {
             const confirmLoad = confirm("Загрузить сохраненную игру? Текущий прогресс, который не был сохранен, будет потерян.");
             if (confirmLoad) {
                 // Clear existing interval before loading and re-initializing
                 if (gameInterval) {
                     clearInterval(gameInterval);
                     gameInterval = null;
                 }
                 if (loadGame()) {
                     // loadGame already calls init() and startGameLoop() if successful
                 } else {
                     alert("Не удалось загрузить игру.");
                     // If load fails, ensure a new game starts
                     if (!gameInterval) {
                         // Only if loadGame didn't call init
                         init();
                     }
                 }
             }
        });
        if (resetGameBtn) resetGameBtn.addEventListener('click', resetGame);

    }

    function openPartnershipModal() {
        const select = document.getElementById('partnership-phone-select');
        if (!select) {
             console.error("Modal select element for partnership not found.");
             alert("Ошибка: Не найдены элементы для партнерства.");
             return;
        }

        let optionsHtml = '';

        // Filter phones that are active AND have stock > 0
        // The original code just checked stock > 0, which is correct for *having* something to sell.
        // If the phone is inactive (lifecycle ended), it probably shouldn't be sent to a retailer,
        // but the rule was just stock > 0. Let's stick to the original rule + isActive=true makes more sense.
        // Correction: The original rule *was* just stock > 0 (after correction was commented out).
        // Let's stick to phones that have stock and haven't passed their *initial* maxSalesLifecycle
        // OR consider adding a mechanic to extend lifecycle for partnerships.
        // For now, let's keep it simple: phones with stock > 0.
        const phonesWithStock = gameState.phones.filter(p => (p.stock || 0) > 0);

        if (phonesWithStock.length === 0) {
            alert('У вас нет телефонов на складе для заключения партнерства! Произведите партию телефона.');
            return; // Exit the function if no phones are available
        }

        phonesWithStock.forEach(p => {
            optionsHtml += `<option value="${p.id}">${p.name || 'N/A'} (На складе: ${(p.stock || 0).toLocaleString()})</option>`;
        });

        select.innerHTML = optionsHtml;

        // Set default values in modal
        const quantityInput = document.getElementById('partnership-quantity');
        const commissionInput = document.getElementById('partnership-commission');
        const commissionOutput = document.getElementById('partnership-commission-value');
        const phonePriceDisplay = document.getElementById('partnership-phone-price-display');


        // Set default values based on the first phone in the list
        const firstPhone = phonesWithStock[0];
        if (firstPhone) {
             if (quantityInput) quantityInput.value = Math.min(1000, firstPhone.stock || 0); // Default to 1000 or available stock
             if (phonePriceDisplay) phonePriceDisplay.textContent = `$${firstPhone.price || 0}`;
             // Add listener to update displayed price when phone selection changes
             select.onchange = (event) => {
                 const selectedPhone = gameState.phones.find(p => p.id == event.target.value);
                 if (selectedPhone && phonePriceDisplay) {
                     phonePriceDisplay.textContent = `$${selectedPhone.price || 0}`;
                 }
             };
        } else {
             // Should not happen if phonesWithStock.length > 0 check passes, but for safety
             if (quantityInput) quantityInput.value = 0;
             if (phonePriceDisplay) phonePriceDisplay.textContent = '$N/A';
             select.onchange = null; // Remove listener if no options
        }


        if(commissionInput) commissionInput.value = 20; // Default commission
        if(commissionOutput) commissionOutput.textContent = '20%';

        if (partnershipModalOverlay) partnershipModalOverlay.style.display = 'flex';
    }

    function startPartnership() {
        const phoneSelect = document.getElementById('partnership-phone-select');
        const quantityInput = document.getElementById('partnership-quantity');
        const commissionInput = document.getElementById('partnership-commission');

        if (!phoneSelect || !quantityInput || !commissionInput) {
             alert('Ошибка: не найдены элементы модального окна партнерства.');
             return;
        }

        const phoneId = phoneSelect.value;
        const quantity = parseInt(quantityInput.value);
        const commission = parseInt(commissionInput.value);

        const phone = gameState.phones.find(p => p.id == phoneId);

        if (!phone || isNaN(quantity) || quantity <= 0 || isNaN(commission) || commission < 10 || commission > 50) {
            alert('Неверные данные для партнерства! Пожалуйста, проверьте модель, количество и комиссию (10-50%).');
            return;
        }

         if ((phone.stock || 0) <= 0) {
             alert(`На складе больше нет моделей "${phone.name || 'N/A'}"!`);
             // Close modal? Or just update? Let's just warn.
             return;
         }

        if (quantity > (phone.stock || 0)) { // Safety check for phone.stock
            alert(`На складе недостаточно моделей "${phone.name || 'N/A'}"! Доступно: ${(phone.stock || 0).toLocaleString()}`);
            quantityInput.value = (phone.stock || 0); // Suggest available stock
            return;
        }

        phone.stock -= quantity;

        // Check if a partnership for this phone already exists
        let existingDeal = gameState.retailPartnerships.find(deal => deal.phoneId === phone.id);

        if (existingDeal) {
             // Add quantity to existing deal
             existingDeal.initialQuantity = (existingDeal.initialQuantity || 0) + quantity; // Track total sent to this partner for this model
             existingDeal.stock = (existingDeal.stock || 0) + quantity;
             // Optional: Update commission/price? For simplicity, let's keep the old ones for the existing deal.
             // If new commission/price should apply, need logic to handle that or start a new deal.
             // Sticking to adding stock to existing deal for now.
        } else {
             // Create new partnership deal
             gameState.retailPartnerships.push({
                 id: Date.now(), // Unique ID for the deal itself
                 phoneId: phone.id,
                 initialQuantity: quantity,
                 stock: quantity,
                 commission: commission,
                 phonePrice: phone.price || 0, // Record the price at the time of the deal
                 unitsSold: 0
             });
        }


        alert(`Партия из ${quantity.toLocaleString()} ед. модели "${phone.name || 'N/A'}" отправлена ритейлеру с комиссией ${commission}%.`);

        if(partnershipModalOverlay) partnershipModalOverlay.style.display = 'none';
        renderMarketingScreen(); // Refresh the marketing screen to show the new/updated deal
        renderSales(); // Refresh sales screen to show reduced stock
    }

    function openAccessoryModal(accId) {
        gameState.currentAccessoryId = accId;
        const accData = STANDALONE_ACCESSORIES.find(a => a.id === accId);
         if (!accData) {
              console.error("Accessory data not found for ID:", accId);
              alert("Ошибка: Не удалось загрузить данные аксессуара.");
              gameState.currentAccessoryId = null; // Reset in case of error
              return;
         }
        const myAcc = gameState.standaloneAccessories.find(a => a.id === accId);

        const modalTitleEl = document.getElementById('accessory-modal-title');
        const quantityInput = document.getElementById('accessory-production-quantity');
        const priceInput = document.getElementById('accessory-price');
        const totalCostEl = document.getElementById('accessory-total-production-cost');


        if (modalTitleEl) {
            modalTitleEl.textContent = `Управление: ${accData.name || 'N/A'}`;
            modalTitleEl.dataset.accessoryId = accId;
        }

        if (quantityInput) quantityInput.value = 1000; // Default production batch size

        // Set default price: either existing price or calculated ideal price
        if (priceInput) priceInput.value = myAcc ? (myAcc.price || Math.ceil((accData.cost || 0) * 2.5)) : Math.ceil((accData.cost || 0) * 2.5);


        const defaultQuantity = parseInt(quantityInput ? quantityInput.value : 0) || 0;
        const totalCost = defaultQuantity * (accData.cost || 0); // Safety check for cost
        if(totalCostEl) totalCostEl.textContent = `$${totalCost.toLocaleString()}`;

        if (accessoryProductionModalOverlay) accessoryProductionModalOverlay.style.display = 'flex';
    }

    function produceAccessory() {
        const accData = STANDALONE_ACCESSORIES.find(a => a.id === gameState.currentAccessoryId);
        if (!accData) {
             alert("Произошла ошибка. Данные аксессуара не найдены.");
             if(accessoryProductionModalOverlay) accessoryProductionModalOverlay.style.display = 'none';
             gameState.currentAccessoryId = null;
             return;
        }

        let myAcc = gameState.standaloneAccessories.find(a => a.id === gameState.currentAccessoryId);

        const quantityInput = document.getElementById('accessory-production-quantity');
        const priceInput = document.getElementById('accessory-price');

        const quantity = quantityInput ? parseInt(quantityInput.value) : NaN;
        const price = priceInput ? parseFloat(priceInput.value) : NaN;

        if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
            alert('Пожалуйста, введите корректное количество и цену.');
            return;
        }

        const totalCost = quantity * (accData.cost || 0); // Safety check for cost

        if (totalCost > gameState.money) {
            alert('Недостаточно средств! Необходимо: $' + totalCost.toLocaleString());
            return;
        }

        gameState.money -= totalCost;

        if (myAcc) {
            myAcc.stock = (myAcc.stock || 0) + quantity; // Add to existing stock
            myAcc.price = price; // Update price
        } else {
            // Create new entry for this accessory
            gameState.standaloneAccessories.push({
                id: gameState.currentAccessoryId,
                stock: quantity,
                price: price
            });
        }

        alert(`Произведено ${quantity.toLocaleString()} ед. "${accData.name || 'N/A'}".`);

        if(accessoryProductionModalOverlay) accessoryProductionModalOverlay.style.display = 'none';
        gameState.currentAccessoryId = null; // Clear current accessory context
        renderAccessoriesScreen(); // Refresh accessories screen
        renderUI(); // Update money display
    }

    function handleSalesActions(e) {
        const targetButton = e.target.closest('button'); // Use closest to handle icon clicks etc.
        if (!targetButton) return;

        const phoneId = targetButton.dataset.id;
        if (!phoneId) return;

        const phone = gameState.phones.find(p => p.id == phoneId);
        if (!phone) {
             console.error("Phone not found for ID:", phoneId);
             return;
        }

        if (targetButton.classList.contains('change-price-btn')) {
            const newPriceStr = prompt(`Введите новую цену для "${phone.name || 'N/A'}" (текущая $${phone.price || 0}, себестоимость $${(phone.totalCost || 0).toFixed(0)}):`, phone.price || 0);
            if (newPriceStr !== null && newPriceStr.trim() !== '') {
                 const newPrice = parseFloat(newPriceStr);
                 if (!isNaN(newPrice) && newPrice > 0) {
                     phone.price = newPrice;
                     renderSales();
                 } else {
                      alert("Некорректная цена. Цена должна быть положительным числом.");
                 }
             }
        }
        else if (targetButton.classList.contains('restock-btn')) {
             const quantityStr = prompt(`Сколько еще единиц "${phone.name || 'N/A'}" произвести? (Себестоимость $${(phone.totalCost || 0).toFixed(0)}/шт.)`, 1000);
             if (quantityStr !== null && quantityStr.trim() !== '') {
                 const quantity = parseInt(quantityStr);
                 if (!isNaN(quantity) && quantity > 0) {
                     const costPerUnit = phone.totalCost || 0; // Use saved cost
                     const totalCost = quantity * costPerUnit;
                     if (gameState.money >= totalCost) {
                         gameState.money -= totalCost;
                         phone.stock = (phone.stock || 0) + quantity; // Add to existing stock
                         // Optionally reactivate the phone if lifecycle ended but stock was added
                         if (!phone.isActive && phone.daysOnMarket >= gameState.maxSalesLifecycle) {
                             phone.isActive = true;
                             phone.daysOnMarket = gameState.maxSalesLifecycle - 5; // Give it a few days buffer
                         }

                         alert(`Произведено ${quantity.toLocaleString()} шт. "${phone.name || 'N/A'}". Списано $${Math.floor(totalCost).toLocaleString()}`);
                         renderSales(); // Refresh sales screen
                         renderUI(); // Update money display
                     } else {
                         alert(`Недостаточно средств для производства этой партии! Необходимо: $${Math.floor(totalCost).toLocaleString()}`);
                     }
                 } else {
                     alert("Некорректное количество. Количество должно быть положительным целым числом.");
                 }
             }
        }
    }

    function handleResearchActions(e) {
        const targetButton = e.target.closest('button');
        if (!targetButton || !targetButton.classList.contains('start-research-btn')) return;

        const projectId = targetButton.dataset.id;
        const project = RESEARCH_PROJECTS.find(p => p.id === projectId);

        if (!project) {
             console.error("Research project not found for ID:", projectId);
             return;
        }

        const isCompleted = gameState.research.completed.includes(p.id);
        const canAfford = gameState.money >= (project.cost || 0); // Safety check for cost
        const isResearching = !!gameState.research.activeProject;


        if (isCompleted) {
             alert(`Исследование "${project.name || 'N/A'}" уже завершено.`);
             return;
        }

        if (isResearching) {
             const activeProjectData = RESEARCH_PROJECTS.find(p => p.id === gameState.research.activeProject);
             const activeProjectName = activeProjectData ? activeProjectData.name || 'неизвестное исследование' : 'неизвестное исследование';
             alert(`Вы уже исследуете "${activeProjectName}". Завершите его, чтобы начать новое.`);
             return;
        }

         if (!canAfford) {
              alert(`Недостаточно средств для начала исследования "${project.name || 'N/A'}". Необходимо: $${(project.cost || 0).toLocaleString()}.`);
              return;
         }

        // If all checks pass, start research
        gameState.money -= (project.cost || 0);
        gameState.research.activeProject = projectId;
        gameState.research.progress = 0;
        alert(`Исследование "${project.name || 'N/A'}" начато!`);
        renderResearch(); // Refresh research screen
        renderUI(); // Update money display
    }

    function handleMarketingActions(e) {
        const targetButton = e.target.closest('button');
        if (!targetButton || !targetButton.classList.contains('start-campaign-btn')) return;

        const campaignId = targetButton.dataset.id;
        const campaign = MARKETING_CAMPAIGNS.find(c => c.id === campaignId);

        if (!campaign) {
             console.error("Marketing campaign not found for ID:", campaignId);
             return;
        }

        const active = gameState.activeCampaigns.find(ac => ac.id === campaign.id);
        const canAfford = gameState.money >= (campaign.cost || 0); // Safety check for cost

        if (active) {
             alert(`Кампания "${campaign.name || 'N/A'}" уже активна.`);
             return;
        }

        if (!canAfford) {
             alert(`Недостаточно средств для запуска кампании "${campaign.name || 'N/A'}". Необходимо: $${(campaign.cost || 0).toLocaleString()}.`);
             return;
        }

        // If all checks pass, start campaign
        gameState.money -= (campaign.cost || 0);
        gameState.activeCampaigns.push({
            ...campaign,
            daysLeft: campaign.duration || 0 // Safety check for duration
        });
        alert(`Маркетинговая кампания "${campaign.name || 'N/A'}" запущена!`);
        renderMarketingScreen(); // Refresh marketing screen
        renderUI(); // Update money display
    }

    function updateMarketing() {
        let totalAwarenessGain = gameState.brandAwarenessBonus;
        gameState.activeCampaigns = gameState.activeCampaigns.filter(c => {
            c.daysLeft = (c.daysLeft || 0) - 1; // Ensure daysLeft is treated as a number
            if (c.daysLeft > 0) {
                totalAwarenessGain += (c.effect || 0) / (c.duration || 1); // Safety check duration=1 to avoid division by zero
                return true;
            }
            return false;
        });
        gameState.brandAwareness = Math.min(100, gameState.brandAwareness + totalAwarenessGain);
         // Natural decay, reduced slightly
        gameState.brandAwareness = Math.max(1, gameState.brandAwareness * 0.9998); // Decay rate
    }

    function updateTrends() {
        // Move upcoming trends to current
        gameState.trends.current = gameState.trends.upcoming.map(trend => ({ ...trend })); // Deep copy

        // Select new upcoming trends
        const shuffled = [...ALL_TRENDS].sort(() => 0.5 - Math.random());
        const newUpcoming = [];
        for (let i = 0; i < 3 && i < shuffled.length; i++) {
             // Ensure selected trends are not already in the current list
             if (!gameState.trends.current.some(t => t.id === shuffled[i].id)) {
                  newUpcoming.push({ ...shuffled[i] });
             } else {
                 // If a potential upcoming trend is already current, try to pick another one
                 // This simple loop might not guarantee 3 *new* trends if the pool is small
                 // but it's good enough for a start.
             }
        }
        // If not enough new trends are picked, just fill with remaining shuffled trends if available
        let remainingShuffledIndex = 0;
        while (newUpcoming.length < 3 && remainingShuffledIndex < shuffled.length) {
             if (!newUpcoming.some(t => t.id === shuffled[remainingShuffledIndex].id) &&
                 !gameState.trends.current.some(t => t.id === shuffled[remainingShuffledIndex].id)) {
                  newUpcoming.push({ ...shuffled[remainingShuffledIndex] });
             }
             remainingShuffledIndex++;
        }


        gameState.trends.upcoming = newUpcoming;

        // Assign strength to current trends (primary and secondary)
        if (gameState.trends.current.length > 0) {
            gameState.trends.current.forEach((trend, index) => {
                 // Assign strength based on position
                 if (index === 0) {
                    trend.strength = 0.40; // Primary trend bonus
                 } else {
                    trend.strength = 0.20; // Secondary trend bonus
                 }
            });
        }

         console.log("Тренды обновлены:", gameState.trends);
         // Re-render trends screen if it's active
         if (document.getElementById('trends-screen') && document.getElementById('trends-screen').classList.contains('active')) {
              renderTrends();
         }
    }

    function renderResearch() {
        const currentResearchStatusEl = document.getElementById('current-research-status');
        if (gameState.research.activeProject) {
            const project = RESEARCH_PROJECTS.find(p => p.id === gameState.research.activeProject);
             if (project) {
                const progressPercent = (gameState.research.progress / (project.time || 1)) * 100; // Avoid division by zero
                if (currentResearchStatusEl) {
                     currentResearchStatusEl.innerHTML = `
                         <p><strong>${project.name || 'Неизвестное исследование'}</strong></p>
                         <p class="text-small">${gameState.research.progress || 0} / ${project.time || 0} дней</p>
                         <div class="progress-bar">
                             <div class="progress-bar-inner" style="width: ${progressPercent}%"></div>
                         </div>
                     `;
                }
             } else {
                  console.error(`Active research project with ID "${gameState.research.activeProject}" not found in RESEARCH_PROJECTS.`);
                  gameState.research.activeProject = null;
                  gameState.research.progress = 0;
                  if (currentResearchStatusEl) currentResearchStatusEl.textContent = 'Ошибка: Активное исследование не найдено.';
             }
        } else {
            if (currentResearchStatusEl) currentResearchStatusEl.textContent = 'Нет активных исследований.';
        }
        let html = '';
        RESEARCH_PROJECTS.forEach(p => {
            const isCompleted = gameState.research.completed.includes(p.id);
             // Check if required research is completed or if no requirements exist
            const requiresMet = !p.requires || gameState.research.completed.includes(p.requires);

            if (isCompleted || !requiresMet) {
                // Only show research if it's not completed and requirements are met
                return;
            }

            const canAfford = gameState.money >= (p.cost || 0);
            const isResearching = !!gameState.research.activeProject;
            const buttonText = isResearching ? 'Другое исследование активно' : (!canAfford ? 'Недостаточно средств' : 'Начать исследование');
             const disabled = !canAfford || isResearching;


            html += `
                <div class="card">
                    <h3>${p.name || 'Неизвестный проект'}</h3>
                    <p class="text-small">${p.description || 'Нет описания'}</p>
                    ${p.unlocks ? `<p class="text-small">Открывает: ${p.unlocks.type === 'logo' ? `Логотип ${p.unlocks.level}` : p.unlocks.type === 'lifecycle' ? `+${p.unlocks.value} дней жизненного цикла` : p.unlocks.type === 'xp_multiplier' ? `x${(1 + p.unlocks.value).toFixed(1)} множитель опыта` : `${p.unlocks.category} Ур. ${p.unlocks.level}`}</p>` : ''}
                    <div class="spec-line mt-20">
                        <span>Стоимость:</span>
                        <span class="text-error">$${(p.cost || 0).toLocaleString()}</span>
                    </div>
                    <div class="spec-line">
                        <span>Время:</span>
                        <span>${p.time || 0} дней</span>
                    </div>
                    ${p.requires ? `<div class="text-small text-secondary mt-10">Требует: "${RESEARCH_PROJECTS.find(req => req.id === p.requires)?.name || 'Неизвестное исследование'}"</div>` : ''}
                    <button class="start-research-btn secondary mt-10" data-id="${p.id}" ${disabled ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            `;
        });
        if (researchListEl) researchListEl.innerHTML = html || '<p>Пока нет доступных исследований. Возможно, вы завершили все текущие или нужно повысить уровень.</p>';
    }

    function renderSales() {
        if(salesInfo && salesInfo.totalProfit) salesInfo.totalProfit.textContent = `$${Math.floor(gameState.totalProfit).toLocaleString()}`;
        if(salesInfo && salesInfo.brandAwareness) salesInfo.brandAwareness.textContent = `${gameState.brandAwareness.toFixed(1)} / 100`;
        if (gameState.phones.length === 0) {
            if(salesListEl) salesListEl.innerHTML = '<p>Пока нет моделей в продаже. Разработайте свой первый телефон!</p>';
            return;
        }
        let html = '';
        // Sort phones by daysOnMarket (newest first) or status? Let's display newest first for clarity.
        [...gameState.phones].sort((a, b) => b.id - a.id).forEach(phone => {
            const status = (phone.isActive) ?
                           ((phone.stock || 0) > 0 ? `<span class="text-success">В продаже</span>` : `<span class="text-warning">Нет на складе</span>`) :
                           `<span class="text-error">Снят с продажи</span>`;
            // Show restock button only if phone was active at some point AND has valid cost
             const showRestock = (phone.daysOnMarket > 0 || (phone.stock || 0) > 0) && (phone.totalCost || 0) > 0;


            html += `
                <div class="card">
                    <h3>${phone.name || 'N/A'} <span class="text-small">(${status})</span></h3>
                    <div class="spec-line">
                        <span>Цена / Себестоимость:</span>
                        <span>$${phone.price || 0} / $${(phone.totalCost || 0).toFixed(0)}</span>
                    </div>
                    <div class="spec-line">
                        <span>На складе:</span>
                        <span>${(phone.stock || 0).toLocaleString()} шт.</span>
                    </div>
                    <div class="spec-line">
                        <span>Продано всего:</span>
                        <span>${(phone.sales && phone.sales.units || 0).toLocaleString()} шт.</span>
                    </div>
                     <div class="spec-line">
                        <span>Прибыль с модели:</span>
                        <span class="text-success">$${Math.floor(phone.sales && phone.sales.profit || 0).toLocaleString()}</span>
                    </div>
                    <div class="spec-line">
                         <span>Дней на рынке:</span>
                         <span>${phone.daysOnMarket || 0} / ${gameState.maxSalesLifecycle}</span>
                     </div>
                    <div class="phone-card-actions">
                         <button class="change-price-btn secondary" data-id="${phone.id}">Изменить цену</button>
                         ${showRestock ? `<button class="restock-btn secondary" data-id="${phone.id}">Произвести еще</button>` : ''}
                         ${!phone.isActive && phone.daysOnMarket >= gameState.maxSalesLifecycle ? `<button class="secondary" disabled>Жизненный цикл завершен</button>` : ''}
                     </div>
                </div>
            `;
        });
        if(salesListEl) salesListEl.innerHTML = html;
    }

    function renderTrends() {
        let html = '<h3 class="section-title">Текущие Тренды</h3>';
        if (gameState.trends.current.length > 0) {
            gameState.trends.current.forEach((trend, index) => {
                // Strength text now reflects the actual calculated strength
                const strengthText = index === 0 ? `🔥 Главный тренд (+${(trend.strength * 100).toFixed(0)}%)` : `⚡ Тренд (+${(trend.strength * 100).toFixed(0)}%)`;
                html += `
                    <div class="card">
                        <h3>${trend.name || 'Неизвестный тренд'}</h3>
                        <p class="text-small" style="margin-bottom: 10px;">${trend.description || 'Нет описания'}</p>
                        <p class="text-warning">${strengthText}</p>
                    </div>
                `;
            });
        } else {
            html += '<p>Рынок стабилен, явных трендов нет.</p>';
        }
        html += '<h3 class="section-title">Прогноз на следующий квартал</h3>';
        if (gameState.trends.upcoming.length > 0) {
            gameState.trends.upcoming.forEach(trend => {
                html += `
                    <div class="card">
                        <h3>${trend.name || 'Неизвестный тренд'}</h3>
                        <p class="text-small">${trend.description || 'Нет описания'}</p>
                    </div>
                `;
            });
        } else {
            html += '<p>Прогнозов пока нет.</p>';
        }
        if(trendsContentEl) trendsContentEl.innerHTML = html;
    }

    function renderCompetitionScreen() {
        const player = {
            id: 'player',
            name: 'Pixel Perfect (Вы)',
             // Use total profit for competition ranking
            money: gameState.totalProfit,
            level: gameState.level,
            brandAwareness: gameState.brandAwareness,
            isPlayer: true
        };

        // Filter out competitors that might be "inactive" or have 0 money if desired,
        // but for a simple list, showing all might be okay.
        // Let's assume competitors array is already filtered or represents all relevant competitors.
        const allParticipants = [player, ...competitors];

        // Ensure sorting key exists on all objects or handle undefined values
        const validSortKeys = ['rank', 'name', 'brandAwareness', 'level', 'money'];
        const currentSortKey = gameState.competitionSort.key;
        const effectiveSortKey = (currentSortKey === 'rank' || !validSortKeys.includes(currentSortKey)) ? 'money' : currentSortKey;


        allParticipants.sort((a, b) => {
            let valA, valB;

            if (effectiveSortKey === 'name') {
                valA = String(a.name || '').toLowerCase();
                valB = String(b.name || '').toLowerCase();
                const nameCompare = valA.localeCompare(valB);
                 return gameState.competitionSort.direction === 'asc' ? nameCompare : -nameCompare;
            } else {
                 // Handle numeric/other keys, ensuring undefined/null values are treated consistently
                 valA = a[effectiveSortKey];
                 valB = b[effectiveSortKey];

                 // Treat undefined/null based on sort direction to put them at the end
                 const numA = (valA === undefined || valA === null) ? (gameState.competitionSort.direction === 'asc' ? Infinity : -Infinity) : (typeof valA === 'number' ? valA : parseFloat(valA) || 0);
                 const numB = (valB === undefined || valB === null) ? (gameState.competitionSort.direction === 'asc' ? Infinity : -Infinity) : (typeof valB === 'number' ? valB : parseFloat(valB) || 0);

                 return gameState.competitionSort.direction === 'asc' ? numA - numB : numB - numA;
            }
        });

        let html = '';
        allParticipants.forEach((p, index) => {
            // Recalculate rank after sorting by the chosen key
            const rank = index + 1; // Rank is based on the sorted position
            const rowClass = p.isPlayer ? 'player-row' : '';

            html += `
                <tr class="${rowClass}">
                    <td>${rank}</td>
                    <td>${p.name || 'N/A'}</td>
                    <td>${(p.brandAwareness || 0).toFixed(1)}</td>
                    <td>${p.level || 0}</td>
                    <td>$${Math.floor(p.money || 0).toLocaleString()}</td>
                </tr>
            `;
        });

        if (competitionTableBody) competitionTableBody.innerHTML = html;

        if (competitionTableHeader) {
             competitionTableHeader.querySelectorAll('th').forEach(th => {
                th.classList.remove('sort-asc', 'sort-desc');
                // Highlight the column being sorted
                if (th.dataset.sort === currentSortKey) { // Use currentSortKey from state for highlighting
                     th.classList.add(`sort-${gameState.competitionSort.direction}`);
                }
            });
        }
    }

    function var_to_css_color(varName) {
        const rootStyle = getComputedStyle(document.documentElement);
        return rootStyle.getPropertyValue(varName).trim();
    }


    init();

});
