// js/game_state.js

let gameState = {};
let currentNegotiation = { playerId: null, type: null, itemKey: null };
let currentMatchSimulation = null;
let currentPressConferenceContext = null;

function getDefaultGameState() {
    function getDefaultGameState() {
    return {
        // ... все твои старые свойства
        transactions: [],
        lastTransactionsBreakdown: { income: {}, expense: {} },
        clubHistory: {},      // <--- ДОБАВИТЬ ЭТУ СТРОКУ
        leagueRecords: {},    // <--- И ЭТУ
        settings: {
            autoSave: true,
            matchSimulationSpeed: 100
        }
    };
}
    const initialFacilities = {};
    if (typeof FACILITY_LEVELS !== 'undefined') {
        for (const key in FACILITY_LEVELS) {
            initialFacilities[key] = { level: 0, upgradeInProgress: false, weeksToComplete: 0 };
        }
    } else {
        console.error("CRITICAL: FACILITY_LEVELS is not defined! Cannot initialize default facilities.");
    }

    let firstYouthIntakeWeek = (typeof YOUTH_INTAKE_WEEKS !== 'undefined' && YOUTH_INTAKE_WEEKS.length > 0) ? YOUTH_INTAKE_WEEKS[0] : 8;
    if (typeof YOUTH_INTAKE_WEEKS !== 'undefined' && YOUTH_INTAKE_WEEKS.length > 1 && firstYouthIntakeWeek < 5) {
        firstYouthIntakeWeek = YOUTH_INTAKE_WEEKS[1] || YOUTH_INTAKE_WEEKS[0];
    }

    const baseStartingBudget = typeof STARTING_BUDGET !== 'undefined' ? STARTING_BUDGET : 500000;
    // Количество команд в лиге: CPU_TEAM_NAMES.length + 1 (пользователь)
    const totalTeamsInLeague = (typeof CPU_TEAM_NAMES !== 'undefined' ? CPU_TEAM_NAMES.length : 16) + 1;
    // Длина сезона: (N-1)*2 если N четное, или N*2 если N нечетное и добавляется "BYE" (но проще считать N*2 если всегда есть "BYE" для нечетных)
    // В generateLeagueSchedule мы добавляем "BYE" если команд нечетное число, так что (totalTeamsWithBye - 1) * 2
    const effectiveTeamsForSchedule = totalTeamsInLeague % 2 === 0 ? totalTeamsInLeague : totalTeamsInLeague + 1;
    const baseSeasonLength = (effectiveTeamsForSchedule -1) * 2;

    const baseFanHappiness = typeof BASE_FAN_HAPPINESS !== 'undefined' ? BASE_FAN_HAPPINESS : 60;
    const baseBoardConfidence = typeof BASE_BOARD_CONFIDENCE !== 'undefined' ? BASE_BOARD_CONFIDENCE : 55;
    const baseRequiredStarters = typeof REQUIRED_STARTERS !== 'undefined' ? REQUIRED_STARTERS : 11;
    const defaultCupRounds = (typeof CUP_COMPETITIONS !== 'undefined' && CUP_COMPETITIONS.nationalCup && CUP_COMPETITIONS.nationalCup.rounds) ? CUP_COMPETITIONS.nationalCup.rounds : ["1/4 финала", "Полуфинал", "Финал"];


    return {
        clubName: "ФК Прогресс",
        avatar: "👔",
        budget: baseStartingBudget,
        currentWeek: 1,
        currentSeason: 1,
        seasonLength: baseSeasonLength,
        fanHappiness: baseFanHappiness,
        boardConfidence: baseBoardConfidence,
        userTeam: {
            name: "ФК Прогресс",
            id: "user_team_01",
            players: [],
            coach: null,
            staff: {
                assistantCoach: null, chiefScout: null, physio: null, youthCoach: null,
                scouts: []
            },
            formation: "4-4-2",
            tactic: "balanced",
            teamTrainingFocus: "none",
            startingXI: Array(baseRequiredStarters).fill(null),
            trainingSlotsUsed: 0,
            youthAcademy: {
                players: [],
                nextIntakeWeek: firstYouthIntakeWeek
            },
            facilities: initialFacilities,
            sponsors: [],
            activeNationalCup: null,
            activeContinentalCup: null,
            totalScoutingAssignments: 0,
            reputation: 40,
            seasonObjectives: {
                leaguePosition: Math.ceil(totalTeamsInLeague / 2.5),
                cupProgress: defaultCupRounds[Math.floor(defaultCupRounds.length / 3)] || defaultCupRounds[0] || "Четвертьфинал"
            },
            teamAtmosphere: 65,
            weeklyIncome: 0,
            weeklyExpense: 0
        },
        cpuTeams: [],
        leagueTable: {},
        schedule: [],
        transferMarket: {
            players: [],
            cpuInterestInUserPlayers: [],
            userShortlist: []
        },
        availableCoaches: [],
        availableStaff: {
            assistantCoach: [], chiefScout: [], physio: [], youthCoach: [], scout: []
        },
        news: [],
        transactions: [],
        lastTransactionsBreakdown: { income: {}, expense: {}, week: 0, season: 0 },
        playerIdCounter: 0,
        staffIdCounter: 0,
        matchIdCounter: 0,
        gameInitialized: false,
        pressConferenceCooldown: 0,
        teamMeetingCooldown: 0,
        internationalBreakActive: false,
        settings: {
            matchSimulationSpeed: 150,
            autoSave: true,
            difficulty: "normal",
            showTutorials: true
        }
    };
}

function initOrResetGameState(clubNameFromInput, avatarFromInput) {
    gameState = getDefaultGameState();
    if (clubNameFromInput) gameState.clubName = clubNameFromInput.slice(0, 25);
    if (avatarFromInput) gameState.avatar = avatarFromInput;
    if (gameState.userTeam) {
        gameState.userTeam.name = gameState.clubName;
    }
    gameState.gameInitialized = false; // Сбрасываем флаг инициализации до вызова startGameLogic

    currentNegotiation = { playerId: null, type: null, itemKey: null };
    currentMatchSimulation = null;
    currentPressConferenceContext = null;
    console.log("Game state has been reset to default values.");
}


function saveGame() {
    if (!gameState || !gameState.gameInitialized) {
        if (typeof showMessage === "function") showMessage("Ошибка", "Нельзя сохранить неначатую игру.");
        else console.warn("showMessage не доступна, игра не сохранена (не инициализирована).");
        return;
    }
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('footballManagerGrandState_v2.1', JSON.stringify(gameState));
            if (typeof showMessage === "function") showMessage("Сохранение", "Игра успешно сохранена!");
            else alert("Игра сохранена (showMessage не доступна)");
        } else {
            console.error("localStorage не доступен. Не удалось сохранить игру.");
            if (typeof showMessage === "function") showMessage("Ошибка сохранения", "localStorage не доступен.");
            else alert("Ошибка сохранения: localStorage не доступен.");
        }
    } catch (e) {
        console.error("Ошибка сохранения игры:", e);
        if (typeof showMessage === "function") showMessage("Ошибка сохранения", `Не удалось сохранить игру. ${e.message}. Попробуйте очистить место в localStorage.`);
        else alert("Ошибка сохранения");
    }
}

function loadGame() {
    if (typeof localStorage === 'undefined') {
        console.error("localStorage не доступен. Не удалось загрузить игру.");
        if (typeof showMessage === "function") showMessage("Ошибка загрузки", "localStorage не доступен.");
        return false; // Возвращаем false, чтобы initGameFlow показал экран настройки
    }
    try {
        const savedStateJSON = localStorage.getItem('footballManagerGrandState_v2.1');
        if (savedStateJSON) {
            const loadedState = JSON.parse(savedStateJSON);
            const defaultState = getDefaultGameState(); // Получаем структуру по умолчанию

            // Применяем загруженное состояние поверх состояния по умолчанию
            // Это гарантирует, что новые поля из defaultState будут присутствовать,
            // если их нет в старом сохранении.
            gameState = deepMerge(defaultState, loadedState);

            // Важно: убедимся, что gameInitialized установлено в true, если загрузка успешна
            // и что это не просто defaultState, который может иметь gameInitialized = false.
            // Если loadedState имел gameInitialized=true, то и gameState.gameInitialized будет true после слияния.
            // Если же мы загрузили что-то, где gameInitialized было false, то это проблема.
            // Но обычно, если игра была сохранена, gameInitialized = true.
            // Дополнительная проверка:
            if (!loadedState.gameInitialized) { // Если в сохраненке игра не была инициализирована (маловероятно для рабочего сохранения)
                console.warn("Загруженное состояние имело gameInitialized = false. Возможна неполная загрузка.");
                // Не сбрасываем до дефолта, даем шанс загрузиться, но предупреждаем.
            }
            gameState.gameInitialized = true; // Принудительно ставим true после успешной загрузки и слияния

            if (typeof showMessage === "function") showMessage("Загрузка", "Игра успешно загружена!");
            else alert("Игра загружена (showMessage не доступна)");
            return true; // Успешная загрузка
        } else {
            console.log("Сохраненная игра не найдена в localStorage.");
            // Не нужно вызывать initOrResetGameState здесь, т.к. он уже был вызван при DOMContentLoaded.
            // Просто возвращаем false, чтобы initGameFlow показал экран настройки.
            return false;
        }
    } catch (e) {
        console.error("Ошибка парсинга или загрузки игры:", e);
        if (typeof showMessage === "function") showMessage("Ошибка загрузки", `Не удалось загрузить. Данные могут быть повреждены (${e.message}).`);
        else alert("Ошибка загрузки.");
        localStorage.removeItem('footballManagerGrandState_v2.1');
        // Не сбрасываем здесь, так как initOrResetGameState уже был вызван.
        // Возвращаем false, чтобы initGameFlow показал экран настройки.
        return false;
    }
}

function deepMerge(target, source) {
    const output = { ...target }; // Начинаем с копии target (обычно это defaultState)
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => { // Итерируем по ключам загруженного состояния (source)
            const sourceValue = source[key];
            const targetValue = target[key]; // Значение из defaultState

            if (target.hasOwnProperty(key)) { // Если ключ из source есть и в target (defaultState)
                if (Array.isArray(sourceValue)) {
                     // Массивы полностью заменяются из source, если они существуют в source
                    output[key] = [...sourceValue];
                } else if (isObject(sourceValue)) {
                    if (isObject(targetValue)) { // Оба объекты, сливаем рекурсивно
                        output[key] = deepMerge(targetValue, sourceValue);
                    } else { // В target не объект (или null), но в source объект - берем из source
                        output[key] = { ...sourceValue };
                    }
                } else if (sourceValue !== undefined) { // Примитивное значение из source (не undefined)
                    output[key] = sourceValue;
                }
                // Если sourceValue === undefined, то в output[key] останется значение из target (defaultState)
            } else { // Если ключа из source нет в target, добавляем его (для новых полей в сохранении, которых нет в defaultState - маловероятно, но возможно)
                output[key] = isObject(sourceValue) ? { ...sourceValue } : (Array.isArray(sourceValue) ? [...sourceValue] : sourceValue);
            }
        });
        // Теперь добавляем ключи из target (defaultState), которых не было в source (загруженном состоянии)
        // Это важно, если в новой версии игры появились новые поля в gameState, которых не было в старом сохранении
        Object.keys(target).forEach(key => {
            if (!source.hasOwnProperty(key)) {
                output[key] = target[key];
            }
        });
    }
    return output;
}


function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function getNextPlayerId() {
    gameState.playerIdCounter = (gameState.playerIdCounter || 0) + 1;
    return gameState.playerIdCounter;
}

function getNextStaffId() {
    gameState.staffIdCounter = (gameState.staffIdCounter || 0) + 1;
    return `S-${gameState.staffIdCounter}`;
}

function getNextMatchId(prefix = "M") {
    gameState.matchIdCounter = (gameState.matchIdCounter || 0) + 1;
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const currentWeek = (gameState && gameState.currentWeek) ? gameState.currentWeek : 1;
    const currentSeason = (gameState && gameState.currentSeason) ? gameState.currentSeason : 1;
    return `${prefix}-${currentSeason}-${String(currentWeek).padStart(2,'0')}-${gameState.matchIdCounter}-${randomSuffix}`;
}

function calculateEndDate(startWeek, startSeason, durationWeeks) {
    let endWeek = startWeek + durationWeeks -1; // -1 потому что неделя старта уже включена
    let endSeason = startSeason;
    const seasonLen = (gameState && gameState.seasonLength && gameState.seasonLength > 0) ? gameState.seasonLength : ((typeof CPU_TEAM_NAMES !== 'undefined' ? CPU_TEAM_NAMES.length + 1 : 16) * 2 -2); // Примерная длина, если gameState.seasonLength еще не определен

    while (endWeek >= seasonLen) { // Если длительность 52 недели, сезон 52, старт на 1, то endWeek=52. 52>=52. endWeek=0, endSeason++. Это неверно.
                                 // Если контракт на 1 неделю, старт на 1. endWeek = 1. Не зайдет в цикл. week = 1, season = 1.
                                 // Контракт должен истекать ПОСЛЕ последней недели его действия.
        endWeek -= seasonLen;    // Пример: контракт на 1 нед, старт на 1. Неделя 1 - контракт действует. После недели 1 - истек. endWeek=1, endSeason=1.
        endSeason++;             // Если контракт на 52 нед, старт на 1. Неделя 52 - действует. После 52 - истек. endWeek=52, endSeason=1 (если сезон 52 нед)
    }
    // Корректная логика: endDate - это последняя неделя, когда контракт ЕЩЕ действует.
    let actualEndWeek = startWeek + durationWeeks - 1;
    let actualEndSeason = startSeason;
    while (actualEndWeek >= seasonLen) {
        actualEndWeek -= seasonLen;
        actualEndSeason++;
    }
    return { week: actualEndWeek + 1, season: actualEndSeason }; // Возвращаем неделю, СЛЕДУЮЩУЮ за последней неделей контракта (когда он уже истек)
}


function getWeeksLeftInContract(player) {
    if (!player || !player.contract || !player.contract.endDate || player.isYouth) {
        return player && player.isYouth ? Infinity : 0;
    }

    let weeksLeft = 0;
    const currentW = (gameState && gameState.currentWeek) ? gameState.currentWeek : 1;
    const currentS = (gameState && gameState.currentSeason) ? gameState.currentSeason : 1;
    const seasonLen = (gameState && gameState.seasonLength && gameState.seasonLength > 0) ? gameState.seasonLength : ((typeof CPU_TEAM_NAMES !== 'undefined' ? CPU_TEAM_NAMES.length + 1 : 16) * 2 -2);

    const contractEndW = player.contract.endDate.week;
    const contractEndS = player.contract.endDate.season;

    // Если дата окончания уже прошла
    if (contractEndS < currentS || (contractEndS === currentS && contractEndW <= currentW)) {
        return 0;
    }

    if (contractEndS === currentS) {
        weeksLeft = contractEndW - currentW;
    } else { // contractEndS > currentS
        weeksLeft = (seasonLen - currentW) + // недель до конца текущего сезона (не включая текущую)
                    ((contractEndS - currentS - 1) * seasonLen) + // недель в полных промежуточных сезонах
                    contractEndW; // недель в конечном сезоне
    }
    return Math.max(0, weeksLeft);
}