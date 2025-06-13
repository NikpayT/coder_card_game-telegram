// js/main.js

// Глобальный объект для хранения ссылок на UI элементы
const ui = {

        screens: {
        // ...
        history: document.getElementById('history-screen'), // <--- ДОБАВИТЬ ЭТО
    },
    clubTrophiesList: document.getElementById('club-trophies-list'), // <--- ДОБАВИТЬ ЭТО
    clubSeasonsList: document.getElementById('club-seasons-list'),   // <--- ДОБАВИТЬ ЭТО
    clubRecordsList: document.getElementById('club-records-list'),   // <--- ДОБАВИТЬ ЭТО
    leagueRecordsList: document.getElementById('league-records-list'), // <--- ДОБАВИТЬ ЭТО
};

// --- Инициализация при загрузке DOM ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM загружен, инициализация игры...");
    initUIElements(); // Инициализация ссылок на DOM-элементы
    if (typeof initOrResetGameState === "function") { // initOrResetGameState из game_state.js
        initOrResetGameState(); // Инициализация пустого gameState
        initGameFlow();       // Основная логика старта игры
    } else {
        console.error("CRITICAL: initOrResetGameState не найдена! Невозможно запустить игру.");
        alert("Критическая ошибка: Необходимые функции игры не загружены. Пожалуйста, проверьте консоль и обновите страницу.");
    }
});

function initUIElements() {
    // Header
    ui.clubNameHeader = document.getElementById('club-name-header');
    ui.budget = document.getElementById('budget');
    ui.currentWeek = document.getElementById('current-week');
    ui.totalWeeks = document.getElementById('total-weeks');
    ui.currentSeason = document.getElementById('current-season');
    ui.fanHappiness = document.getElementById('fan-happiness');
    ui.boardConfidence = document.getElementById('board-confidence');
    ui.saveGameBtn = document.getElementById('save-game-btn');
    ui.loadGameBtn = document.getElementById('load-game-btn');
    ui.newGameBtn = document.getElementById('new-game-btn');
    ui.settingsBtn = document.getElementById('settings-btn');

    // Main Nav & Next Week
    ui.mainNavButtons = document.querySelectorAll('#main-nav button[data-screen]');
    ui.nextWeekBtn = document.getElementById('next-week-btn');

    // Screens
    ui.screens = {
        news: document.getElementById('news-screen'),
        office: document.getElementById('office-screen'),
        team: document.getElementById('team-screen'),
        tactics: document.getElementById('tactics-screen'),
        training: document.getElementById('training-screen'),
        youth_academy: document.getElementById('youth_academy-screen'),
        staff: document.getElementById('staff-screen'),
        transfers: document.getElementById('transfers-screen'),
        facilities: document.getElementById('facilities-screen'),
        finances: document.getElementById('finances-screen'),
        fixtures: document.getElementById('fixtures-screen'),
        league: document.getElementById('league-screen'),
        cup: document.getElementById('cup-screen'),
    };
    ui.newsFeed = document.getElementById('news-feed');

    // Office Screen
    ui.holdTeamMeetingBtn = document.getElementById('hold-team-meeting-btn');
    ui.callPressConferenceBtn = document.getElementById('call-press-conference-btn');
    ui.teamMeetingCooldownDisplay = document.getElementById('team-meeting-cooldown-display');
    ui.pressConferenceCooldownDisplay = document.getElementById('press-conference-cooldown-display');
    ui.boardConfidenceText = document.getElementById('board-confidence-text');
    ui.boardConfidenceValue = document.getElementById('board-confidence-value');
    ui.fanHappinessText = document.getElementById('fan-happiness-text');
    ui.fanHappinessValue = document.getElementById('fan-happiness-value');
    ui.teamAtmosphereDisplay = document.getElementById('team-atmosphere-display');
    ui.seasonObjectivesList = document.getElementById('season-objectives-list');

    // Team Screen
    ui.squadSizeDisplay = document.getElementById('squad-size-display');
    ui.totalAttack = document.getElementById('total-attack');
    ui.totalDefense = document.getElementById('total-defense');
    ui.avgMorale = document.getElementById('avg-morale');
    ui.avgForm = document.getElementById('avg-form');
    ui.teamCohesionDisplay = document.getElementById('team-cohesion-display');
    ui.playerListFilterPosition = document.getElementById('player-list-filter-position');
    ui.playerListFilterStatus = document.getElementById('player-list-filter-status');
    ui.playerListSort = document.getElementById('player-list-sort');
    ui.playerList = document.getElementById('player-list');

    // Tactics Screen
    ui.formationSelect = document.getElementById('formation-select');
    ui.tacticSelect = document.getElementById('tactic-select');
    ui.autoFillLineupBtn = document.getElementById('auto-fill-lineup-btn');
    ui.startingLineupFormation = document.getElementById('starting-lineup-formation');
    ui.benchCountDisplay = document.getElementById('bench-count-display');
    ui.benchPlayersList = document.getElementById('bench-players-list');

    // Training Screen
    ui.trainingEffectivenessBonus = document.getElementById('training-effectiveness-bonus');
    ui.trainingInjuryRisk = document.getElementById('training-injury-risk');
    ui.trainingSlotsAvailable = document.getElementById('training-slots-available');
    ui.trainingSlotsMax = document.getElementById('training-slots-max');
    ui.trainingPlayerSelection = document.getElementById('training-player-selection');
    ui.teamTrainingFocus = document.getElementById('team-training-focus');
    ui.teamTrainingDescription = document.getElementById('team-training-description');

    // Youth Academy Screen
    ui.youthFacilityLevel = document.getElementById('youth-facility-level');
    ui.youthDevBonus = document.getElementById('youth-dev-bonus');
    ui.youthSquadSize = document.getElementById('youth-squad-size');
    ui.youthSquadMax = document.getElementById('youth-squad-max');
    ui.youthIntakeCountdown = document.getElementById('youth-intake-countdown');
    ui.youthCoachNameDisplay = document.getElementById('youth-coach-name-display');
    ui.youthPlayerList = document.getElementById('youth-player-list');

    // Staff Screen
    ui.currentCoachInfo = document.getElementById('current-coach-info');
    ui.availableCoachesList = document.getElementById('available-coaches-list');
    ui.otherStaffSectionsContainer = document.getElementById('other-staff-sections-container');

    // Transfers Screen
    ui.transferFilterPosition = document.getElementById('transfer-filter-position');
    ui.transferFilterAge = document.getElementById('transfer-filter-age');
    ui.transferFilterPrice = document.getElementById('transfer-filter-price');
    ui.applyTransferFiltersBtn = document.getElementById('apply-transfer-filters-btn');
    ui.scoutingAccuracyDisplay = document.getElementById('scouting-accuracy-display');
    ui.scoutingAssignmentsDisplay = document.getElementById('scouting-assignments-display');
    ui.scoutingCapacityDisplay = document.getElementById('scouting-capacity-display');
    ui.transferMarketList = document.getElementById('transfer-market-list');

    // Facilities Screen
    ui.facilitiesList = document.getElementById('facilities-list');

    // Finances Screen
    ui.financeBudgetDisplay = document.getElementById('finance-budget-display');
    ui.financeWeeklyIncome = document.getElementById('finance-weekly-income');
    ui.financeWeeklyExpense = document.getElementById('finance-weekly-expense');
    ui.financeWeeklyBalance = document.getElementById('finance-weekly-balance');
    ui.sponsorsList = document.getElementById('sponsors-list');
    ui.findNewSponsorBtn = document.getElementById('find-new-sponsor-btn');
    ui.incomeBreakdownList = document.getElementById('income-breakdown-list');
    ui.expenseBreakdownList = document.getElementById('expense-breakdown-list');
    ui.transactionHistoryLimitDisplay = document.getElementById('transaction-history-limit-display');
    ui.transactionHistory = document.getElementById('transaction-history');

    // Fixtures Screen
    ui.fixtureFilters = document.querySelector('.fixture-filters');
    ui.matchSchedule = document.getElementById('match-schedule');
    ui.lastUserMatchResultText = document.getElementById('last-user-match-result-text');

    // League & Cup Screens
    ui.leagueTableBody = document.getElementById('league-table-body');
    ui.cupNameDisplay = document.getElementById('cup-name-display');
    ui.cupCurrentRound = document.getElementById('cup-current-round');
    ui.cupBracketOrNextMatch = document.getElementById('cup-bracket-or-next-match');

    // Overlays
    ui.initialSetupOverlay = document.getElementById('initial-setup-overlay');
    ui.userClubNameInput = document.getElementById('user-club-name-input');
    ui.avatarSelection = document.querySelector('.avatar-selection');
    ui.startGameBtn = document.getElementById('start-game-btn');

    ui.matchSimOverlay = document.getElementById('match-simulation-overlay');
    ui.matchTeamsInfo = document.getElementById('match-teams-info');
    ui.matchTimeDisplay = document.getElementById('match-time-display');
    ui.matchCurrentScore = document.getElementById('match-current-score');
    ui.matchSimTacticsPanel = document.querySelector('.match-sim-tactics-panel');
    ui.userTeamSimName = document.getElementById('user-team-sim-name');
    ui.substitutionsLeft = document.getElementById('substitutions-left');
    ui.substitutionsMax = document.getElementById('substitutions-max');
    ui.inMatchTacticSelect = document.getElementById('in-match-tactic-select');
    ui.makeSubstitutionBtn = document.getElementById('make-substitution-btn');
    ui.matchEvents = document.getElementById('match-events');
    ui.finalScore = document.getElementById('final-score');
    ui.continueMatchSimBtn = document.getElementById('continue-match-sim-btn');
    ui.skipToResultBtn = document.getElementById('skip-to-result-btn');
    ui.closeMatchSimBtn = document.getElementById('close-match-sim-btn');

    ui.playerDetailsOverlay = document.getElementById('player-details-overlay');
    ui.detailsPlayerName = document.getElementById('details-player-name');
    ui.detailsPlayerAge = document.getElementById('details-player-age');
    ui.detailsPlayerPosition = document.getElementById('details-player-position');
    ui.detailsPlayerDetailedPosition = document.getElementById('details-player-detailed-position');
    ui.detailsPlayerPersonality = document.getElementById('details-player-personality');
    ui.detailsPlayerAttack = document.getElementById('details-player-attack');
    ui.detailsPlayerDefense = document.getElementById('details-player-defense');
    ui.detailsPlayerPotentialRating = document.getElementById('details-player-potential-rating');
    ui.detailsPlayerForm = document.getElementById('details-player-form');
    ui.detailsPlayerMorale = document.getElementById('details-player-morale');
    ui.detailsPlayerStatus = document.getElementById('details-player-status');
    ui.detailsPlayerSalary = document.getElementById('details-player-salary');
    ui.detailsPlayerContractWeeksLeft = document.getElementById('details-player-contract-weeks-left');
    ui.detailsPlayerContractEnds = document.getElementById('details-player-contract-ends');
    ui.detailsPlayerPrice = document.getElementById('details-player-price');
    ui.detailsPlayerOnloanTeam = document.getElementById('details-player-onloan-team');
    ui.detailsPlayerOnloanWeeks = document.getElementById('details-player-onloan-weeks');
    ui.detailsPlayerOnloanWage = document.getElementById('details-player-onloan-wage');
    ui.detailsPlayerOnloanTeamPaysWage = document.getElementById('details-player-onloan-team-pays-wage');
    ui.playerActionsInDetails = document.getElementById('player-actions-in-details');
    ui.closePlayerDetailsBtn = document.getElementById('close-player-details-btn');

    ui.contractNegotiationOverlay = document.getElementById('contract-negotiation-overlay');
    ui.negotiatePlayerName = document.getElementById('negotiate-player-name');
    ui.currentSalaryDisplay = document.getElementById('current-salary-display');
    ui.currentWeeksLeftDisplay = document.getElementById('current-weeks-left-display');
    ui.expectedSalaryDisplay = document.getElementById('expected-salary-display');
    ui.expectedDurationDisplay = document.getElementById('expected-duration-display');
    ui.newSalaryInput = document.getElementById('new-salary-input');
    ui.newDurationSelect = document.getElementById('new-duration-select');
    ui.releaseClauseInput = document.getElementById('release-clause-input');
    ui.signingBonusInput = document.getElementById('signing-bonus-input');
    ui.loyaltyBonusInput = document.getElementById('loyalty-bonus-input');
    ui.negotiationFeedback = document.getElementById('negotiation-feedback');
    ui.offerContractBtn = document.getElementById('offer-contract-btn');
    ui.cancelNegotiationBtn = document.getElementById('cancel-negotiation-btn');

    ui.pressConferenceOverlay = document.getElementById('press-conference-overlay');
    ui.pressTopicQuestion = document.getElementById('press-topic-question');
    ui.pressOptionsContainer = document.getElementById('press-options-container');
    ui.skipPressQuestionBtn = document.getElementById('skip-press-question-btn');

    ui.substitutionOverlay = document.getElementById('substitution-overlay');
    ui.subOutPlayerSelect = document.getElementById('sub-out-player-select');
    ui.subInPlayerSelect = document.getElementById('sub-in-player-select');
    ui.confirmSubstitutionBtn = document.getElementById('confirm-substitution-btn');
    ui.cancelSubstitutionBtn = document.getElementById('cancel-substitution-btn');

    ui.genericMessageOverlay = document.getElementById('generic-message-overlay');
    ui.genericMessageTitle = document.getElementById('generic-message-title');
    ui.genericMessageText = document.getElementById('generic-message-text');
    ui.genericMessageOkBtn = document.getElementById('generic-message-ok-btn');

    ui.settingsOverlay = document.getElementById('settings-overlay');
    ui.settingSimSpeed = document.getElementById('setting-sim-speed');
    ui.settingAutosave = document.getElementById('setting-autosave');
    ui.settingDifficulty = document.getElementById('setting-difficulty');
    ui.saveSettingsBtn = document.getElementById('save-settings-btn');
    ui.closeSettingsBtn = document.getElementById('close-settings-btn');
}

function initGameFlow() {
    // Загрузка опций для select элементов из ui_renderer.js
    // Эти функции должны быть доступны глобально, так как они определены в ui_renderer.js
    if (typeof loadFormationOptions === "function") loadFormationOptions(); else console.error("loadFormationOptions не найдена (должна быть в ui_renderer.js)");
    if (typeof loadTacticOptions === "function") loadTacticOptions(); else console.error("loadTacticOptions не найдена (должна быть в ui_renderer.js)");
    if (typeof loadTeamTrainingOptions === "function") loadTeamTrainingOptions(); else console.error("loadTeamTrainingOptions не найдена (должна быть в ui_renderer.js)");
    if (typeof loadPlayerFilterOptions === "function") loadPlayerFilterOptions(); else console.error("loadPlayerFilterOptions не найдена (должна быть в ui_renderer.js)");
    if (typeof loadContractDurationOptions === "function") loadContractDurationOptions(); else console.error("loadContractDurationOptions не найдена (должна быть в ui_renderer.js)");

    addEventListeners(); // Установка всех слушателей событий

    if (typeof loadGame === "function" && loadGame()) { // loadGame из game_state.js
        console.log("Игра успешно загружена из localStorage.");
        if(ui.initialSetupOverlay) {
            ui.initialSetupOverlay.style.display = 'none';
            ui.initialSetupOverlay.classList.remove('active');
        }
        if (typeof updateAllUIDisplays === "function") updateAllUIDisplays(); else console.error("updateAllUIDisplays не найдена (должна быть в ui_renderer.js)");
        showScreen('news'); // showScreen - локальная функция main.js
    } else {
        console.log("Сохраненная игра не найдена или ошибка загрузки, показываем экран настройки.");
        // gameState уже должен быть сброшен/инициализирован функцией initOrResetGameState()
        if(ui.initialSetupOverlay) {
            ui.initialSetupOverlay.style.display = 'flex';
            ui.initialSetupOverlay.classList.add('active');
        }
        // Можно добавить новость по умолчанию или очистить, если это необходимо
        if (ui.newsFeed) ui.newsFeed.innerHTML = '<li>Добро пожаловать! Начните новую карьеру.</li>';
    }
}


function addEventListeners() {
    // Кнопка "Начать Карьеру"
    if (ui.startGameBtn) {
        ui.startGameBtn.addEventListener('click', () => {
            console.log("Кнопка 'Начать Карьеру' нажата");
            const clubName = ui.userClubNameInput ? ui.userClubNameInput.value.trim() || "ФК Прогресс" : "ФК Прогресс";
            const selectedAvatarEl = ui.avatarSelection ? ui.avatarSelection.querySelector('.selected') : null;
            const avatar = selectedAvatarEl ? selectedAvatarEl.textContent.trim() : "👔";

            console.log("Выбранный клуб:", clubName, "Аватар:", avatar);

            if(ui.initialSetupOverlay) {
                ui.initialSetupOverlay.style.display = 'none';
                ui.initialSetupOverlay.classList.remove('active');
            }

            if (typeof startGameLogic === "function") { // startGameLogic из game_logic_core.js
                startGameLogic(clubName, avatar);
            } else {
                console.error("Функция startGameLogic не найдена!");
                if (typeof showMessage === "function") showMessage("Критическая ошибка", "Не удалось запустить логику игры. Проверьте консоль.");
            }
        });
    } else { console.error("Кнопка startGameBtn не найдена в DOM!"); }

    // Кнопка "Новая игра"
    if (ui.newGameBtn) {
        ui.newGameBtn.addEventListener('click', () => {
            if (confirm("Начать новую игру? Текущий прогресс будет утерян (если не сохранен).")) {
                if (typeof localStorage !== 'undefined') localStorage.removeItem('footballManagerGrandState_v2.1');
                if (typeof initOrResetGameState === "function") initOrResetGameState();
                if (ui.initialSetupOverlay) {
                    ui.initialSetupOverlay.style.display = 'flex';
                    ui.initialSetupOverlay.classList.add('active');
                }
                if(ui.newsFeed) ui.newsFeed.innerHTML = '<li>Добро пожаловать! Начните новую игру или загрузите сохранение.</li>';
                if(ui.playerList) ui.playerList.innerHTML = '';
                if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
                showScreen('news'); // Показываем новости, т.к. это дефолтный экран
            }
        });
    }

    // Выбор аватара
    if (ui.avatarSelection) {
        ui.avatarSelection.addEventListener('click', (e) => {
            if (e.target.tagName === 'SPAN') {
                ui.avatarSelection.querySelectorAll('span').forEach(s => s.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        });
    }

    // Сохранение/Загрузка
    if(ui.saveGameBtn && typeof saveGame === "function") ui.saveGameBtn.addEventListener('click', saveGame);
    if(ui.loadGameBtn && typeof loadGame === "function") {
        ui.loadGameBtn.addEventListener('click', () => {
            if (loadGame()) {
                if(ui.initialSetupOverlay) {
                    ui.initialSetupOverlay.style.display = 'none';
                    ui.initialSetupOverlay.classList.remove('active');
                }
                if (typeof updateAllUIDisplays === "function") updateAllUIDisplays();
                showScreen('news');
            } else { // Если загрузка не удалась, gameState уже сброшен или остался дефолтным.
                if (ui.initialSetupOverlay) { // Показываем экран новой игры.
                    ui.initialSetupOverlay.style.display = 'flex';
                    ui.initialSetupOverlay.classList.add('active');
                }
            }
        });
    }

    // Кнопка "Следующая неделя"
    if(ui.nextWeekBtn) {
        ui.nextWeekBtn.addEventListener('click', () => {
            if (typeof playNextWeek === "function") playNextWeek(); // playNextWeek из game_logic_core.js
            else console.error("playNextWeek не найдена!");
        });
    }

    // Навигация по экранам
    if(ui.mainNavButtons) {
        ui.mainNavButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const screenId = e.currentTarget.dataset.screen;
                if (screenId) showScreen(screenId);
            });
        });
    }

    // Фильтры и сортировки
    if(ui.playerListFilterPosition) ui.playerListFilterPosition.addEventListener('change', () => { if (typeof renderPlayerListWithFilters === "function") renderPlayerListWithFilters(); });
    if(ui.playerListFilterStatus) ui.playerListFilterStatus.addEventListener('change', () => { if (typeof renderPlayerListWithFilters === "function") renderPlayerListWithFilters(); });
    if(ui.playerListSort) ui.playerListSort.addEventListener('change', () => { if (typeof renderPlayerListWithFilters === "function") renderPlayerListWithFilters(); });
    if(ui.applyTransferFiltersBtn) ui.applyTransferFiltersBtn.addEventListener('click', () => { if(typeof renderTransferMarket === "function") renderTransferMarket(); });
    if(ui.fixtureFilters) ui.fixtureFilters.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON') {
            ui.fixtureFilters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            if(typeof renderSchedule === "function") renderSchedule(e.target.dataset.filter);
        }
    });

    // Кнопки на экранах
    if(ui.autoFillLineupBtn) ui.autoFillLineupBtn.addEventListener('click', () => { if (typeof autoFillLineup === "function") autoFillLineup(); });
    if(ui.formationSelect) ui.formationSelect.addEventListener('change', (e) => { if(gameState && gameState.userTeam) {gameState.userTeam.formation = e.target.value; if(typeof autoFillLineup === "function") autoFillLineup(); } if(typeof renderTacticsScreen === "function") renderTacticsScreen(); });
    if(ui.tacticSelect) ui.tacticSelect.addEventListener('change', (e) => { if(gameState && gameState.userTeam) gameState.userTeam.tactic = e.target.value; /* Обновление UI не всегда нужно сразу */ });
    if(ui.teamTrainingFocus) ui.teamTrainingFocus.addEventListener('change', (e) => { if(gameState && gameState.userTeam) gameState.userTeam.teamTrainingFocus = e.target.value; if(typeof renderTrainingScreen === "function") renderTrainingScreen(); });
    if(ui.findNewSponsorBtn) ui.findNewSponsorBtn.addEventListener('click', () => { if (typeof handleFindNewSponsor === "function") handleFindNewSponsor(); });
    if(ui.callPressConferenceBtn) ui.callPressConferenceBtn.addEventListener('click', () => { if (typeof callPressConference === "function") callPressConference(); });
    if(ui.holdTeamMeetingBtn) ui.holdTeamMeetingBtn.addEventListener('click', () => { if (typeof holdTeamMeeting === "function") holdTeamMeeting(); });


    // Оверлеи
    if(ui.closePlayerDetailsBtn && ui.playerDetailsOverlay) ui.closePlayerDetailsBtn.addEventListener('click', () => { ui.playerDetailsOverlay.style.display = 'none'; });
    if(ui.offerContractBtn) ui.offerContractBtn.addEventListener('click', () => { if(typeof handleOfferContract === "function") handleOfferContract(); });
    if(ui.cancelNegotiationBtn && ui.contractNegotiationOverlay) {
        ui.cancelNegotiationBtn.addEventListener('click', () => {
            ui.contractNegotiationOverlay.style.display = 'none';
            if (currentNegotiation) { currentNegotiation.playerId = null; currentNegotiation.type = null; currentNegotiation.itemKey = null;}
        });
    }
    if(ui.skipPressQuestionBtn && ui.pressConferenceOverlay) {
        ui.skipPressQuestionBtn.addEventListener('click', () => {
            ui.pressConferenceOverlay.style.display = 'none';
            if (gameState && gameState.pressConferenceCooldown === 0) gameState.pressConferenceCooldown = 1; // Небольшой КД даже при пропуске
        });
    }
    // Управление симуляцией матча
    if(ui.closeMatchSimBtn && ui.matchSimOverlay) {
        ui.closeMatchSimBtn.addEventListener('click', () => {
            if (currentMatchSimulation && !currentMatchSimulation.matchFinalized) {
                if(typeof finalizeMatchSimulation === "function") finalizeMatchSimulation(true); // true = пропустить до конца
            }
            ui.matchSimOverlay.style.display = 'none';
            currentMatchSimulation = null;
            if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
            showScreen('fixtures'); // После матча возвращаемся в календарь
        });
    }
    if(ui.continueMatchSimBtn && ui.closeMatchSimBtn && ui.skipToResultBtn) {
        ui.continueMatchSimBtn.addEventListener('click', () => {
            if(currentMatchSimulation) {
                currentMatchSimulation.isPaused = false;
                ui.closeMatchSimBtn.textContent = "Завершить"; // Теперь "Завершить", а не "Пропустить"
                ui.continueMatchSimBtn.style.display = 'none';
                ui.skipToResultBtn.style.display = 'none'; // Скрываем "К результату", если матч продолжается по минутам
                if(typeof runMatchMinute === "function") runMatchMinute();
            }
        });
    }
    if(ui.skipToResultBtn) {
        ui.skipToResultBtn.addEventListener('click', () => {
            if (currentMatchSimulation && !currentMatchSimulation.matchFinalized) {
                if(typeof finalizeMatchSimulation === "function") finalizeMatchSimulation(true);
            }
        });
    }
    if(ui.inMatchTacticSelect) {
        ui.inMatchTacticSelect.addEventListener('change', (e) => {
            if (currentMatchSimulation && currentMatchSimulation.isUserMatch && gameState && gameState.userTeam) {
                 // Обновляем тактику в КОПИИ команды в симуляции
                const userTeamInSim = currentMatchSimulation.homeTeam.name === gameState.userTeam.name ? currentMatchSimulation.homeTeam : currentMatchSimulation.awayTeam;
                userTeamInSim.tactic = e.target.value;
                // Также обновляем в основном gameState, чтобы сохранилось после матча
                gameState.userTeam.tactic = e.target.value;

                if(typeof addMatchEventToUI === "function") addMatchEventToUI(currentMatchSimulation.currentTime, `Тактика изменена на: ${ui.inMatchTacticSelect.options[ui.inMatchTacticSelect.selectedIndex].text}`);
            }
        });
    }
    if(ui.makeSubstitutionBtn && typeof openSubstitutionOverlay === "function") ui.makeSubstitutionBtn.addEventListener('click', openSubstitutionOverlay);
    if(ui.confirmSubstitutionBtn && ui.substitutionOverlay) ui.confirmSubstitutionBtn.addEventListener('click', () => { if(typeof makeSubstitution === "function") makeSubstitution(); });
    if(ui.cancelSubstitutionBtn && ui.substitutionOverlay) ui.cancelSubstitutionBtn.addEventListener('click', () => { ui.substitutionOverlay.style.display = 'none'; });
    if(ui.genericMessageOkBtn && ui.genericMessageOverlay) ui.genericMessageOkBtn.addEventListener('click', () => { ui.genericMessageOverlay.style.display = 'none'; });

    // Настройки
    if(ui.settingsBtn && ui.settingsOverlay) {
        ui.settingsBtn.addEventListener('click', () => {
            if (gameState && gameState.settings) {
                 if(ui.settingSimSpeed) ui.settingSimSpeed.value = gameState.settings.matchSimulationSpeed;
                 if(ui.settingAutosave) ui.settingAutosave.checked = gameState.settings.autoSave;
                 if(ui.settingDifficulty) ui.settingDifficulty.value = gameState.settings.difficulty;
            }
            ui.settingsOverlay.style.display = 'flex';
        });
    }
    if(ui.closeSettingsBtn && ui.settingsOverlay) {
        ui.closeSettingsBtn.addEventListener('click', () => {
            ui.settingsOverlay.style.display = 'none';
        });
    }
    if(ui.saveSettingsBtn && ui.settingsOverlay) {
        ui.saveSettingsBtn.addEventListener('click', () => {
            if (gameState && gameState.settings) {
                if(ui.settingSimSpeed) gameState.settings.matchSimulationSpeed = parseInt(ui.settingSimSpeed.value) || 100;
                if(ui.settingAutosave) gameState.settings.autoSave = ui.settingAutosave.checked;
                if(ui.settingDifficulty) gameState.settings.difficulty = ui.settingDifficulty.value;
                if (typeof showMessage === "function") showMessage("Настройки", "Настройки сохранены.");
            }
            ui.settingsOverlay.style.display = 'none';
        });
    }
}

// --- Управление экранами ---
function showScreen(screenId) {
    if (!ui.screens) { console.error("UI screens не инициализированы в showScreen!"); return; }

    let screenActivated = false;
    for (const key in ui.screens) {
        if (ui.screens[key]) {
            const isActive = key === screenId;
            ui.screens[key].classList.toggle('active', isActive);
            ui.screens[key].style.display = isActive ? 'block' : 'none';
            if (isActive) screenActivated = true;
        }
    }

    if (!screenActivated && ui.screens.news) {
        console.warn(`Экран ${screenId} не найден или его DOM элемент отсутствует, показываем новости.`);
        ui.screens.news.classList.add('active');
        ui.screens.news.style.display = 'block';
        screenId = 'news'; // Обновляем screenId для подсветки кнопки навигации
    }

    if (ui.mainNavButtons) {
        ui.mainNavButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.screen === screenId);
        });
    }

    // Вызов специфичной функции рендеринга для активного экрана
    const renderFunctionName = `render${screenId.charAt(0).toUpperCase() + screenId.slice(1)}Screen`;
    if (typeof window[renderFunctionName] === "function") {
        window[renderFunctionName]();
    } else if (screenId === "league" && typeof renderLeagueTable === "function") {
        renderLeagueTable();
    } else if (screenId === "cup" && typeof renderCupScreen === "function") {
        renderCupScreen();
    } else if (screenId === "fixtures" && typeof renderSchedule === "function" && ui.fixtureFilters) {
        renderSchedule(ui.fixtureFilters.querySelector('button.active')?.dataset.filter || "current_week");
    } else if (screenId === "news" && typeof renderNewsFeed === "function") {
        renderNewsFeed(); // Новости рендерятся при каждом показе, т.к. могут часто обновляться
    } else {
        // console.log(`No specific render function for screen: ${screenId} or it's already handled by updateAllUIDisplays`);
    }
    // updateAllUIDisplays(); // Можно вызывать здесь для обновления всех данных, но это может быть избыточно.
                           // Лучше, чтобы каждая render*Screen функция сама обновляла всё необходимое для своего экрана.
                           // updateAllUIDisplays() вызывается после playNextWeek и загрузки игры.
}


// --- Функции для оверлеев ---
function openContractNegotiation(playerId) {
    if (!currentNegotiation || !gameState || !gameState.userTeam || !gameState.userTeam.players) {console.error("Ошибка открытия переговоров: нет данных"); return;}
    currentNegotiation.playerId = playerId;
    currentNegotiation.type = 'contract';
    const player = gameState.userTeam.players.find(p => p.id === playerId);
    if (!player) { console.error("Player not found for negotiation:", playerId); return; }

    if(!ui.negotiatePlayerName || !ui.currentSalaryDisplay || !ui.currentWeeksLeftDisplay || !ui.expectedSalaryDisplay || !ui.newSalaryInput || !ui.expectedDurationDisplay || !ui.newDurationSelect || !ui.releaseClauseInput || !ui.signingBonusInput || !ui.loyaltyBonusInput || !ui.negotiationFeedback || !ui.contractNegotiationOverlay) {
        console.error("Не все UI элементы для переговоров по контракту найдены.");
        return;
    }


    ui.negotiatePlayerName.textContent = player.name;
    ui.currentSalaryDisplay.textContent = player.contract.salary.toLocaleString();
    ui.currentWeeksLeftDisplay.textContent = typeof getWeeksLeftInContract === "function" ? getWeeksLeftInContract(player) : 'N/A';

    const currentOverall = typeof getEffectivePlayerStats === "function" ? getEffectivePlayerStats(player).overall : ((player.attack + player.defense)/2);
    const potentialValue = typeof getPlayerPotentialValue === "function" ? getPlayerPotentialValue(player) : (player.attack + player.defense + 20);
    const ageFactor = Math.max(0.5, 1.5 - (player.age - 18) * 0.04);
    const moraleFactor = Math.max(0.6, player.morale / 100 + 0.1);
    const teamReputationFactor = Math.max(0.7, (gameState.userTeam.reputation || 50) / 75 + 0.2);
    const performanceFactor = Math.max(0.7, currentOverall / 75);

    let expectedSalaryRaw = player.contract.salary * 0.6 +
                           (currentOverall * 15 + potentialValue * 20) * ageFactor * moraleFactor * performanceFactor / teamReputationFactor;
    expectedSalaryRaw *= (1 + (player.personality === 'Амбициозный' ? 0.20 : (player.personality === 'Неконфликтный' ? -0.08 : 0.05)));

    const expectedSalary = Math.max(player.contract.salary, Math.floor(expectedSalaryRaw / 50) * 50 + 50);
    ui.expectedSalaryDisplay.textContent = `~${expectedSalary.toLocaleString()}`;
    ui.newSalaryInput.value = expectedSalary;
    ui.newSalaryInput.min = Math.floor(player.contract.salary * 0.60 / 50) * 50; // Минимум 60% от текущей

    let expectedDurationWeeks;
    if (player.age < 24) expectedDurationWeeks = CONTRACT_LENGTHS_WEEKS.veryLong;
    else if (player.age < 28) expectedDurationWeeks = CONTRACT_LENGTHS_WEEKS.long;
    else if (player.age < 32) expectedDurationWeeks = CONTRACT_LENGTHS_WEEKS.medium;
    else expectedDurationWeeks = CONTRACT_LENGTHS_WEEKS.short;
    player.contract.desiredContractLength = expectedDurationWeeks; // Сохраняем для логики принятия в game_logic

    ui.expectedDurationDisplay.textContent = `~${Math.round(expectedDurationWeeks / (WEEKS_IN_YEAR/12))} мес.`;
    ui.newDurationSelect.value = expectedDurationWeeks;
    ui.releaseClauseInput.value = player.contract.releaseClause > 0 ? player.contract.releaseClause : Math.floor(player.price * (1.8 + Math.random()*1.7) / 10000) * 10000; // 1.8-3.5x
    ui.signingBonusInput.value = player.contract.signingBonus || Math.floor(expectedSalary * (0.5 + Math.random())); // 0.5-1.5 недельной ЗП
    ui.loyaltyBonusInput.value = player.contract.loyaltyBonus || Math.floor(expectedSalary * (1 + Math.random()*2) * (expectedDurationWeeks / WEEKS_IN_YEAR) / 1000) * 1000 ; // За год лояльности

    ui.negotiationFeedback.textContent = '';
    ui.contractNegotiationOverlay.style.display = 'flex';
}

function openSubstitutionOverlay() {
    if (!currentMatchSimulation || !currentMatchSimulation.matchId || !gameState || !gameState.userTeam || typeof getTeamReference !== 'function') {
        console.warn("Невозможно открыть оверлей замен: нет данных матча или команды.");
        return;
    }
    // Определяем, какая команда пользователя в симуляции (хозяева или гости)
    const userTeamInSim = currentMatchSimulation.homeTeam.name === gameState.userTeam.name ? currentMatchSimulation.homeTeam : currentMatchSimulation.awayTeam;

    if (!userTeamInSim || !userTeamInSim.startingXI || !userTeamInSim.players) {
        console.warn("Невозможно открыть оверлей замен: нет данных о команде пользователя в симуляции.");
        return;
    }
    if(!ui.subOutPlayerSelect || !ui.subInPlayerSelect || !ui.substitutionOverlay) {
        console.error("Не все UI элементы для замены найдены.");
        return;
    }


    ui.subOutPlayerSelect.innerHTML = '<option value="">-- Заменить игрока --</option>';
    userTeamInSim.startingXI.filter(id => id !== null).forEach(playerId => {
        const player = userTeamInSim.players.find(p => p.id === playerId); // Ищем в команде из симуляции
        if (player && player.status) {
            const stamina = (currentMatchSimulation.playerStamina && currentMatchSimulation.playerStamina[player.id] !== undefined) ? currentMatchSimulation.playerStamina[player.id] : player.form;
            const statusText = player.status.type !== 'fit' ? `(${player.status.type.slice(0,3)}.)` : ((currentMatchSimulation.playerStamina && currentMatchSimulation.playerStamina[player.id] !== undefined && currentMatchSimulation.playerStamina[player.id] < 25) ? '(Устал!)' : '');
            ui.subOutPlayerSelect.innerHTML += `<option value="${player.id}">${player.name.split(" ")[1]} (${player.position}, ${Math.round(stamina)}% ${statusText})</option>`;
        }
    });

    ui.subInPlayerSelect.innerHTML = '<option value="">-- Выпустить на поле --</option>';
    userTeamInSim.players.filter(p => p && p.status && !userTeamInSim.startingXI.includes(p.id) && p.status.type === 'fit' && !p.internationalDuty && !p.onLoan).forEach(player => {
        ui.subInPlayerSelect.innerHTML += `<option value="${player.id}">${player.name.split(" ")[1]} (${player.position}, ${player.form}% форма)</option>`;
    });
    ui.substitutionOverlay.style.display = 'flex';
}

function showMessage(title, text, type = 'info') {
    if(!ui.genericMessageOverlay || !ui.genericMessageTitle || !ui.genericMessageText) {
        console.warn("showMessage: Generic Message Overlay UI elements не найдены. Используем alert.");
        alert(`${title}\n${text}`);
        return;
    }
    ui.genericMessageTitle.textContent = title;
    ui.genericMessageText.textContent = text;
    ui.genericMessageOverlay.className = `overlay message-${type} active`; // Убедимся, что класс active добавляется
    ui.genericMessageOverlay.style.display = 'flex';
}

// Вспомогательная функция для добавления событий матча в UI (если она не в game_logic_match_sim.js)
function addMatchEventToUI(time, eventText) {
    if (ui.matchEvents) {
        const eventLi = document.createElement('li');
        eventLi.innerHTML = `<strong>${String(time).padStart(2,'0')}'</strong>: ${eventText}`;
        ui.matchEvents.appendChild(eventLi);
        ui.matchEvents.scrollTop = ui.matchEvents.scrollHeight;
    }
}

// --- Информация об игроке (детали) ---
function showPlayerDetails(playerId, sourceArray) {
    if (!ui.playerDetailsOverlay || !gameState) {
        console.error("Необходимые UI элементы или gameState для деталей игрока не найдены.");
        return;
    }

    // Ищем игрока в предоставленном массиве, затем в команде пользователя, академии, на трансферном рынке
    let player = sourceArray ? sourceArray.find(p => p.id === playerId) : null;
    if (!player && gameState.userTeam) player = gameState.userTeam.players.find(p => p.id === playerId);
    if (!player && gameState.userTeam && gameState.userTeam.youthAcademy) player = gameState.userTeam.youthAcademy.players.find(p => p.id === playerId);
    if (!player && gameState.transferMarket) player = gameState.transferMarket.players.find(p => p.id === playerId);

    if (!player) {
        showMessage("Ошибка", "Игрок с ID " + playerId + " не найден.");
        return;
    }

    const displayPlayer = (player.isUserPlayer || player.isYouth || player.scoutedLevel >= 3) ? player : (typeof getScoutedPlayerDisplayStats === "function" ? getScoutedPlayerDisplayStats(player) : player);
    const potentialRating = typeof getPlayerPotentialRating === "function" ? getPlayerPotentialRating(player) : '?';
    const weeksLeft = typeof getWeeksLeftInContract === "function" ? getWeeksLeftInContract(player) : (player.isYouth ? Infinity : 0);
    const contractEndDate = player.contract && player.contract.endDate ? `${player.contract.endDate.week}/${player.contract.endDate.season}` : 'N/A';

    if(ui.detailsPlayerName) ui.detailsPlayerName.textContent = displayPlayer.name || 'Неизвестно';
    if(ui.detailsPlayerAge) ui.detailsPlayerAge.textContent = displayPlayer.age || '?';
    if(ui.detailsPlayerPosition) ui.detailsPlayerPosition.textContent = displayPlayer.position || '?';
    if(ui.detailsPlayerDetailedPosition) ui.detailsPlayerDetailedPosition.textContent = displayPlayer.detailedPosition || (displayPlayer.position || '?');
    if(ui.detailsPlayerPersonality) ui.detailsPlayerPersonality.textContent = displayPlayer.personality || '?';
    if(ui.detailsPlayerAttack) ui.detailsPlayerAttack.textContent = displayPlayer.attack || '?';
    if(ui.detailsPlayerDefense) ui.detailsPlayerDefense.textContent = displayPlayer.defense || '?';
    if(ui.detailsPlayerPotentialRating) ui.detailsPlayerPotentialRating.textContent = potentialRating;
    if(ui.detailsPlayerForm) ui.detailsPlayerForm.textContent = displayPlayer.form !== undefined ? displayPlayer.form : '?';
    if(ui.detailsPlayerMorale) ui.detailsPlayerMorale.textContent = displayPlayer.morale !== undefined ? displayPlayer.morale : '?';
    if(ui.detailsPlayerStatus && displayPlayer.status) {
        ui.detailsPlayerStatus.textContent = `${displayPlayer.status.type === 'fit' ? 'Готов' :
                                              (displayPlayer.status.type === 'injured' ? `Травма (${displayPlayer.status.duration} нед.)` :
                                              (displayPlayer.status.type === 'suspended' ? `Дискв. (${displayPlayer.status.duration} м.)` : 'Неизвестно' ))}`;
    } else if (ui.detailsPlayerStatus) {
        ui.detailsPlayerStatus.textContent = 'Неизвестно';
    }

    if(ui.detailsPlayerSalary && displayPlayer.contract) ui.detailsPlayerSalary.textContent = displayPlayer.contract.salary ? displayPlayer.contract.salary.toLocaleString() : '?';
    if(ui.detailsPlayerContractWeeksLeft) ui.detailsPlayerContractWeeksLeft.textContent = weeksLeft === Infinity ? 'Юниор' : (weeksLeft > 0 ? weeksLeft : 'N/A');
    if(ui.detailsPlayerContractEnds) ui.detailsPlayerContractEnds.textContent = contractEndDate;
    if(ui.detailsPlayerPrice) ui.detailsPlayerPrice.textContent = displayPlayer.price > 0 ? displayPlayer.price.toLocaleString() : (player.isYouth ? 'Бесценен' : '?');

    const loanInfoContainer = ui.playerDetailsOverlay.querySelector('.player-loan-info'); // Находим контейнер
    if (loanInfoContainer) {
        if (player.onLoan) {
            if(ui.detailsPlayerOnloanTeam) ui.detailsPlayerOnloanTeam.textContent = player.onLoan.teamName;
            if(ui.detailsPlayerOnloanWeeks) ui.detailsPlayerOnloanWeeks.textContent = player.onLoan.weeksLeft;
            if(ui.detailsPlayerOnloanWage) ui.detailsPlayerOnloanWage.textContent = player.onLoan.wageContributionPercent;
            if(ui.detailsPlayerOnloanTeamPaysWage) ui.detailsPlayerOnloanTeamPaysWage.textContent = player.onLoan.teamName;
            loanInfoContainer.style.display = 'grid'; // или 'block', в зависимости от CSS
        } else {
            loanInfoContainer.style.display = 'none';
        }
    }

    if(ui.playerActionsInDetails) {
        ui.playerActionsInDetails.innerHTML = ''; // Очищаем старые кнопки
        // Пример добавления кнопки "Продлить контракт"
        if (player.isUserPlayer && !player.isYouth && weeksLeft > 0 && weeksLeft <= MIN_CONTRACT_WEEKS_RENEWAL * 3 && !player.onLoan) {
            const renewBtn = document.createElement('button');
            renewBtn.textContent = "Продлить контракт";
            renewBtn.className = "action-button";
            renewBtn.onclick = () => { openContractNegotiation(player.id); ui.playerDetailsOverlay.style.display = 'none'; };
            ui.playerActionsInDetails.appendChild(renewBtn);
        }
        // Добавить другие кнопки по аналогии (продать, аренда и т.д.)
    }

    ui.playerDetailsOverlay.style.display = 'flex';
}