document.addEventListener('DOMContentLoaded', () => {
    // --- Глобальные константы и настройки ---
    const STARTING_BUDGET = 500000; // Увеличил стартовый бюджет
    const REQUIRED_STARTERS = 11;
    const MIN_SQUAD_SIZE = 16;
    const MAX_SQUAD_SIZE = 25; // Увеличил макс. размер
    const MAX_TRAINING_SLOTS = 3;
    const WEEKS_IN_YEAR = 52; // Для расчета контрактов и возраста
    const NEWS_FEED_LIMIT = 50;
    const TRANSACTION_HISTORY_LIMIT = 20;
    const SCOUTING_BASE_COST = 2000;
    const SCOUTING_BASE_ACCURACY = 50; // %
    const YOUTH_INTAKE_MIN_PLAYERS = 3;
    const YOUTH_INTAKE_MAX_PLAYERS = 6;
    const BASE_FAN_HAPPINESS = 70;
    const BASE_BOARD_CONFIDENCE = 60;

    // --- UI Элементы (много!) ---
    const ui = {
        clubNameHeader: document.getElementById('club-name-header'),
        budget: document.getElementById('budget'),
        currentWeek: document.getElementById('current-week'),
        totalWeeks: document.getElementById('total-weeks'),
        currentSeason: document.getElementById('current-season'),
        fanHappiness: document.getElementById('fan-happiness'),
        saveGameBtn: document.getElementById('save-game-btn'),
        loadGameBtn: document.getElementById('load-game-btn'),
        newGameBtn: document.getElementById('new-game-btn'),
        nextWeekBtn: document.getElementById('next-week-btn'),

        newsFeed: document.getElementById('news-feed'),

        squadSizeDisplay: document.getElementById('squad-size-display'),
        totalAttack: document.getElementById('total-attack'),
        totalDefense: document.getElementById('total-defense'),
        avgMorale: document.getElementById('avg-morale'),
        avgForm: document.getElementById('avg-form'),
        playerList: document.getElementById('player-list'),

        formationSelect: document.getElementById('formation-select'),
        tacticSelect: document.getElementById('tactic-select'),
        autoFillLineupBtn: document.getElementById('auto-fill-lineup-btn'),
        startingLineupFormation: document.getElementById('starting-lineup-formation'),
        benchCountDisplay: document.getElementById('bench-count-display'),
        benchPlayersList: document.getElementById('bench-players-list'),

        trainingEffectivenessBonus: document.getElementById('training-effectiveness-bonus'),
        trainingSlotsAvailable: document.getElementById('training-slots-available'),
        trainingPlayerSelection: document.getElementById('training-player-selection'),
        teamTrainingFocus: document.getElementById('team-training-focus'),

        youthFacilityLevel: document.getElementById('youth-facility-level'),
        youthDevBonus: document.getElementById('youth-dev-bonus'),
        youthSquadSize: document.getElementById('youth-squad-size'),
        youthSquadMax: document.getElementById('youth-squad-max'),
        youthIntakeCountdown: document.getElementById('youth-intake-countdown'),
        youthPlayerList: document.getElementById('youth-player-list'),

        currentCoachInfo: document.getElementById('current-coach-info'),
        availableCoachesList: document.getElementById('available-coaches-list'),
        otherStaffSections: document.getElementById('other-staff-sections'),

        scoutingAccuracyDisplay: document.getElementById('scouting-accuracy-display'),
        transferMarketList: document.getElementById('transfer-market-list'),

        facilitiesList: document.getElementById('facilities-list'),

        financeBudgetDisplay: document.getElementById('finance-budget-display'),
        financeWeeklyIncome: document.getElementById('finance-weekly-income'),
        financeWeeklyExpense: document.getElementById('finance-weekly-expense'),
        financeWeeklyBalance: document.getElementById('finance-weekly-balance'),
        sponsorsList: document.getElementById('sponsors-list'),
        findNewSponsorBtn: document.getElementById('find-new-sponsor-btn'),
        transactionHistory: document.getElementById('transaction-history'),

        fixtureFilters: document.querySelector('.fixture-filters'),
        matchSchedule: document.getElementById('match-schedule'),
        lastUserMatchResultText: document.getElementById('last-user-match-result-text'),

        leagueTableBody: document.getElementById('league-table-body'),

        cupNameDisplay: document.getElementById('cup-name-display'),
        cupCurrentRound: document.getElementById('cup-current-round'),
        cupBracketOrNextMatch: document.getElementById('cup-bracket-or-next-match'),

        holdTeamMeetingBtn: document.getElementById('hold-team-meeting-btn'),
        callPressConferenceBtn: document.getElementById('call-press-conference-btn'),
        boardConfidenceDisplay: document.getElementById('board-confidence-display'),

        // Оверлеи
        initialSetupOverlay: document.getElementById('initial-setup-overlay'),
        userClubNameInput: document.getElementById('user-club-name-input'),
        avatarSelection: document.querySelector('.avatar-selection'),
        startGameBtn: document.getElementById('start-game-btn'),

        matchSimOverlay: document.getElementById('match-simulation-overlay'),
        matchTeamsInfo: document.getElementById('match-teams-info'),
        matchTimeDisplay: document.getElementById('match-time-display'),
        matchCurrentScore: document.getElementById('match-current-score'),
        userTeamSimName: document.getElementById('user-team-sim-name'),
        substitutionsLeft: document.getElementById('substitutions-left'),
        inMatchTacticSelect: document.getElementById('in-match-tactic-select'),
        makeSubstitutionBtn: document.getElementById('make-substitution-btn'),
        matchEvents: document.getElementById('match-events'),
        finalScore: document.getElementById('final-score'),
        closeMatchSimBtn: document.getElementById('close-match-sim-btn'),
        continueMatchSimBtn: document.getElementById('continue-match-sim-btn'),
        matchSimTacticsPanel: document.querySelector('.match-sim-tactics-panel'),


        playerDetailsOverlay: document.getElementById('player-details-overlay'),
        detailsPlayerName: document.getElementById('details-player-name'),
        detailsPlayerAge: document.getElementById('details-player-age'),
        detailsPlayerPosition: document.getElementById('details-player-position'),
        detailsPlayerAttack: document.getElementById('details-player-attack'),
        detailsPlayerDefense: document.getElementById('details-player-defense'),
        detailsPlayerForm: document.getElementById('details-player-form'),
        detailsPlayerMorale: document.getElementById('details-player-morale'),
        detailsPlayerSalary: document.getElementById('details-player-salary'),
        detailsPlayerContractEnds: document.getElementById('details-player-contract-ends'),
        detailsPlayerContractWeeksLeft: document.getElementById('details-player-contract-weeks-left'),
        detailsPlayerPrice: document.getElementById('details-player-price'),
        detailsPlayerStatus: document.getElementById('details-player-status'),
        detailsPlayerPersonality: document.getElementById('details-player-personality'),
        playerActionsInDetails: document.getElementById('player-actions-in-details'),
        closePlayerDetailsBtn: document.getElementById('close-player-details-btn'),

        contractNegotiationOverlay: document.getElementById('contract-negotiation-overlay'),
        negotiatePlayerName: document.getElementById('negotiate-player-name'),
        currentSalaryDisplay: document.getElementById('current-salary-display'),
        currentWeeksLeftDisplay: document.getElementById('current-weeks-left-display'),
        expectedSalaryDisplay: document.getElementById('expected-salary-display'),
        expectedDurationDisplay: document.getElementById('expected-duration-display'),
        newSalaryInput: document.getElementById('new-salary-input'),
        newDurationSelect: document.getElementById('new-duration-select'),
        offerContractBtn: document.getElementById('offer-contract-btn'),
        cancelNegotiationBtn: document.getElementById('cancel-negotiation-btn'),
        negotiationFeedback: document.getElementById('negotiation-feedback'),

        pressConferenceOverlay: document.getElementById('press-conference-overlay'),
        pressTopicQuestion: document.getElementById('press-topic-question'),
        pressOptionsContainer: document.getElementById('press-options-container'),
        skipPressQuestionBtn: document.getElementById('skip-press-question-btn'),

        substitutionOverlay: document.getElementById('substitution-overlay'),
        subOutPlayerSelect: document.getElementById('sub-out-player-select'),
        subInPlayerSelect: document.getElementById('sub-in-player-select'),
        confirmSubstitutionBtn: document.getElementById('confirm-substitution-btn'),
        cancelSubstitutionBtn: document.getElementById('cancel-substitution-btn'),

        screens: { // Для удобного доступа
            news: document.getElementById('news-screen'),
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
            office: document.getElementById('office-screen'),
        }
    };
    const mainNavButtons = document.querySelectorAll('#main-nav button[data-screen]');

    // --- Игровое состояние ---
    let gameState = {};
    let currentNegotiationPlayerId = null;
    let currentMatchSimulation = null; // Для хранения состояния симуляции матча

    function getDefaultGameState() {
        const initialFacilities = {};
        for (const key in FACILITY_LEVELS) {
            initialFacilities[key] = { level: 0, upgradeInProgress: false, weeksToComplete: 0 };
        }

        return {
            clubName: "Мой ФК",
            avatar: "👔",
            budget: STARTING_BUDGET,
            currentWeek: 1,
            currentSeason: 1,
            seasonLength: (CPU_TEAM_NAMES.length + 1 -1) * 2, // (N-1)*2 туров для лиги
            fanHappiness: BASE_FAN_HAPPINESS, // 0-100
            boardConfidence: BASE_BOARD_CONFIDENCE, // 0-100
            userTeam: {
                name: "Мой ФК",
                players: [],
                coach: null,
                staff: { // Для ассистентов, скаутов и т.д.
                    assistantCoach: null, chiefScout: null, physio: null, youthCoach: null
                },
                formation: "4-4-2",
                tactic: "balanced",
                teamTrainingFocus: "none",
                startingXI: Array(REQUIRED_STARTERS).fill(null),
                trainingSlotsUsed: 0,
                youthAcademy: {
                    players: [],
                    nextIntakeWeek: YOUTH_INTAKE_WEEKS[0]
                },
                facilities: initialFacilities,
                sponsors: [], // { type, name, weeklyIncome, durationWeeks, weeksLeft }
                activeNationalCup: null, // { name, currentRoundIndex, fixtures: [] }
            },
            cpuTeams: [],
            leagueTable: {},
            schedule: [], // Включает и лигу, и кубки
            transferMarket: [],
            availableCoaches: [],
            availableStaff: { assistantCoach: [], chiefScout: [], physio: [], youthCoach: [] },
            news: [],
            transactions: [], // { week, description, amount, type: 'income'/'expense' }
            playerIdCounter: 0,
            staffIdCounter: 0,
            matchIdCounter: 0,
            gameInitialized: false,
            pressConferenceCooldown: 0, // Недель до следующей пресс-конференции
            teamMeetingCooldown: 0,
            internationalBreakActive: false,
        };
    }

    // --- Инициализация игры ---
    function initGame() {
        loadFormationOptions();
        loadTacticOptions();
        loadTeamTrainingOptions();

        if (localStorage.getItem('footballManagerDeluxeState')) {
            loadGame();
             if (!gameState.gameInitialized) { // Если что-то пошло не так при загрузке
                ui.initialSetupOverlay.style.display = 'flex';
            } else {
                ui.initialSetupOverlay.style.display = 'none';
                updateAllUI();
                showScreen('news');
            }
        } else {
            ui.initialSetupOverlay.style.display = 'flex';
        }
        addEventListeners();
    }

    function resetGameStateAndStart(clubName, avatar) {
        gameState = getDefaultGameState();
        gameState.clubName = clubName || "Мой ФК";
        gameState.avatar = avatar || "👔";
        gameState.userTeam.name = gameState.clubName;
        ui.clubNameHeader.textContent = gameState.clubName + " " + gameState.avatar;
        ui.totalWeeks.textContent = gameState.seasonLength;

        // Создание команды пользователя
        for (let i = 0; i < MIN_SQUAD_SIZE; i++) {
            const position = PLAYER_POSITIONS[i % PLAYER_POSITIONS.length];
            const player = createPlayer({
                isUserPlayer: true,
                position: position,
                baseAttack: getRandomInt(30, 50), // Стартовые слабее
                baseDefense: getRandomInt(30, 50),
                age: getRandomInt(19, 25)
            });
            player.contract.salary = Math.floor((player.attack + player.defense) * 2.0 + player.potential * 50);
            player.contract.durationWeeks = CONTRACT_LENGTHS_WEEKS.medium + getRandomInt(-4,4);
            player.contract.endDate = calculateEndDate(gameState.currentWeek, gameState.currentSeason, player.contract.durationWeeks);
            player.price = 0; // Стартовые не продаются сразу
            gameState.userTeam.players.push(player);
        }
        autoFillLineup();

        CPU_TEAM_NAMES.forEach(name => {
            const team = createCPUTeam(name);
            gameState.cpuTeams.push(team);
            gameState.leagueTable[name] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0, name: name };
        });
        gameState.leagueTable[gameState.userTeam.name] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0, name: gameState.userTeam.name };

        generateLeagueSchedule();
        initNationalCup(); // Инициализация кубка
        populateInitialTransferMarket(20);
        populateAvailableCoaches(5);
        populateAvailableStaff(3); // По 3 каждого типа персонала
        
        gameState.gameInitialized = true;
        addNews('budgetChange', "Стартовый капитал", STARTING_BUDGET, true);
        addNews('newSeason', gameState.currentSeason);
        addTransaction("Стартовый капитал", STARTING_BUDGET, 'income');

        updateAllUI();
        showScreen('news');
    }

    // --- Вспомогательные функции ---
    function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function getRandomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function addNews(type, ...args) {
        const message = NEWS_EVENTS[type] ? NEWS_EVENTS[type](...args) : `Неизвестное событие: ${type}`;
        gameState.news.unshift({ week: gameState.currentWeek, season: gameState.currentSeason, message });
        if (gameState.news.length > NEWS_FEED_LIMIT) gameState.news.pop();
        if(ui.newsFeed.parentElement.classList.contains('active')) renderNewsFeed(); // Обновляем только если экран активен
    }
    function addTransaction(description, amount, type) {
        gameState.transactions.unshift({ week: gameState.currentWeek, season: gameState.currentSeason, description, amount, type });
        if (gameState.transactions.length > TRANSACTION_HISTORY_LIMIT) gameState.transactions.pop();
        if(ui.transactionHistory && ui.transactionHistory.parentElement.parentElement.classList.contains('active')) renderFinancesScreen();
    }

    function calculateEndDate(startWeek, startSeason, durationWeeks) {
        let endWeek = startWeek + durationWeeks -1; // -1 потому что текущая неделя уже часть контракта
        let endSeason = startSeason;
        while (endWeek > gameState.seasonLength) {
            endWeek -= gameState.seasonLength;
            endSeason++;
        }
        return { week: endWeek, season: endSeason };
    }

    function getWeeksLeftInContract(player) {
        if (!player.contract || !player.contract.endDate) return 0;
        let weeksLeft = 0;
        if (player.contract.endDate.season === gameState.currentSeason) {
            weeksLeft = player.contract.endDate.week - gameState.currentWeek + 1;
        } else if (player.contract.endDate.season > gameState.currentSeason) {
            weeksLeft = (gameState.seasonLength - gameState.currentWeek + 1) + // недели в текущем сезоне
                        ((player.contract.endDate.season - gameState.currentSeason - 1) * gameState.seasonLength) + // недели в полных промежуточных сезонах
                        player.contract.endDate.week; // недели в последнем сезоне
        }
        return Math.max(0, weeksLeft);
    }

    // --- Создание сущностей ---
    function createPlayer(options = {}) {
        gameState.playerIdCounter++;
        const age = options.age || getRandomInt(16, 33); // Молодежь может быть 16-18
        const baseAttack = options.baseAttack || getRandomInt(35, 70);
        const baseDefense = options.baseDefense || getRandomInt(35, 70);
        // Потенциал - скрытая максимальная сумма статов (атака+защита) или множитель
        const potentialValue = options.potentialValue || getRandomInt(baseAttack + baseDefense + 5, 160 + Math.max(0, 23-age)*2 ); // Молодые имеют выше макс.потенциал
        
        let initialSalary = Math.floor((baseAttack + baseDefense) * getRandomInt(3, 7) + potentialValue * 2 + (options.isUserPlayer ? 0 : getRandomInt(0,500)));
        if (options.isYouth) initialSalary = Math.floor(initialSalary / 3);


        return {
            id: gameState.playerIdCounter,
            name: options.name || `${getRandomElement(PLAYER_FIRST_NAMES)} ${getRandomElement(PLAYER_LAST_NAMES)}`,
            age: age,
            position: options.position || getRandomElement(PLAYER_POSITIONS),
            attack: baseAttack,
            defense: baseDefense,
            morale: getRandomInt(50, 85),
            form: getRandomInt(40, 80),
            price: options.price === undefined ? Math.floor((baseAttack + baseDefense + potentialValue + (30-age)*10) * getRandomInt(100, 200)) : options.price,
            contract: {
                salary: initialSalary,
                durationWeeks: options.contractDurationWeeks || CONTRACT_LENGTHS_WEEKS.medium + getRandomInt(-8, 8),
                endDate: null, // Будет установлено при добавлении в команду
                releaseClause: 0, // Отступные
                agentFee: 0 // При подписании
            },
            status: { type: 'fit', duration: 0, affectedStat: null }, // affectedStat для травм
            trainingFocus: null,
            teamTrainingEffect: { attack: 0, defense: 0, cohesion: 0}, // Для командных тренировок
            potential: potentialValue, // Скрытый макс.суммы статов или множитель развития
            personality: getRandomElement(PLAYER_PERSONALITIES),
            isUserPlayer: options.isUserPlayer || false,
            isYouth: options.isYouth || false,
            statsVisible: options.statsVisible !== undefined ? options.statsVisible : (options.isUserPlayer || options.isYouth),
            scoutedLevel: options.scoutedLevel !== undefined ? options.scoutedLevel : (options.isUserPlayer || options.isYouth ? 3 : 0), // 0-нет, 1-позиция/возраст, 2-прим.статы, 3-точные
            onLoan: false, // TODO: Аренда
            internationalDuty: false, // В сборной
            relations: {} // Отношения с другими игроками/тренером TODO
        };
    }

    function createCPUTeam(name, numPlayers = MIN_SQUAD_SIZE + getRandomInt(0,3)) {
        const team = {
            name,
            players: [],
            coach: null,
            formation: getRandomElement(["4-4-2", "4-3-3", "3-5-2"]),
            tactic: getRandomElement(["balanced", "attacking", "defensive"]),
            startingXI: Array(REQUIRED_STARTERS).fill(null),
            activeNationalCup: null
        };
        for (let i = 0; i < numPlayers; i++) {
            const player = createPlayer({ baseAttack: getRandomInt(45,75), baseDefense: getRandomInt(45,75) }); // CPU посильнее
            player.contract.durationWeeks = CONTRACT_LENGTHS_WEEKS.medium + getRandomInt(-8,8);
            player.contract.endDate = calculateEndDate(1,1, player.contract.durationWeeks); // Условно для CPU
            team.players.push(player);
        }
        // CPU выбирают стартовый состав по силе
        team.players.sort((a,b) => (b.attack + b.defense) - (a.attack + a.defense));
        for(let i=0; i < REQUIRED_STARTERS && i < team.players.length; i++) {
            team.startingXI[i] = team.players[i].id;
        }
        // CPU команды получают тренера
        const coachKeys = Object.keys(COACH_SPECIALIZATIONS);
        const specKey = coachKeys[getRandomInt(0, coachKeys.length - 1)];
        team.coach = createCoach(getRandomElement(COACH_NAMES), specKey, getRandomInt(500, 2500));
        return team;
    }

    function createCoach(name, specKey, salary) {
        gameState.staffIdCounter = (gameState.staffIdCounter || 0) + 1;
        return {
            id: gameState.staffIdCounter,
            name: name,
            role: "Главный тренер",
            specKey: specKey,
            specialization: COACH_SPECIALIZATIONS[specKey],
            salary: salary,
            attackBoost: COACH_SPECIALIZATIONS[specKey].attackBoost || 0,
            defenseBoost: COACH_SPECIALIZATIONS[specKey].defenseBoost || 0,
            trainingBonus: COACH_SPECIALIZATIONS[specKey].trainingBonus || 0,
            moraleBoost: COACH_SPECIALIZATIONS[specKey].moraleBoost || 0,
            youthFocus: COACH_SPECIALIZATIONS[specKey].youthFocus || 0
        };
    }

    function createStaffMember(roleKey) {
        gameState.staffIdCounter = (gameState.staffIdCounter || 0) + 1;
        const roleDetails = STAFF_ROLES[roleKey];
        const name = `${getRandomElement(STAFF_NAMES_GENERIC)} ${getRandomElement(PLAYER_LAST_NAMES)}`; // Используем фамилии игроков для разнообразия
        return {
            id: gameState.staffIdCounter,
            name: name,
            role: roleDetails.name,
            roleKey: roleKey,
            skillLevel: getRandomInt(30, 70), // 0-100, влияет на эффективность
            salary: getRandomInt(roleDetails.salaryRange[0], roleDetails.salaryRange[1]),
            // Другие специфичные для роли параметры
        };
    }
    
    // ... Остальные функции create... (populateInitialTransferMarket, populateAvailableCoaches и т.д.) будут похожи на предыдущие,
    // но с учетом новых полей у игроков/тренеров

    function populateInitialTransferMarket(count = 20) {
        gameState.transferMarket = [];
        for (let i = 0; i < count; i++) {
            const player = createPlayer({ scoutedLevel: getRandomInt(0,1) }); // Большинство не разведаны
            player.contract.endDate = calculateEndDate(1,1, player.contract.durationWeeks); // Условно для рынка
            gameState.transferMarket.push(player);
        }
    }
    
    function populateAvailableCoaches(count = 5) {
        gameState.availableCoaches = [];
        const usedNames = [];
        for (let i = 0; i < count; i++) {
            let name;
            do { name = getRandomElement(COACH_NAMES); } while (usedNames.includes(name));
            usedNames.push(name);

            const specKeys = Object.keys(COACH_SPECIALIZATIONS);
            const specKey = getRandomElement(specKeys);
            const baseSalary = getRandomInt(1500, 6000);
            const skillBonus = (COACH_SPECIALIZATIONS[specKey].attackBoost + COACH_SPECIALIZATIONS[specKey].defenseBoost + (COACH_SPECIALIZATIONS[specKey].trainingBonus * 50) ) / 10;
            const salary = Math.floor((baseSalary + skillBonus * 100) /100) * 100;
            gameState.availableCoaches.push(createCoach(name, specKey, salary));
        }
    }

    function populateAvailableStaff(countPerRole = 3) {
        gameState.availableStaff = { assistantCoach: [], chiefScout: [], physio: [], youthCoach: [] };
        for (const roleKey in STAFF_ROLES) {
            for (let i = 0; i < countPerRole; i++) {
                gameState.availableStaff[roleKey].push(createStaffMember(roleKey));
            }
        }
    }

    // --- Генерация расписаний ---
    function generateLeagueSchedule() {
        // gameState.schedule будет общим, сюда добавляем матчи лиги
        const allTeamNames = [gameState.userTeam.name, ...gameState.cpuTeams.map(t => t.name)];
        const numTeams = allTeamNames.length;
        gameState.seasonLength = (numTeams - 1) * 2; // Каждый с каждым дома и в гостях
        ui.totalWeeks.textContent = gameState.seasonLength;

        let localMatchId = 0;
        const rounds = [];
        for (let i = 0; i < numTeams - 1; i++) {
            rounds[i] = [];
        }

        // Алгоритм кругового турнира (упрощенный вариант)
        const teamsForSchedule = [...allTeamNames];
        if (numTeams % 2 !== 0) teamsForSchedule.push(null); // Добавляем "пустышку" для нечетного числа

        const halfSeasonRounds = teamsForSchedule.length -1;

        for (let round = 0; round < halfSeasonRounds; round++) {
            for (let i = 0; i < teamsForSchedule.length / 2; i++) {
                const home = teamsForSchedule[i];
                const away = teamsForSchedule[teamsForSchedule.length - 1 - i];
                if (home && away) { // Исключаем матчи с "пустышкой"
                    localMatchId++;
                    gameState.schedule.push({
                        matchId: `L-${gameState.currentSeason}-${localMatchId}`, // Уникальный ID матча лиги
                        competition: "Лига",
                        week: round + 1,
                        homeTeamName: home,
                        awayTeamName: away,
                        homeScore: null, awayScore: null, played: false,
                        isUserMatch: home === gameState.userTeam.name || away === gameState.userTeam.name
                    });
                    localMatchId++;
                     gameState.schedule.push({ // Ответный матч
                        matchId: `L-${gameState.currentSeason}-${localMatchId}`,
                        competition: "Лига",
                        week: round + 1 + halfSeasonRounds,
                        homeTeamName: away, // Меняем местами
                        awayTeamName: home,
                        homeScore: null, awayScore: null, played: false,
                        isUserMatch: away === gameState.userTeam.name || home === gameState.userTeam.name
                    });
                }
            }
            // Ротация команд для следующего тура (кроме первой)
            const lastTeam = teamsForSchedule.pop();
            teamsForSchedule.splice(1, 0, lastTeam);
        }
        gameState.schedule.sort((a,b) => a.week - b.week || (a.isUserMatch ? -1 : 1)); // Сортируем, матчи пользователя пораньше в неделе
    }

    function initNationalCup() {
        const cupData = CUP_COMPETITIONS.nationalCup;
        const allTeamsForCup = [gameState.userTeam.name, ...gameState.cpuTeams.map(t => t.name)];
        if (allTeamsForCup.length < cupData.teams) {
            // console.warn("Недостаточно команд для кубка, нужно " + cupData.teams);
            return; // Не проводим кубок, если команд мало
        }
        // Отбираем нужное количество команд (случайно, если их больше)
        const cupParticipants = [...allTeamsForCup].sort(() => 0.5 - Math.random()).slice(0, cupData.teams);

        gameState.userTeam.activeNationalCup = {
            name: cupData.name,
            currentRoundIndex: 0,
            userEliminated: false,
            fixtures: [], // [{ roundName, matches: [{matchId, home, away, week}] }]
            winner: null
        };
        generateCupRound(cupParticipants, 0);
    }

    function generateCupRound(teamsInRound, roundIndex) {
        const cupData = CUP_COMPETITIONS.nationalCup;
        const cupState = gameState.userTeam.activeNationalCup;
        if (!cupState || roundIndex >= cupData.rounds.length || teamsInRound.length < 2) {
            if(teamsInRound.length === 1 && cupState) { // Победитель определен
                cupState.winner = teamsInRound[0];
                addNews("cupWinner", cupState.winner, cupState.name);
                if(cupState.winner === gameState.userTeam.name) {
                    gameState.budget += cupData.prizeMoney[cupData.prizeMoney.length-1] * 2; // Доп. бонус за победу
                    addTransaction(`Победа в ${cupState.name}`, cupData.prizeMoney[cupData.prizeMoney.length-1] * 2, 'income');
                }
            }
            return;
        }

        const roundName = cupData.rounds[roundIndex];
        const roundFixtures = { roundName, matches: [] };
        const shuffledTeams = [...teamsInRound].sort(() => 0.5 - Math.random());
        const matchesThisRound = [];

        for (let i = 0; i < shuffledTeams.length / 2; i++) {
            gameState.matchIdCounter++;
            const homeTeam = shuffledTeams[i*2];
            const awayTeam = shuffledTeams[i*2+1];
            
            // Находим свободную неделю для кубкового матча
            // Обычно кубки играются в середине недели или в специальные окна
            // Упрощенно: ищем ближайшую неделю, где нет матчей лиги у этих команд ИЛИ нет матчей пользователя
            let cupWeek = gameState.currentWeek + roundIndex * 2 + getRandomInt(1,3); // Примерно через 2-4 недели
            // Проверка, чтобы не пересекалось сильно с лигой (очень упрощенно)
             while(gameState.schedule.some(m => m.week === cupWeek && m.competition === "Лига" && (m.homeTeamName === homeTeam || m.awayTeamName === homeTeam || m.homeTeamName === awayTeam || m.awayTeamName === awayTeam ) ) ) {
                cupWeek++;
                if(cupWeek > gameState.seasonLength) cupWeek = gameState.currentWeek + 1; // Костыль, если все занято
            }
             if (cupWeek > gameState.seasonLength) cupWeek = Math.max(gameState.currentWeek, gameState.seasonLength - (cupData.rounds.length - roundIndex) * 2);


            const match = {
                matchId: `C-${gameState.currentSeason}-${roundIndex}-${gameState.matchIdCounter}`,
                competition: cupState.name,
                roundName: roundName,
                week: cupWeek,
                homeTeamName: homeTeam,
                awayTeamName: awayTeam,
                homeScore: null, awayScore: null, played: false,
                isUserMatch: homeTeam === gameState.userTeam.name || awayTeam === gameState.userTeam.name
            };
            gameState.schedule.push(match);
            matchesThisRound.push(match);
            if(match.isUserMatch) addNews("cupDraw", roundName, (homeTeam === gameState.userTeam.name ? awayTeam : homeTeam), homeTeam === gameState.userTeam.name);
        }
        roundFixtures.matches = matchesThisRound;
        cupState.fixtures.push(roundFixtures);
        gameState.schedule.sort((a,b) => a.week - b.week || (a.isUserMatch ? -1 : 1));
    }

    // --- Обновление UI (много функций рендеринга) ---
    function updateAllUI() {
        if (!gameState || !gameState.gameInitialized) return;

        ui.budget.textContent = gameState.budget.toLocaleString();
        ui.currentWeek.textContent = gameState.currentWeek;
        ui.currentSeason.textContent = gameState.currentSeason;
        ui.fanHappiness.textContent = gameState.fanHappiness;
        ui.clubNameHeader.textContent = gameState.clubName + " " + gameState.avatar;

        calculateTeamOverallStats(); // Важно перед рендером команды
        renderPlayerList();
        renderTacticsScreen();
        renderTrainingScreen();
        renderYouthAcademyScreen();
        renderStaffScreen();
        renderTransferMarket();
        renderFacilitiesScreen();
        renderFinancesScreen();
        renderSchedule();
        renderLeagueTable();
        renderCupScreen();
        renderOfficeScreen();
        renderNewsFeed(); // Новости в конце, т.к. другие функции могут их добавлять
        
        ui.newGameBtn.style.display = 'inline-block';
    }
    
    function loadFormationOptions() {
        const formations = ["4-4-2", "4-3-3", "3-5-2", "5-3-2", "4-2-3-1", "4-1-4-1", "4-4-1-1", "3-4-3"];
        ui.formationSelect.innerHTML = formations.map(f => `<option value="${f}">${f}</option>`).join('');
    }
    function loadTacticOptions() {
        const tactics = {
            balanced: "Сбалансированная", attacking: "Атакующая", defensive: "Оборонительная",
            "counter-attacking": "Контратакующая", possession: "Владение мячом", "high-press": "Высокий прессинг"
        };
        ui.tacticSelect.innerHTML = Object.entries(tactics).map(([key, value]) => `<option value="${key}">${value}</option>`).join('');
        ui.inMatchTacticSelect.innerHTML = ui.tacticSelect.innerHTML; // Для симуляции матча
    }
     function loadTeamTrainingOptions() {
        const focuses = {
            none: "Нет фокуса", attack_cohesion: "Атакующая сыгранность", defense_cohesion: "Оборонительная сыгранность",
            set_pieces: "Стандартные положения", fitness_recovery: "Фитнес и восстановление", morale_boost: "Повышение морали"
        };
        ui.teamTrainingFocus.innerHTML = Object.entries(focuses).map(([key, value]) => `<option value="${key}">${value}</option>`).join('');
    }


    function calculateTeamOverallStats() {
        // ... (логика из предыдущей версии, но теперь учитывает больше факторов при расчете)
        let totalAttack = 0, totalDefense = 0, totalMorale = 0, totalForm = 0;
        const playerCount = gameState.userTeam.players.length;
        const activePlayers = gameState.userTeam.players.filter(p => p.status.type === 'fit' && !p.internationalDuty);

        if (activePlayers.length > 0) {
            activePlayers.forEach(p => {
                const effStats = getEffectivePlayerStats(p);
                totalAttack += effStats.attack;
                totalDefense += effStats.defense;
                totalMorale += p.morale;
                totalForm += p.form;
            });
            ui.avgMorale.textContent = Math.round(totalMorale / activePlayers.length);
            ui.avgForm.textContent = Math.round(totalForm / activePlayers.length);
        } else {
            ui.avgMorale.textContent = "0"; ui.avgForm.textContent = "0";
        }
        
        // Учитываем бонусы от главного тренера
        if (gameState.userTeam.coach) {
            totalAttack += gameState.userTeam.coach.attackBoost * (activePlayers.length / REQUIRED_STARTERS);
            totalDefense += gameState.userTeam.coach.defenseBoost * (activePlayers.length / REQUIRED_STARTERS);
        }
        // Бонус от ассистента (меньший)
        if (gameState.userTeam.staff.assistantCoach) {
            const assistantSkillFactor = (gameState.userTeam.staff.assistantCoach.skillLevel || 50) / 100;
            totalAttack += 2 * assistantSkillFactor * (activePlayers.length / REQUIRED_STARTERS); // Примерный бонус
            totalDefense += 2 * assistantSkillFactor * (activePlayers.length / REQUIRED_STARTERS);
        }

        ui.totalAttack.textContent = playerCount > 0 ? Math.round(totalAttack / activePlayers.length * REQUIRED_STARTERS) : 0;
        ui.totalDefense.textContent = playerCount > 0 ? Math.round(totalDefense / activePlayers.length * REQUIRED_STARTERS) : 0;
        ui.squadSizeDisplay.textContent = `${playerCount}/${MAX_SQUAD_SIZE}`;
    }

    function renderNewsFeed() { /* ... как раньше ... */ 
        ui.newsFeed.innerHTML = '';
        gameState.news.slice(0, NEWS_FEED_LIMIT).forEach(item => {
            const li = document.createElement('li');
            li.textContent = `(С:${item.season} Н:${item.week}) ${item.message}`;
            ui.newsFeed.appendChild(li);
        });
    }

    function renderPlayerListItem(player, listElement, actions = [], isYouth = false) {
        const li = document.createElement('li');
        li.classList.add('list-item', 'player-item');
        if (player.status.type === 'injured') li.classList.add('status-injured');
        else if (player.status.type === 'suspended') li.classList.add('status-suspended');
        if (player.internationalDuty) li.classList.add('status-international');

        li.dataset.playerId = player.id;
        li.draggable = actions.includes('drag');

        const weeksLeft = getWeeksLeftInContract(player);
        let contractInfo = `З/П: ${player.contract.salary.toLocaleString()}$`;
        if (!isYouth) {
            contractInfo += `, До: ${player.contract.endDate.week}/${player.contract.endDate.season} (${weeksLeft} нед.)`;
        }
        if (weeksLeft <= MIN_CONTRACT_WEEKS_RENEWAL && weeksLeft > 0 && !isYouth) {
             li.classList.add('contract-warning');
             contractInfo += ' ⚠️';
        }


        let playerInfoHtml = `
            <div class="player-info">
                <strong>${player.name}</strong> (Поз: ${player.position}, Воз: ${player.age})<br>
                Ата: ${player.attack} / Защ: ${player.defense} / Фор: ${player.form}% / Мор: ${player.morale}% <br>
                <span class="player-status">${contractInfo}. ${player.status.type === 'fit' ? (player.internationalDuty ? 'В сборной' : 'Готов') : (player.status.type === 'injured' ? `Травма (${player.status.duration} нед.)` : `Дискв. (${player.status.duration} м.)`)}</span>
            </div>
        `;
        // Для неразведанных игроков
         if (player.scoutedLevel < 3 && !player.isUserPlayer && !isYouth) {
             const displayStats = getScoutedPlayerDisplayStats(player);
             playerInfoHtml = `
                <div class="player-info">
                    <strong>${player.name}</strong> (Поз: ${displayStats.position}, Воз: ${displayStats.age})<br>
                    Ата: ${displayStats.attack} / Защ: ${displayStats.defense} / Фор: ? / Мор: ? <br>
                    <span class="player-status">З/П: ?, Контракт: ?. Скаутинг: ${player.scoutedLevel}/3</span>
                </div>`;
        }


        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('player-actions');

        if (actions.includes('sell') && player.price > 0) {
            const sellButton = document.createElement('button');
            sellButton.classList.add('sell-btn', 'small-action-button');
            sellButton.textContent = `Продать ($${player.price.toLocaleString()})`;
            sellButton.onclick = () => handleSellPlayer(player.id);
            buttonsDiv.appendChild(sellButton);
        }
        if (actions.includes('buy') && !player.isUserPlayer) {
            const buyButton = document.createElement('button');
            buyButton.classList.add('buy-btn', 'small-action-button');
            buyButton.textContent = `Купить ($${player.price.toLocaleString()})`;
            buyButton.disabled = gameState.budget < player.price || gameState.userTeam.players.length >= MAX_SQUAD_SIZE;
            buyButton.onclick = () => handleBuyPlayer(player.id);
            buttonsDiv.appendChild(buyButton);
        }
        if (actions.includes('scout') && player.scoutedLevel < 3 && !player.isUserPlayer) {
            const scoutCost = SCOUTING_BASE_COST * (player.scoutedLevel + 1);
            const scoutButton = document.createElement('button');
            scoutButton.classList.add('scout-btn', 'small-action-button');
            scoutButton.textContent = `Скаут (${player.scoutedLevel+1}/3) $${scoutCost.toLocaleString()}`;
            scoutButton.disabled = gameState.budget < scoutCost;
            scoutButton.onclick = () => handleScoutPlayer(player.id, scoutCost);
            buttonsDiv.appendChild(scoutButton);
        }
        if (actions.includes('renew') && weeksLeft <= MIN_CONTRACT_WEEKS_RENEWAL * 2 && weeksLeft > 0 && !isYouth) { // Можно предлагать заранее
            const renewButton = document.createElement('button');
            renewButton.classList.add('action-button', 'small-action-button'); // Общий стиль
            renewButton.textContent = 'Продлить';
            renewButton.onclick = () => openContractNegotiation(player.id);
            buttonsDiv.appendChild(renewButton);
        }
        if (actions.includes('promote') && isYouth) {
            const promoteButton = document.createElement('button');
            promoteButton.classList.add('promote-btn', 'small-action-button');
            promoteButton.textContent = 'В основу';
            promoteButton.disabled = gameState.userTeam.players.length >= MAX_SQUAD_SIZE;
            promoteButton.onclick = () => handlePromoteYouthPlayer(player.id);
            buttonsDiv.appendChild(promoteButton);
        }
        if (actions.includes('release') && isYouth) {
            // TODO: Кнопка отчислить из академии
        }
         if (actions.includes('details')) {
            const detailsButton = document.createElement('button');
            detailsButton.classList.add('small-action-button');
            detailsButton.textContent = 'Инфо';
            detailsButton.onclick = () => showPlayerDetails(player.id, isYouth ? gameState.userTeam.youthAcademy.players : (player.isUserPlayer ? gameState.userTeam.players : gameState.transferMarket) );
            buttonsDiv.appendChild(detailsButton);
        }

        li.innerHTML = playerInfoHtml;
        li.appendChild(buttonsDiv);
        listElement.appendChild(li);

        if (actions.includes('drag')) {
            li.addEventListener('dragstart', (e) => {
                // Нельзя перетаскивать травмированных/дискв/в сборной
                if (player.status.type !== 'fit' || player.internationalDuty) {
                    e.preventDefault();
                    return;
                }
                e.dataTransfer.setData('text/plain', player.id);
                li.classList.add('dragging');
            });
            li.addEventListener('dragend', () => li.classList.remove('dragging'));
        }
    }

    function renderPlayerList() { /* ... как раньше, но вызывает renderPlayerListItem с ['sell', 'renew', 'details'] ... */
        ui.playerList.innerHTML = '';
        if (gameState.userTeam.players.length === 0) {
            ui.playerList.innerHTML = '<li>В команде нет игроков.</li>';
            return;
        }
        // Сортировка по статусу (сначала здоровые), потом по позиции, потом по силе
        gameState.userTeam.players.sort((a,b) => 
            (a.status.type !== 'fit' ? 1 : (a.internationalDuty ? 0.5 : -1)) - (b.status.type !== 'fit' ? 1 : (b.internationalDuty ? 0.5 : -1)) ||
            PLAYER_POSITIONS.indexOf(a.position) - PLAYER_POSITIONS.indexOf(b.position) || 
            (b.attack + b.defense) - (a.attack + a.defense)
        ).forEach(player => {
            renderPlayerListItem(player, ui.playerList, ['sell', 'renew', 'details']);
        });
    }
    
    function renderTransferMarket() { /* ... вызывает renderPlayerListItem с ['buy', 'scout', 'details'] ... */
        ui.transferMarketList.innerHTML = '';
        ui.scoutingAccuracyDisplay.textContent = calculateScoutingAccuracy();

        if (gameState.transferMarket.length === 0) {
            ui.transferMarketList.innerHTML = '<li>Трансферный рынок пуст.</li>';
            return;
        }
        gameState.transferMarket.forEach(player => {
            const actions = ['buy', 'details'];
            if (player.scoutedLevel < 3) actions.push('scout');
            renderPlayerListItem(player, ui.transferMarketList, actions);
        });
    }

    function renderTacticsScreen() { /* ... как раньше, но добавляет autoFillLineupBtn ... */
        ui.formationSelect.value = gameState.userTeam.formation;
        ui.tacticSelect.value = gameState.userTeam.tactic;
        ui.startingLineupFormation.innerHTML = ''; // Очищаем перед рендером

        const formationStructure = getFormationStructure(gameState.userTeam.formation);
        let slotIndex = 0;

        formationStructure.forEach(line => {
            line.positions.forEach(posDetail => {
                if (slotIndex >= REQUIRED_STARTERS) return;
                const slotDiv = document.createElement('div');
                slotDiv.classList.add('formation-slot');
                slotDiv.dataset.slotIndex = slotIndex;
                slotDiv.dataset.targetPosition = posDetail.base; // ЗАЩ, ПЗЩ, НАП, ВРТ

                const playerIdInSlot = gameState.userTeam.startingXI[slotIndex];
                if (playerIdInSlot) {
                    const player = gameState.userTeam.players.find(p => p.id === playerIdInSlot);
                    if (player) {
                        const effStats = getEffectivePlayerStats(player);
                        let displayPosition = player.position;
                        // Проверяем, соответствует ли игрок базовой позиции слота
                        if (player.position !== posDetail.base && posDetail.base !== "ANY") { // ANY для универсальных слотов, если будут
                           slotDiv.style.borderColor = 'orange'; // Подсветка, если не на своей основной позиции
                        }

                        slotDiv.innerHTML = `<span class="player-name">${player.name.split(' ')[1]}</span><span class="player-pos-skill">${displayPosition} (${effStats.overall})</span>`;
                        slotDiv.classList.add('has-player');
                        if (player.status.type !== 'fit' || player.internationalDuty) slotDiv.classList.add('player-unavailable');
                        
                        slotDiv.draggable = true;
                        slotDiv.addEventListener('dragstart', (e) => {
                            if (player.status.type !== 'fit' || player.internationalDuty) { e.preventDefault(); return; }
                            e.dataTransfer.setData('text/plain', player.id + '_fromslot_' + slotIndex);
                            slotDiv.classList.add('dragging');
                        });
                        slotDiv.addEventListener('dragend', () => slotDiv.classList.remove('dragging'));
                    } else {
                        slotDiv.textContent = `(${posDetail.label})`;
                        gameState.userTeam.startingXI[slotIndex] = null; // Игрок удален, очищаем слот
                    }
                } else {
                    slotDiv.textContent = `(${posDetail.label})`;
                }
                
                slotDiv.addEventListener('dragover', (e) => e.preventDefault());
                slotDiv.addEventListener('drop', handleDropOnFormationSlot);
                ui.startingLineupFormation.appendChild(slotDiv);
                slotIndex++;
            });
        });
        // Динамически настраиваем grid-template-rows/columns для формации
        // Например, ui.startingLineupFormation.style.gridTemplateRows = `repeat(${formationStructure.length}, 1fr)`;
        // А колонки можно сделать сложнее, или оставить auto

        ui.benchPlayersList.innerHTML = '';
        const benchPlayers = gameState.userTeam.players.filter(p => !gameState.userTeam.startingXI.includes(p.id));
        ui.benchCountDisplay.textContent = benchPlayers.length;
        benchPlayers.sort((a,b) => (a.status.type !== 'fit' ? 1 : -1) - (b.status.type !== 'fit' ? 1 : -1) || PLAYER_POSITIONS.indexOf(a.position) - PLAYER_POSITIONS.indexOf(b.position))
        .forEach(player => {
            renderPlayerListItem(player, ui.benchPlayersList, ['drag', 'renew', 'details']);
        });
        
        ui.benchPlayersList.addEventListener('dragover', e => e.preventDefault());
        ui.benchPlayersList.addEventListener('drop', handleDropOnBench);
    }
    
    function renderTrainingScreen() { /* ... включает бонусы от инфраструктуры и тренера ... */
        const baseEffectiveness = 50; // Базовая эффективность в %
        const coachBonus = gameState.userTeam.coach ? (gameState.userTeam.coach.trainingBonus * 100) : 0;
        const facilityBonus = gameState.userTeam.facilities.trainingGround.level * (FACILITY_LEVELS.trainingGround.effects.trainingEffectivenessBonus[gameState.userTeam.facilities.trainingGround.level] * 100);
        const youthCoachBonus = gameState.userTeam.staff.youthCoach ? (gameState.userTeam.staff.youthCoach.skillLevel / 5) : 0; // Для молодежи

        ui.trainingEffectivenessBonus.textContent = Math.round(baseEffectiveness + coachBonus + facilityBonus);
        ui.trainingSlotsAvailable.textContent = MAX_TRAINING_SLOTS - gameState.userTeam.trainingSlotsUsed;
        ui.trainingPlayerSelection.innerHTML = ''; // Очищаем

        const playersInTraining = gameState.userTeam.players.filter(p => p.trainingFocus);
        playersInTraining.forEach(player => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('list-item', 'compact'); // Используем list-item
            itemDiv.innerHTML = `
                <div class="player-info">${player.name} (Тренирует: ${player.trainingFocus === 'attack' ? 'Атака' : (player.trainingFocus === 'defense' ? 'Защита' : 'Фитнес/Мораль')})</div>
                <button data-player-id="${player.id}" class="cancel-train-btn small-action-button red">Отменить</button>
            `;
            itemDiv.querySelector('.cancel-train-btn').onclick = () => {
                player.trainingFocus = null;
                gameState.userTeam.trainingSlotsUsed--;
                updateAllUI(); // Обновить все, т.к. изменилось кол-во слотов
            };
            ui.trainingPlayerSelection.appendChild(itemDiv);
        });

        if (gameState.userTeam.trainingSlotsUsed < MAX_TRAINING_SLOTS) {
            const eligiblePlayers = gameState.userTeam.players.filter(p => !p.trainingFocus && p.status.type === 'fit' && !p.internationalDuty && p.age < 34); // Не тренируем слишком старых индивидуально
             if (eligiblePlayers.length > 0) {
                const itemDiv = document.createElement('div'); // Контейнер для выбора
                itemDiv.classList.add('list-item','compact', 'training-selection-controls');
                const selectPlayer = document.createElement('select');
                selectPlayer.innerHTML = '<option value="">Игрок для тренировки...</option>';
                eligiblePlayers.sort((a,b) => (a.attack+a.defense) - (b.attack+b.defense)).forEach(p => { // Сначала слабых
                    selectPlayer.innerHTML += `<option value="${p.id}">${p.name} (A:${p.attack}/З:${p.defense})</option>`;
                });

                const selectFocus = document.createElement('select');
                selectFocus.innerHTML = `
                    <option value="attack">Атака</option> <option value="defense">Защита</option>
                    <option value="fitness">Фитнес/Мораль</option>
                    ${eligiblePlayers.some(p => p.age < 22) ? '<option value="potential">Развитие потенциала (молодые)</option>' : ''}
                `;
                const trainButton = document.createElement('button');
                trainButton.classList.add('train-btn', 'small-action-button', 'green');
                trainButton.textContent = "Начать";
                trainButton.onclick = () => {
                    const playerId = parseInt(selectPlayer.value);
                    const focus = selectFocus.value;
                    if (playerId && focus) handleTrainPlayer(playerId, focus);
                };
                itemDiv.appendChild(selectPlayer);
                itemDiv.appendChild(selectFocus);
                itemDiv.appendChild(trainButton);
                ui.trainingPlayerSelection.appendChild(itemDiv);
            } else {
                 ui.trainingPlayerSelection.innerHTML += '<li>Нет доступных игроков для индивидуальной тренировки.</li>';
            }
        }
        ui.teamTrainingFocus.value = gameState.userTeam.teamTrainingFocus;
    }
    
    function renderYouthAcademyScreen() { /* ... Отображение игроков академии, уровня базы ... */
        const facility = gameState.userTeam.facilities.youthAcademyFacility;
        ui.youthFacilityLevel.textContent = facility.level;
        ui.youthDevBonus.textContent = Math.round(FACILITY_LEVELS.youthAcademyFacility.effects.youthPlayerDevelopmentRate[facility.level] * 100);
        
        ui.youthSquadSize.textContent = gameState.userTeam.youthAcademy.players.length;
        ui.youthSquadMax.textContent = YOUTH_ACADEMY_MAX_PLAYERS + facility.level * 2; // Больше мест с уровнем

        let weeksToNextIntake = gameState.userTeam.youthAcademy.nextIntakeWeek - gameState.currentWeek;
        if (weeksToNextIntake <= 0) { // Если пропустили, ищем следующую доступную неделю набора
            const nextIntakeOption = YOUTH_INTAKE_WEEKS.find(w => w > gameState.currentWeek) || YOUTH_INTAKE_WEEKS[0];
            weeksToNextIntake = nextIntakeOption - gameState.currentWeek;
            if(weeksToNextIntake <=0) weeksToNextIntake += gameState.seasonLength; // Если все в этом сезоне прошли
            gameState.userTeam.youthAcademy.nextIntakeWeek = gameState.currentWeek + weeksToNextIntake; // Обновляем, если нужно
        }
        ui.youthIntakeCountdown.textContent = weeksToNextIntake;


        ui.youthPlayerList.innerHTML = '';
        if (gameState.userTeam.youthAcademy.players.length === 0) {
            ui.youthPlayerList.innerHTML = '<li>В академии пока нет игроков.</li>';
            return;
        }
        gameState.userTeam.youthAcademy.players.sort((a,b) => b.potential - a.potential) // Сортируем по потенциалу (который скрыт от игрока напрямую)
        .forEach(player => {
            // Для молодежи показываем их "ожидаемый" потенциал (например, звездочками или оценкой A-F)
            // Это нужно будет сделать через getScoutedPlayerDisplayStats или аналогичную функцию
            renderPlayerListItem(player, ui.youthPlayerList, ['promote', 'details'], true);
        });
    }
    
    function renderStaffScreen() { /* ... Отображение тренера и другого персонала ... */
        // Главный тренер
        const coach = gameState.userTeam.coach;
        if (coach) {
            ui.currentCoachInfo.innerHTML = `
                <p><strong>${coach.name}</strong> (${coach.role})</p>
                <p>Специализация: ${coach.specKey}</p>
                <p>Бонусы: Атк +${coach.attackBoost}, Защ +${coach.defenseBoost}, Трен. +${Math.round(coach.trainingBonus*100)}%, Мор. +${coach.moraleBoost}</p>
                <p>З/П: ${coach.salary.toLocaleString()}$/нед.</p>
                <button id="fire-coach-btn-dynamic" class="small-action-button red">Уволить</button>
            `;
            document.getElementById('fire-coach-btn-dynamic').onclick = handleFireCoach;
        } else {
            ui.currentCoachInfo.innerHTML = '<p>Главный тренер не нанят.</p>';
        }

        ui.availableCoachesList.innerHTML = '';
        if (gameState.availableCoaches.length === 0) {
            ui.availableCoachesList.innerHTML = '<li>Нет доступных главных тренеров.</li>';
        } else {
            gameState.availableCoaches.forEach(c => {
                const li = document.createElement('li');
                li.classList.add('list-item');
                li.innerHTML = `
                    <div class="coach-info">
                        <strong>${c.name}</strong> (Спец: ${c.specKey})<br>
                        <span class="item-details">Бонусы: А+${c.attackBoost}, З+${c.defenseBoost}, Т+${Math.round(c.trainingBonus*100)}%. З/П: ${c.salary.toLocaleString()}$</span>
                    </div>
                    <button data-coach-id="${c.id}" class="hire-coach-btn small-action-button green">Нанять</button>
                `;
                const hireBtn = li.querySelector('.hire-coach-btn');
                hireBtn.disabled = !!gameState.userTeam.coach || gameState.budget < c.salary;
                hireBtn.onclick = () => handleHireCoach(c.id);
                ui.availableCoachesList.appendChild(li);
            });
        }

        // Другой персонал
        ui.otherStaffSections.innerHTML = '';
        for (const roleKey in STAFF_ROLES) {
            const roleDetails = STAFF_ROLES[roleKey];
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('staff-section');
            sectionDiv.innerHTML = `<h3>${roleDetails.name}:</h3>`;

            const currentStaffMember = gameState.userTeam.staff[roleKey];
            const staffInfoDiv = document.createElement('div');
            staffInfoDiv.classList.add('staff-member-card');
            if (currentStaffMember) {
                staffInfoDiv.innerHTML = `
                    <p><strong>${currentStaffMember.name}</strong></p>
                    <p>Навык: ${currentStaffMember.skillLevel}/100, З/П: ${currentStaffMember.salary.toLocaleString()}$/нед.</p>
                    <p><small>${roleDetails.effect}</small></p>
                    <button data-role-key="${roleKey}" class="fire-staff-btn small-action-button red">Уволить</button>
                `;
                staffInfoDiv.querySelector('.fire-staff-btn').onclick = (e) => handleFireStaff(e.target.dataset.roleKey);
            } else {
                staffInfoDiv.innerHTML = `<p>${roleDetails.name} не нанят.</p>`;
            }
            sectionDiv.appendChild(staffInfoDiv);

            const availableList = document.createElement('ul');
            if (!gameState.availableStaff[roleKey] || gameState.availableStaff[roleKey].length === 0) {
                availableList.innerHTML = `<li>Нет доступных кандидатов на должность ${roleDetails.name}.</li>`;
            } else {
                gameState.availableStaff[roleKey].forEach(staff => {
                    const li = document.createElement('li');
                    li.classList.add('list-item', 'compact');
                    li.innerHTML = `
                        <div class="staff-info">
                            <strong>${staff.name}</strong><br>
                            <span class="item-details">Навык: ${staff.skillLevel}, З/П: ${staff.salary.toLocaleString()}$</span>
                        </div>
                        <button data-staff-id="${staff.id}" data-role-key="${roleKey}" class="hire-staff-btn small-action-button green">Нанять</button>
                    `;
                    const hireBtn = li.querySelector('.hire-staff-btn');
                    hireBtn.disabled = !!currentStaffMember || gameState.budget < staff.salary;
                    hireBtn.onclick = (e) => handleHireStaff(e.target.dataset.staffId, e.target.dataset.roleKey);
                    availableList.appendChild(li);
                });
            }
            sectionDiv.appendChild(availableList);
            ui.otherStaffSections.appendChild(sectionDiv);
        }
    }
    
    function renderFacilitiesScreen() { /* ... Отображение уровня и улучшений стадиона, базы и т.д. ... */
        ui.facilitiesList.innerHTML = '';
        for (const key in gameState.userTeam.facilities) {
            const facilityState = gameState.userTeam.facilities[key];
            const facilityData = FACILITY_LEVELS[key];
            if (!facilityData) continue;

            const card = document.createElement('div');
            card.classList.add('card-item', 'facility-card');
            let effectsHtml = '';
            for(const effectKey in facilityData.effects) {
                effectsHtml += `<p><small>${effectKey}: +${facilityData.effects[effectKey][facilityState.level]}</small></p>`;
            }
            
            let upgradeButtonHtml = '';
            if (facilityState.upgradeInProgress) {
                const progress = ((facilityData.upgradeTimeWeeks[facilityState.level+1] - facilityState.weeksToComplete) / facilityData.upgradeTimeWeeks[facilityState.level+1]) * 100;
                upgradeButtonHtml = `
                    <p>Улучшение до уровня ${facilityState.level + 1} в процессе...</p>
                    <div class="progress-bar-container"><div class="progress-bar" style="width:${progress}%">${Math.round(progress)}%</div></div>
                    <p><small>Осталось: ${facilityState.weeksToComplete} нед.</small></p>
                `;
            } else if (facilityState.level < facilityData.maxLevel) {
                const cost = facilityData.costs[facilityState.level + 1];
                const time = facilityData.upgradeTimeWeeks[facilityState.level + 1];
                upgradeButtonHtml = `<button data-facility-key="${key}" class="upgrade-facility-btn action-button green" ${gameState.budget < cost ? 'disabled' : ''}>Улучшить до ур. ${facilityState.level + 1} ($${cost.toLocaleString()}, ${time} нед.)</button>`;
            } else {
                upgradeButtonHtml = '<p>Максимальный уровень достигнут.</p>';
            }

            card.innerHTML = `
                <div class="facility-info">
                    <h3>${facilityData.name} (Уровень: ${facilityState.level})</h3>
                    ${effectsHtml}
                </div>
                ${upgradeButtonHtml}
            `;
            if(card.querySelector('.upgrade-facility-btn')) {
                 card.querySelector('.upgrade-facility-btn').onclick = (e) => handleUpgradeFacility(e.target.dataset.facilityKey);
            }
            ui.facilitiesList.appendChild(card);
        }
    }
    
    function renderFinancesScreen() { /* ... Отображение бюджета, доходов/расходов, спонсоров ... */
        const weeklyExpenses = calculateWeeklyExpenses();
        const weeklyIncomes = calculateWeeklyIncomes(); // Включая спонсоров и доход от стадиона (усредненный)

        ui.financeBudgetDisplay.textContent = gameState.budget.toLocaleString();
        ui.financeWeeklyIncome.textContent = weeklyIncomes.toLocaleString();
        ui.financeWeeklyExpense.textContent = weeklyExpenses.toLocaleString();
        const balance = weeklyIncomes - weeklyExpenses;
        ui.financeWeeklyBalance.textContent = balance.toLocaleString();
        ui.financeWeeklyBalance.className = balance >= 0 ? 'positive' : 'negative';

        ui.sponsorsList.innerHTML = '';
        if (gameState.userTeam.sponsors.length === 0) {
            ui.sponsorsList.innerHTML = '<li>Нет активных спонсорских контрактов.</li>';
        } else {
            gameState.userTeam.sponsors.forEach(sponsor => {
                const li = document.createElement('li');
                li.classList.add('list-item', 'compact');
                li.innerHTML = `
                    <div class="sponsor-info">
                        <strong>${sponsor.name}</strong> (${SPONSOR_TYPES[sponsor.type].name})<br>
                        <span class="item-details">Доход: ${sponsor.weeklyIncome.toLocaleString()}$/нед. Осталось: ${sponsor.weeksLeft} нед.</span>
                    </div>
                    ${sponsor.weeksLeft < 5 ? '<button class="small-action-button yellow">Истекает!</button>' : ''}
                `; // TODO: Кнопка для досрочного расторжения?
                ui.sponsorsList.appendChild(li);
            });
        }
        ui.findNewSponsorBtn.disabled = gameState.userTeam.sponsors.filter(s=>s.type === 'kit').length >= MAX_SPONSORS_PER_TYPE &&
                                         gameState.userTeam.sponsors.filter(s=>s.type === 'stadiumNaming').length >= MAX_SPONSORS_PER_TYPE;


        ui.transactionHistory.innerHTML = '';
        if (gameState.transactions.length === 0) {
            ui.transactionHistory.innerHTML = '<li>История транзакций пуста.</li>';
        } else {
            gameState.transactions.forEach(t => {
                const li = document.createElement('li');
                li.classList.add(t.type); // 'income' or 'expense'
                li.textContent = `(С${t.season} Н${t.week}) ${t.description}: ${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}$`;
                ui.transactionHistory.appendChild(li);
            });
        }
    }
    
    function renderSchedule(filter = "all") { /* ... Календарь матчей, включая кубки ... */
        ui.matchSchedule.innerHTML = '';
        let matchesToShow = gameState.schedule.filter(m => m.week === gameState.currentWeek);
        
        if (filter === "league") matchesToShow = gameState.schedule.filter(m => m.competition === "Лига" && m.week >= gameState.currentWeek);
        else if (filter === "cup") matchesToShow = gameState.schedule.filter(m => m.competition !== "Лига" && m.week >= gameState.currentWeek);
        else if (filter === "user") matchesToShow = gameState.schedule.filter(m => m.isUserMatch && m.week >= gameState.currentWeek);
        else if (filter === "all_season") matchesToShow = gameState.schedule.filter(m => m.week >= gameState.currentWeek); // Показать все оставшиеся
        else matchesToShow = gameState.schedule.filter(m => m.week === gameState.currentWeek); // По умолчанию только текущая неделя

        if (filter !== "all" && filter !== "user" && filter !== "all_season") { // Для лиги и кубка показываем не только текущую неделю
            matchesToShow = matchesToShow.slice(0,20); // Ограничиваем вывод
        }


        if (matchesToShow.length === 0) {
            if (gameState.currentWeek > gameState.seasonLength && filter === "all") {
                 ui.matchSchedule.innerHTML = '<p>Сезон окончен!</p>';
            } else {
                ui.matchSchedule.innerHTML = '<p>Нет запланированных матчей по вашему фильтру.</p>';
            }
            return;
        }

        matchesToShow.forEach(match => {
            const div = document.createElement('div');
            div.classList.add('list-item', 'match-entry');
            if (match.isUserMatch && !match.played) div.classList.add('user-next-match');
            if (match.played) div.classList.add('match-played');

            let statusHtml = '';
            if (match.played) {
                statusHtml = `<span>${match.homeScore} - ${match.awayScore}</span>`;
            } else if (match.isUserMatch) {
                const canPlay = canUserTeamPlayMatch();
                statusHtml = `<button class="play-match-btn action-button green" data-match-id="${match.matchId}" ${!canPlay.canPlay ? 'disabled' : ''}>Играть</button>`;
                if (!canPlay.canPlay) div.title = canPlay.reason;
            } else {
                statusHtml = `<span>Неделя ${match.week}</span>`;
            }

            div.innerHTML = `
                <div style="flex-grow:1;">
                    <small>[${match.competition_short || match.competition.substring(0,3)}] Н:${match.week}</small><br>
                    ${match.homeTeamName} vs ${match.awayTeamName}
                </div>
                ${statusHtml}
            `;
            if (match.isUserMatch && !match.played) {
                const playBtn = div.querySelector('.play-match-btn');
                if(playBtn) playBtn.addEventListener('click', (e) => {
                    const matchId = e.target.dataset.matchId;
                    initiateMatchSimulation(matchId);
                });
            }
            ui.matchSchedule.appendChild(div);
        });
    }
    
    function renderLeagueTable() { /* ... как раньше ... */
        ui.leagueTableBody.innerHTML = '';
        const sortedTable = Object.values(gameState.leagueTable).sort((a, b) => {
            if (b.Pts !== a.Pts) return b.Pts - a.Pts;
            if (b.GD !== a.GD) return b.GD - a.GD;
            if (b.GF !== a.GF) return b.GF - a.GF;
            return a.name.localeCompare(b.name);
        });

        sortedTable.forEach((teamStats, index) => {
            const tr = document.createElement('tr');
            if (teamStats.name === gameState.userTeam.name) tr.classList.add('user-team-row');
            tr.innerHTML = `<td>${index + 1}</td><td>${teamStats.name}</td><td>${teamStats.P}</td><td>${teamStats.W}</td><td>${teamStats.D}</td><td>${teamStats.L}</td><td>${teamStats.GF}</td><td>${teamStats.GA}</td><td>${teamStats.GD}</td><td>${teamStats.Pts}</td>`;
            ui.leagueTableBody.appendChild(tr);
        });
    }

    function renderCupScreen() { /* ... Отображение сетки кубка или следующего матча ... */
        const cupState = gameState.userTeam.activeNationalCup;
        if (!cupState || cupState.userEliminated || cupState.winner) {
            ui.cupNameDisplay.textContent = CUP_COMPETITIONS.nationalCup.name;
            ui.cupCurrentRound.textContent = cupState ? (cupState.winner ? `Победитель: ${cupState.winner}` : "Вы выбыли") : "Не участвуете";
            ui.cupBracketOrNextMatch.innerHTML = cupState && cupState.winner ? `<p>Поздравляем ${cupState.winner}!</p>` : '<p>Информация о кубке недоступна или вы завершили участие.</p>';
            return;
        }
        ui.cupNameDisplay.textContent = cupState.name;
        const currentRoundData = cupState.fixtures[cupState.currentRoundIndex];
        ui.cupCurrentRound.textContent = currentRoundData ? currentRoundData.roundName : "Завершено";
        ui.cupBracketOrNextMatch.innerHTML = '';

        if (currentRoundData) {
            currentRoundData.matches.forEach(match => {
                const div = document.createElement('div');
                div.classList.add('list-item', 'match-entry');
                if (match.isUserMatch && !match.played) div.classList.add('user-next-match');
                if (match.played) div.classList.add('match-played');
                
                let statusHtml = match.played ? `<span>${match.homeScore} - ${match.awayScore}</span>` : `<span>Неделя ${match.week}</span>`;
                if (match.isUserMatch && !match.played) {
                     const canPlay = canUserTeamPlayMatch();
                     statusHtml = `<button class="play-match-btn action-button green" data-match-id="${match.matchId}" ${!canPlay.canPlay ? 'disabled' : ''}>Играть</button>`;
                     if (!canPlay.canPlay) div.title = canPlay.reason;
                }

                div.innerHTML = `<div style="flex-grow:1;">${match.homeTeamName} vs ${match.awayTeamName}</div> ${statusHtml}`;
                if (match.isUserMatch && !match.played && div.querySelector('.play-match-btn')) {
                    div.querySelector('.play-match-btn').addEventListener('click', (e) => initiateMatchSimulation(e.target.dataset.matchId));
                }
                ui.cupBracketOrNextMatch.appendChild(div);
            });
        } else if (cupState.winner) {
             ui.cupBracketOrNextMatch.innerHTML = `<p><strong>Победитель Кубка: ${cupState.winner}!</strong></p>`;
        } else {
             ui.cupBracketOrNextMatch.innerHTML = '<p>Следующий раунд будет сформирован.</p>';
        }
    }
    
    function renderOfficeScreen() { /* ... Кнопки для собраний, прессы ... */
        ui.boardConfidenceDisplay.textContent = `${gameState.boardConfidence}% (${getBoardConfidenceText()})`;
        ui.holdTeamMeetingBtn.disabled = gameState.teamMeetingCooldown > 0;
        ui.callPressConferenceBtn.disabled = gameState.pressConferenceCooldown > 0;
        if(gameState.teamMeetingCooldown > 0) ui.holdTeamMeetingBtn.title = `Доступно через ${gameState.teamMeetingCooldown} нед.`;
        if(gameState.pressConferenceCooldown > 0) ui.callPressConferenceBtn.title = `Доступно через ${gameState.pressConferenceCooldown} нед.`;
    }
    
    // --- Логика игры (много функций) ---
    // Контракты
    function openContractNegotiation(playerId) {
        currentNegotiationPlayerId = playerId;
        const player = gameState.userTeam.players.find(p => p.id === playerId);
        if (!player) return;

        ui.negotiatePlayerName.textContent = player.name;
        ui.currentSalaryDisplay.textContent = player.contract.salary.toLocaleString();
        ui.currentWeeksLeftDisplay.textContent = getWeeksLeftInContract(player);

        // Упрощенные ожидания игрока
        const moraleFactor = Math.max(0.8, player.morale / 100 + 0.3); // От 0.8 до 1.3
        const formFactor = Math.max(0.9, player.form / 100 + 0.4);   // От 0.9 до 1.4
        const ageFactor = player.age < 24 ? 1.2 : (player.age > 30 ? 0.8 : 1.0);
        const performanceFactor = (player.attack + player.defense) / 100; // Средний скилл / 50

        const expectedSalary = Math.floor(player.contract.salary * moraleFactor * formFactor * ageFactor * performanceFactor / 100) * 100 + 500;
        ui.expectedSalaryDisplay.textContent = `~${expectedSalary.toLocaleString()}`;
        ui.newSalaryInput.value = Math.max(player.contract.salary, Math.floor(expectedSalary * 0.9 /100)*100); // Предлагаем не ниже текущей или 90% от ожидаемой

        const expectedDuration = player.age < 28 ? CONTRACT_LENGTHS_WEEKS.long : CONTRACT_LENGTHS_WEEKS.medium;
        ui.expectedDurationDisplay.textContent = `~${expectedDuration}`;
        ui.newDurationSelect.value = expectedDuration;

        ui.negotiationFeedback.textContent = '';
        ui.contractNegotiationOverlay.style.display = 'flex';
    }
    function handleOfferContract() {
        const player = gameState.userTeam.players.find(p => p.id === currentNegotiationPlayerId);
        if (!player) return;

        const offeredSalary = parseInt(ui.newSalaryInput.value);
        const offeredDuration = parseInt(ui.newDurationSelect.value);

        if (isNaN(offeredSalary) || offeredSalary <= 0 || isNaN(offeredDuration) || offeredDuration <= 0) {
            ui.negotiationFeedback.textContent = "Некорректные условия.";
            return;
        }
        // Упрощенная логика согласия
        const salaryDemandFactor = Math.max(0.7, Math.min(1.5, (player.morale / 70) * ((player.attack + player.defense) / 120) * (player.age > 29 ? 0.85 : 1.15) ));
        const demandedSalary = Math.floor(player.contract.salary * salaryDemandFactor / 100) * 100 + getRandomInt(-200,200);

        if (offeredSalary >= demandedSalary && offeredDuration >= player.contract.durationWeeks / 2) { // Если зп устраивает и срок не слишком короткий
            player.contract.salary = offeredSalary;
            player.contract.durationWeeks = offeredDuration;
            player.contract.endDate = calculateEndDate(gameState.currentWeek, gameState.currentSeason, offeredDuration);
            player.morale = Math.min(100, player.morale + getRandomInt(10, 25)); // Бонус к морали
            addNews('contractRenewed', player.name, offeredSalary, offeredDuration);
            addTransaction(`Продление контракта: ${player.name}`, 0, 'neutral'); // Сумма здесь 0, т.к. это будущие расходы
            ui.contractNegotiationOverlay.style.display = 'none';
            updateAllUI();
        } else {
            let reason = "предложенные условия неприемлемы.";
            if(offeredSalary < demandedSalary) reason = `зарплата слишком низкая (ожидает около ${demandedSalary.toLocaleString()}$).`;
            else reason = `срок контракта слишком короткий.`;
            player.morale = Math.max(0, player.morale - getRandomInt(5, 15));
            ui.negotiationFeedback.textContent = `Игрок отклонил предложение: ${reason}`;
            addNews('contractRenewalFailed', player.name, reason);
        }
        currentNegotiationPlayerId = null;
    }

    // Трансферы и скаутинг
    function handleSellPlayer(playerId) { /* ... */
        const playerIndex = gameState.userTeam.players.findIndex(p => p.id === playerId);
        if (playerIndex > -1) {
            const player = gameState.userTeam.players[playerIndex];
            if (player.price === 0 && player.age < 28) { // Стартовые или только что из академии
                alert("Этого игрока пока нельзя продать (слишком мало опыта в клубе)."); return;
            }
            if (gameState.userTeam.players.length <= MIN_SQUAD_SIZE - 3) {
                alert(`Нельзя продать, в команде должно быть мин. ${MIN_SQUAD_SIZE - 3} игроков!`); return;
            }
            
            const transferFee = player.price * (0.8 + Math.random() * 0.4); // 80-120% от цены
            gameState.budget += transferFee;
            addTransaction(`Продажа ${player.name}`, transferFee, 'income');
            addNews('playerSold', player.name, gameState.userTeam.name, transferFee);
            
            const soldPlayer = gameState.userTeam.players.splice(playerIndex, 1)[0];
            if (gameState.userTeam.startingXI.includes(soldPlayer.id)) {
                gameState.userTeam.startingXI[gameState.userTeam.startingXI.indexOf(soldPlayer.id)] = null;
            }
            if(soldPlayer.trainingFocus) gameState.userTeam.trainingSlotsUsed--;

            soldPlayer.isUserPlayer = false; soldPlayer.scoutedLevel = 0; soldPlayer.statsVisible = false;
            gameState.transferMarket.unshift(soldPlayer); // Возвращаем на рынок
            updateAllUI();
        }
    }
    function handleBuyPlayer(playerId) { /* ... */
        const playerIndex = gameState.transferMarket.findIndex(p => p.id === playerId);
        if (playerIndex > -1) {
            const player = gameState.transferMarket[playerIndex];
             if (player.scoutedLevel < 3) { alert("Сначала полностью разведайте игрока."); return; }
            if (gameState.userTeam.players.length >= MAX_SQUAD_SIZE) { alert(`Макс. ${MAX_SQUAD_SIZE} игроков в команде!`); return; }
            
            const transferFee = player.price * (1 + Math.random() * 0.3); // Может быть дороже
            if (gameState.budget >= transferFee) {
                gameState.budget -= transferFee;
                addTransaction(`Покупка ${player.name}`, transferFee, 'expense');
                
                const boughtPlayer = gameState.transferMarket.splice(playerIndex, 1)[0];
                boughtPlayer.isUserPlayer = true; boughtPlayer.scoutedLevel = 3; boughtPlayer.statsVisible = true;
                // Новый контракт при покупке
                boughtPlayer.contract.salary = Math.floor(boughtPlayer.contract.salary * (1 + getRandomInt(5,20)/100) /100)*100; // Чуть выше
                boughtPlayer.contract.durationWeeks = getRandomElement(Object.values(CONTRACT_LENGTHS_WEEKS));
                boughtPlayer.contract.endDate = calculateEndDate(gameState.currentWeek, gameState.currentSeason, boughtPlayer.contract.durationWeeks);
                
                gameState.userTeam.players.push(boughtPlayer);
                addNews('playerBought', boughtPlayer.name, gameState.userTeam.name, transferFee);
                updateAllUI();
            } else { alert("Недостаточно средств!"); }
        }
    }
    function handleScoutPlayer(playerId, cost) { /* ... */
        if (gameState.budget >= cost) {
            const player = gameState.transferMarket.find(p => p.id === playerId);
            if (player && player.scoutedLevel < 3) {
                gameState.budget -= cost; addTransaction(`Скаут ${player.name}`, cost, 'expense');
                player.scoutedLevel++;
                if(player.scoutedLevel >= 3) { player.statsVisible = true; addNews('generic', `Скаут завершен: ${player.name}. Статы открыты.`);}
                else { addNews('generic', `Скаут ${player.name} (ур. ${player.scoutedLevel}/3).`); }
                updateAllUI();
            }
        } else { alert("Недостаточно средств для скаутинга!"); }
    }
    
    // Молодежная академия
    function handlePromoteYouthPlayer(playerId) {
        if (gameState.userTeam.players.length >= MAX_SQUAD_SIZE) {
            alert("В основной команде нет места."); return;
        }
        const playerIndex = gameState.userTeam.youthAcademy.players.findIndex(p => p.id === playerId);
        if (playerIndex > -1) {
            const player = gameState.userTeam.youthAcademy.players.splice(playerIndex, 1)[0];
            player.isYouth = false;
            player.isUserPlayer = true;
            player.price = 0; // Молодые игроки сначала не имеют цены продажи
            player.contract.salary = Math.floor(player.potential * 30 + getRandomInt(100,300) /100)*100; // Первая проф. з/п
            player.contract.durationWeeks = CONTRACT_LENGTHS_WEEKS.medium;
            player.contract.endDate = calculateEndDate(gameState.currentWeek, gameState.currentSeason, player.contract.durationWeeks);
            gameState.userTeam.players.push(player);
            addNews('youthPlayerPromoted', player.name);
            updateAllUI();
        }
    }
    function processYouthIntake() {
        if (gameState.currentWeek === gameState.userTeam.youthAcademy.nextIntakeWeek) {
            const facilityLevel = gameState.userTeam.facilities.youthAcademyFacility.level;
            const qualityBonus = FACILITY_LEVELS.youthAcademyFacility.effects.newIntakeQualityBonus[facilityLevel];
            const youthCoachBonus = gameState.userTeam.staff.youthCoach ? gameState.userTeam.staff.youthCoach.skillLevel / 10 : 0;
            
            let numNewPlayers = getRandomInt(YOUTH_INTAKE_MIN_PLAYERS, YOUTH_INTAKE_MAX_PLAYERS + Math.floor(facilityLevel/2));
            let promotedCount = 0;
            for (let i = 0; i < numNewPlayers; i++) {
                if (gameState.userTeam.youthAcademy.players.length < YOUTH_ACADEMY_MAX_PLAYERS + facilityLevel * 2) {
                    const basePotential = getRandomInt(YOUTH_PLAYER_POTENTIAL_RANGE[0], YOUTH_PLAYER_POTENTIAL_RANGE[1]);
                    const finalPotential = Math.min(180, basePotential + qualityBonus + youthCoachBonus + getRandomInt(-5,5)); // 180 макс сумма атк+защ
                    
                    const newYouth = createPlayer({
                        isYouth: true,
                        age: getRandomInt(15, 17),
                        potentialValue: finalPotential,
                        baseAttack: Math.floor(finalPotential/2 * (0.3 + Math.random()*0.4)), // Начальные статы ниже
                        baseDefense: Math.floor(finalPotential/2 * (0.3 + Math.random()*0.4)),
                    });
                    gameState.userTeam.youthAcademy.players.push(newYouth);
                    promotedCount++;
                }
            }
            if (promotedCount > 0) addNews('newYouthIntake', promotedCount);
            
            // Устанавливаем следующую неделю набора
            const currentIntakeIndex = YOUTH_INTAKE_WEEKS.indexOf(gameState.currentWeek);
            gameState.userTeam.youthAcademy.nextIntakeWeek = YOUTH_INTAKE_WEEKS[(currentIntakeIndex + 1) % YOUTH_INTAKE_WEEKS.length];
            if (gameState.userTeam.youthAcademy.nextIntakeWeek <= gameState.currentWeek && YOUTH_INTAKE_WEEKS.length > 1) {
                // Если следующая неделя уже прошла в этом сезоне, переносим на следующий
                // Это упрощение, нужно более умное управление датами набора
            }
        }
    }
    function developYouthPlayers() {
        const devRateFacility = FACILITY_LEVELS.youthAcademyFacility.effects.youthPlayerDevelopmentRate[gameState.userTeam.facilities.youthAcademyFacility.level];
        const youthCoach = gameState.userTeam.staff.youthCoach;
        const youthCoachFactor = youthCoach ? (youthCoach.skillLevel / 200) : 0; // от 0 до 0.5
        
        gameState.userTeam.youthAcademy.players.forEach(player => {
            if (player.age > 20) return; // Перестают сильно развиваться в академии
            
            const baseDevChance = 0.1 + devRateFacility + youthCoachFactor + (player.potential > 120 ? 0.05 : 0); // Базовый шанс на улучшение
            if (Math.random() < baseDevChance) {
                const statToImprove = Math.random() < 0.5 ? 'attack' : 'defense';
                const currentSum = player.attack + player.defense;
                if (currentSum < player.potential) { // Если есть куда расти
                    const improvement = getRandomInt(1,2);
                    player[statToImprove] = Math.min(99, player[statToImprove] + improvement);
                    // addNews('generic', `Молодой игрок ${player.name} улучшил ${statToImprove}`); // Слишком много новостей будет
                }
            }
            // Небольшой рост формы/морали
             player.form = Math.min(100, player.form + getRandomInt(1,5));
             player.morale = Math.min(100, player.morale + getRandomInt(1,3));
        });
    }

    // Персонал
    function handleHireCoach(coachId) { /* ... */
        if (gameState.userTeam.coach) { alert("У вас уже есть тренер."); return; }
        const coachIndex = gameState.availableCoaches.findIndex(c => c.id === parseInt(coachId));
        if (coachIndex > -1) {
            const coachToHire = gameState.availableCoaches[coachIndex];
            if (gameState.budget >= coachToHire.salary) { // Проверяем только первую з/п
                gameState.userTeam.coach = coachToHire;
                gameState.availableCoaches.splice(coachIndex, 1);
                addNews('newCoach', coachToHire.name, gameState.userTeam.name);
                addTransaction(`Наем тренера ${coachToHire.name}`, coachToHire.salary, 'expense'); // Зарплата вычитается еженедельно
                updateAllUI();
            } else { alert("Недостаточно средств."); }
        }
    }
    function handleFireCoach() { /* ... */
        if (gameState.userTeam.coach) {
            if (confirm(`Уволить тренера ${gameState.userTeam.coach.name}? Это может стоить неустойку.`)) {
                const firedCoach = gameState.userTeam.coach;
                const severancePay = Math.floor(firedCoach.salary * getRandomInt(2,6)); // Неустойка 2-6 недельных зарплат
                if(gameState.budget < severancePay) { alert("Недостаточно средств для выплаты неустойки!"); return;}
                gameState.budget -= severancePay;
                addTransaction(`Увольнение тренера ${firedCoach.name}`, severancePay, 'expense');
                
                gameState.userTeam.coach = null;
                firedCoach.id = gameState.staffIdCounter++; // Новый ID чтобы не было конфликта если он вернется на рынок
                gameState.availableCoaches.unshift(firedCoach); // Возвращаем на рынок
                addNews('firedCoach', firedCoach.name, gameState.userTeam.name);
                updateAllUI();
            }
        }
    }
    function handleHireStaff(staffId, roleKey) { /* ... */
        staffId = parseInt(staffId);
        if (gameState.userTeam.staff[roleKey]) { alert(`Должность ${STAFF_ROLES[roleKey].name} уже занята.`); return; }
        const staffIndex = gameState.availableStaff[roleKey].findIndex(s => s.id === staffId);
        if (staffIndex > -1) {
            const staffToHire = gameState.availableStaff[roleKey][staffIndex];
            if (gameState.budget >= staffToHire.salary) {
                gameState.userTeam.staff[roleKey] = staffToHire;
                gameState.availableStaff[roleKey].splice(staffIndex, 1);
                addNews('staffHired', staffToHire.name, staffToHire.role);
                addTransaction(`Наем ${staffToHire.role}`, staffToHire.salary, 'expense');
                updateAllUI();
            } else { alert("Недостаточно средств."); }
        }
    }
    function handleFireStaff(roleKey) { /* ... */
        const staffMember = gameState.userTeam.staff[roleKey];
        if (staffMember) {
            if (confirm(`Уволить ${staffMember.role} ${staffMember.name}?`)) {
                const severancePay = Math.floor(staffMember.salary * getRandomInt(1,4));
                if(gameState.budget < severancePay) { alert("Недостаточно средств для выплаты неустойки!"); return;}
                gameState.budget -= severancePay;
                addTransaction(`Увольнение ${staffMember.role}`, severancePay, 'expense');

                gameState.userTeam.staff[roleKey] = null;
                staffMember.id = gameState.staffIdCounter++;
                gameState.availableStaff[roleKey].unshift(staffMember); // Возвращаем на рынок
                addNews('staffFired', staffMember.name, staffMember.role);
                updateAllUI();
            }
        }
    }

    // Инфраструктура
    function handleUpgradeFacility(facilityKey) { /* ... */
        const facilityState = gameState.userTeam.facilities[facilityKey];
        const facilityData = FACILITY_LEVELS[facilityKey];
        if (facilityState.level < facilityData.maxLevel && !facilityState.upgradeInProgress) {
            const cost = facilityData.costs[facilityState.level + 1];
            if (gameState.budget >= cost) {
                gameState.budget -= cost;
                addTransaction(`Улучшение: ${facilityData.name}`, cost, 'expense');
                facilityState.upgradeInProgress = true;
                facilityState.weeksToComplete = facilityData.upgradeTimeWeeks[facilityState.level + 1];
                addNews('facilityUpgradeStarted', facilityData.name, facilityState.level + 1);
                updateAllUI();
            } else { alert("Недостаточно средств для улучшения."); }
        }
    }
    function processFacilityUpgrades() { /* ... */
        for (const key in gameState.userTeam.facilities) {
            const facilityState = gameState.userTeam.facilities[key];
            if (facilityState.upgradeInProgress) {
                facilityState.weeksToComplete--;
                if (facilityState.weeksToComplete <= 0) {
                    facilityState.level++;
                    facilityState.upgradeInProgress = false;
                    addNews('facilityUpgradeComplete', FACILITY_LEVELS[key].name, facilityState.level);
                    // Обновить связанные бонусы (например, фан счастье от стадиона)
                    if (key === 'stadium') gameState.fanHappiness = Math.min(100, gameState.fanHappiness + FACILITY_LEVELS.stadium.effects.fanHappinessBonus[facilityState.level]);
                }
            }
        }
    }

    // Финансы и спонсоры
    function handleFindNewSponsor() { /* ... */
        // Ищем тип спонсора, которого еще нет или у которого истек контракт
        let availableSponsorTypeKey = null;
        for (const typeKey in SPONSOR_TYPES) {
            if (!gameState.userTeam.sponsors.find(s => s.type === typeKey)) {
                 // Проверка требований (например, уровень стадиона)
                if(SPONSOR_TYPES[typeKey].requiresStadiumLevel && gameState.userTeam.facilities.stadium.level < SPONSOR_TYPES[typeKey].requiresStadiumLevel) {
                    continue;
                }
                availableSponsorTypeKey = typeKey;
                break;
            }
        }
        if (!availableSponsorTypeKey) {
            alert("Нет доступных слотов для новых спонсоров или не выполнены требования."); return;
        }

        const sponsorDetails = SPONSOR_TYPES[availableSponsorTypeKey];
        const weeklyIncome = getRandomInt(sponsorDetails.baseIncomePerWeek[0], sponsorDetails.baseIncomePerWeek[1]) * (1 + gameState.fanHappiness/200 + gameState.boardConfidence/300); // Доход зависит от популярности
        const duration = getRandomInt(sponsorDetails.durationWeeks[0], sponsorDetails.durationWeeks[1]);
        const sponsorName = `${getRandomElement(["РосТелеКом", "ГазПромБанк", "Лукойл-Сервис", "Аэрофлот Карго", "Магнит Косметик", "МегаФон Ритейл"])} (${sponsorDetails.name})`;

        gameState.userTeam.sponsors.push({
            type: availableSponsorTypeKey, name: sponsorName, weeklyIncome: Math.floor(weeklyIncome/100)*100,
            durationWeeks: duration, weeksLeft: duration
        });
        addNews('newSponsor', sponsorName, Math.floor(weeklyIncome/100)*100, duration);
        updateAllUI();
    }
    function processSponsors() { /* ... */
        gameState.userTeam.sponsors.forEach(sponsor => {
            sponsor.weeksLeft--;
        });
        gameState.userTeam.sponsors = gameState.userTeam.sponsors.filter(s => s.weeksLeft > 0); // Удаляем истекшие
    }
    function calculateWeeklyExpenses() { /* ... */
        let totalExpenses = 0;
        gameState.userTeam.players.forEach(p => totalExpenses += p.contract.salary);
        if (gameState.userTeam.coach) totalExpenses += gameState.userTeam.coach.salary;
        for (const roleKey in gameState.userTeam.staff) {
            if (gameState.userTeam.staff[roleKey]) totalExpenses += gameState.userTeam.staff[roleKey].salary;
        }
        // Расходы на содержание инфраструктуры
        let facilityMaintenance = 0;
        for(const key in gameState.userTeam.facilities) {
            facilityMaintenance += gameState.userTeam.facilities[key].level * 500; // Условно 500 за уровень
        }
        totalExpenses += facilityMaintenance;
        totalExpenses += 5000; // Базовые операционные расходы
        return totalExpenses;
    }
    function calculateWeeklyIncomes() { /* ... */
        let totalIncomes = 0;
        gameState.userTeam.sponsors.forEach(s => totalIncomes += s.weeklyIncome);
        // Доход от билетов (усредненный, реальный лучше после каждого домашнего матча)
        const stadiumLevel = gameState.userTeam.facilities.stadium.level;
        const baseMatchIncome = FACILITY_LEVELS.stadium.effects.incomePerMatchBonus[stadiumLevel];
        const fanFactor = gameState.fanHappiness / 100;
        totalIncomes += Math.floor(baseMatchIncome * fanFactor / 2); // Предполагаем 2 домашних матча в месяц (делим на 2 для недели)
        return totalIncomes;
    }
    function processWeeklyFinancials() { /* ... */
        const expenses = calculateWeeklyExpenses();
        const incomes = calculateWeeklyIncomes();
        
        gameState.budget += (incomes - expenses);
        addTransaction("Еженедельные доходы", incomes, 'income');
        addTransaction("Еженедельные расходы", expenses, 'expense');

        if (gameState.budget < -100000) { // Порог банкротства
            alert("Клуб обанкротился! Игра окончена.");
            // TODO: Реализовать экран Game Over
            localStorage.removeItem('footballManagerDeluxeState');
            ui.initialSetupOverlay.style.display = 'flex'; // Показываем снова для ввода имени
            // gameState = getDefaultGameState(); // Сброс состояния, но лучше перезагрузить страницу или показать спец. экран
            // initGame(); // Это вызовет resetGameStateAndStart, если нет сохранения
            location.reload(); // Самый простой способ начать заново
        } else if (gameState.budget < 0) {
            addNews('generic', "ВНИМАНИЕ! Бюджет клуба отрицательный. Примите меры!");
            gameState.boardConfidence = Math.max(0, gameState.boardConfidence - 5);
        }
    }
    
    // Матчи
    function getEffectivePlayerStats(player, forMatchSim = false) { /* ... Учитывает больше факторов ... */
        if (!player) return { attack: 0, defense: 0, overall: 0, currentStamina: 100 };
        const formModifier = (player.form - 50) / 50 * 0.15; // от -0.15 до +0.15
        const moraleModifier = (player.morale - 50) / 100 * 0.10; // от -0.05 до +0.05
        
        let effectiveAttack = player.attack * (1 + formModifier + moraleModifier);
        let effectiveDefense = player.defense * (1 + formModifier + moraleModifier);

        // Влияние командной тренировки
        effectiveAttack += player.teamTrainingEffect.attack || 0;
        effectiveDefense += player.teamTrainingEffect.defense || 0;


        effectiveAttack = Math.max(10, Math.min(99, Math.round(effectiveAttack)));
        effectiveDefense = Math.max(10, Math.min(99, Math.round(effectiveDefense)));
        
        let currentStamina = player.form; // Условно, форма как текущая выносливость для матча
        if(forMatchSim && currentMatchSimulation && currentMatchSimulation.playerStamina[player.id] !== undefined) {
            currentStamina = currentMatchSimulation.playerStamina[player.id];
        }
        // Если выносливость низкая, статы падают
        if(currentStamina < 50) {
            const staminaPenalty = (50 - currentStamina) / 50 * 0.3; // до -30%
            effectiveAttack *= (1 - staminaPenalty);
            effectiveDefense *= (1 - staminaPenalty);
        }


        return {
            attack: Math.round(effectiveAttack),
            defense: Math.round(effectiveDefense),
            overall: Math.round((effectiveAttack + effectiveDefense) / 2),
            currentStamina: currentStamina
        };
    }
    function calculateTeamStrength(teamObject, forMatch = true) { /* ... Учитывает тактику, сыгранность ... */
        let totalAttack = 0;
        let totalDefense = 0;
        let playerCountInCalc = 0;
        let teamCohesion = 50; // Базовая сыгранность, 0-100

        const playersToConsider = forMatch ? 
            teamObject.startingXI.map(id => teamObject.players.find(p => p.id === id)).filter(p => p && p.status.type === 'fit' && !p.internationalDuty) :
            teamObject.players.filter(p => p.status.type === 'fit' && !p.internationalDuty);
        
        if(playersToConsider.length === 0) return { attack: 10, defense: 10, cohesion: 0 };

        playersToConsider.forEach(player => {
            if (!player) return;
            const effectiveStats = getEffectivePlayerStats(player, forMatch); // Передаем флаг forMatch
            let positionBonus = 1.0;
            
            if (forMatch) {
                const slotIndex = teamObject.startingXI.indexOf(player.id);
                const formationStructure = getFormationStructure(teamObject.formation);
                let targetPositionType = "ANY";
                // Находим targetPositionType для данного slotIndex
                let currentSlot = 0;
                for(const line of formationStructure){
                    for(const posDetail of line.positions){
                        if(currentSlot === slotIndex) { targetPositionType = posDetail.base; break;}
                        currentSlot++;
                    }
                    if(targetPositionType !== "ANY") break;
                }

                if (player.position === targetPositionType) positionBonus = 1.05;
                else if (
                    (player.position === 'ЗАЩ' && targetPositionType === 'ПЗЩ') ||
                    (player.position === 'ПЗЩ' && (targetPositionType === 'ЗАЩ' || targetPositionType === 'НАП')) ||
                    (player.position === 'НАП' && targetPositionType === 'ПЗЩ')
                ) positionBonus = 0.95;
                else if (player.position !== 'ВРТ' && targetPositionType !== 'ВРТ') positionBonus = 0.85;
                else if (player.position === 'ВРТ' && targetPositionType !== 'ВРТ') positionBonus = 0.4;
                else if (player.position !== 'ВРТ' && targetPositionType === 'ВРТ') positionBonus = 0.4;
            }

            totalAttack += effectiveStats.attack * positionBonus;
            totalDefense += effectiveStats.defense * positionBonus;
            teamCohesion += player.morale / playersToConsider.length; // Сыгранность зависит от морали
            teamCohesion += (player.teamTrainingEffect.cohesion || 0) / playersToConsider.length;
            playerCountInCalc++;
        });

        if (playerCountInCalc === 0) return { attack: 10, defense: 10, cohesion: 0 };
        
        totalAttack = Math.round(totalAttack / playerCountInCalc);
        totalDefense = Math.round(totalDefense / playerCountInCalc);
        teamCohesion = Math.min(100, Math.max(0, Math.round(teamCohesion)));

        if (teamObject.coach) {
            totalAttack += teamObject.coach.attackBoost;
            totalDefense += teamObject.coach.defenseBoost;
            teamCohesion += teamObject.coach.moraleBoost * 2; // Тренер сильно влияет на сыгранность
        }
        if (teamObject.staff && teamObject.staff.assistantCoach) {
            totalAttack += Math.round(teamObject.staff.assistantCoach.skillLevel / 25);
            totalDefense += Math.round(teamObject.staff.assistantCoach.skillLevel / 25);
        }
        
        let tacticAttackFactor = 1.0, tacticDefenseFactor = 1.0, tacticCohesionFactor = 1.0;
        if (forMatch) {
            switch (teamObject.tactic) {
                case 'attacking': tacticAttackFactor = 1.1; tacticDefenseFactor = 0.9; break;
                case 'defensive': tacticAttackFactor = 0.9; tacticDefenseFactor = 1.1; break;
                case 'counter-attacking': tacticAttackFactor = 0.95; tacticDefenseFactor = 1.05; tacticCohesionFactor = 1.05; break;
                case 'possession': tacticAttackFactor = 1.0; tacticDefenseFactor = 1.0; tacticCohesionFactor = 1.1; break;
                case 'high-press': tacticAttackFactor = 1.05; tacticDefenseFactor = 0.95; tacticCohesionFactor = 0.95; break; // Прессинг может снизить сыгранность, если не отработан
            }
        }
        totalAttack = Math.round(totalAttack * tacticAttackFactor);
        totalDefense = Math.round(totalDefense * tacticDefenseFactor);
        teamCohesion = Math.min(100, Math.max(0, Math.round(teamCohesion * tacticCohesionFactor)));

        // Влияние сыгранности на общие статы
        const cohesionModifier = (teamCohesion - 50) / 50 * 0.1; // +/- 10%
        totalAttack = Math.round(totalAttack * (1 + cohesionModifier));
        totalDefense = Math.round(totalDefense * (1 + cohesionModifier));


        return {
            attack: Math.max(1, totalAttack),
            defense: Math.max(1, totalDefense),
            cohesion: teamCohesion
        };
    }
    function initiateMatchSimulation(matchId) { /* ... */
        const match = gameState.schedule.find(m => m.matchId === matchId);
        if (!match || match.played) return;

        const homeTeam = getTeamReference(match.homeTeamName);
        const awayTeam = getTeamReference(match.awayTeamName);
        if (!homeTeam || !awayTeam) { console.error("Команда не найдена:", match); alert("Ошибка: команда не найдена."); return; }
        
        if (match.isUserMatch) {
            const check = canUserTeamPlayMatch();
            if (!check.canPlay) { alert(check.reason); showScreen('tactics'); return; }
            ui.matchSimTacticsPanel.style.display = 'block';
            ui.userTeamSimName.textContent = gameState.userTeam.name;
            ui.inMatchTacticSelect.value = gameState.userTeam.tactic;
        } else {
             ui.matchSimTacticsPanel.style.display = 'none';
        }

        // Инициализация состояния симуляции
        currentMatchSimulation = {
            matchId: matchId,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            homeScore: 0,
            awayScore: 0,
            currentTime: 0,
            eventsLog: [],
            isPaused: false, // Для тактических замен
            substitutionsMade: 0,
            playerStamina: {} // { playerId: staminaValue }
        };
        // Заполняем начальную выносливость для игроков в старте
        [...homeTeam.startingXI, ...awayTeam.startingXI].forEach(playerId => {
            if(playerId) {
                const player = homeTeam.players.find(p=>p.id===playerId) || awayTeam.players.find(p=>p.id===playerId);
                if(player) currentMatchSimulation.playerStamina[playerId] = player.form; // Начальная выносливость = форма
            }
        });


        ui.matchTeamsInfo.textContent = `${homeTeam.name} vs ${awayTeam.name}`;
        ui.matchTimeDisplay.textContent = "00:00";
        ui.matchCurrentScore.textContent = "0 - 0";
        ui.matchEvents.innerHTML = '';
        ui.finalScore.textContent = '';
        ui.closeMatchSimBtn.textContent = "Завершить";
        ui.closeMatchSimBtn.style.display = 'inline-block';
        ui.continueMatchSimBtn.style.display = 'none';

        ui.matchSimOverlay.style.display = 'flex';
        addMatchEvent(0, `Начало матча!`);
        
        // Начинаем симуляцию
        runMatchMinute();
    }
    function runMatchMinute() {
        if (!currentMatchSimulation || currentMatchSimulation.isPaused || currentMatchSimulation.currentTime >= 90) {
            if (currentMatchSimulation && currentMatchSimulation.currentTime >= 90) finalizeMatchSimulation();
            return;
        }
        
        const sim = currentMatchSimulation;
        sim.currentTime += 1; // Симулируем по минутам
        ui.matchTimeDisplay.textContent = `${String(sim.currentTime).padStart(2,'0')}:00`;

        // Логика событий матча (упрощенно, шанс на событие каждую минуту)
        const homeStrength = calculateTeamStrength(sim.homeTeam, true); // Пересчитываем с учетом тактики и т.д.
        const awayStrength = calculateTeamStrength(sim.awayTeam, true);

        const baseEventChance = 0.08; // 8% шанс на какое-то событие в минуту
        if (Math.random() < baseEventChance) {
            const rand = Math.random();
            const homeAttPower = homeStrength.attack * (0.7 + rand * 0.6) * (homeStrength.cohesion / 100);
            const awayDefPower = awayStrength.defense * (0.7 + (1-rand) * 0.6) * (awayStrength.cohesion / 100);
            const awayAttPower = awayStrength.attack * (0.7 + rand * 0.6) * (awayStrength.cohesion / 100);
            const homeDefPower = homeStrength.defense * (0.7 + (1-rand) * 0.6) * (homeStrength.cohesion / 100);

            if (rand < (homeStrength.attack / (homeStrength.attack + awayStrength.attack + 1))) { // Шанс атаки домашней
                if (homeAttPower > awayDefPower * (0.6 + Math.random() * 0.8) ) {
                    sim.homeScore++;
                    addMatchEvent(sim.currentTime, `ГОЛ! ${sim.homeTeam.name} забивает!`);
                    // Шанс на травму/карточку при голе
                    if(Math.random() < 0.03) handleMatchIncident(sim.homeTeam, sim.currentTime);
                } else {
                    if (Math.random() < 0.3) addMatchEvent(sim.currentTime, `${sim.homeTeam.name} атакует, но ${sim.awayTeam.name} отбивается.`);
                }
            } else { // Атака гостей
                if (awayAttPower > homeDefPower * (0.6 + Math.random() * 0.8)) {
                    sim.awayScore++;
                    addMatchEvent(sim.currentTime, `ГОЛ! ${sim.awayTeam.name} забивает!`);
                    if(Math.random() < 0.03) handleMatchIncident(sim.awayTeam, sim.currentTime);
                } else {
                     if (Math.random() < 0.3) addMatchEvent(sim.currentTime, `${sim.awayTeam.name} атакует, ${sim.homeTeam.name} в защите.`);
                }
            }
            ui.matchCurrentScore.textContent = `${sim.homeScore} - ${sim.awayScore}`;
        }
        // Случайная травма/карточка вне голевых моментов
        if (Math.random() < 0.002) handleMatchIncident(Math.random() < 0.5 ? sim.homeTeam : sim.awayTeam, sim.currentTime);

        // Уменьшение выносливости игроков
        [...sim.homeTeam.startingXI, ...sim.awayTeam.startingXI].forEach(playerId => {
            if(playerId && sim.playerStamina[playerId] !== undefined) {
                sim.playerStamina[playerId] -= getRandomInt(0,2); // Теряем 0-2 выносливости в минуту
                sim.playerStamina[playerId] = Math.max(0, sim.playerStamina[playerId]);
            }
        });


        // Возможность для пользователя вмешаться (упрощенно, каждые 15 минут)
        const matchRef = gameState.schedule.find(m=>m.matchId === sim.matchId);
        if (matchRef.isUserMatch && sim.currentTime % 15 === 0 && sim.currentTime < 90) {
            sim.isPaused = true;
            ui.substitutionsLeft.textContent = `${MAX_SUBSTITUTIONS_PER_MATCH - sim.substitutionsMade}`;
            ui.makeSubstitutionBtn.disabled = sim.substitutionsMade >= MAX_SUBSTITUTIONS_PER_MATCH;
            ui.closeMatchSimBtn.style.display = 'none';
            ui.continueMatchSimBtn.style.display = 'inline-block';
            addMatchEvent(sim.currentTime, `ПАУЗА. Вы можете изменить тактику или сделать замену.`);
            return; // Прерываем цикл, ждем реакции пользователя
        }

        setTimeout(runMatchMinute, 50); // Задержка для "анимации"
    }
    function addMatchEvent(time, text) {
        if(!currentMatchSimulation) return;
        currentMatchSimulation.eventsLog.push({time, text});
        const p = document.createElement('p');
        p.innerHTML = `<strong>${String(time).padStart(2,'0')}'</strong>: ${text}`;
        ui.matchEvents.appendChild(p);
        ui.matchEvents.scrollTop = ui.matchEvents.scrollHeight; // Автопрокрутка
    }
    function finalizeMatchSimulation() {
        if(!currentMatchSimulation) return;
        const sim = currentMatchSimulation;
        const match = gameState.schedule.find(m => m.matchId === sim.matchId);

        addMatchEvent(90, `Финальный свисток!`);
        ui.finalScore.textContent = `Итоговый счет: ${sim.homeTeam.name} ${sim.homeScore} - ${sim.awayScore} ${sim.awayTeam.name}`;
        ui.closeMatchSimBtn.textContent = "Закрыть";
        ui.closeMatchSimBtn.style.display = 'inline-block';
        ui.continueMatchSimBtn.style.display = 'none';
        ui.matchSimTacticsPanel.style.display = 'none';


        match.homeScore = sim.homeScore;
        match.awayScore = sim.awayScore;
        match.played = true;

        processPostMatchPlayerChanges(sim.homeTeam, sim.homeScore, sim.awayScore, sim.playerStamina);
        processPostMatchPlayerChanges(sim.awayTeam, sim.awayScore, sim.homeScore, sim.playerStamina);
        
        addNews('matchResult', match.homeTeamName, match.awayTeamName, sim.homeScore, sim.awayScore, match.isUserMatch, match.competition);
        updateLeagueTable(match); // Обновляем таблицу лиги, если это матч лиги
        if (match.competition !== "Лига") processCupMatchResult(match); // Обрабатываем результат кубка

        if (match.isUserMatch) {
            ui.lastUserMatchResultText.textContent = `${match.homeTeamName} ${sim.homeScore} - ${sim.awayScore} ${match.awayTeamName} (${match.competition})`;
            const userWon = (match.homeTeamName === gameState.userTeam.name && sim.homeScore > sim.awayScore) ||
                            (match.awayTeamName === gameState.userTeam.name && sim.awayScore > sim.homeScore);
            const draw = sim.homeScore === sim.awayScore;
            let prize = 0;
            let fanHappinessChange = 0;
            let boardConfidenceChange = 0;

            if (userWon) {
                prize = 20000 + sim.homeScore * 1000 + (match.competition !== "Лига" ? 15000 : 0); // Больше за кубок
                fanHappinessChange = getRandomInt(3,7); boardConfidenceChange = getRandomInt(2,5);
            } else if (draw) {
                prize = 7000 + sim.homeScore * 500 + (match.competition !== "Лига" ? 5000 : 0);
                fanHappinessChange = getRandomInt(-2,2); boardConfidenceChange = getRandomInt(-1,1);
            } else { // Поражение
                prize = 1500 + (match.competition !== "Лига" ? 2000 : 0);
                fanHappinessChange = getRandomInt(-7,-3); boardConfidenceChange = getRandomInt(-5,-2);
            }
            gameState.budget += prize;
            addTransaction(`Призовые за матч (${match.competition})`, prize, 'income');
            gameState.fanHappiness = Math.min(100, Math.max(0, gameState.fanHappiness + fanHappinessChange));
            gameState.boardConfidence = Math.min(100, Math.max(0, gameState.boardConfidence + boardConfidenceChange));
        }
        currentMatchSimulation = null; // Очищаем состояние симуляции
        // updateAllUI(); // Будет вызвано из closeMatchSimBtn.onclick
    }
    function handleMatchIncident(teamObject, currentTime) { /* ... */
        const teamRef = getTeamReference(teamObject.name);
        if (!teamRef || !teamRef.startingXI) return;
        const activePlayerIds = teamRef.startingXI.filter(id => id !== null && teamRef.players.find(p=>p.id===id)?.status.type === 'fit');
        if (activePlayerIds.length === 0) return;
        
        const randomPlayerId = getRandomElement(activePlayerIds);
        const player = teamRef.players.find(p => p.id === randomPlayerId);

        if (player && player.status.type === 'fit') {
            const injuryRiskReduction = gameState.userTeam.facilities.trainingGround.effects.injuryRiskReduction[gameState.userTeam.facilities.trainingGround.level] +
                                     (teamRef.staff && teamRef.staff.physio ? teamRef.staff.physio.skillLevel / 1000 : 0); // 0 до 0.1 от физио

            if (Math.random() < (0.5 - injuryRiskReduction * 2)) { // Шанс на травму
                const injuryDuration = getRandomInt(1, 3 + Math.max(0, 2 - Math.floor((teamRef.staff?.physio?.skillLevel || 0)/25) ) ); // Физио уменьшает макс. срок
                player.status = { type: 'injured', duration: injuryDuration, affectedStat: Math.random() < 0.5 ? 'attack':'defense' }; // Условно, какая часть тела
                addMatchEvent(currentTime, `🔴 Травма! ${player.name} (${teamRef.name}) выбывает на ${injuryDuration} нед.`);
                if(teamRef.name === gameState.userTeam.name) addNews('playerInjured', player.name, injuryDuration, teamRef.name);
            } else { // Дисквалификация (желтая/красная)
                const suspensionDuration = 1;
                player.status = { type: 'suspended', duration: suspensionDuration };
                addMatchEvent(currentTime, `🟥 Дисквалификация! ${player.name} (${teamRef.name}) пропустит ${suspensionDuration} матч.`);
                if(teamRef.name === gameState.userTeam.name) addNews('playerSuspended', player.name, suspensionDuration, teamRef.name);
            }
        }
    }
    function processPostMatchPlayerChanges(teamObject, goalsFor, goalsAgainst, playerStaminaMap) { /* ... */
        const teamRef = getTeamReference(teamObject.name);
        if (!teamRef || !teamRef.players) return;

        teamRef.players.forEach(player => {
            let formChange = 0; let moraleChange = 0;
            const playedInMatch = teamRef.startingXI.includes(player.id) || (currentMatchSimulation && Object.keys(currentMatchSimulation.playerStamina).includes(player.id.toString())); // Если был в старте ИЛИ есть в карте выносливости (значит играл)
            
            if (playedInMatch) {
                const staminaLeft = playerStaminaMap ? (playerStaminaMap[player.id] || 50) : player.form;
                formChange = Math.floor((staminaLeft - player.form) / 5) + getRandomInt(-3,3); // Изменение формы зависит от того, насколько выносливость упала/выросла от обычной формы
                player.form = Math.max(10, Math.min(100, Math.round(staminaLeft))); // Устанавливаем форму по итогу матча
            } else { // Не играл
                formChange = getRandomInt(-5, 0);
                moraleChange = getRandomInt(-3,0);
            }
            
            // Общее изменение морали от результата
            if (goalsFor > goalsAgainst) moraleChange += getRandomInt(3, 8);
            else if (goalsFor < goalsAgainst) moraleChange += getRandomInt(-8, -3);
            else moraleChange += getRandomInt(-2, 2);

            player.form = Math.max(10, Math.min(100, player.form + formChange));
            player.morale = Math.max(0, Math.min(100, player.morale + moraleChange));
        });
    }
    function makeSubstitution() { /* ... */
        if (!currentMatchSimulation || currentMatchSimulation.substitutionsMade >= MAX_SUBSTITUTIONS_PER_MATCH) return;
        
        const outPlayerId = parseInt(ui.subOutPlayerSelect.value);
        const inPlayerId = parseInt(ui.subInPlayerSelect.value);

        if (!outPlayerId || !inPlayerId || outPlayerId === inPlayerId) { alert("Выберите корректных игроков."); return; }

        const userTeam = gameState.userTeam;
        const outPlayer = userTeam.players.find(p => p.id === outPlayerId);
        const inPlayer = userTeam.players.find(p => p.id === inPlayerId);

        if (!outPlayer || !inPlayer) { alert("Игроки не найдены."); return; }
        if (!userTeam.startingXI.includes(outPlayerId)) { alert(`${outPlayer.name} не на поле.`); return; }
        if (userTeam.startingXI.includes(inPlayerId)) { alert(`${inPlayer.name} уже на поле.`); return; }
        if (inPlayer.status.type !== 'fit' || inPlayer.internationalDuty) { alert(`${inPlayer.name} не готов к выходу.`); return; }

        const slotIndex = userTeam.startingXI.indexOf(outPlayerId);
        userTeam.startingXI[slotIndex] = inPlayerId;
        
        // Добавляем нового игрока в карту выносливости симуляции
        currentMatchSimulation.playerStamina[inPlayerId] = inPlayer.form;
        // Старого можно удалить или оставить (для истории)
        // delete currentMatchSimulation.playerStamina[outPlayerId];


        currentMatchSimulation.substitutionsMade++;
        addMatchEvent(currentMatchSimulation.currentTime, `ЗАМЕНА: ${inPlayer.name} выходит вместо ${outPlayer.name}.`);
        ui.substitutionOverlay.style.display = 'none';
        // Обновляем UI симуляции, если нужно
        ui.substitutionsLeft.textContent = `${MAX_SUBSTITUTIONS_PER_MATCH - currentMatchSimulation.substitutionsMade}`;
        ui.makeSubstitutionBtn.disabled = currentMatchSimulation.substitutionsMade >= MAX_SUBSTITUTIONS_PER_MATCH;
    }
    function openSubstitutionOverlay() { /* ... */
        if (!currentMatchSimulation) return;
        const userTeam = gameState.userTeam;
        
        ui.subOutPlayerSelect.innerHTML = '';
        userTeam.startingXI.filter(id => id !== null).forEach(playerId => {
            const player = userTeam.players.find(p => p.id === playerId);
            if (player) ui.subOutPlayerSelect.innerHTML += `<option value="${player.id}">${player.name} (А:${player.attack}/З:${player.defense} Ф:${currentMatchSimulation.playerStamina[player.id] || player.form}%)</option>`;
        });

        ui.subInPlayerSelect.innerHTML = '';
        userTeam.players.filter(p => !userTeam.startingXI.includes(p.id) && p.status.type === 'fit' && !p.internationalDuty).forEach(player => {
            ui.subInPlayerSelect.innerHTML += `<option value="${player.id}">${player.name} (А:${player.attack}/З:${player.defense} Ф:${player.form}%)</option>`;
        });
        ui.substitutionOverlay.style.display = 'flex';
    }


    // Еженедельные процессы
    function playNextWeek() { /* ... */
        // Проверка, сыгран ли матч пользователя
        const userMatchForCurrentWeek = gameState.schedule.find(m => m.week === gameState.currentWeek && m.isUserMatch && !m.played);
        if (userMatchForCurrentWeek) { alert("Вы должны сыграть свой матч(и) на этой неделе!"); showScreen('fixtures'); return; }

        // Симуляция CPU матчей лиги и кубков
        gameState.schedule.forEach(match => {
            if (match.week === gameState.currentWeek && !match.played && !match.isUserMatch) {
                const homeTeam = getTeamReference(match.homeTeamName);
                const awayTeam = getTeamReference(match.awayTeamName);
                if (homeTeam && awayTeam) {
                    const homeStrength = calculateTeamStrength(homeTeam, true);
                    const awayStrength = calculateTeamStrength(awayTeam, true);
                    // Простая симуляция для CPU
                    let hScore = 0, aScore = 0;
                    const numMoments = getRandomInt(6,12);
                    for(let i=0; i < numMoments; i++) {
                        if(Math.random() < (homeStrength.attack / (homeStrength.attack + awayStrength.defense + 1)) * 0.35) hScore++;
                        if(Math.random() < (awayStrength.attack / (awayStrength.attack + homeStrength.defense + 1)) * 0.35) aScore++;
                    }
                    match.homeScore = Math.min(hScore, 6); match.awayScore = Math.min(aScore, 6);
                    match.played = true;
                    
                    addNews('matchResult', match.homeTeamName, match.awayTeamName, match.homeScore, match.awayScore, false, match.competition);
                    updateLeagueTable(match);
                    if (match.competition !== "Лига") processCupMatchResult(match);

                    // Для CPU команд тоже нужно обновлять мораль/форму, но упрощенно
                    const cpuPlayerStamina = {}; // Заглушка
                    processPostMatchPlayerChanges(homeTeam, match.homeScore, match.awayScore, cpuPlayerStamina);
                    processPostMatchPlayerChanges(awayTeam, match.awayScore, match.homeScore, cpuPlayerStamina);
                }
            }
        });
        
        processTraining();
        developYouthPlayers(); // Развитие молодежи
        processYouthIntake(); // Проверка набора
        processFacilityUpgrades();
        processSponsors();
        processWeeklyPlayerUpdates(); // Травмы, контракты
        processWeeklyFinancials();
        updateInternationalDuty(); // Проверка на вызов в сборные

        // Обновление кулдаунов
        if(gameState.pressConferenceCooldown > 0) gameState.pressConferenceCooldown--;
        if(gameState.teamMeetingCooldown > 0) gameState.teamMeetingCooldown--;


        // Переход на следующую неделю или сезон
        if (gameState.currentWeek >= gameState.seasonLength) { // Конец сезона
            const winner = Object.values(gameState.leagueTable).sort((a,b) => b.Pts - a.Pts || b.GD - a.GD)[0];
            addNews('seasonEnd', winner.name);
            gameState.budget += 500000 + (winner.name === gameState.userTeam.name ? 1000000 : 0); // Бонус за конец сезона и за победу
            addTransaction(`Бонус за сезон`, 500000 + (winner.name === gameState.userTeam.name ? 1000000 : 0), 'income');
            gameState.fanHappiness = Math.min(100, gameState.fanHappiness + (winner.name === gameState.userTeam.name ? 20 : 5));
            gameState.boardConfidence = Math.min(100, gameState.boardConfidence + (winner.name === gameState.userTeam.name ? 15 : 3));


            gameState.currentWeek = 1;
            gameState.currentSeason++;
            addNews('newSeason', gameState.currentSeason);
            
            // Сброс для нового сезона
            Object.keys(gameState.leagueTable).forEach(teamName => {
                gameState.leagueTable[teamName] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0, name: teamName };
            });
            gameState.schedule = []; // Очищаем старое расписание
            generateLeagueSchedule(); // Новое расписание лиги
            initNationalCup(); // Новый розыгрыш кубка

            // Старение игроков и контракты
            [...gameState.userTeam.players, ...gameState.cpuTeams.flatMap(t=>t.players), ...gameState.userTeam.youthAcademy.players].forEach(p => {
                p.age++;
                if(p.age > 33 && Math.random() < 0.15 * (p.age - 33)) { // Шанс на ухудшение статов у возрастных
                    p.attack = Math.max(15, p.attack - getRandomInt(0,1));
                    p.defense = Math.max(15, p.defense - getRandomInt(0,1));
                }
                if(!p.isYouth) { // Для игроков основной команды обновляем endDate контракта
                    p.contract.endDate.season--; // Условно сдвигаем дату окончания "назад" на один сезон
                    if(p.contract.endDate.season < gameState.currentSeason) { // Если контракт должен был закончиться в прошлом сезоне
                        // Это должно было обработаться в processWeeklyPlayerUpdates, но как запасной вариант
                         p.contract.durationWeeks = 0; // Истек
                    }
                }
            });

        } else {
            gameState.currentWeek++;
        }

        // Обновление рынка
        if (gameState.transferMarket.length > 10 && Math.random() < 0.2) gameState.transferMarket.splice(getRandomInt(0,gameState.transferMarket.length-1),1); // Случайный уходит
        if (Math.random() < 0.4) {
            const newPlayer = createPlayer({ scoutedLevel: getRandomInt(0,1) });
            newPlayer.contract.endDate = calculateEndDate(gameState.currentWeek, gameState.currentSeason, newPlayer.contract.durationWeeks);
            gameState.transferMarket.unshift(newPlayer);
        }
        if (gameState.transferMarket.length > 30) gameState.transferMarket = gameState.transferMarket.slice(0,30);

        // Обновление доступных тренеров/персонала
        if (Math.random() < 0.15 && gameState.availableCoaches.length < 8) { /* ... */ }
        for (const roleKey in gameState.availableStaff) {
            if (Math.random() < 0.1 && gameState.availableStaff[roleKey].length < 6) { /* ... */ }
        }

        updateAllUI();
        showScreen('news');
    }
    
    // Офис (Пресс-конференции, собрания)
    function callPressConference() { /* ... */
        if (gameState.pressConferenceCooldown > 0) { alert(`Следующая пресс-конференция доступна через ${gameState.pressConferenceCooldown} нед.`); return; }
        
        const topic = getRandomElement(PRESS_CONFERENCE_TOPICS);
        let question = topic.question;
        // Подставляем конкретные имена, если нужно
        if (topic.id === "upcoming_match") {
            const nextUserMatch = gameState.schedule.find(m => m.isUserMatch && !m.played && m.week >= gameState.currentWeek);
            question = question.replace("{opponent}", nextUserMatch ? (nextUserMatch.homeTeamName === gameState.userTeam.name ? nextUserMatch.awayTeamName : nextUserMatch.homeTeamName) : "следующего соперника");
        } else if (topic.id === "player_form" && gameState.userTeam.players.length > 0) {
            question = question.replace("{playerName}", getRandomElement(gameState.userTeam.players).name);
        }

        ui.pressTopicQuestion.textContent = question;
        ui.pressOptionsContainer.innerHTML = '';
        topic.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.textContent = opt.text;
            btn.onclick = () => {
                applyPressConferenceEffect(opt.effect, topic.id);
                ui.pressConferenceOverlay.style.display = 'none';
            };
            ui.pressOptionsContainer.appendChild(btn);
        });
        ui.pressConferenceOverlay.style.display = 'flex';
    }
    function applyPressConferenceEffect(effect, topicId) { /* ... */
        let newsEffectText = "нейтрально";
        if (effect.moraleBoost) {
            gameState.userTeam.players.forEach(p => p.morale = Math.min(100, p.morale + effect.moraleBoost));
            if(effect.moraleBoost > 0) newsEffectText = "положительно на мораль команды";
            else newsEffectText = "негативно на мораль команды";
        }
        if (effect.playerMoraleBoost && topicId === "player_form") {
            // TODO: нужно как-то передать ID конкретного игрока, о котором был вопрос
            // Пока что эффект на случайного игрока или на всех
            // const targetPlayer = ...; targetPlayer.morale = Math.min(100, targetPlayer.morale + effect.playerMoraleBoost);
        }
        if (effect.fanHappinessBoost) gameState.fanHappiness = Math.min(100, gameState.fanHappiness + effect.fanHappinessBoost);
        if (effect.boardPressure) gameState.boardConfidence = Math.max(0, gameState.boardConfidence - 5);
        
        addNews('pressConferenceChoice', topicId, newsEffectText);
        gameState.pressConferenceCooldown = getRandomInt(2,4); // КД на пресс-конференции
        updateAllUI();
    }
    function holdTeamMeeting() { /* ... */
        if (gameState.teamMeetingCooldown > 0) { alert(`Следующее собрание доступно через ${gameState.teamMeetingCooldown} нед.`); return; }
        // Упрощенная логика: просто случайный эффект на мораль
        const moraleChange = getRandomInt(-10, 15);
        gameState.userTeam.players.forEach(p => p.morale = Math.min(100, Math.max(0, p.morale + moraleChange)));
        let effectText = moraleChange > 5 ? "очень позитивно" : (moraleChange > 0 ? "позитивно" : (moraleChange < -5 ? "очень негативно" : "негативно"));
        if(moraleChange === 0) effectText = "нейтрально";
        addNews('teamMeetingResult', `Собрание повлияло на мораль команды ${effectText}.`);
        gameState.teamMeetingCooldown = getRandomInt(3,5);
        updateAllUI();
    }
    
    // ... Остальные функции (сохранение/загрузка, навигация, детали игрока, вспомогательные)
    // В основном остаются как в предыдущей "большой" версии, но могут требовать адаптации
    // к новым полям gameState и новым UI элементам.
    // Для краткости, я не буду их здесь полностью повторять, если логика не меняется кардинально.
    // Важно проверить все вызовы updateAllUI() и render функций.

    // ----- СЛУШАТЕЛИ СОБЫТИЙ -----
    function addEventListeners() {
        ui.startGameBtn.addEventListener('click', () => {
            const clubName = ui.userClubNameInput.value.trim() || "Мой ФК";
            const selectedAvatarEl = ui.avatarSelection.querySelector('.selected');
            const avatar = selectedAvatarEl ? selectedAvatarEl.textContent : "👔";
            ui.initialSetupOverlay.style.display = 'none';
            resetGameStateAndStart(clubName, avatar);
        });
        ui.newGameBtn.addEventListener('click', () => {
            if (confirm("Начать новую игру? Текущий прогресс будет утерян.")) {
                localStorage.removeItem('footballManagerDeluxeState');
                ui.initialSetupOverlay.style.display = 'flex'; // Показываем снова для ввода имени
            }
        });
        ui.avatarSelection.addEventListener('click', (e) => {
            if (e.target.tagName === 'SPAN') {
                ui.avatarSelection.querySelectorAll('span').forEach(s => s.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        });

        ui.saveGameBtn.addEventListener('click', saveGame);
        ui.loadGameBtn.addEventListener('click', loadGame);
        ui.nextWeekBtn.addEventListener('click', playNextWeek);

        mainNavButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const screenId = e.target.dataset.screen;
                if (screenId) showScreen(screenId);
            });
        });

        // Тактика
        ui.formationSelect.addEventListener('change', (e) => { gameState.userTeam.formation = e.target.value; renderTacticsScreen(); });
        ui.tacticSelect.addEventListener('change', (e) => { gameState.userTeam.tactic = e.target.value; /* Можно добавить новость или эффект */ });
        ui.autoFillLineupBtn.addEventListener('click', autoFillLineup);

        // Тренировки
        ui.teamTrainingFocus.addEventListener('change', (e) => { gameState.userTeam.teamTrainingFocus = e.target.value; /* Эффект применится на след. неделе */ });
        
        // Финансы
        ui.findNewSponsorBtn.addEventListener('click', handleFindNewSponsor);

        // Календарь
        ui.fixtureFilters.addEventListener('click', (e) => {
            if(e.target.tagName === 'BUTTON') {
                ui.fixtureFilters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderSchedule(e.target.dataset.filter);
            }
        });

        // Офис
        ui.callPressConferenceBtn.addEventListener('click', callPressConference);
        ui.holdTeamMeetingBtn.addEventListener('click', holdTeamMeeting);
        ui.skipPressQuestionBtn.addEventListener('click', () => { ui.pressConferenceOverlay.style.display = 'none'; gameState.pressConferenceCooldown = 1; /* небольшой кд за пропуск */ });


        // Оверлеи
        ui.closePlayerDetailsBtn.addEventListener('click', () => { ui.playerDetailsOverlay.style.display = 'none'; });
        ui.offerContractBtn.addEventListener('click', handleOfferContract);
        ui.cancelNegotiationBtn.addEventListener('click', () => { ui.contractNegotiationOverlay.style.display = 'none'; currentNegotiationPlayerId = null;});
        
        ui.closeMatchSimBtn.addEventListener('click', () => {
            if (currentMatchSimulation && currentMatchSimulation.currentTime < 90) { // Если матч не доигран (например, после паузы)
                finalizeMatchSimulation(); // Принудительно завершаем
            }
            ui.matchSimOverlay.style.display = 'none';
            updateAllUI(); // Важно обновить после закрытия симуляции
        });
        ui.continueMatchSimBtn.addEventListener('click', () => {
            if(currentMatchSimulation) {
                currentMatchSimulation.isPaused = false;
                ui.closeMatchSimBtn.style.display = 'inline-block'; // Показываем кнопку Завершить
                ui.continueMatchSimBtn.style.display = 'none'; // Скрываем Продолжить
                runMatchMinute(); // Возобновляем симуляцию
            }
        });
        ui.inMatchTacticSelect.addEventListener('change', (e) => {
            if (currentMatchSimulation && gameState.schedule.find(m=>m.matchId === currentMatchSimulation.matchId)?.isUserMatch) {
                gameState.userTeam.tactic = e.target.value; // Меняем тактику команды
                addMatchEvent(currentMatchSimulation.currentTime, `Тактика изменена на: ${ui.inMatchTacticSelect.options[ui.inMatchTacticSelect.selectedIndex].text}`);
            }
        });
        ui.makeSubstitutionBtn.addEventListener('click', openSubstitutionOverlay);
        ui.confirmSubstitutionBtn.addEventListener('click', makeSubstitution);
        ui.cancelSubstitutionBtn.addEventListener('click', () => { ui.substitutionOverlay.style.display = 'none'; });
    }

    // Запуск игры
    initGame();
});


// Многие функции такие как saveGame, loadGame, showScreen, getTeamReference, updateLeagueTable,
// getBoardConfidenceText, canUserTeamPlayMatch, processCupMatchResult, getScoutedPlayerDisplayStats,
// getFormationStructure, autoFillLineup, updateInternationalDuty, processTraining, processWeeklyPlayerUpdates
// и другие мелкие вспомогательные функции, нужно будет либо перенести из предыдущих версий,
// либо дописать. Для экономии места я их здесь не дублирую, предполагая, что их базовая логика понятна
// или может быть адаптирована.

// Например:
function saveGame() {
    try {
        localStorage.setItem('footballManagerDeluxeState', JSON.stringify(gameState));
        alert("Игра сохранена!");
        addNews('generic', "Игра успешно сохранена.");
    } catch (e) {
        console.error("Ошибка сохранения:", e);
        alert("Не удалось сохранить игру.");
    }
}

function loadGame() {
    try {
        const savedState = localStorage.getItem('footballManagerDeluxeState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            // Глубокое слияние, чтобы не потерять новые поля из getDefaultGameState при загрузке старого сохранения
            const defaultState = getDefaultGameState();
            for (const key in defaultState) {
                if (parsedState[key] !== undefined) {
                    if (typeof defaultState[key] === 'object' && defaultState[key] !== null && !Array.isArray(defaultState[key])) {
                        gameState[key] = { ...defaultState[key], ...parsedState[key] };
                        // Для вложенных объектов тоже нужно аккуратное слияние, особенно для userTeam.facilities и staff
                        if (key === 'userTeam') {
                            gameState.userTeam.facilities = { ...defaultState.userTeam.facilities, ...(parsedState.userTeam.facilities || {}) };
                            gameState.userTeam.staff = { ...defaultState.userTeam.staff, ...(parsedState.userTeam.staff || {}) };
                            gameState.userTeam.youthAcademy = { ...defaultState.userTeam.youthAcademy, ...(parsedState.userTeam.youthAcademy || {}) };
                            gameState.userTeam.players = parsedState.userTeam.players || []; // Массивы просто заменяем
                            gameState.userTeam.startingXI = parsedState.userTeam.startingXI || Array(REQUIRED_STARTERS).fill(null);

                        }
                    } else {
                        gameState[key] = parsedState[key];
                    }
                } else {
                    gameState[key] = defaultState[key]; // Если в сохранении нет ключа, берем из дефолта
                }
            }
             // Убедимся что все необходимые массивы и объекты существуют после загрузки
            gameState.schedule = gameState.schedule || [];
            gameState.transferMarket = gameState.transferMarket || [];
            gameState.availableCoaches = gameState.availableCoaches || [];
            gameState.availableStaff = gameState.availableStaff || { assistantCoach: [], chiefScout: [], physio: [], youthCoach: [] };
            gameState.news = gameState.news || [];
            gameState.transactions = gameState.transactions || [];
            gameState.leagueTable = gameState.leagueTable || {};
            if (!gameState.userTeam.activeNationalCup) gameState.userTeam.activeNationalCup = null; // На случай старых сохранений


            alert("Игра загружена!");
            addNews('generic', "Игра успешно загружена.");
            // updateAllUI(); // Вызывается из initGame
            // showScreen('news');
        } else { return false; }
    } catch (e) {
        console.error("Ошибка загрузки:", e);
        alert("Не удалось загрузить игру. Данные могут быть повреждены. Начните новую.");
        localStorage.removeItem('footballManagerDeluxeState');
        return false;
    }
    return true;
}

function showScreen(screenId) {
    for (const key in ui.screens) {
        ui.screens[key].classList.remove('active');
        ui.screens[key].style.display = 'none';
    }
    if (ui.screens[screenId]) {
        ui.screens[screenId].classList.add('active');
        ui.screens[screenId].style.display = 'block';
        // Динамическое обновление контента только для активного экрана, если нужно
        // Например: if (screenId === 'finances') renderFinancesScreen();
        // Но updateAllUI() обычно вызывается при смене недели или важном событии
    }
    mainNavButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.screen === screenId);
    });
}

function getTeamReference(name) {
    if (name === gameState.userTeam.name) return gameState.userTeam;
    return gameState.cpuTeams.find(t => t.name === name);
}
function updateLeagueTable(match) {
    if (match.competition !== "Лига") return; // Обновляем только для матчей лиги
    const home = gameState.leagueTable[match.homeTeamName];
    const away = gameState.leagueTable[match.awayTeamName];
    if(!home || !away) return; // Если команды нет в таблице (например, из другого турнира случайно попала)

    home.P++; away.P++;
    home.GF += match.homeScore; away.GF += match.awayScore;
    home.GA += match.awayScore; away.GA += match.homeScore;
    home.GD = home.GF - home.GA; away.GD = away.GF - away.GA;

    if (match.homeScore > match.awayScore) { home.W++; away.L++; home.Pts += 3; }
    else if (match.homeScore < match.awayScore) { away.W++; home.L++; away.Pts += 3; }
    else { home.D++; away.D++; home.Pts += 1; away.Pts += 1; }
}
function processCupMatchResult(match) {
    const cupState = gameState.userTeam.activeNationalCup;
    if (!cupState || match.competition !== cupState.name || cupState.userEliminated || cupState.winner) return;

    const currentRoundFixtures = cupState.fixtures[cupState.currentRoundIndex];
    if (!currentRoundFixtures) return;

    // Проверяем, все ли матчи раунда сыграны
    const allMatchesInRoundPlayed = currentRoundFixtures.matches.every(m => m.played);

    if (allMatchesInRoundPlayed) {
        const winners = [];
        currentRoundFixtures.matches.forEach(m => {
            if (m.homeScore > m.awayScore) winners.push(m.homeTeamName);
            else if (m.awayScore > m.homeScore) winners.push(m.awayTeamName);
            else { // Ничья - упрощенно, побеждает домашняя команда или случайная для CPU
                winners.push(m.isUserMatch && m.homeTeamName === gameState.userTeam.name ? m.homeTeamName : (Math.random() < 0.5 ? m.homeTeamName : m.awayTeamName));
            }
        });
        
        // Проверяем, не выбыла ли команда пользователя
        if (!winners.includes(gameState.userTeam.name) && currentRoundFixtures.matches.some(m=>m.isUserMatch)) {
            cupState.userEliminated = true;
            addNews('generic', `Вы выбыли из ${cupState.name}.`);
        }

        // Переходим к следующему раунду
        cupState.currentRoundIndex++;
        if (winners.length >= 2 && !cupState.userEliminated) {
            generateCupRound(winners, cupState.currentRoundIndex);
             // Призовые за проход раунда
            if(cupState.fixtures[cupState.currentRoundIndex-1].matches.some(m=>m.isUserMatch && winners.includes(gameState.userTeam.name))) { // Если пользователь прошел
                const prize = CUP_COMPETITIONS.nationalCup.prizeMoney[cupState.currentRoundIndex-1] || 0;
                gameState.budget += prize;
                addTransaction(`Призовые за ${CUP_COMPETITIONS.nationalCup.rounds[cupState.currentRoundIndex-1]}`, prize, 'income');
            }
        } else if (winners.length === 1) { // Финал сыгран, есть победитель
            cupState.winner = winners[0];
            addNews("cupWinner", cupState.winner, cupState.name);
             if(cupState.winner === gameState.userTeam.name) {
                const finalPrize = CUP_COMPETITIONS.nationalCup.prizeMoney[CUP_COMPETITIONS.nationalCup.prizeMoney.length-1] * 1.5; // Доп. бонус за победу
                gameState.budget += finalPrize;
                addTransaction(`Победа в ${cupState.name}`, finalPrize, 'income');
                gameState.fanHappiness = Math.min(100, gameState.fanHappiness + 15);
                gameState.boardConfidence = Math.min(100, gameState.boardConfidence + 10);
            }
        }
    }
}

function getBoardConfidenceText() {
    if (gameState.boardConfidence > 80) return "В восторге";
    if (gameState.boardConfidence > 60) return "Довольно";
    if (gameState.boardConfidence > 40) return "Нейтрально";
    if (gameState.boardConfidence > 20) return "Обеспокоено";
    return "Крайне недовольно";
}

function canUserTeamPlayMatch() {
    const starters = gameState.userTeam.startingXI.filter(id => id !== null);
    if (starters.length < REQUIRED_STARTERS) {
        return { canPlay: false, reason: `Необходимо ${REQUIRED_STARTERS} игроков в старте! Сейчас: ${starters.length}.` };
    }
    const fitStarters = starters.map(id => gameState.userTeam.players.find(p=>p.id===id)).filter(p => p && p.status.type === 'fit' && !p.internationalDuty);
    if(fitStarters.length < REQUIRED_STARTERS){
        return { canPlay: false, reason: `Не все игроки в старте здоровы/доступны! Готово: ${fitStarters.length}/${REQUIRED_STARTERS}.` };
    }
    return { canPlay: true, reason: "" };
}

function getScoutedPlayerDisplayStats(player) {
    if (player.scoutedLevel >= 3 || player.isUserPlayer) return player; // Полные статы
    
    const display = { name: player.name, position: '?', age: '?', attack: '?', defense: '?', contract: {salary: '?'}};
    const accuracyFactor = SCOUTING_BASE_ACCURACY + (gameState.userTeam.staff.chiefScout ? gameState.userTeam.staff.chiefScout.skillLevel / 2 : 0); // Точность скаута

    if (player.scoutedLevel >= 1) {
        display.position = player.position;
        display.age = `${player.age - getRandomInt(0,2)}-${player.age + getRandomInt(0,2)}`; // Диапазон возраста
    }
    if (player.scoutedLevel >= 2) {
        const range = Math.max(5, 20 - Math.floor(accuracyFactor/10) ); // Чем лучше скаут, тем меньше диапазон
        display.attack = `${Math.max(10, player.attack - range)}-${Math.min(99, player.attack + range)}`;
        display.defense = `${Math.max(10, player.defense - range)}-${Math.min(99, player.defense + range)}`;
    }
    return display;
}
function calculateScoutingAccuracy() {
    return Math.min(100, SCOUTING_BASE_ACCURACY + (gameState.userTeam.staff.chiefScout ? gameState.userTeam.staff.chiefScout.skillLevel / 1.5 : 0) + // От главного скаута
                         (gameState.userTeam.facilities.trainingGround.level * 2) ); // Условно, база тоже помогает
}

function getFormationStructure(formationString) {
    // Возвращает структуру типа [{line: 'def', positions: [{base:'ЗАЩ', label:'ЦЗ'}, ...]}, ...]
    // Это нужно для более точного рендеринга и проверки позиций. Пока упрощенно:
    const parts = formationString.split('-').map(Number);
    const structure = [];
    if(parts.length === 3) { // типовые 4-4-2, 4-3-3, 3-5-2
        structure.push({ line: 'GK', positions: Array(1).fill(null).map((_,i)=>({base:'ВРТ', label:`ВРТ`})) });
        structure.push({ line: 'DEF', positions: Array(parts[0]).fill(null).map((_,i)=>({base:'ЗАЩ', label:`З${i+1}`})) });
        structure.push({ line: 'MID', positions: Array(parts[1]).fill(null).map((_,i)=>({base:'ПЗЩ', label:`П${i+1}`})) });
        structure.push({ line: 'ATT', positions: Array(parts[2]).fill(null).map((_,i)=>({base:'НАП', label:`Н${i+1}`})) });
    } else if (formationString === "4-2-3-1") {
        structure.push({ line: 'GK', positions: [{base:'ВРТ', label:`ВРТ`}] });
        structure.push({ line: 'DEF', positions: Array(4).fill(null).map((_,i)=>({base:'ЗАЩ', label:`З${i+1}`})) });
        structure.push({ line: 'DMID', positions: Array(2).fill(null).map((_,i)=>({base:'ПЗЩ', label:`ОП${i+1}`})) }); // Опорники
        structure.push({ line: 'AMID', positions: Array(3).fill(null).map((_,i)=>({base:'ПЗЩ', label:`АП${i+1}`})) }); // Атакующие ПЗ
        structure.push({ line: 'ATT', positions: [{base:'НАП', label:`ФРВ`}] });
    } else if (formationString === "4-1-4-1") {
         structure.push({ line: 'GK', positions: [{base:'ВРТ', label:`ВРТ`}] });
        structure.push({ line: 'DEF', positions: Array(4).fill(null).map((_,i)=>({base:'ЗАЩ', label:`З${i+1}`})) });
        structure.push({ line: 'DMID', positions: [{base:'ПЗЩ', label:`ОП`}] });
        structure.push({ line: 'MID', positions: Array(4).fill(null).map((_,i)=>({base:'ПЗЩ', label:`ЦП${i+1}`})) });
        structure.push({ line: 'ATT', positions: [{base:'НАП', label:`ФРВ`}] });
    }
     else { // По умолчанию для неизвестных формаций, просто делим на линии
        structure.push({ line: 'GK', positions: [{base:'ВРТ', label:`ВРТ`}] });
        parts.forEach((count, index) => {
            let basePos = 'ПЗЩ'; // По умолчанию
            if(index === 0 && parts.length > 1) basePos = 'ЗАЩ';
            if(index === parts.length -1 && parts.length > 1) basePos = 'НАП';
            structure.push({ line: `L${index+1}`, positions: Array(count).fill(null).map((_,i)=>({base:basePos, label:`X${i+1}`})) });
        });
    }
    // Убедимся, что всего слотов REQUIRED_STARTERS
    let totalSlots = structure.reduce((sum, line) => sum + line.positions.length, 0);
    if(totalSlots !== REQUIRED_STARTERS) {
        // console.warn(`Формация ${formationString} генерирует ${totalSlots} слотов, а нужно ${REQUIRED_STARTERS}. Упрощаем.`);
        // Очень грубое исправление - просто берем первые 3 линии и распределяем 11 игроков
        const defaultStructure = [];
        defaultStructure.push({ line: 'GK', positions: [{base:'ВРТ', label:`ВРТ`}] });
        defaultStructure.push({ line: 'DEF', positions: Array(4).fill(null).map((_,i)=>({base:'ЗАЩ', label:`З${i+1}`})) });
        defaultStructure.push({ line: 'MID', positions: Array(4).fill(null).map((_,i)=>({base:'ПЗЩ', label:`П${i+1}`})) });
        defaultStructure.push({ line: 'ATT', positions: Array(2).fill(null).map((_,i)=>({base:'НАП', label:`Н${i+1}`})) });
        return defaultStructure;
    }
    return structure;
}

function autoFillLineup() {
    constทีม = gameState.userTeam;
    // Сначала очищаем текущий стартовый состав
    команда.startingXI = Array(REQUIRED_STARTERS).fill(null);
    const availablePlayers = [...команда.players].filter(p => p.status.type === 'fit' && !p.internationalDuty)
                                            .sort((a,b) => (b.attack + b.defense) - (a.attack + a.defense)); // Сильнейшие сначала
    
    const formationStructure = getFormationStructure(команда.formation);
    let playerIndex = 0;

    for (let slotIndex = 0; slotIndex < REQUIRED_STARTERS; slotIndex++) {
        if(playerIndex >= availablePlayers.length) break; // Игроки кончились

        // Находим базовую позицию для слота
        let targetPosBase = "ANY";
        let currentSlotCounter = 0;
        for(const line of formationStructure) {
            for(const posDetail of line.positions) {
                if(currentSlotCounter === slotIndex) { targetPosBase = posDetail.base; break; }
                currentSlotCounter++;
            }
            if(targetPosBase !== "ANY") break;
        }

        // Ищем лучшего подходящего игрока из оставшихся
        let bestFitPlayer = null;
        let bestFitPlayerIndexInAvailable = -1;
        let maxFitScore = -1;

        for(let i=0; i < availablePlayers.length; i++) {
            const p = availablePlayers[i];
            if(команда.startingXI.includes(p.id)) continue; // Уже в старте (не должно быть, но на всякий)
            
            let fitScore = (p.attack + p.defense) * p.form / 100; // Базовый рейтинг
            if(p.position === targetPosBase) fitScore *= 1.2; // Бонус за свою позицию
            else if (targetPosBase !== "ANY") fitScore *= 0.8; // Штраф за чужую

            if(fitScore > maxFitScore) {
                maxFitScore = fitScore;
                bestFitPlayer = p;
                bestFitPlayerIndexInAvailable = i;
            }
        }
        
        if(bestFitPlayer) {
            команда.startingXI[slotIndex] = bestFitPlayer.id;
            // Удаляем выбранного игрока из availablePlayers, чтобы не выбирать его снова (не обязательно, т.к. проверяем includes)
            // availablePlayers.splice(bestFitPlayerIndexInAvailable, 1); 
        }
        playerIndex++; // Переходим к следующему слоту или игроку
    }
    renderTacticsScreen();
    addNews('generic', 'Стартовый состав заполнен автоматически.');
}

function updateInternationalDuty() {
    const isBreakWeek = INTERNATIONAL_BREAK_WEEKS.includes(gameState.currentWeek);
    gameState.internationalBreakActive = isBreakWeek;

    gameState.userTeam.players.forEach(player => {
        if (isBreakWeek) {
            // Упрощенно: сильные игроки (особенно молодые) имеют шанс быть вызванными
            const callUpChance = (player.attack + player.defense) / 160 + (25 - player.age)/100; // от 0 до ~1.5
            if (Math.random() < callUpChance * 0.1 && player.status.type === 'fit') { // 10% от шанса
                player.internationalDuty = true;
                addNews('playerCalledUp', player.name, getRandomElement(NATIONAL_TEAMS));
            }
        } else {
            if (player.internationalDuty) {
                player.internationalDuty = false;
                addNews('playerReturnedFromNationalTeam', player.name);
                player.form = Math.max(20, player.form - getRandomInt(10,25)); // Усталость после сборной
            }
        }
    });
}
// Процесс тренировки (индивидуальной и командной)
function processTraining() {
    const baseEffectiveness = 0.5; // Базовая эффективность тренировок (0 до 1)
    const coachBonus = gameState.userTeam.coach ? gameState.userTeam.coach.trainingBonus : 0;
    const facilityBonus = FACILITY_LEVELS.trainingGround.effects.trainingEffectivenessBonus[gameState.userTeam.facilities.trainingGround.level];
    const totalEffectivenessFactor = baseEffectiveness + coachBonus + facilityBonus;

    // Индивидуальные тренировки
    gameState.userTeam.players.forEach(player => {
        if (player.trainingFocus && player.status.type === 'fit' && !player.internationalDuty) {
            let success = false;
            let statImproved = "";
            let improvementAmount = 0;
            const potentialFactor = Math.max(0.5, player.potential / (player.attack + player.defense +1) ); // Если потенциал выше текущих статов, лучше тренируется
            const ageFactor = Math.max(0.3, (35 - player.age) / 15 ); // Молодые лучше тренируются
            
            const successChance = totalEffectivenessFactor * potentialFactor * ageFactor;

            if (Math.random() < successChance) {
                success = true;
                improvementAmount = getRandomInt(1,2);
                if (player.trainingFocus === 'attack' && player.attack < 99) {
                    player.attack = Math.min(99, player.attack + improvementAmount); statImproved = "Атака";
                } else if (player.trainingFocus === 'defense' && player.defense < 99) {
                    player.defense = Math.min(99, player.defense + improvementAmount); statImproved = "Защита";
                } else if (player.trainingFocus === 'fitness') {
                    player.form = Math.min(100, player.form + getRandomInt(5, 10));
                    player.morale = Math.min(100, player.morale + getRandomInt(3, 7));
                    statImproved = "Фитнес/Мораль"; improvementAmount = 5; // Условное значение
                } else if (player.trainingFocus === 'potential' && player.age < 23) {
                    // Увеличиваем "скрытый" потенциал или немного оба стата
                    player.potential = Math.min(190, player.potential + getRandomInt(1,3));
                    player.attack = Math.min(99, player.attack + 1);
                    player.defense = Math.min(99, player.defense + 1);
                    statImproved = "Потенциал"; improvementAmount = 1;
                }
            }
            if (success && statImproved) {
                addNews('trainingComplete', player.name, statImproved, improvementAmount);
            }
            player.trainingFocus = null; // Сбрасываем фокус
        }
    });
    gameState.userTeam.trainingSlotsUsed = 0;

    // Командные тренировки
    const teamFocus = gameState.userTeam.teamTrainingFocus;
    if (teamFocus !== "none") {
        gameState.userTeam.players.forEach(p => {
            p.teamTrainingEffect = { attack: 0, defense: 0, cohesion: 0}; // Сбрасываем предыдущий эффект
            if (p.status.type === 'fit' && !p.internationalDuty) {
                let focusEffect = Math.round(totalEffectivenessFactor * 5); // Базовый эффект от командной тренировки
                 if (teamFocus === "attack_cohesion") { p.teamTrainingEffect.attack = focusEffect; p.teamTrainingEffect.cohesion = focusEffect/2; }
                 else if (teamFocus === "defense_cohesion") { p.teamTrainingEffect.defense = focusEffect; p.teamTrainingEffect.cohesion = focusEffect/2; }
                 else if (teamFocus === "set_pieces") { p.teamTrainingEffect.attack += focusEffect/2; /* TODO: Спец. стат для стандартов? */ }
                 else if (teamFocus === "fitness_recovery") { p.form = Math.min(100, p.form + focusEffect); }
                 else if (teamFocus === "morale_boost") { p.morale = Math.min(100, p.morale + focusEffect); }
            }
        });
        addNews('generic', `Команда сфокусировалась на тренировке: ${ui.teamTrainingFocus.options[ui.teamTrainingFocus.selectedIndex].text}.`);
    } else {
         gameState.userTeam.players.forEach(p => p.teamTrainingEffect = { attack: 0, defense: 0, cohesion: 0});
    }
}
// Еженедельное обновление статусов игроков (травмы, дисквалификации, контракты)
function processWeeklyPlayerUpdates() {
    const allTeamPlayers = [...gameState.userTeam.players, ...gameState.cpuTeams.flatMap(t => t.players)];
    allPlayers.forEach(player => {
        // Обновление статуса (травмы/дисквалификации)
        if (player.status.type !== 'fit' && player.status.duration > 0) {
            player.status.duration--;
            if (player.status.duration === 0) {
                const oldStatusType = player.status.type;
                player.status = { type: 'fit', duration: 0, affectedStat: null };
                player.form = Math.max(30, player.form - getRandomInt(10,20));
                if(player.isUserPlayer) {
                    if (oldStatusType === 'injured') addNews('playerRecovered', player.name, gameState.userTeam.name);
                    else if (oldStatusType === 'suspended') addNews('playerSuspensionOver', player.name, gameState.userTeam.name);
                }
            }
        }
        // Случайные изменения формы/морали, если не тренируется и не в сборной
        if (player.status.type === 'fit' && !player.trainingFocus && !player.internationalDuty) {
             player.form = Math.max(10, Math.min(100, player.form + getRandomInt(-5, 5)));
             player.morale = Math.max(10, Math.min(100, player.morale + getRandomInt(-3, 3)));
        }

        // Контракты (только для игроков пользователя)
        if (player.isUserPlayer && !player.isYouth) {
            const weeksLeft = getWeeksLeftInContract(player);
            if (weeksLeft === MIN_CONTRACT_WEEKS_RENEWAL || weeksLeft === Math.floor(MIN_CONTRACT_WEEKS_RENEWAL/2) || weeksLeft === 1) {
                addNews('contractExpiringSoon', player.name, weeksLeft);
            }
            if (weeksLeft <= 0) { // Контракт истек
                addNews('playerLeftOnFree', player.name, gameState.userTeam.name);
                const playerIndex = gameState.userTeam.players.findIndex(p => p.id === player.id);
                if (playerIndex > -1) {
                    const freedPlayer = gameState.userTeam.players.splice(playerIndex, 1)[0];
                    if (gameState.userTeam.startingXI.includes(freedPlayer.id)) {
                        gameState.userTeam.startingXI[gameState.userTeam.startingXI.indexOf(freedPlayer.id)] = null;
                    }
                    freedPlayer.isUserPlayer = false; freedPlayer.scoutedLevel = 0; freedPlayer.statsVisible = false;
                    freedPlayer.contract.salary = Math.floor(freedPlayer.contract.salary * 0.8); // Снижаем ожидания на рынке
                    gameState.transferMarket.unshift(freedPlayer);
                }
            }
        }
    });
}

// Заглушки для функций, которые нужно будет детализировать
function handleDropOnFormationSlot(event) { /* ... как раньше, но с учетом player.internationalDuty ... */
    event.preventDefault();
    const targetSlotElement = event.target.closest('.formation-slot');
    if (!targetSlotElement) return;
    const targetSlotIndex = parseInt(targetSlotElement.dataset.slotIndex);
    const data = event.dataTransfer.getData('text/plain');
    let playerId, sourceSlotIndex = -1;

    if (data.includes('_fromslot_')) { [playerId, sourceSlotIndex] = data.split('_fromslot_').map(s => parseInt(s,10)); }
    else { playerId = parseInt(data); }

    const player = gameState.userTeam.players.find(p => p.id === playerId);
    if (!player || player.status.type !== 'fit' || player.internationalDuty) {
        addNews('generic', `Игрок ${player ? player.name : ''} не может быть добавлен (статус/сборная).`); return;
    }
    const existingPlayerInTargetSlotId = gameState.userTeam.startingXI[targetSlotIndex];
    if (sourceSlotIndex !== -1) { // Игрок из другого слота
        gameState.userTeam.startingXI[sourceSlotIndex] = existingPlayerInTargetSlotId; 
    }
    // Убираем игрока из всех других слотов
    for(let i=0; i<gameState.userTeam.startingXI.length; i++){
        if(gameState.userTeam.startingXI[i] === playerId && i !== targetSlotIndex) gameState.userTeam.startingXI[i] = null;
    }
    gameState.userTeam.startingXI[targetSlotIndex] = playerId;
    renderTacticsScreen();
    calculateTeamOverallStats();
}
function handleDropOnBench(event) { /* ... как раньше ... */
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    if (data.includes('_fromslot_')) {
        const [playerId, sourceSlotIndexStr] = data.split('_fromslot_');
        const sourceSlotIndex = parseInt(sourceSlotIndexStr);
        if (gameState.userTeam.startingXI[sourceSlotIndex] === parseInt(playerId)) {
            gameState.userTeam.startingXI[sourceSlotIndex] = null;
        }
    }
    renderTacticsScreen();
    calculateTeamOverallStats();
}
function handleTrainPlayer(playerId, focus) { /* ... как раньше ... */
    if (gameState.userTeam.trainingSlotsUsed >= MAX_TRAINING_SLOTS) { alert("Все слоты заняты."); return; }
    const player = gameState.userTeam.players.find(p => p.id === playerId);
    if (player && !player.trainingFocus && player.status.type === 'fit' && !player.internationalDuty) {
        if (focus === 'potential' && player.age >= 23) { alert("Тренировка потенциала эффективна только для молодых игроков (до 23 лет)."); return; }
        player.trainingFocus = focus;
        gameState.userTeam.trainingSlotsUsed++;
        renderTrainingScreen(); // Только этот экран для оптимизации
    }
}
function showPlayerDetails(playerId, playerArray) { /* ... как раньше, но больше полей ... */
    const player = playerArray.find(p => p.id === playerId);
    if (!player) return;

    const displayStats = (player.isUserPlayer || player.isYouth || player.scoutedLevel >=3) ? player : getScoutedPlayerDisplayStats(player);

    ui.detailsPlayerName.textContent = displayStats.name;
    ui.detailsPlayerAge.textContent = displayStats.age;
    ui.detailsPlayerPosition.textContent = displayStats.position;
    ui.detailsPlayerAttack.textContent = displayStats.attack;
    ui.detailsPlayerDefense.textContent = displayStats.defense;
    ui.detailsPlayerForm.textContent = (typeof displayStats.form === 'number') ? `${displayStats.form}%` : displayStats.form;
    ui.detailsPlayerMorale.textContent = (typeof displayStats.morale === 'number') ? `${displayStats.morale}%` : displayStats.morale;
    ui.detailsPlayerSalary.textContent = (typeof displayStats.contract?.salary === 'number') ? `${displayStats.contract.salary.toLocaleString()}$/нед.` : '?';
    
    if (player.isUserPlayer && !player.isYouth && player.contract.endDate) {
        ui.detailsPlayerContractEnds.textContent = `${player.contract.endDate.week}/${player.contract.endDate.season}`;
        ui.detailsPlayerContractWeeksLeft.textContent = getWeeksLeftInContract(player);
    } else if (player.isYouth) {
        ui.detailsPlayerContractEnds.textContent = "Юн. контракт";
        ui.detailsPlayerContractWeeksLeft.textContent = "N/A";
    } else {
         ui.detailsPlayerContractEnds.textContent = "?";
        ui.detailsPlayerContractWeeksLeft.textContent = "?";
    }

    ui.detailsPlayerPrice.textContent = (typeof displayStats.price === 'number') ? `${displayStats.price.toLocaleString()}$` : '?';
    let statusText = '?';
    if (player.isUserPlayer || player.isYouth || player.scoutedLevel >=1) { // Статус виден раньше статов
        statusText = player.internationalDuty ? 'В сборной' : (player.status.type === 'fit' ? 'Готов' : (player.status.type === 'injured' ? `Травма (${player.status.duration} нед.)` : `Дискв. (${player.status.duration} м.)`));
    }
    ui.detailsPlayerStatus.textContent = statusText;
    ui.detailsPlayerPersonality.textContent = (player.isUserPlayer || player.isYouth || player.scoutedLevel >=2) ? player.personality : '?';


    ui.playerActionsInDetails.innerHTML = ''; // Очищаем действия
    if(player.isUserPlayer && !player.isYouth && getWeeksLeftInContract(player) > 0 && getWeeksLeftInContract(player) <= MIN_CONTRACT_WEEKS_RENEWAL * 2.5) {
        const renewBtn = document.createElement('button');
        renewBtn.textContent = "Продлить контракт";
        renewBtn.className = "action-button green";
        renewBtn.onclick = () => { openContractNegotiation(player.id); ui.playerDetailsOverlay.style.display = 'none'; };
        ui.playerActionsInDetails.appendChild(renewBtn);
    }
    // TODO: Другие действия (выставить на трансфер, пожаловаться и т.д.)

    ui.playerDetailsOverlay.style.display = 'flex';
}