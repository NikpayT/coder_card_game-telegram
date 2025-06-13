// js/game_logic_core.js

// Предполагается, что gameState, ui объекты и константы из data.js доступны глобально.

// --- Общие вспомогательные функции ---
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
    if (!arr || arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
}

function addNews(type, ...args) {
    if (!gameState || !gameState.news || typeof gameState.currentWeek === 'undefined' || typeof gameState.currentSeason === 'undefined') {
        console.warn("addNews: gameState или его компоненты не инициализированы.", type, args);
        return;
    }
    const messageText = NEWS_EVENTS[type] ? (typeof NEWS_EVENTS[type] === 'function' ? NEWS_EVENTS[type](...args) : NEWS_EVENTS[type]) : args.join(' ');
    gameState.news.unshift({ type, message: messageText, week: gameState.currentWeek, season: gameState.currentSeason });
    if (gameState.news.length > NEWS_FEED_LIMIT_UI) {
        gameState.news.length = NEWS_FEED_LIMIT_UI;
    }
}

function addTransaction(description, amount, type, category) {
    if (!gameState || !gameState.transactions || typeof gameState.currentWeek === 'undefined' || typeof gameState.currentSeason === 'undefined') {
         console.warn("addTransaction: gameState или его компоненты не инициализированы.", description);
         return;
    }
    gameState.transactions.unshift({ description, amount: Math.round(amount), type, category, week: gameState.currentWeek, season: gameState.currentSeason });
    if (gameState.transactions.length > TRANSACTION_HISTORY_LIMIT_UI) {
        gameState.transactions.length = TRANSACTION_HISTORY_LIMIT_UI;
    }
}

function getEffectivePlayerStats(player, forMatchSim = false) {
    if (!player) return { attack: 0, defense: 0, overall: 0, currentStamina: 100 };
    const form = player.form !== undefined ? player.form : 50;
    const morale = player.morale !== undefined ? player.morale : 50;
    const consistency = player.consistency !== undefined ? player.consistency : 50;

    const formFactor = (form - 50) / 50 * 0.20;
    const moraleFactor = (morale - 50) / 100 * 0.15;
    const consistencyFactor = (consistency - 50) / 50 * 0.10 * (Math.random() - 0.5) * 2;

    let effectiveAttack = player.attack * (1 + formFactor + moraleFactor + consistencyFactor);
    let effectiveDefense = player.defense * (1 + formFactor + moraleFactor + consistencyFactor);

    effectiveAttack += (player.teamTrainingEffect ? player.teamTrainingEffect.attack : 0) || 0;
    effectiveDefense += (player.teamTrainingEffect ? player.teamTrainingEffect.defense : 0) || 0;

    effectiveAttack = Math.max(1, Math.min(99, Math.round(effectiveAttack)));
    effectiveDefense = Math.max(1, Math.min(99, Math.round(effectiveDefense)));

    let currentStamina = form;
    if (forMatchSim && typeof currentMatchSimulation !== 'undefined' && currentMatchSimulation && currentMatchSimulation.playerStamina && currentMatchSimulation.playerStamina[player.id] !== undefined) {
        currentStamina = currentMatchSimulation.playerStamina[player.id];
    }
    if (currentStamina < 40) {
        const staminaPenalty = (40 - currentStamina) / 40 * 0.50;
        effectiveAttack *= (1 - staminaPenalty);
        effectiveDefense *= (1 - staminaPenalty);
    }
    return {
        attack: Math.round(Math.max(1, effectiveAttack)),
        defense: Math.round(Math.max(1, effectiveDefense)),
        overall: Math.round(((Math.max(1, effectiveAttack) * (player.position === 'НАП' ? 1.15 : (player.position === 'ПЗЩ' ? 1.05 : 0.95))) + (Math.max(1, effectiveDefense) * (player.position === 'ЗАЩ' || player.position === 'ВРТ' ? 1.15 : (player.position === 'ПЗЩ' ? 1.05 : 0.95)))) / 2.1),
        currentStamina: Math.round(currentStamina)
    };
}

function getPlayerPotentialValue(player) {
    return player ? (player.potential || (player.attack + player.defense + getRandomInt(5, 20))) : 0;
}

function getPlayerPotentialRating(player) {
    if (!player) return '?';
    if (!player.isUserPlayer && !player.isYouth && player.scoutedLevel < 2) return '?';

    const potentialValue = getPlayerPotentialValue(player);
    if (potentialValue >= 180) return 'A+ (Мировая звезда)';
    if (potentialValue >= 165) return 'A (Элита)';
    if (potentialValue >= 150) return 'B+ (Топ-игрок)';
    if (potentialValue >= 135) return 'B (Сильный)';
    if (potentialValue >= 120) return 'C+ (Хороший)';
    if (potentialValue >= 105) return 'C (Перспективный)';
    if (potentialValue >= 90) return 'D (Средний)';
    return 'E (Слабый)';
}

function getFormationStructure(formationString) {
    const structures = {
        "4-4-2": [ { line: "ATTACK", positions: [{ base: "НАП", label: "ФРВ" }, { base: "НАП", label: "ФРВ" }] }, { line: "MIDFIELD", positions: [{ base: "ПЗЩ", label: "ЛП" }, { base: "ПЗЩ", label: "ЦП1" }, { base: "ПЗЩ", label: "ЦП2" }, { base: "ПЗЩ", label: "ПП" }] }, { line: "DEFENSE", positions: [{ base: "ЗАЩ", label: "ЛЗ" }, { base: "ЗАЩ", label: "ЦЗ1" }, { base: "ЗАЩ", label: "ЦЗ2" }, { base: "ЗАЩ", label: "ПЗ" }] }, { line: "KEEPER", positions: [{ base: "ВРТ", label: "ВРТ" }] }],
        "4-3-3": [ { line: "ATTACK", positions: [{ base: "НАП", label: "ЛФА" },{ base: "НАП", label: "ЦФД" }, { base: "НАП", label: "ПФА" }] }, { line: "MIDFIELD", positions: [{ base: "ПЗЩ", label: "ЛЦП" }, { base: "ПЗЩ", label: "ЦП" }, { base: "ПЗЩ", label: "ПЦП" }] }, { line: "DEFENSE", positions: [{ base: "ЗАЩ", label: "ЛЗ" }, { base: "ЗАЩ", label: "ЦЗ1" }, { base: "ЗАЩ", label: "ЦЗ2" }, { base: "ЗАЩ", label: "ПЗ" }] }, { line: "KEEPER", positions: [{ base: "ВРТ", label: "ВРТ" }] }],
        "3-5-2": [ { line: "ATTACK", positions: [{ base: "НАП", label: "ФРВ1" }, { base: "НАП", label: "ФРВ2" }] }, { line: "MIDFIELD", positions: [{ base: "ПЗЩ", label: "ЛФП" }, { base: "ПЗЩ", label: "ЛЦП" }, { base: "ПЗЩ", label: "ЦОП" }, { base: "ПЗЩ", label: "ПЦП" }, { base: "ПЗЩ", label: "ПФП" }] }, { line: "DEFENSE", positions: [{ base: "ЗАЩ", label: "ЛЦЗ" }, { base: "ЗАЩ", label: "ЦЗ" }, { base: "ЗАЩ", label: "ПЦЗ" }] }, { line: "KEEPER", positions: [{ base: "ВРТ", label: "ВРТ" }] }],
        "4-2-3-1": [ { line: "ATTACK", positions: [{ base: "НАП", label: "ЦФД" }] }, { line: "MIDFIELD_ATTACK", positions: [{ base: "ПЗЩ", label: "ЛАП" }, { base: "ПЗЩ", label: "ЦАП" }, { base: "ПЗЩ", label: "ПAП" }] }, { line: "MIDFIELD_DEFENSE", positions: [{ base: "ПЗЩ", label: "ЛЦОП" }, { base: "ПЗЩ", label: "ПЦОП" }] }, { line: "DEFENSE", positions: [{ base: "ЗАЩ", label: "ЛЗ" }, { base: "ЗАЩ", label: "ЦЗ1" }, { base: "ЗАЩ", label: "ЦЗ2" }, { base: "ЗАЩ", label: "ПЗ" }] }, { line: "KEEPER", positions: [{ base: "ВРТ", label: "ВРТ" }] }],
        "5-3-2": [ { line: "ATTACK", positions: [{ base: "НАП", label: "ФРВ1" }, { base: "НАП", label: "ФРВ2" }] }, { line: "MIDFIELD", positions: [{ base: "ПЗЩ", label: "ЛЦП" }, { base: "ПЗЩ", label: "ЦП" }, { base: "ПЗЩ", label: "ПЦП" }] }, { line: "DEFENSE", positions: [{ base: "ЗАЩ", label: "ЛФЗ" }, { base: "ЗАЩ", label: "ЛЦЗ" }, { base: "ЗАЩ", label: "ЦЗ" }, { base: "ЗАЩ", label: "ПЦЗ" }, { base: "ЗАЩ", label: "ПФЗ" }] }, { line: "KEEPER", positions: [{ base: "ВРТ", label: "ВРТ" }] }],
        "4-1-4-1": [ { line: "ATTACK", positions: [{ base: "НАП", label: "ЦФД" }] }, { line: "MIDFIELD_WINGS", positions: [{ base: "ПЗЩ", label: "ЛП" }, { base: "ПЗЩ", label: "ПП" }] }, { line: "MIDFIELD_CENTER", positions: [{ base: "ПЗЩ", label: "ЛЦАП" }, { base: "ПЗЩ", label: "ПЦАП" }] }, { line: "MIDFIELD_HOLDING", positions: [{ base: "ПЗЩ", label: "ЦОП" }] }, { line: "DEFENSE", positions: [{ base: "ЗАЩ", label: "ЛЗ" }, { base: "ЗАЩ", label: "ЦЗ1" }, { base: "ЗАЩ", label: "ЦЗ2" }, { base: "ЗАЩ", label: "ПЗ" }] }, { line: "KEEPER", positions: [{ base: "ВРТ", label: "ВРТ" }] }],
        "4-4-1-1": [ { line: "ATTACK_STRIKER", positions: [{ base: "НАП", label: "ФРВ" }] }, { line: "ATTACK_SUPPORT", positions: [{ base: "ПЗЩ", label: "ЦАП" }] }, { line: "MIDFIELD_WINGS", positions: [{ base: "ПЗЩ", label: "ЛП" }, { base: "ПЗЩ", label: "ПП" }] }, { line: "MIDFIELD_CENTER", positions: [{ base: "ПЗЩ", label: "ЛЦП" }, { base: "ПЗЩ", label: "ПЦП" }] }, { line: "DEFENSE", positions: [{ base: "ЗАЩ", label: "ЛЗ" }, { base: "ЗАЩ", label: "ЦЗ1" }, { base: "ЗАЩ", label: "ЦЗ2" }, { base: "ЗАЩ", label: "ПЗ" }] }, { line: "KEEPER", positions: [{ base: "ВРТ", label: "ВРТ" }] }],
        "3-4-3": [ { line: "ATTACK", positions: [{ base: "НАП", label: "ЛФА" },{ base: "НАП", label: "ЦФД" }, { base: "НАП", label: "ПФА" }] }, { line: "MIDFIELD", positions: [{ base: "ПЗЩ", label: "ЛФП" }, { base: "ПЗЩ", label: "ЛЦП" }, { base: "ПЗЩ", label: "ПЦП" }, { base: "ПЗЩ", label: "ПФП" }] }, { line: "DEFENSE", positions: [{ base: "ЗАЩ", label: "ЛЦЗ" }, { base: "ЗАЩ", label: "ЦЗ" }, { base: "ЗАЩ", label: "ПЦЗ" }] }, { line: "KEEPER", positions: [{ base: "ВРТ", label: "ВРТ" }] }]
    };

    if (structures[formationString]) {
        let totalPositions = 0;
        structures[formationString].forEach(line => totalPositions += line.positions.length);
        if (totalPositions !== REQUIRED_STARTERS) {
            return [ { line: "GENERIC_FALLBACK", positions: Array(REQUIRED_STARTERS).fill(null).map((_,i) => ({base: PLAYER_POSITIONS[i % PLAYER_POSITIONS.length] || "ANY", label: `Игрок ${i+1}`})) }];
        }
        return structures[formationString];
    }
    return [ { line: "GENERIC_FALLBACK", positions: Array(REQUIRED_STARTERS).fill(null).map((_,i) => ({base: PLAYER_POSITIONS[i % PLAYER_POSITIONS.length] || "ANY", label: `Игрок ${i+1}`})) }];
}

function getTeamReference(teamName) {
    if (!gameState) return null;
    if (gameState.userTeam && gameState.userTeam.name === teamName) {
        return gameState.userTeam;
    }
    if (gameState.cpuTeams) {
        const team = gameState.cpuTeams.find(t => t.name === teamName);
        if (team) return team;
    }
    return null;
}


// --- Инициализация новой игры (логическая часть) ---
function startGameLogic(clubName, avatar) {
    initOrResetGameState(clubName, avatar);
     initHistoryAndRecords(); // <--- ДОБАВИТЬ ЭТУ СТРОКУ

    for (let i = 0; i < MIN_SQUAD_SIZE_TEAM; i++) {
        const position = PLAYER_POSITIONS[i % PLAYER_POSITIONS.length];
        const player = createPlayer({
            isUserPlayer: true,
            position: position,
            baseAttack: getRandomInt(45, 68),
            baseDefense: getRandomInt(45, 68),
            age: getRandomInt(18, 26)
        });
        player.contract.salary = Math.max(100, Math.floor(((player.attack + player.defense) * 2.5 + getPlayerPotentialValue(player) * 20) / 50) * 50);
        player.contract.durationWeeks = getRandomElement([CONTRACT_LENGTHS_WEEKS.medium, CONTRACT_LENGTHS_WEEKS.long, CONTRACT_LENGTHS_WEEKS.veryLong]);
        if (typeof calculateEndDate === "function") player.contract.endDate = calculateEndDate(gameState.currentWeek, gameState.currentSeason, player.contract.durationWeeks);
        player.price = Math.max(1000, Math.floor(player.price * 0.25));
        gameState.userTeam.players.push(player);
    }
    autoFillLineup();

    CPU_TEAM_NAMES.forEach(name => {
        const team = createCPUTeam(name);
        gameState.cpuTeams.push(team);
        gameState.leagueTable[name] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0, name: name, form: [] };
    });
    if (gameState.userTeam) {
        gameState.leagueTable[gameState.userTeam.name] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0, name: gameState.userTeam.name, form: [] };
    }

    generateLeagueSchedule();
    initNationalCup();
    sortSchedule();

    populateInitialTransferMarket(80);
    populateAvailableCoaches(15);
    populateAvailableStaff(6);

    gameState.gameInitialized = true;
    addNews('generic', `Добро пожаловать в ${gameState.clubName}, Менеджер ${gameState.avatar}! Ваш путь к футбольной славе начинается здесь и сейчас.`);
    addNews('newSeason', gameState.currentSeason);
    addTransaction("Стартовый капитал клуба", STARTING_BUDGET, 'income', "Начальный бюджет");

    if (typeof updateAllUIDisplays === "function") updateAllUIDisplays();
    if (typeof showScreen === "function") showScreen('news');
}


// --- Создание игровых сущностей ---
function createPlayer(options = {}) {
    const id = typeof getNextPlayerId === "function" ? getNextPlayerId() : Date.now() + Math.random();
    const age = options.age || getRandomInt(16, 36);
    const baseAttack = options.baseAttack || getRandomInt(25, 85);
    const baseDefense = options.baseDefense || getRandomInt(25, 85);
    const currentPosition = options.position || getRandomElement(PLAYER_POSITIONS);

    let potentialSum = options.potentialValue || getRandomInt(baseAttack + baseDefense + 3, 185 + Math.max(0, 26-age)*3.5 );
    potentialSum = Math.min(198, Math.max(60, potentialSum));

    let initialSalary = Math.floor((baseAttack + baseDefense) * getRandomInt(4, 9) + potentialSum * 1.2 + (options.isUserPlayer ? 0 : getRandomInt(0,700)));
    if (options.isYouth) initialSalary = Math.floor(initialSalary / 5.5);
    initialSalary = Math.max(25, Math.floor(initialSalary/25)*25);

    const contractDuration = options.contractDurationWeeks || getRandomElement(Object.values(CONTRACT_LENGTHS_WEEKS));

    return {
        id: id,
        name: options.name || `${getRandomElement(PLAYER_FIRST_NAMES)} ${getRandomElement(PLAYER_LAST_NAMES)}`,
        age: age,
        position: currentPosition,
        detailedPosition: options.detailedPosition || getRandomElement(DETAILED_PLAYER_POSITIONS[currentPosition]),
        attack: baseAttack,
        defense: baseDefense,
        morale: getRandomInt(30, 75),
        form: getRandomInt(20, 70),
        price: options.price === undefined ? Math.max(250, Math.floor((baseAttack + baseDefense + potentialSum + Math.max(0, (29-age)*18)) * getRandomInt(130, 280))) : options.price,
        contract: {
            salary: initialSalary,
            durationWeeks: contractDuration,
            endDate: null,
            releaseClause: 0,
            agentFee: 0,
            wageDemands: initialSalary,
            desiredContractLength: contractDuration,
            loyaltyBonus: 0,
            signingBonus: 0
        },
        status: { type: 'fit', duration: 0, affectedStat: null },
        trainingFocus: null,
        teamTrainingEffect: { attack: 0, defense: 0, cohesion: 0},
        potential: potentialSum,
        personality: getRandomElement(PLAYER_PERSONALITIES),
        isUserPlayer: options.isUserPlayer || false,
        isYouth: options.isYouth || false,
        statsVisible: options.statsVisible !== undefined ? options.statsVisible : (options.isUserPlayer || options.isYouth),
        scoutedLevel: options.scoutedLevel !== undefined ? options.scoutedLevel : (options.isUserPlayer || options.isYouth ? 3 : 0),
        onLoan: null,
        internationalDuty: false,
        relations: {},
        preferredFoot: Math.random() < 0.60 ? 'Правая' : (Math.random() < 0.88 ? 'Левая' : 'Обе'),
        workRate: getRandomInt(15,85),
        consistency: getRandomInt(10,80),
        injuryProneness: getRandomInt(1, 35),
        playedInMatch: false
    };
}

function createCPUTeam(name, numPlayers = MIN_SQUAD_SIZE_TEAM + getRandomInt(0,6)) {
    const teamReputation = getRandomInt(10, 65);
    const defaultFacilities = typeof getDefaultGameState === "function" ? getDefaultGameState().userTeam.facilities : {};
    const teamId = getNextStaffId();
    const team = {
        name, id: teamId,
        players: [], coach: null,
        formation: getRandomElement(Object.values(COACH_SPECIALIZATIONS).map(s => s.preferredFormation || "4-4-2")),
        tactic: getRandomElement(["balanced", "attacking", "defensive", "counter-attacking", "possession", "high-press"]),
        startingXI: Array(REQUIRED_STARTERS).fill(null),
        activeNationalCup: null,
        staff: { assistantCoach: null, chiefScout: null, physio: null, youthCoach: null, scouts: [] },
        facilities: JSON.parse(JSON.stringify(defaultFacilities)),
        reputation: teamReputation,
        budget: STARTING_BUDGET + getRandomInt(-200000, 300000) + teamReputation * 3500
    };
    for (let i = 0; i < numPlayers; i++) {
        const player = createPlayer({
            baseAttack: getRandomInt(40,78), baseDefense: getRandomInt(40,78),
            age: getRandomInt(17,35),
            potentialValue: getRandomInt(90, 180)
        });
        if (typeof calculateEndDate === "function") player.contract.endDate = calculateEndDate(1,1, player.contract.durationWeeks);
        team.players.push(player);
    }
    // Простой авто-состав для CPU
    const sortedPlayers = [...team.players].filter(p => p.status.type === 'fit')
                           .sort((a,b) => (getEffectivePlayerStats(b).overall) - (getEffectivePlayerStats(a).overall));
    for(let i=0; i < REQUIRED_STARTERS && i < sortedPlayers.length; i++) { team.startingXI[i] = sortedPlayers[i].id; }

    const coachKeys = Object.keys(COACH_SPECIALIZATIONS);
    const specKey = getRandomElement(coachKeys);
    team.coach = createCoach(getRandomElement(COACH_NAMES), specKey, getRandomInt(1000, 4000) + Math.floor(team.reputation * 20));
    if (Math.random() < 0.55) team.staff.assistantCoach = createStaffMember('assistantCoach');
    if (Math.random() < 0.45) team.staff.physio = createStaffMember('physio');
    if (Math.random() < 0.35) team.staff.chiefScout = createStaffMember('chiefScout');
    if (Math.random() < 0.4) team.staff.youthCoach = createStaffMember('youthCoach');
    return team;
}

function createCoach(name, specKey, salary) {
    const id = typeof getNextStaffId === "function" ? getNextStaffId() : Date.now() + Math.random() + 1;
    const spec = COACH_SPECIALIZATIONS[specKey];
    return {
        id: id, name: name, role: "Главный тренер", specKey: specKey, specialization: spec,
        salary: Math.floor(salary/100)*100, attackBoost: spec.attackBoost || 0, defenseBoost: spec.defenseBoost || 0,
        trainingBonus: spec.trainingBonus || 0, moraleBoost: spec.moraleBoost || 0, youthFocus: spec.youthFocus || 0,
        preferredFormation: spec.preferredFormation || "4-4-2",
        reputation: getRandomInt(25, 70)
    };
}

function createStaffMember(roleKey) {
    const id = typeof getNextStaffId === "function" ? getNextStaffId() : Date.now() + Math.random() + 2;
    const roleDetails = STAFF_ROLES[roleKey];
    if (!roleDetails) {
        console.error(`Role details not found for key: ${roleKey}`);
        return null;
    }
    const name = `${getRandomElement(STAFF_NAMES_GENERIC)} ${getRandomElement(PLAYER_LAST_NAMES)}`;
    const skill = getRandomInt(20, 75);
    return {
        id: id, name: name, role: roleDetails.name, roleKey: roleKey,
        skillLevel: skill,
        salary: Math.max(roleDetails.salaryRange[0], Math.floor(getRandomInt(roleDetails.salaryRange[0], roleDetails.salaryRange[1])/50)*50 + Math.floor( (skill - 40) * (roleDetails.salaryRange[1]/1000) * 3.5 )),
        assignment: null, weeksLeft: 0
    };
}

function populateInitialTransferMarket(count = 80) {
    if (!gameState.transferMarket) gameState.transferMarket = { players: [] };
    gameState.transferMarket.players = []; // Очищаем перед заполнением
    for (let i = 0; i < count; i++) {
        const player = createPlayer({ scoutedLevel: getRandomInt(0,1) });
        if (typeof calculateEndDate === "function") player.contract.endDate = calculateEndDate(gameState.currentWeek || 1, gameState.currentSeason || 1, player.contract.durationWeeks);
        gameState.transferMarket.players.push(player);
    }
}

function populateAvailableCoaches(count = 15) {
    if (!gameState.availableCoaches) gameState.availableCoaches = [];
    // Не очищаем, а добавляем, если нужно пополнить список
    const existingNames = new Set([...gameState.availableCoaches.map(c => c.name), gameState.userTeam?.coach?.name].filter(Boolean));
    const targetSize = Math.max(gameState.availableCoaches.length, count); // Целевой размер списка

    for (let i = gameState.availableCoaches.length; i < targetSize; i++) {
        if (gameState.availableCoaches.length >= 25) break;
        let name;
        let attempts = 0;
        do {
            name = getRandomElement(COACH_NAMES);
            attempts++;
        } while (existingNames.has(name) && attempts < COACH_NAMES.length * 3);
        if (existingNames.has(name)) continue;

        existingNames.add(name);
        const specKey = getRandomElement(Object.keys(COACH_SPECIALIZATIONS));
        const baseSalary = getRandomInt(1800, 7500); const spec = COACH_SPECIALIZATIONS[specKey];
        const skillFactor = (spec.attackBoost + spec.defenseBoost + (spec.trainingBonus * 50) + (spec.youthFocus*30) ) / 7;
        const reputationFactor = getRandomInt(20,60);
        const salary = Math.max(800, Math.floor((baseSalary + skillFactor * 180 + reputationFactor * 35) /100) * 100);
        const coach = createCoach(name, specKey, salary);
        coach.reputation = reputationFactor;
        gameState.availableCoaches.push(coach);
    }
}

function populateAvailableStaff(countPerRole = 6, specificRoleKey = null) {
    if (!gameState.availableStaff) gameState.availableStaff = {};
    const rolesToPopulate = specificRoleKey ? [specificRoleKey] : Object.keys(STAFF_ROLES);

    rolesToPopulate.forEach(roleKey => {
        if (!gameState.availableStaff[roleKey]) gameState.availableStaff[roleKey] = [];
        const existingNames = new Set(gameState.availableStaff[roleKey].map(s => s.name));
        const currentStaffInRole = gameState.userTeam?.staff?.[roleKey];
        if(currentStaffInRole){
            (Array.isArray(currentStaffInRole) ? currentStaffInRole : [currentStaffInRole]).forEach(s => s ? existingNames.add(s.name) : null);
        }
        const targetSize = Math.max(gameState.availableStaff[roleKey].length, countPerRole);

        for (let i = gameState.availableStaff[roleKey].length; i < targetSize; i++) {
             if (gameState.availableStaff[roleKey].length >= 12) break;
            const staffMember = createStaffMember(roleKey);
            if (staffMember && !existingNames.has(staffMember.name)) {
                gameState.availableStaff[roleKey].push(staffMember);
                existingNames.add(staffMember.name);
            }
        }
    });
}

// --- Генерация расписаний ---
function generateLeagueSchedule() {
    if (!gameState.cpuTeams || !gameState.userTeam) {
        console.error("Невозможно сгенерировать расписание: команды не определены.");
        gameState.schedule = [];
        gameState.seasonLength = 0;
        return;
    }
    const teamsForScheduling = [gameState.userTeam.name, ...gameState.cpuTeams.map(t => t.name)];
    if (teamsForScheduling.length < 2) {
        console.warn("Слишком мало команд для генерации расписания лиги.");
        gameState.schedule = [];
        gameState.seasonLength = 0;
        return;
    }

    const teams = [...teamsForScheduling];
    const isOdd = teams.length % 2 !== 0;
    if (isOdd) {
        teams.push("BYE_WEEK_TEAM");
    }
    const numTeams = teams.length;
    const halfRounds = numTeams - 1;
    const schedule = [];

    const roundRobin = [];
    for (let i = 0; i < numTeams; i++) roundRobin[i] = i;

    for (let r = 0; r < halfRounds; r++) {
        for (let i = 0; i < numTeams / 2; i++) {
            const homeIndex = roundRobin[i];
            const awayIndex = roundRobin[numTeams - 1 - i];

            if (teams[homeIndex] !== "BYE_WEEK_TEAM" && teams[awayIndex] !== "BYE_WEEK_TEAM") {
                const match = (r % 2 === 0 || i % 2 === 0 && i !== 0) ?
                    { home: teams[homeIndex], away: teams[awayIndex] } :
                    { home: teams[awayIndex], away: teams[homeIndex] };
                schedule.push({
                    matchId: getNextMatchId("L"), week: r + 1,
                    homeTeam: match.home, awayTeam: match.away,
                    played: false, homeScore: 0, awayScore: 0,
                    isUserMatch: match.home === gameState.userTeam.name || match.away === gameState.userTeam.name,
                    competition: "League"
                });
            }
        }
        const last = roundRobin.pop();
        roundRobin.splice(1,0,last);
    }

    const firstHalfSchedule = [...schedule];
    firstHalfSchedule.forEach(match => {
        schedule.push({
            ...match,
            matchId: getNextMatchId("L"),
            week: match.week + halfRounds,
            homeTeam: match.awayTeam,
            awayTeam: match.homeTeam,
            isUserMatch: match.awayTeam === gameState.userTeam.name || match.homeTeam === gameState.userTeam.name,
        });
    });

    gameState.schedule = gameState.schedule.concat(schedule); // Объединяем с существующим расписанием (кубки)
    gameState.seasonLength = halfRounds * 2;
}

function initNationalCup() {
    if (!gameState.cpuTeams || !gameState.userTeam || !CUP_COMPETITIONS.nationalCup) return;

    const cupData = CUP_COMPETITIONS.nationalCup;
    let allTeamObjects = [
        { name: gameState.userTeam.name, reputation: gameState.userTeam.reputation || 50, id: gameState.userTeam.id, obj: gameState.userTeam },
        ...gameState.cpuTeams.map(t => ({ name: t.name, reputation: t.reputation || 50, id: t.id, obj: t }))
    ];

    let targetTeamsForCup = cupData.teams;
    if (allTeamObjects.length < targetTeamsForCup) {
        let powerOfTwo = 2;
        while (powerOfTwo * 2 <= allTeamObjects.length && powerOfTwo * 2 <= targetTeamsForCup) {
            powerOfTwo *= 2;
        }
        targetTeamsForCup = powerOfTwo;
        if (targetTeamsForCup < 2) {
             console.warn(`Not enough teams (${allTeamObjects.length}) for ${cupData.name}. Cup will not be held.`);
             return;
        }
        console.warn(`Not enough teams for ${cupData.name}, ${targetTeamsForCup} teams will participate.`);
    }
    allTeamObjects.sort((a, b) => b.reputation - a.reputation);
    allTeamObjects = allTeamObjects.slice(0, targetTeamsForCup);


    const participatingTeamNames = allTeamObjects.map(t => t.name);
    const cupKey = "nationalCup";

    const cupStateForUser = {
        name: cupKey,
        currentRoundIndex: 0,
        participatingTeams: [...participatingTeamNames]
    };
    if (allTeamObjects.some(t => t.id === gameState.userTeam.id)) {
        gameState.userTeam.activeNationalCup = cupStateForUser;
    } else {
        gameState.userTeam.activeNationalCup = null;
    }

    allTeamObjects.forEach(teamObjWrapper => {
        if (teamObjWrapper.obj && teamObjWrapper.id !== gameState.userTeam.id) {
            teamObjWrapper.obj.activeNationalCup = { name: cupKey, currentRoundIndex: 0, participatingTeams: [...participatingTeamNames] };
        }
    });
    CUP_COMPETITIONS[cupKey].actualTeams = targetTeamsForCup;

    generateCupRound(participatingTeamNames, 0, cupStateForUser, cupData, cupKey);
}

function generateCupRound(teamsInRoundNames, roundIndex, cupStateObjectForUser, cupData, cupKey) {
    const actualCupData = CUP_COMPETITIONS[cupKey];
    const actualNumTeamsInCup = actualCupData.actualTeams || teamsInRoundNames.length; // Используем фактическое число команд
    const numExpectedRounds = actualNumTeamsInCup > 1 ? Math.ceil(Math.log2(actualNumTeamsInCup)) : 0;
    const dynamicRounds = Array.from({length: numExpectedRounds}, (_, i) => cupData.rounds[i] || `Раунд ${i+1}`);

    if (!cupData || roundIndex >= dynamicRounds.length) {
        if (teamsInRoundNames.length === 1 && typeof addNews === "function") {
            addNews('cupWinner', teamsInRoundNames[0], cupData.name);
            const prizeMoneyForWinner = cupData.winnerBonus || (cupData.prizeMoney[dynamicRounds.length-1] || 0);
            if (cupStateObjectForUser && teamsInRoundNames[0] === gameState.userTeam.name && prizeMoneyForWinner > 0) {
                gameState.budget += prizeMoneyForWinner;
                addTransaction(`Победа в ${cupData.name}`, prizeMoneyForWinner, 'income', 'Призовые');
            }
             if (cupStateObjectForUser) cupStateObjectForUser.currentRoundIndex = -1;
        }
        return;
    }
    if (teamsInRoundNames.length < 2) {
        if (teamsInRoundNames.length === 1 && typeof addNews === "function") {
            addNews('generic', `${teamsInRoundNames[0]} автоматически проходит в следующий раунд ${cupData.shortName}.`);
            if (cupStateObjectForUser) cupStateObjectForUser.participatingTeams = [teamsInRoundNames[0]];
            generateCupRound(teamsInRoundNames, roundIndex + 1, cupStateObjectForUser, cupData, cupKey);
        }
        return;
    }

    if (cupStateObjectForUser && cupStateObjectForUser.name === cupKey) cupStateObjectForUser.currentRoundIndex = roundIndex;
    gameState.cpuTeams.forEach(cpuTeam => {
        if (cpuTeam.activeNationalCup && cpuTeam.activeNationalCup.name === cupKey) {
            cpuTeam.activeNationalCup.currentRoundIndex = roundIndex;
        }
    });

    const roundName = dynamicRounds[roundIndex];
    const weekForRound = cupData.startWeek + roundIndex * cupData.frequencyWeeks;
    if (weekForRound > gameState.seasonLength) {
        console.warn(`Неделя кубка (${weekForRound}) выходит за пределы сезона (${gameState.seasonLength}). Кубок может не завершиться.`);
    }

    let shuffledTeams = [...teamsInRoundNames].sort(() => 0.5 - Math.random());
    let nextRoundByes = [];

    while (shuffledTeams.length >= 2) {
        const homeTeam = shuffledTeams.shift();
        const awayTeam = shuffledTeams.shift();

        gameState.schedule.push({
            matchId: getNextMatchId("C"), week: weekForRound,
            homeTeam: homeTeam, awayTeam: awayTeam,
            played: false, homeScore: 0, awayScore: 0,
            isUserMatch: homeTeam === gameState.userTeam.name || awayTeam === gameState.userTeam.name,
            competition: cupData.shortName, round: roundName,
            cupData: { roundIndex: roundIndex, cupKey: cupKey, prize: cupData.prizeMoney[roundIndex] || 0 }
        });
        if (typeof addNews === "function") addNews('cupDraw', roundName, homeTeam, awayTeam, cupData.name);
    }
    if (shuffledTeams.length === 1) {
        const luckyTeam = shuffledTeams[0];
        addNews('generic', `${luckyTeam} автоматически проходит в следующий раунд ${cupData.shortName} (нет пары).`);
        nextRoundByes.push(luckyTeam);
    }
    if (cupStateObjectForUser) {
        cupStateObjectForUser.nextRoundByes = nextRoundByes;
    }
    gameState.cpuTeams.forEach(cpu => {
        if(cpu.activeNationalCup && cpu.activeNationalCup.name === cupKey){
            cpu.activeNationalCup.nextRoundByes = [...nextRoundByes];
        }
    });

    sortSchedule();
}


function sortSchedule() {
    if (gameState.schedule) {
        gameState.schedule.sort((a, b) => {
            if (a.week !== b.week) return a.week - b.week;
            if (a.isUserMatch && !b.isUserMatch) return -1;
            if (!a.isUserMatch && b.isUserMatch) return 1;
            const compAOrder = a.competition === "League" ? 1 : (a.competition && a.competition.includes(CUP_COMPETITIONS.nationalCup.shortName) ? 2 : 3);
            const compBOrder = b.competition === "League" ? 1 : (b.competition && b.competition.includes(CUP_COMPETITIONS.nationalCup.shortName) ? 2 : 3);
            return compAOrder - compBOrder;
        });
    }
}

// --- Основная игровая логика (handle* функции) ---
function handleSellPlayer(playerId) {
    if (!gameState.userTeam || !gameState.userTeam.players) return;
    const playerIndex = gameState.userTeam.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) { console.warn("Player to sell not found:", playerId); return; }
    const player = gameState.userTeam.players[playerIndex];

    if (player.price === 0 && player.age < 28 && !player.isYouth) {
        if(typeof showMessage === "function") showMessage("Инфо", "Этого игрока (стартовый/молодой из академии) пока нельзя продать."); return;
    }
    if (gameState.userTeam.players.length <= MIN_SQUAD_SIZE_TEAM) {
        if(typeof showMessage === "function") showMessage("Инфо", `Нельзя продать игрока, в команде должно быть минимум ${MIN_SQUAD_SIZE_TEAM} игроков!`); return;
    }
    if (player.onLoan) {
        if(typeof showMessage === "function") showMessage("Инфо", `${player.name} находится в аренде и не может быть продан сейчас.`); return;
    }

    const transferFee = Math.floor(player.price * (0.75 + Math.random() * 0.40));
    if (!confirm(`Продать ${player.name} за ${transferFee.toLocaleString()}$?`)) return;

    gameState.budget += transferFee;
    addTransaction(`Продажа ${player.name}`, transferFee, 'income', 'Трансферы');
    addNews('playerSold', player.name, gameState.userTeam.name, "Другой клуб", transferFee);

    const soldPlayer = gameState.userTeam.players.splice(playerIndex, 1)[0];
    if (gameState.userTeam.startingXI) {
        const startingIndex = gameState.userTeam.startingXI.indexOf(soldPlayer.id);
        if (startingIndex !== -1) {
            gameState.userTeam.startingXI[startingIndex] = null;
            autoFillLineup();
        }
    }
    if(soldPlayer.trainingFocus && gameState.userTeam) { soldPlayer.trainingFocus = null; gameState.userTeam.trainingSlotsUsed = Math.max(0, (gameState.userTeam.trainingSlotsUsed || 0) - 1);}

    soldPlayer.isUserPlayer = false; soldPlayer.scoutedLevel = 0; soldPlayer.statsVisible = false;
    soldPlayer.contract = { salary: Math.floor(soldPlayer.contract.salary*0.8), durationWeeks: 0, endDate: null, releaseClause: 0, agentFee: 0};
    soldPlayer.morale = getRandomInt(40,60);
    if(!gameState.transferMarket) gameState.transferMarket = { players: [] };
    gameState.transferMarket.players.unshift(soldPlayer);

    gameState.fanHappiness = Math.max(0, gameState.fanHappiness - (player.attack+player.defense > 145 ? 7 : 3) + (transferFee > player.price * 1.05 ? 2:0) );
    gameState.boardConfidence = Math.min(100, gameState.boardConfidence + (transferFee > player.price * 1.0 ? 1: -2) );

    if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
}

function handleBuyPlayer(playerId) {
    if (!gameState.transferMarket || !gameState.transferMarket.players) return;
    const playerIndex = gameState.transferMarket.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) { console.warn("Player to buy not found:", playerId); return;}
    const player = gameState.transferMarket.players[playerIndex];

    if (player.scoutedLevel < 3) { if(typeof showMessage === "function") showMessage("Инфо", "Сначала полностью разведайте игрока."); return; }
    if (gameState.userTeam && gameState.userTeam.players && gameState.userTeam.players.length >= MAX_SQUAD_SIZE_TEAM) {
        if(typeof showMessage === "function") showMessage("Инфо", `В команде не может быть больше ${MAX_SQUAD_SIZE_TEAM} игроков!`); return;
    }

    const transferFeeFactor = 1.05 + Math.random() * 0.35 + Math.max(0, (getPlayerPotentialValue(player) - (player.attack+player.defense))/60 );
    const transferFee = Math.floor(player.price * transferFeeFactor);
    const agentFee = Math.floor(transferFee * (0.05 + Math.random()*0.06));
    const totalCost = transferFee + agentFee;

    const desiredSalaryRaw = player.contract.salary * (1.1 + Math.random() * 0.3 + Math.max(0, (getPlayerPotentialValue(player) - 120)/80 ) );
    const desiredSalary = Math.max(player.contract.salary, Math.floor(desiredSalaryRaw / 50) * 50 + 50);
    const desiredDuration = player.age < 24 ? getRandomElement([CONTRACT_LENGTHS_WEEKS.long, CONTRACT_LENGTHS_WEEKS.veryLong]) : getRandomElement([CONTRACT_LENGTHS_WEEKS.medium, CONTRACT_LENGTHS_WEEKS.long]);
    const signingBonus = Math.floor(desiredSalary * (0.5 + Math.random()*2.5));

    if (!confirm(`Купить ${player.name} (${player.position}, ${player.age} лет) за ${transferFee.toLocaleString()}$ (+агентские ${agentFee.toLocaleString()}$)?\nОн требует з/п ~${desiredSalary.toLocaleString()}$ на ${Math.round(desiredDuration/(WEEKS_IN_YEAR/12))} мес. и подписной бонус ${signingBonus.toLocaleString()}$.`)) return;

    if (gameState.budget >= totalCost + signingBonus) {
        gameState.budget -= (totalCost + signingBonus);
        addTransaction(`Покупка ${player.name}`, transferFee, 'expense', 'Трансферы');
        addTransaction(`Агентские за ${player.name}`, agentFee, 'expense', 'Агентские');
        addTransaction(`Подписной бонус ${player.name}`, signingBonus, 'expense', 'Бонусы игрокам');

        const boughtPlayer = gameState.transferMarket.players.splice(playerIndex, 1)[0];
        boughtPlayer.isUserPlayer = true; boughtPlayer.scoutedLevel = 3; boughtPlayer.statsVisible = true;
        boughtPlayer.contract = {
            salary: desiredSalary,
            durationWeeks: desiredDuration,
            endDate: calculateEndDate(gameState.currentWeek, gameState.currentSeason, desiredDuration),
            releaseClause: Math.floor(transferFee * (1.5 + Math.random()*1.8) / 10000) * 10000,
            agentFee: 0,
            signingBonus: signingBonus,
            loyaltyBonus: 0
        };
        boughtPlayer.morale = getRandomInt(65,85);
        boughtPlayer.form = getRandomInt(50,75);

        if (gameState.userTeam && gameState.userTeam.players) gameState.userTeam.players.push(boughtPlayer);
        addNews('playerBought', boughtPlayer.name, gameState.userTeam.name, "Трансферного рынка", transferFee);

        gameState.fanHappiness = Math.min(100, gameState.fanHappiness + (getPlayerPotentialValue(boughtPlayer) > 155 ? 6 : 3) );
        gameState.boardConfidence = Math.min(100, gameState.boardConfidence + (player.age < 25 && getPlayerPotentialValue(boughtPlayer) > 145 ? 4 : 2) );

        if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
    } else { if(typeof showMessage === "function") showMessage("Инфо","Недостаточно средств (учитывая подписной бонус и агентские)!"); }
}

function handleScoutPlayer(playerId, cost) {
    if (!gameState.transferMarket || !gameState.transferMarket.players || !gameState.userTeam || !gameState.userTeam.staff) return;
    const player = gameState.transferMarket.players.find(p => p.id === playerId);
    if (!player || player.scoutedLevel >= 3) return;

    const chiefScout = gameState.userTeam.staff.chiefScout;
    const regularScouts = gameState.userTeam.staff.scouts || [];
    const totalScoutCapacity = (chiefScout ? 1 : 0) + regularScouts.length;

    if ((gameState.userTeam.totalScoutingAssignments || 0) >= totalScoutCapacity) {
        if(typeof showMessage === "function") showMessage("Инфо", "Все скауты заняты."); return;
    }

    if (gameState.budget >= cost) {
        gameState.budget -= cost; addTransaction(`Скаут. отчет по ${player.name}`, cost, 'expense', 'Скаутские расходы');

        let assignedScout = null;
        if(chiefScout && !chiefScout.assignment) {
            assignedScout = chiefScout;
        } else {
            for(let scout of regularScouts) {
                if(scout && !scout.assignment) { assignedScout = scout; break; } // Добавлена проверка scout
            }
        }

        if(assignedScout) {
            assignedScout.assignment = player.id;
            const baseWeeks = 5 - player.scoutedLevel;
            const skillFactor = Math.max(0.5, assignedScout.skillLevel / 60);
            const networkLevel = gameState.userTeam.facilities && gameState.userTeam.facilities.scoutingNetwork ? gameState.userTeam.facilities.scoutingNetwork.level : 0;
            const networkSpeedFactor = FACILITY_LEVELS.scoutingNetwork.effects.scoutingSpeedFactor[networkLevel] || 1.0;
            assignedScout.weeksLeft = Math.max(1, Math.ceil(baseWeeks / skillFactor * networkSpeedFactor));

            gameState.userTeam.totalScoutingAssignments = (gameState.userTeam.totalScoutingAssignments || 0) + 1;
            addNews('generic', `${assignedScout.name} (${assignedScout.role}) начал разведку ${player.name}. Отчет через ${assignedScout.weeksLeft} нед.`);
        } else {
             if(typeof showMessage === "function") showMessage("Ошибка", "Не удалось назначить скаута."); gameState.budget += cost; return;
        }
        if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
    } else { if(typeof showMessage === "function") showMessage("Инфо", `Недостаточно средств для скаутинга (нужно ${cost.toLocaleString()}$).`); }
}

function processScoutingReports() {
    if(!gameState.userTeam || !gameState.userTeam.staff) return;
    const allScouts = [gameState.userTeam.staff.chiefScout, ...(gameState.userTeam.staff.scouts || [])].filter(s => s && s.assignment);
    allScouts.forEach(scout => {
        if (scout.assignment && scout.weeksLeft > 0) {
            scout.weeksLeft--;
            if (scout.weeksLeft <= 0) {
                const player = gameState.transferMarket && gameState.transferMarket.players ? gameState.transferMarket.players.find(p => p.id === scout.assignment) : null;
                if (player) {
                    player.scoutedLevel++;
                    const potentialRating = getPlayerPotentialRating(player);
                    if (player.scoutedLevel >= 3) {
                        player.statsVisible = true;
                        addNews('scoutingReportReady', player.name, `${potentialRating} (полные данные)`, scout.name);
                    } else {
                        addNews('scoutingReportReady', player.name, `${potentialRating} (уровень ${player.scoutedLevel}/3)`, scout.name);
                    }
                }
                scout.assignment = null;
                gameState.userTeam.totalScoutingAssignments = Math.max(0, (gameState.userTeam.totalScoutingAssignments || 0) - 1);
            }
        }
    });
}

function processFacilityUpgrades() {
    if (!gameState || !gameState.userTeam || !gameState.userTeam.facilities) return;
    for (const key in gameState.userTeam.facilities) {
        if (gameState.userTeam.facilities.hasOwnProperty(key)) {
            const facilityState = gameState.userTeam.facilities[key];
            if (facilityState.upgradeInProgress && facilityState.weeksToComplete > 0) {
                facilityState.weeksToComplete--;
                if (facilityState.weeksToComplete === 0) {
                    facilityState.upgradeInProgress = false;
                    // Уровень уже был обновлен в handleUpgradeFacility
                    if (FACILITY_LEVELS[key]) {
                         addNews('facilityUpgradeComplete', FACILITY_LEVELS[key].name, facilityState.level, gameState.userTeam.name);
                    }
                }
            }
        }
    }
}

function handleUpgradeFacility(facilityKey) {
    if (!gameState || !gameState.userTeam || !gameState.userTeam.facilities || !FACILITY_LEVELS[facilityKey]) {
        console.error("handleUpgradeFacility: Необходимые данные отсутствуют.");
        return;
    }
    const facilityState = gameState.userTeam.facilities[facilityKey];
    const facilityData = FACILITY_LEVELS[facilityKey];

    if (facilityState.upgradeInProgress) {
        if (typeof showMessage === "function") showMessage("Инфо", `${facilityData.name} уже улучшается.`);
        return;
    }
    if (facilityState.level >= facilityData.maxLevel) {
        if (typeof showMessage === "function") showMessage("Инфо", `${facilityData.name} уже максимального уровня.`);
        return;
    }

    const nextLevel = facilityState.level + 1;
    const cost = facilityData.costs[nextLevel];
    const time = facilityData.upgradeTimeWeeks[nextLevel];

    if (gameState.budget < cost) {
        if (typeof showMessage === "function") showMessage("Инфо", `Недостаточно средств для улучшения ${facilityData.name} (нужно ${cost.toLocaleString()}$).`);
        return;
    }

    if (confirm(`Улучшить ${facilityData.name} до уровня ${nextLevel} за ${cost.toLocaleString()}$? Время улучшения: ${time} нед.`)) {
        gameState.budget -= cost;
        addTransaction(`Улучшение: ${facilityData.name} (Ур.${nextLevel})`, cost, 'expense', 'Инфраструктура');

        facilityState.upgradeInProgress = true;
        facilityState.weeksToComplete = time;
        facilityState.level = nextLevel; // Обновляем уровень сразу

        addNews('facilityUpgradeStarted', facilityData.name, nextLevel, gameState.userTeam.name);
        if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
    }
}

function handlePromoteYouthPlayer(playerId) {
    if (!gameState.userTeam || !gameState.userTeam.youthAcademy || !gameState.userTeam.youthAcademy.players) return;
    const playerIndex = gameState.userTeam.youthAcademy.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;

    if (gameState.userTeam.players.length >= MAX_SQUAD_SIZE_TEAM) {
        if (typeof showMessage === "function") showMessage("Инфо", `В основной команде нет места (макс. ${MAX_SQUAD_SIZE_TEAM} игроков).`);
        return;
    }
    const player = gameState.userTeam.youthAcademy.players.splice(playerIndex, 1)[0];
    player.isYouth = false;
    player.isUserPlayer = true;
    player.statsVisible = true;
    player.scoutedLevel = 3;
    player.contract.salary = Math.max(100, Math.floor((getPlayerPotentialValue(player) * 10 + player.age * 20) / 50) * 50);
    player.contract.durationWeeks = player.age < 19 ? CONTRACT_LENGTHS_WEEKS.long : CONTRACT_LENGTHS_WEEKS.medium;
    player.contract.endDate = calculateEndDate(gameState.currentWeek, gameState.currentSeason, player.contract.durationWeeks);
    player.price = Math.max(1000, Math.floor(getPlayerPotentialValue(player) * getRandomInt(200, 400) * (1 - (player.age - 16)*0.05) ));

    gameState.userTeam.players.push(player);
    addNews('youthPlayerPromoted', player.name, gameState.userTeam.name);
    if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
}

function handleHireCoach(coachId) {
    if (!gameState.availableCoaches || !gameState.userTeam) return;
    const coachIndex = gameState.availableCoaches.findIndex(c => c.id.toString() === coachId.toString());
    if (coachIndex === -1) return;

    const newCoach = gameState.availableCoaches[coachIndex];

    if (gameState.userTeam.coach) {
        if (!confirm(`Вы уверены, что хотите заменить текущего тренера ${gameState.userTeam.coach.name} на ${newCoach.name}? Текущий тренер будет уволен.`)) return;
        handleFireCoach(false);
    }

    gameState.userTeam.coach = gameState.availableCoaches.splice(coachIndex, 1)[0];
    addNews('newCoach', gameState.userTeam.coach.name, gameState.userTeam.name, gameState.userTeam.coach.specKey);
    populateAvailableCoaches(1);
    if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
}

function handleFireCoach(confirmAction = true) {
    if (!gameState.userTeam || !gameState.userTeam.coach) return;
    const coach = gameState.userTeam.coach;
    if (confirmAction && !confirm(`Уволить тренера ${coach.name}?`)) return;

    addNews('firedCoach', coach.name, gameState.userTeam.name);
    const severancePay = coach.salary * getRandomInt(2,6);
    gameState.budget -= severancePay;
    addTransaction(`Неустойка тренеру ${coach.name}`, severancePay, 'expense', 'Персонал');

    coach.reputation = Math.max(10, coach.reputation - 10);
    gameState.availableCoaches.unshift(coach);
    gameState.userTeam.coach = null;

    gameState.boardConfidence = Math.max(0, gameState.boardConfidence - 10);
    if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
}

function handleHireStaff(staffIdStr, roleKey) {
    if (!gameState.availableStaff || !gameState.availableStaff[roleKey] || !gameState.userTeam || !gameState.userTeam.staff) return;

    const staffIndex = gameState.availableStaff[roleKey].findIndex(s => s.id.toString() === staffIdStr.toString());
    if (staffIndex === -1) return;

    const newStaff = gameState.availableStaff[roleKey][staffIndex];
    const roleDetails = STAFF_ROLES[roleKey];

    const currentStaffForRole = gameState.userTeam.staff[roleKey];
    if (Array.isArray(currentStaffForRole)) {
        if (currentStaffForRole.length >= roleDetails.maxCount) {
            if (typeof showMessage === "function") showMessage("Инфо", `Достигнуто максимальное количество (${roleDetails.maxCount}) для роли ${roleDetails.name}.`);
            return;
        }
    } else {
        if (currentStaffForRole && roleDetails.maxCount === 1) {
            if (typeof showMessage === "function") showMessage("Инфо", `Роль ${roleDetails.name} уже занята. Сначала увольте текущего сотрудника.`);
            return;
        }
    }

    const hiredStaffMember = gameState.availableStaff[roleKey].splice(staffIndex, 1)[0];
    if (Array.isArray(gameState.userTeam.staff[roleKey])) {
        gameState.userTeam.staff[roleKey].push(hiredStaffMember);
    } else {
        gameState.userTeam.staff[roleKey] = hiredStaffMember;
    }

    addNews('staffHired', newStaff.name, roleDetails.name, gameState.userTeam.name);
    populateAvailableStaff(1, roleKey);
    if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
}

function handleFireStaff(staffIdStr, roleKey) {
    if (!gameState.userTeam || !gameState.userTeam.staff) return;

    const roleDetails = STAFF_ROLES[roleKey];
    let staffMember = null;
    let staffArrayIndex = -1;

    if (Array.isArray(gameState.userTeam.staff[roleKey])) {
        staffArrayIndex = gameState.userTeam.staff[roleKey].findIndex(s => s.id.toString() === staffIdStr.toString());
        if (staffArrayIndex !== -1) {
            staffMember = gameState.userTeam.staff[roleKey][staffArrayIndex];
        }
    } else {
        if (gameState.userTeam.staff[roleKey] && gameState.userTeam.staff[roleKey].id.toString() === staffIdStr.toString()) {
            staffMember = gameState.userTeam.staff[roleKey];
        }
    }

    if (!staffMember) { console.warn("Staff to fire not found:", staffIdStr, roleKey); return; }
    if (!confirm(`Уволить ${staffMember.name} (${roleDetails.name})?`)) return;

    const severancePay = staffMember.salary * getRandomInt(1,3);
    gameState.budget -= severancePay;
    addTransaction(`Неустойка персоналу: ${staffMember.name}`, severancePay, 'expense', 'Персонал');

    addNews('staffFired', staffMember.name, roleDetails.name, gameState.userTeam.name);
    if (!gameState.availableStaff[roleKey]) gameState.availableStaff[roleKey] = [];
    gameState.availableStaff[roleKey].unshift(staffMember);

    if (Array.isArray(gameState.userTeam.staff[roleKey])) {
        gameState.userTeam.staff[roleKey].splice(staffArrayIndex, 1);
    } else {
        gameState.userTeam.staff[roleKey] = null;
    }
    gameState.boardConfidence = Math.max(0, gameState.boardConfidence - 3);
    if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
}


function handleFindNewSponsor() {
    if (!gameState.userTeam) return;

    const availableSponsorTypes = Object.keys(SPONSOR_TYPES).filter(typeKey => {
        const currentSponsorsOfType = gameState.userTeam.sponsors.filter(s => s.type === typeKey).length;
        const maxAllowed = MAX_SPONSORS_PER_TYPE[typeKey] || 1;
        const typeData = SPONSOR_TYPES[typeKey];
        if (currentSponsorsOfType >= maxAllowed) return false;
        if (typeData.requiredReputation && gameState.userTeam.reputation < typeData.requiredReputation) return false;
        if (typeData.requiresFacilityLevel) {
            for (const facKey in typeData.requiresFacilityLevel) {
                if (!gameState.userTeam.facilities[facKey] || gameState.userTeam.facilities[facKey].level < typeData.requiresFacilityLevel[facKey]) return false;
            }
        }
        return true;
    });

    if (availableSponsorTypes.length === 0) {
        if (typeof showMessage === "function") showMessage("Спонсоры", "Нет доступных типов спонсоров или не выполнены условия.");
        return;
    }

    const randomTypeKey = getRandomElement(availableSponsorTypes);
    const sponsorData = SPONSOR_TYPES[randomTypeKey];
    const baseIncome = getRandomInt(sponsorData.baseIncomePerWeek[0], sponsorData.baseIncomePerWeek[1]);
    const reputationBonus = Math.floor(gameState.userTeam.reputation / 10) * (baseIncome * 0.02);
    const commercialBonus = gameState.userTeam.facilities.commercialDepartment ? FACILITY_LEVELS.commercialDepartment.effects.sponsorIncomeMultiplier[gameState.userTeam.facilities.commercialDepartment.level] : 1.0;

    const weeklyIncome = Math.floor((baseIncome + reputationBonus) * commercialBonus / 50) * 50;
    const actualDuration = getRandomInt(sponsorData.durationWeeks[0], sponsorData.durationWeeks[1]);
    const sponsorName = `${sponsorData.name} #${getRandomInt(100,999)}`;

    if (confirm(`Предложение от спонсора "${sponsorName}" (${randomTypeKey}):\nДоход: ${weeklyIncome.toLocaleString()}$/нед.\nСрок: ${actualDuration} нед.\nПринять?`)) {
        gameState.userTeam.sponsors.push({
            id: getNextStaffId(),
            name: sponsorName,
            type: randomTypeKey,
            weeklyIncome: weeklyIncome,
            durationWeeks: actualDuration,
            weeksLeft: actualDuration
        });
        addNews('newSponsor', sponsorName, weeklyIncome, actualDuration, gameState.userTeam.name);
        if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
    }
}

// --- Еженедельные процессы ---
function playNextWeek() {
    if (!gameState.gameInitialized) {
        console.warn("Игра не инициализирована, playNextWeek отменен.");
        return;
    }

    if (gameState.internationalBreakActive) {
        addNews('generic', "Международный перерыв! Матчи клубов отложены.");
        if (gameState.userTeam && gameState.userTeam.players) {
            gameState.userTeam.players.forEach(p => {
                if (p.internationalDuty) {
                    p.form = Math.max(10, p.form - getRandomInt(8, 20));
                    if (Math.random() < 0.05) {
                        const statToImprove = Math.random() < 0.5 ? 'attack' : 'defense';
                        p[statToImprove] = Math.min(99, p[statToImprove] + 1);
                    }
                     if (Math.random() < 0.02) {
                        const injuryDuration = getRandomInt(1, 4);
                        p.status = { type: 'injured', duration: injuryDuration, affectedStat: null };
                        addNews('playerInjured', p.name, injuryDuration, p.isUserPlayer ? gameState.userTeam.name : "сборной", "в расположении сборной");
                    }
                }
            });
        }
    } else {
        const userMatchForCurrentWeek = gameState.schedule ? gameState.schedule.find(m => m.week === gameState.currentWeek && m.isUserMatch && !m.played) : null;
        if (userMatchForCurrentWeek) {
            if(typeof showMessage === "function") showMessage("Внимание!", "Вы должны сыграть свой матч(и) на этой неделе!");
            if(typeof showScreen === "function") showScreen('fixtures'); return;
        }
        if (gameState.schedule) {
            gameState.schedule.forEach(match => {
                if (match.week === gameState.currentWeek && !match.played && !match.isUserMatch && typeof simulateCPUMatch === "function") { // simulateCPUMatch из game_logic_match_sim.js
                    simulateCPUMatch(match);
                }
            });
        }
    }

    processTraining();
    developYouthPlayers();
    processYouthIntake();
    processFacilityUpgrades();
    processSponsors();
    processScoutingReports();
    processLoanedPlayers();
    processWeeklyPlayerUpdates();
    processWeeklyFinancials();
    updateInternationalDuty();
    if (!gameState.internationalBreakActive) processCupProgression();

    if(gameState.pressConferenceCooldown > 0) gameState.pressConferenceCooldown--;
    if(gameState.teamMeetingCooldown > 0) gameState.teamMeetingCooldown--;

    if (gameState.currentWeek >= gameState.seasonLength && !gameState.internationalBreakActive) {
        endCurrentSeason();
    } else {
        gameState.currentWeek++;
    }
    updateMarketAndStaffAvailability();
    if(gameState.settings && gameState.settings.autoSave && gameState.currentWeek > 1 && gameState.currentWeek % 4 === 1 && typeof saveGame === "function") saveGame();

    if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
    if(typeof showScreen === "function") showScreen('news');
}

function processCupProgression() {
    if (!gameState.schedule || !gameState.userTeam) return;

    const activeCupObjects = [];
    if (gameState.userTeam.activeNationalCup && gameState.userTeam.activeNationalCup.currentRoundIndex !== -1) {
        activeCupObjects.push({ state: gameState.userTeam.activeNationalCup, key: gameState.userTeam.activeNationalCup.name, data: CUP_COMPETITIONS[gameState.userTeam.activeNationalCup.name], isUserInvolved: true });
    }
    gameState.cpuTeams.forEach(team => {
        if (team.activeNationalCup && team.activeNationalCup.currentRoundIndex !== -1) {
            if (!activeCupObjects.find(co => co.key === team.activeNationalCup.name && co.state.currentRoundIndex === team.activeNationalCup.currentRoundIndex )) {
                 activeCupObjects.push({ state: team.activeNationalCup, key: team.activeNationalCup.name, data: CUP_COMPETITIONS[team.activeNationalCup.name], isUserInvolved: false, teamScope: team.name });
            }
        }
    });

    activeCupObjects.forEach(cupInfo => {
        const cupState = cupInfo.state;
        const cupKey = cupInfo.key;
        const cupData = cupInfo.data;

        if (!cupData || cupState.currentRoundIndex === -1) return;

        const currentRoundName = cupData.rounds[cupState.currentRoundIndex];
        const allMatchesInThisEntireRound = gameState.schedule.filter(m =>
            m.competition === cupData.shortName &&
            m.round === currentRoundName &&
            m.cupData && m.cupData.cupKey === cupKey && m.cupData.roundIndex === cupState.currentRoundIndex
        );

        if (allMatchesInThisEntireRound.length === 0 && cupState.participatingTeams && cupState.participatingTeams.length === 1) {
            addNews('cupWinner', cupState.participatingTeams[0], cupData.name);
             if (cupState.participatingTeams[0] === gameState.userTeam.name && cupData.winnerBonus) {
                gameState.budget += cupData.winnerBonus;
                addTransaction(`Победа в ${cupData.name}`, cupData.winnerBonus, 'income', 'Призовые');
            }
            cupState.currentRoundIndex = -1;
             gameState.cpuTeams.forEach(cpu => {
                if(cpu.activeNationalCup && cpu.activeNationalCup.name === cupKey) cpu.activeNationalCup.currentRoundIndex = -1;
            });
            return;
        }

        const allEntireRoundPlayed = allMatchesInThisEntireRound.length > 0 && allMatchesInThisEntireRound.every(m => m.played);

        if (allEntireRoundPlayed) {
            const winners = [];
            allMatchesInThisEntireRound.forEach(match => {
                let winner;
                if (match.homeScore > match.awayScore) winner = match.homeTeam;
                else if (match.awayScore > match.homeScore) winner = match.awayTeam;
                else {
                    const homeTeamRef = getTeamReference(match.homeTeam);
                    const awayTeamRef = getTeamReference(match.awayTeam);
                    winner = (homeTeamRef?.reputation || 0) >= (awayTeamRef?.reputation || 0) ? match.homeTeam : match.awayTeam;
                    addNews('generic', `В матче ${cupData.shortName} ${match.homeTeam} - ${match.awayTeam} ничья. Победитель (${winner}) определен по доп. показателям.`);
                }
                winners.push(winner);
                if (match.isUserMatch && winner === gameState.userTeam.name && match.cupData.prize > 0) {
                    gameState.budget += match.cupData.prize;
                    addTransaction(`Призовые за ${match.round} (${cupData.name})`, match.cupData.prize, 'income', 'Призовые');
                }
            });

            const teamsThatWereInRound = new Set(cupState.participatingTeams);
            const teamsThatActuallyPlayed = new Set();
            allMatchesInThisEntireRound.forEach(m => { teamsThatActuallyPlayed.add(m.homeTeam); teamsThatActuallyPlayed.add(m.awayTeam); });

            teamsThatWereInRound.forEach(teamName => {
                if (!teamsThatActuallyPlayed.has(teamName) && !winners.includes(teamName)) {
                    winners.push(teamName);
                }
            });
            if(cupState.nextRoundByes && cupState.nextRoundByes.length > 0){
                winners.push(...cupState.nextRoundByes);
                cupState.nextRoundByes = [];
            }

            const uniqueWinners = [...new Set(winners)];
            cupState.participatingTeams = uniqueWinners;

            if (uniqueWinners.length > 0 && cupState.currentRoundIndex < cupData.rounds.length - 1) {
                addNews('generic', `Завершился раунд ${currentRoundName} в ${cupData.name}. В следующий раунд проходят: ${uniqueWinners.join(', ')}.`);
                generateCupRound(uniqueWinners, cupState.currentRoundIndex + 1, cupInfo.isUserInvolved ? cupState : null, cupData, cupKey);
            } else if (uniqueWinners.length === 1 && cupState.currentRoundIndex === cupData.rounds.length - 1) {
                // Финал, победитель определен (новость и призовые уже в generateCupRound, когда roundIndex выходит за пределы)
            } else if (uniqueWinners.length === 0 && allMatchesInThisEntireRound.length > 0) {
                console.warn("Все команды вылетели из кубка после раунда", currentRoundName);
                cupState.currentRoundIndex = -1;
            }
            gameState.cpuTeams.forEach(cpu => {
                if(cpu.activeNationalCup && cpu.activeNationalCup.name === cupKey) {
                    cpu.activeNationalCup.participatingTeams = [...uniqueWinners];
                    cpu.activeNationalCup.currentRoundIndex = cupState.currentRoundIndex;
                    if(cpu.activeNationalCup.nextRoundByes) cpu.activeNationalCup.nextRoundByes = [];
                }
            });
        }
    });
}

function processTraining() {
    if (!gameState.userTeam || !gameState.userTeam.players) return;

    const baseEffectiveness = 0.5;
    const coachBonus = gameState.userTeam.coach ? gameState.userTeam.coach.trainingBonus : 0;
    const facility = gameState.userTeam.facilities.trainingGround;
    const facilityBonus = facility && FACILITY_LEVELS.trainingGround ? FACILITY_LEVELS.trainingGround.effects.trainingEffectivenessBonus[facility.level] : 0;
    const assistantBonus = (gameState.userTeam.staff && gameState.userTeam.staff.assistantCoach && STAFF_ROLES.assistantCoach) ? STAFF_ROLES.assistantCoach.skillEffectiveness.trainingBoost * gameState.userTeam.staff.assistantCoach.skillLevel / 100 : 0;
    const totalEffectivenessMultiplier = baseEffectiveness + coachBonus + facilityBonus + assistantBonus;

    gameState.userTeam.players.forEach(player => {
        player.teamTrainingEffect = { attack: 0, defense: 0, cohesion: 0 };
        if (player.trainingFocus && player.status && player.status.type === 'fit' && !player.internationalDuty && !player.onLoan) {
            const focus = player.trainingFocus;
            let improvementChance = 0.35 * totalEffectivenessMultiplier;
            let maxImprovement = 1;

            if (focus.intensity === 'high') { improvementChance *= 1.6; maxImprovement = 2;}
            else if (focus.intensity === 'low') {improvementChance *= 0.6; maxImprovement = 1;}

            improvementChance *= Math.max(0.1, 1 - (player.age - 17) * 0.03);
            improvementChance = Math.max(0.03, Math.min(0.9, improvementChance));

            if (Math.random() < improvementChance) {
                const actualImprovement = getRandomInt(1, maxImprovement);
                if (focus.stat === 'attack' && player.attack < 99) {
                    player.attack = Math.min(99, player.attack + actualImprovement);
                    addNews('trainingComplete', player.name, 'Атака', actualImprovement);
                } else if (focus.stat === 'defense' && player.defense < 99) {
                    player.defense = Math.min(99, player.defense + actualImprovement);
                    addNews('trainingComplete', player.name, 'Защита', actualImprovement);
                } else if (focus.stat === 'stamina' && player.form < 98) {
                    player.form = Math.min(98, player.form + actualImprovement * 3);
                     addNews('trainingComplete', player.name, 'Форма', actualImprovement*3);
                }
                const baseInjuryRisk = PLAYER_TRAINING_INJURY_CHANCE * (focus.intensity === 'high' ? 2.5 : (focus.intensity === 'medium' ? 1.2 : 0.6));
                const injuryRiskReductionFacility = (facility && FACILITY_LEVELS.trainingGround) ? FACILITY_LEVELS.trainingGround.effects.injuryRiskReduction[facility.level] : 0;
                const injuryRiskReductionPhysio = ((gameState.userTeam.staff && gameState.userTeam.staff.physio && STAFF_ROLES.physio) ? STAFF_ROLES.physio.skillEffectiveness.injuryPrevention * gameState.userTeam.staff.physio.skillLevel / 150 : 0);
                const finalInjuryRisk = Math.max(0.0005, baseInjuryRisk * (1 - (injuryRiskReductionFacility + injuryRiskReductionPhysio)) * (player.injuryProneness / 40));

                if (Math.random() < finalInjuryRisk) {
                    const injuryDuration = getRandomInt(1, 2);
                    player.status = { type: 'injured', duration: injuryDuration, affectedStat: null };
                    player.trainingFocus = null;
                    gameState.userTeam.trainingSlotsUsed = Math.max(0, (gameState.userTeam.trainingSlotsUsed || 0) -1);
                    addNews('playerTrainingInjury', player.name, injuryDuration, gameState.userTeam.name);
                }
            }
        }
        if (gameState.userTeam.teamTrainingFocus !== 'none' && player.status && player.status.type === 'fit' && !player.internationalDuty && !player.onLoan) {
            const teamFocus = gameState.userTeam.teamTrainingFocus;
            let effect = { attack: 0, defense: 0, cohesion: 0 };
            const baseCohesionGain = (0.6 + totalEffectivenessMultiplier * 0.25) * ((player.consistency || 50) / 100);

            if (teamFocus === 'attack_cohesion') {
                effect.attack = Math.random() < 0.15 ? 1 : 0;
                effect.cohesion = baseCohesionGain * (player.position === 'НАП' ? 1.3 : (player.position === 'ПЗЩ' ? 1.1 : 0.7));
            } else if (teamFocus === 'defense_cohesion') {
                effect.defense = Math.random() < 0.15 ? 1 : 0;
                effect.cohesion = baseCohesionGain * (player.position === 'ЗАЩ' || player.position === 'ВРТ' ? 1.3 : (player.position === 'ПЗЩ' ? 1.1 : 0.7));
            } else if (teamFocus === 'set_pieces') {
                effect.cohesion = baseCohesionGain * 0.6;
            } else if (teamFocus === 'fitness_recovery') {
                player.form = Math.min(100, player.form + getRandomInt(3, 7));
            } else if (teamFocus === 'morale_boost') {
                player.morale = Math.min(100, player.morale + getRandomInt(2, 5));
                effect.cohesion = baseCohesionGain * 0.4;
            }
            player.teamTrainingEffect = effect;
        }
    });
}

function developYouthPlayers() {
    if (!gameState.userTeam || !gameState.userTeam.youthAcademy || !gameState.userTeam.youthAcademy.players) return;
    const facility = gameState.userTeam.facilities.youthAcademyFacility;
    const facilityBonus = facility && FACILITY_LEVELS.youthAcademyFacility ? FACILITY_LEVELS.youthAcademyFacility.effects.youthPlayerDevelopmentRate[facility.level] : 0;
    const youthCoach = gameState.userTeam.staff.youthCoach;
    const coachBonus = youthCoach && STAFF_ROLES.youthCoach ? STAFF_ROLES.youthCoach.skillEffectiveness.youthDevelopmentRate * youthCoach.skillLevel / 100 : 0;
    const mainCoachBonus = gameState.userTeam.coach?.youthFocus || 0;
    const totalDevRate = 0.12 + facilityBonus + coachBonus + mainCoachBonus;

    gameState.userTeam.youthAcademy.players.forEach(player => {
        if (player.age < 20) {
            const potentialLeft = getPlayerPotentialValue(player) - (player.attack + player.defense);
            if (potentialLeft > 0) {
                let improvementPoints = 0;
                if (Math.random() < totalDevRate * (21 - player.age) * 0.12) {
                    improvementPoints = getRandomInt(1, 3);
                }

                for (let i = 0; i < improvementPoints; i++) {
                    if (player.attack + player.defense >= getPlayerPotentialValue(player)) break;
                    const improvingAttack = Math.random() < (player.position === 'НАП' ? 0.7 : (player.position === 'ПЗЩ' ? 0.5 : 0.3));
                    if (improvingAttack && player.attack < 99) player.attack++;
                    else if (player.defense < 99) player.defense++;
                    else if (player.attack < 99) player.attack++;
                }
            }
        }
    });
}

function processYouthIntake() {
    if (!gameState.userTeam || !gameState.userTeam.youthAcademy) return;
    if (YOUTH_INTAKE_WEEKS.includes(gameState.currentWeek)) {
        const facility = gameState.userTeam.facilities.youthAcademyFacility;
        const qualityBonus = facility && FACILITY_LEVELS.youthAcademyFacility ? FACILITY_LEVELS.youthAcademyFacility.effects.newIntakeQualityBonus[facility.level] : 0;
        const youthCoach = gameState.userTeam.staff.youthCoach;
        const coachDiscoveryBonus = youthCoach && STAFF_ROLES.youthCoach ? STAFF_ROLES.youthCoach.skillEffectiveness.potentialDiscovery * youthCoach.skillLevel / 8 : 0;

        const numNewPlayers = getRandomInt(YOUTH_INTAKE_MIN_PLAYERS, YOUTH_INTAKE_MAX_PLAYERS);
        let newPlayersAdded = 0;
        for (let i = 0; i < numNewPlayers; i++) {
            const maxAcademySize = YOUTH_ACADEMY_MAX_PLAYERS + (facility && FACILITY_LEVELS.youthAcademyFacility ? FACILITY_LEVELS.youthAcademyFacility.effects.maxYouthPlayersBonus[facility.level] : 0);
            if (gameState.userTeam.youthAcademy.players.length >= maxAcademySize) break;

            const age = getRandomInt(15, 17);
            const baseStat = 25 + qualityBonus + coachDiscoveryBonus;
            const player = createPlayer({
                isYouth: true, age: age,
                baseAttack: getRandomInt(Math.max(15, baseStat - 15), baseStat + 20),
                baseDefense: getRandomInt(Math.max(15, baseStat - 15), baseStat + 20),
                potentialValue: getRandomInt(110 + qualityBonus + coachDiscoveryBonus, 170 + qualityBonus * 2.5 + coachDiscoveryBonus * 2)
            });
            gameState.userTeam.youthAcademy.players.push(player);
            newPlayersAdded++;
        }
        if (newPlayersAdded > 0) {
            addNews('newYouthIntake', newPlayersAdded, gameState.userTeam.name);
        }
        const currentIntakeIndex = YOUTH_INTAKE_WEEKS.indexOf(gameState.currentWeek);
        if (currentIntakeIndex !== -1 && currentIntakeIndex < YOUTH_INTAKE_WEEKS.length - 1) {
            gameState.userTeam.youthAcademy.nextIntakeWeek = YOUTH_INTAKE_WEEKS[currentIntakeIndex + 1];
        } else {
            gameState.userTeam.youthAcademy.nextIntakeWeek = YOUTH_INTAKE_WEEKS[0];
        }
    }
}
function processSponsors() {
    if (!gameState.userTeam || !gameState.userTeam.sponsors) return;
    let totalSponsorIncomeThisWeek = 0;
    gameState.userTeam.sponsors.forEach(sponsor => {
        if (sponsor.weeksLeft > 0) {
            totalSponsorIncomeThisWeek += sponsor.weeklyIncome;
            sponsor.weeksLeft--;
             if(sponsor.weeksLeft === 0) addNews('generic', `Спонсорский контракт с "${sponsor.name}" завершен.`);
        }
    });
    gameState.userTeam.sponsors = gameState.userTeam.sponsors.filter(s => s.weeksLeft > 0);

    if (totalSponsorIncomeThisWeek > 0) {
        gameState.budget += totalSponsorIncomeThisWeek;
    }
    if(gameState.userTeam) gameState.userTeam.weeklyIncome = (gameState.userTeam.weeklyIncome || 0) + totalSponsorIncomeThisWeek;
}

function processLoanedPlayers() {
    if (!gameState.userTeam || !gameState.userTeam.players) return;
    const playersToReturn = [];
    gameState.userTeam.players.forEach(player => {
        if (player.onLoan) {
            player.onLoan.weeksLeft--;
            if (player.onLoan.weeksLeft <= 0) {
                addNews('playerReturnedFromLoan', player.name, player.onLoan.teamName, gameState.userTeam.name);
                playersToReturn.push(player);
            } else {
                if (player.age < 24 && Math.random() < 0.035) {
                    const stat = Math.random() < 0.5 ? 'attack' : 'defense';
                    player[stat] = Math.min(99, player[stat] + 1);
                }
            }
        }
    });
    playersToReturn.forEach(player => player.onLoan = null);
}

function processWeeklyPlayerUpdates() {
    if (!gameState.userTeam || !gameState.userTeam.players) return;
    const playersToRemove = [];

    gameState.userTeam.players.forEach(player => {
        if (!player.playedInMatch && player.trainingFocus?.stat !== 'stamina') {
            player.form = Math.min(100, player.form + getRandomInt(2, 5));
        }
        if (Math.random() < 0.15) player.morale = Math.min(100, player.morale + getRandomInt(0, 2));
        else if (Math.random() < 0.08) player.morale = Math.max(0, player.morale - getRandomInt(0, 2));

        if (gameState.currentWeek === 1 && player.age > 0) {
            player.age++;
            if (player.age > 29) {
                const declineChance = (player.age - 29) * 0.03;
                if (Math.random() < declineChance) player.attack = Math.max(10, player.attack - 1);
                if (Math.random() < declineChance) player.defense = Math.max(10, player.defense - 1);
            }
        }

        const weeksLeft = getWeeksLeftInContract(player);
        if (weeksLeft <= 0 && player.contract.endDate !== null && !player.isYouth) {
            addNews('playerLeftOnFree', player.name, gameState.userTeam.name);
            playersToRemove.push(player.id);
             if (gameState.userTeam.startingXI.includes(player.id)) {
                gameState.userTeam.startingXI[gameState.userTeam.startingXI.indexOf(player.id)] = null;
            }
        } else if (weeksLeft > 0 && weeksLeft <= 4 && !player.isYouth && (gameState.currentWeek % 2 === 1) ) {
            addNews('contractExpiringSoon', player.name, weeksLeft);
        }

        if (player.status && (player.status.type === 'injured' || player.status.type === 'suspended')) {
            player.status.duration--;
            if (player.status.duration <= 0) {
                if (player.status.type === 'injured') addNews('playerRecovered', player.name, gameState.userTeam.name);
                else addNews('playerSuspensionOver', player.name, gameState.userTeam.name);
                player.status = { type: 'fit', duration: 0 };
            }
        }
        player.playedInMatch = false;
    });

    if (playersToRemove.length > 0) {
        gameState.userTeam.players = gameState.userTeam.players.filter(p => !playersToRemove.includes(p.id));
        autoFillLineup();
    }

    let totalMorale = 0;
    const activePlayers = gameState.userTeam.players.filter(p => p.status && p.status.type === 'fit' && !p.onLoan && !p.internationalDuty);
    if (activePlayers.length > 0) {
        activePlayers.forEach(p => totalMorale += p.morale);
        const avgMorale = totalMorale / activePlayers.length;
        const targetAtmosphere = Math.max(20, Math.min(90, Math.floor(avgMorale * 0.8 + gameState.boardConfidence * 0.1 + gameState.fanHappiness * 0.1)));
        if (targetAtmosphere > (gameState.userTeam.teamAtmosphere || 65) + 2) gameState.userTeam.teamAtmosphere = Math.min(100, (gameState.userTeam.teamAtmosphere || 65) + getRandomInt(1,2));
        else if (targetAtmosphere < (gameState.userTeam.teamAtmosphere || 65) - 2) gameState.userTeam.teamAtmosphere = Math.max(0, (gameState.userTeam.teamAtmosphere || 65) - getRandomInt(1,2));
    }
}

function processWeeklyFinancials() {
    if (!gameState.userTeam || typeof gameState.budget !== 'number') return;
    let weeklyExpensesTotal = 0;
    let weeklyIncomesTotal = 0;

    const expenseBreakdown = {};
    const incomeBreakdown = {};

    let playerSalaries = 0;
    gameState.userTeam.players.forEach(p => playerSalaries += p.contract.salary);
    weeklyExpensesTotal += playerSalaries;
    expenseBreakdown["Зарплаты игроков"] = (expenseBreakdown["Зарплаты игроков"] || 0) + playerSalaries;

    let staffSalaries = 0;
    if (gameState.userTeam.coach) staffSalaries += gameState.userTeam.coach.salary;
    for (const roleKey in gameState.userTeam.staff) {
        const staffItem = gameState.userTeam.staff[roleKey];
        if (staffItem) {
            if (Array.isArray(staffItem)) staffItem.forEach(s => { if(s) staffSalaries += s.salary;});
            else if(staffItem.salary) staffSalaries += staffItem.salary;
        }
    }
    weeklyExpensesTotal += staffSalaries;
    expenseBreakdown["Зарплаты персонала"] = (expenseBreakdown["Зарплаты персонала"] || 0) + staffSalaries;

    let facilityMaintenance = 0;
    for (const key in gameState.userTeam.facilities) {
        const facility = gameState.userTeam.facilities[key];
        if (facility.level > 0 && FACILITY_LEVELS[key] && FACILITY_LEVELS[key].costs[facility.level]) {
            facilityMaintenance += Math.floor(FACILITY_LEVELS[key].costs[facility.level] * 0.0015);
        }
    }
    weeklyExpensesTotal += facilityMaintenance;
    expenseBreakdown["Содержание базы"] = (expenseBreakdown["Содержание базы"] || 0) + facilityMaintenance;

    const homeMatchThisWeek = gameState.schedule.find(m => m.week === gameState.currentWeek && m.homeTeam === gameState.userTeam.name && m.played);
    if (homeMatchThisWeek && gameState.userTeam.facilities.stadium && FACILITY_LEVELS.stadium) {
        const stadium = gameState.userTeam.facilities.stadium;
        let matchdayIncome = FACILITY_LEVELS.stadium.effects.incomePerMatchTicketBase[stadium.level] || 0;
        matchdayIncome *= (1 + (gameState.fanHappiness - 50) / 100 * 0.25);
        matchdayIncome *= FACILITY_LEVELS.stadium.effects.matchdayRevenueMultiplier[stadium.level] || 1.0;
        matchdayIncome = Math.floor(matchdayIncome);
        gameState.budget += matchdayIncome; // Доход от матча зачисляется сразу
        weeklyIncomesTotal += matchdayIncome;
        incomeBreakdown["Доходы от матчей"] = (incomeBreakdown["Доходы от матчей"] || 0) + matchdayIncome;
        addTransaction("Доход от домашнего матча", matchdayIncome, 'income', 'Доходы от матчей');
    }
    gameState.userTeam.sponsors.forEach(s => {
        if(s.weeksLeft >= 0) { // Доход от спонсоров уже зачислен в processSponsors
            incomeBreakdown["Спонсоры"] = (incomeBreakdown["Спонсоры"] || 0) + s.weeklyIncome;
            weeklyIncomesTotal += s.weeklyIncome;
        }
    });
    if (gameState.userTeam.facilities.commercialDepartment && FACILITY_LEVELS.commercialDepartment) {
        const merchIncome = FACILITY_LEVELS.commercialDepartment.effects.merchandiseSalesBase[gameState.userTeam.facilities.commercialDepartment.level] || 0;
        if (merchIncome > 0) {
            gameState.budget += merchIncome;
            weeklyIncomesTotal += merchIncome;
            incomeBreakdown["Продажа атрибутики"] = (incomeBreakdown["Продажа атрибутики"] || 0) + merchIncome;
            addTransaction("Доход от продажи атрибутики", merchIncome, 'income', 'Коммерция');
        }
    }

    gameState.budget -= weeklyExpensesTotal;

    gameState.userTeam.weeklyExpense = weeklyExpensesTotal;
    gameState.userTeam.weeklyIncome = weeklyIncomesTotal;
    gameState.lastTransactionsBreakdown = { income: incomeBreakdown, expense: expenseBreakdown, week: gameState.currentWeek, season: gameState.currentSeason };

    if (weeklyExpensesTotal > 0) addTransaction("Еженедельные расходы (ЗП, содержание)", weeklyExpensesTotal, 'expense', "Операционные расходы");

    if (gameState.budget < 0 && Math.abs(gameState.budget) > STARTING_BUDGET * 0.25) {
        gameState.boardConfidence = Math.max(0, gameState.boardConfidence - 7);
        addNews('boardConfidenceChange', `Серьезные финансовые проблемы! Бюджет: ${gameState.budget.toLocaleString()}`, -7, gameState.boardConfidence);
         if (gameState.boardConfidence < 5 && Math.random() < 0.1) {
             if(typeof showMessage === "function") showMessage("УВОЛЬНЕНИЕ!", "Руководство клуба крайне недовольно вашими финансовыми результатами и приняло решение расторгнуть контракт. Игра окончена.");
             // TODO: Реализовать логику Game Over (например, блокировка кнопок, показ сообщения о конце игры)
        }
    }
}

function updateInternationalDuty() {
    if (!gameState.userTeam || !gameState.userTeam.players) return;
    const isBreakWeek = INTERNATIONAL_BREAK_WEEKS.includes(gameState.currentWeek);
    gameState.internationalBreakActive = isBreakWeek;

    gameState.userTeam.players.forEach(player => {
        if (isBreakWeek) {
            if (!player.onLoan && player.status && player.status.type === 'fit' && player.age < 34 && (getEffectivePlayerStats(player).overall > 70 + getRandomInt(-5,5))) {
                if (!player.internationalDuty) {
                    player.internationalDuty = true;
                    addNews('playerCalledUp', player.name, "Сборная", gameState.userTeam.name);
                }
            }
        } else {
            if (player.internationalDuty) {
                player.internationalDuty = false;
                addNews('playerReturnedFromNationalTeam', player.name, gameState.userTeam.name);
                player.form = Math.max(20, player.form - getRandomInt(15, 30));
            }
        }
    });
}

function endCurrentSeason() {
    addNews('generic', `Сезон ${gameState.currentSeason} завершен! Подведение итогов...`);
    const leagueStandings = Object.values(gameState.leagueTable).sort((a,b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF);
    if (leagueStandings.length > 0) {
        const champion = leagueStandings[0];
        addNews('seasonEndLeague', champion.name);
        if (champion.name === gameState.userTeam.name) {
            gameState.fanHappiness = Math.min(100, gameState.fanHappiness + 25);
            gameState.boardConfidence = Math.min(100, gameState.boardConfidence + 20);
            const prize = 1000000 + gameState.userTeam.reputation * 5000;
            gameState.budget += prize;
            addTransaction("Призовые за чемпионство в Лиге", prize, 'income', 'Призовые');
        } else {
            const userTeamPos = leagueStandings.findIndex(t => t.name === gameState.userTeam.name) + 1;
            if (userTeamPos > 0 && userTeamPos <= 3) {
                gameState.fanHappiness = Math.min(100, gameState.fanHappiness + 10);
                gameState.boardConfidence = Math.min(100, gameState.boardConfidence + 8);
                 const prize = 300000 + gameState.userTeam.reputation * 2000;
                 gameState.budget += prize;
                 addTransaction(`Призовые за ${userTeamPos} место в Лиге`, prize, 'income', 'Призовые');
            } else if (userTeamPos > leagueStandings.length * 0.8) {
                gameState.fanHappiness = Math.max(0, gameState.fanHappiness - 15);
                gameState.boardConfidence = Math.max(0, gameState.boardConfidence - 20);
            }
        }
    }
    const objectives = gameState.userTeam.seasonObjectives;
    const userTeamPosInLeague = leagueStandings.findIndex(t=>t.name === gameState.userTeam.name) + 1;
    if(userTeamPosInLeague > 0 && userTeamPosInLeague <= objectives.leaguePosition) {
        addNews('generic', `Цель по лиге (занять место не ниже ${objectives.leaguePosition}) ВЫПОЛНЕНА! (Ваше место: ${userTeamPosInLeague})`);
        gameState.boardConfidence = Math.min(100, gameState.boardConfidence + 10);
    } else if (userTeamPosInLeague > 0) {
        addNews('generic', `Цель по лиге (занять место не ниже ${objectives.leaguePosition}) ПРОВАЛЕНА. (Ваше место: ${userTeamPosInLeague})`);
        gameState.boardConfidence = Math.max(0, gameState.boardConfidence - 15);
    }

    gameState.currentSeason++;
    gameState.currentWeek = 1;
    gameState.internationalBreakActive = false;

    const prevRep = gameState.userTeam.reputation;
    gameState.userTeam.reputation = Math.min(100, Math.max(10, prevRep + Math.floor((gameState.boardConfidence - 50) / 5) + (leagueStandings.length > 0 && leagueStandings[0].name === gameState.userTeam.name ? 5:0) ));

    const newLeagueObjectivePos = userTeamPosInLeague > 0 ? Math.max(1, Math.min(leagueStandings.length, Math.floor(userTeamPosInLeague * 0.8) - getRandomInt(0,2) )) : Math.ceil(leagueStandings.length / 2);
    gameState.userTeam.seasonObjectives.leaguePosition = newLeagueObjectivePos;
    gameState.userTeam.seasonObjectives.cupProgress = CUP_COMPETITIONS.nationalCup.rounds[getRandomInt(0, CUP_COMPETITIONS.nationalCup.rounds.length -2)];

    for (const teamName in gameState.leagueTable) {
        gameState.leagueTable[teamName] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0, name: teamName, form: [] };
    }
    gameState.schedule = [];
    generateLeagueSchedule();
    initNationalCup();
    sortSchedule();

    gameState.userTeam.players.forEach(p => {
        p.form = getRandomInt(65, 85);
        p.morale = getRandomInt(70, 90);
        p.teamTrainingEffect = { attack: 0, defense: 0, cohesion: 0 };
    });
    gameState.cpuTeams.forEach(team => {
        team.players.forEach(p => {
            p.form = getRandomInt(60, 80);
            p.morale = getRandomInt(65, 85);
        });
    });

    updateMarketAndStaffAvailability(true);
    addNews('newSeason', gameState.currentSeason);
    updateHistoryAfterSeason(leagueStandings); 
}

function updateMarketAndStaffAvailability(fullRefresh = false) {
    if (!gameState.transferMarket || !gameState.availableCoaches || !gameState.availableStaff) return;

    if (fullRefresh || Math.random() < 0.3) {
        const currentMarketSize = gameState.transferMarket.players.length;
        const numToRemove = fullRefresh ? Math.floor(currentMarketSize * 0.5) : Math.floor(currentMarketSize * 0.20);
        for (let i=0; i < numToRemove && gameState.transferMarket.players.length > 0; i++) {
            gameState.transferMarket.players.splice(getRandomInt(0, gameState.transferMarket.players.length -1), 1);
        }
        const numToAdd = fullRefresh ? 80 : getRandomInt(15,30);
        populateInitialTransferMarket(numToAdd);
    }

    if (fullRefresh || Math.random() < 0.35) {
        const currentCoachesSize = gameState.availableCoaches.length;
        const numToRemove = fullRefresh ? Math.floor(currentCoachesSize*0.4) : Math.floor(currentCoachesSize * 0.25);
         for (let i=0; i < numToRemove && gameState.availableCoaches.length > 0; i++) {
            gameState.availableCoaches.splice(getRandomInt(0, gameState.availableCoaches.length -1), 1);
        }
        const numToAdd = fullRefresh ? 15 : getRandomInt(2,5);
        populateAvailableCoaches(numToAdd);
    }

     if (fullRefresh || Math.random() < 0.35) {
        for (const roleKey in STAFF_ROLES) {
            if(!gameState.availableStaff[roleKey]) gameState.availableStaff[roleKey] = [];
            const currentStaffSize = gameState.availableStaff[roleKey].length;
            const numToRemove = fullRefresh ? Math.floor(currentStaffSize*0.4) : Math.floor(currentStaffSize * 0.25);
            for (let i=0; i < numToRemove && gameState.availableStaff[roleKey].length > 0; i++) {
                gameState.availableStaff[roleKey].splice(getRandomInt(0, gameState.availableStaff[roleKey].length -1), 1);
            }
            const numToAdd = fullRefresh ? 6 : getRandomInt(1,3);
            populateAvailableStaff(numToAdd, roleKey);
        }
    }
}

// ===== НАЧАЛО ИСПРАВЛЕНИЯ =====
// Старая версия была слишком сложной и не всегда заполняла все 11 слотов, оставляя null.
// Это приводило к тому, что canUserTeamPlayMatch() возвращала false, блокируя игру.
// Новая версия намного проще и надежнее: она сначала заполняет слоты игроками на их родных позициях,
// а затем гарантированно заполняет оставшиеся пустые слоты любыми доступными игроками.
function autoFillLineup() {
    if (!gameState.userTeam || !gameState.userTeam.players) return;

    const team = gameState.userTeam;
    const formationStructure = getFormationStructure(team.formation);
    const availablePlayers = [...team.players].filter(p => p.status && p.status.type === 'fit' && !p.onLoan && !p.internationalDuty);
    
    // Сбрасываем состав
    team.startingXI = Array(REQUIRED_STARTERS).fill(null);
    const usedPlayerIds = new Set();

    let slotIndex = 0;

    // Шаг 1: Расставляем игроков на их родные позиции
    formationStructure.forEach(line => {
        line.positions.forEach(posDetail => {
            if (slotIndex >= REQUIRED_STARTERS) return;
            
            // Ищем лучшего игрока на эту позицию, который еще не в составе
            const bestPlayerForSlot = availablePlayers
                .filter(p => p.position === posDetail.base && !usedPlayerIds.has(p.id))
                .sort((a, b) => getEffectivePlayerStats(b).overall - getEffectivePlayerStats(a).overall)[0];

            if (bestPlayerForSlot) {
                team.startingXI[slotIndex] = bestPlayerForSlot.id;
                usedPlayerIds.add(bestPlayerForSlot.id);
            }
            slotIndex++;
        });
    });

    // Шаг 2: Заполняем оставшиеся пустые слоты лучшими из оставшихся игроков
    for (let i = 0; i < REQUIRED_STARTERS; i++) {
        if (team.startingXI[i] === null) {
            // Ищем лучшего доступного игрока, который еще не использован
            const bestAvailablePlayer = availablePlayers
                .filter(p => !usedPlayerIds.has(p.id))
                .sort((a, b) => getEffectivePlayerStats(b).overall - getEffectivePlayerStats(a).overall)[0];

            if (bestAvailablePlayer) {
                team.startingXI[i] = bestAvailablePlayer.id;
                usedPlayerIds.add(bestAvailablePlayer.id);
            }
        }
    }
    
    // Шаг 3 (Резервный): Если по какой-то причине слоты все еще пусты (например, меньше 11 здоровых игроков),
    // то canUserTeamPlayMatch() все равно вернет false, что является правильным поведением.
    // Этот код гарантирует, что если 11 здоровых игроков есть, они будут в составе.

    if (typeof renderTacticsScreen === "function") {
        renderTacticsScreen();
    }
}
// ===== КОНЕЦ ИСПРАВЛЕНИЯ =====


function handleOfferContract() {
    if (!currentNegotiation || !currentNegotiation.playerId || !gameState.userTeam || !gameState.userTeam.players || !ui.newSalaryInput || !ui.newDurationSelect || !ui.releaseClauseInput || !ui.signingBonusInput || !ui.loyaltyBonusInput || !ui.negotiationFeedback || !ui.contractNegotiationOverlay) {
        console.error("Ошибка переговоров: нет данных или UI элементов.");
        if (ui.negotiationFeedback) ui.negotiationFeedback.textContent = "Внутренняя ошибка. Попробуйте еще раз.";
        return;
    }
    const player = gameState.userTeam.players.find(p => p.id === currentNegotiation.playerId);
    if (!player) { console.error("Игрок для переговоров не найден"); ui.negotiationFeedback.textContent = "Игрок не найден."; return; }

    const offeredSalary = parseInt(ui.newSalaryInput.value);
    const offeredDuration = parseInt(ui.newDurationSelect.value);
    const offeredReleaseClause = parseInt(ui.releaseClauseInput.value) || 0;
    const offeredSigningBonus = parseInt(ui.signingBonusInput.value) || 0;
    const offeredLoyaltyBonus = parseInt(ui.loyaltyBonusInput.value) || 0;

    if (isNaN(offeredSalary) || offeredSalary <= 0 || isNaN(offeredDuration) || offeredDuration <= 0) {
        ui.negotiationFeedback.textContent = "Некорректные условия зарплаты или срока."; return;
    }
    if (gameState.budget < offeredSigningBonus) {
         ui.negotiationFeedback.textContent = `Недостаточно средств на подписной бонус (${offeredSigningBonus.toLocaleString()}$). Требуется: ${offeredSigningBonus.toLocaleString()}, в наличии: ${gameState.budget.toLocaleString()}.`; return;
    }

    const currentOverall = getEffectivePlayerStats(player).overall;
    const potentialValue = getPlayerPotentialValue(player);
    const ageFactor = Math.max(0.55, 1.45 - (player.age - 18) * 0.038);
    const moraleFactor = Math.max(0.35, player.morale / 100 + 0.03);
    const teamReputationFactor = Math.max(0.65, (gameState.userTeam.reputation || 50) / 85);

    let demandedSalary = player.contract.salary * 0.3;
    demandedSalary += (currentOverall * 20 + potentialValue * 25) * ageFactor;
    demandedSalary *= moraleFactor / teamReputationFactor;
    demandedSalary = Math.floor(demandedSalary / 50) * 50 + getRandomInt(-15, 15) * 25;
    demandedSalary = Math.max(player.contract.salary * 0.8, Math.max(50, demandedSalary));

    const salaryRatio = offeredSalary / Math.max(50, demandedSalary);
    const durationRatio = offeredDuration / (player.contract.desiredContractLength || CONTRACT_LENGTHS_WEEKS.medium);
    const releaseClauseAcceptable = offeredReleaseClause === 0 || offeredReleaseClause >= player.price * 1.8 || currentOverall < 80 || player.age > 30;
    const signingBonusFactor = offeredSigningBonus / Math.max(1000, demandedSalary * 2.5);
    const loyaltyBonusFactor = offeredLoyaltyBonus / Math.max(1000, demandedSalary * 12);

    let acceptanceScore = salaryRatio * 0.45 + durationRatio * 0.10 + (releaseClauseAcceptable ? 0.1 : -0.20) + signingBonusFactor * 0.20 + loyaltyBonusFactor * 0.15;
    if (player.personality === 'Амбициозный' && offeredSalary > demandedSalary*1.2) acceptanceScore += 0.12;
    else if (player.personality === 'Неконфликтный' && offeredSalary >= demandedSalary * 0.9) acceptanceScore += 0.08;
    else if (player.personality === 'Лидер' && offeredDuration >= CONTRACT_LENGTHS_WEEKS.long) acceptanceScore += 0.05;

    if (player.morale < 40) acceptanceScore -= 0.1;

    if (acceptanceScore >= 0.88 || (acceptanceScore > 0.75 && Math.random() < 0.70)) {
        gameState.budget -= offeredSigningBonus;
        if (offeredSigningBonus > 0) addTransaction(`Подписной бонус: ${player.name}`, offeredSigningBonus, 'expense', 'Бонусы игрокам');

        player.contract.salary = offeredSalary;
        player.contract.durationWeeks = offeredDuration;
        if (typeof calculateEndDate === "function") player.contract.endDate = calculateEndDate(gameState.currentWeek, gameState.currentSeason, offeredDuration);
        player.contract.releaseClause = offeredReleaseClause;
        player.contract.signingBonus = offeredSigningBonus;
        player.contract.loyaltyBonus = offeredLoyaltyBonus;
        player.morale = Math.min(100, player.morale + getRandomInt(20, 40));
        addNews('contractRenewed', player.name, offeredSalary, offeredDuration);
        if (ui.contractNegotiationOverlay) ui.contractNegotiationOverlay.style.display = 'none';
        if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
    } else {
        let reason = "";
        if (salaryRatio < 0.80) reason += `Зарплата (${offeredSalary.toLocaleString()}) значительно ниже ожидаемой (~${demandedSalary.toLocaleString()}). `;
        if (durationRatio < 0.60 && player.age < 30) reason += `Хотел бы более длительный контракт. `;
        if (!releaseClauseAcceptable && offeredReleaseClause > 0 && player.price > 0) reason += `Сумма отступных (${offeredReleaseClause.toLocaleString()}) слишком низкая (ожидает > ${(player.price * 1.8).toLocaleString()}). `;
        if (signingBonusFactor < 0.25 && demandedSalary * 2.5 > 1000) reason += `Подписной бонус маловат. `;
        if (!reason) reason = "не устроили общие условия или он ожидает лучшего предложения от другого клуба.";

        player.morale = Math.max(0, player.morale - getRandomInt(10, 20));
        ui.negotiationFeedback.textContent = `Игрок отклонил предложение: ${reason}`;
        addNews('contractRenewalFailed', player.name, reason);
    }
    currentNegotiation.playerId = null; currentNegotiation.type = null; currentNegotiation.itemKey = null;
}

function handleDropOnFormationSlot(event) {
    event.preventDefault();
    if (!event.dataTransfer || !event.currentTarget) return;
    const playerIdStr = event.dataTransfer.getData('text/plain');
    const targetSlotIndex = parseInt(event.currentTarget.dataset.slotIndex);

    if (isNaN(targetSlotIndex) || !playerIdStr || !gameState.userTeam || !gameState.userTeam.players || !gameState.userTeam.startingXI) return;

    const [playerIdRaw, sourceInfo, sourceSlotIndexStr] = playerIdStr.split('_');
    const actualPlayerId = parseInt(playerIdRaw);

    const playerToMove = gameState.userTeam.players.find(p => p.id === actualPlayerId);
    if (!playerToMove || playerToMove.status.type !== 'fit' || playerToMove.onLoan || playerToMove.internationalDuty) {
        return;
    }

    const playerInTargetSlotId = gameState.userTeam.startingXI[targetSlotIndex];
    const currentPositionIndexOfPlayerToMove = gameState.userTeam.startingXI.indexOf(actualPlayerId);

    if (currentPositionIndexOfPlayerToMove !== -1) {
        gameState.userTeam.startingXI[currentPositionIndexOfPlayerToMove] = playerInTargetSlotId;
    }
    gameState.userTeam.startingXI[targetSlotIndex] = actualPlayerId;

    if(typeof renderTacticsScreen === "function") renderTacticsScreen();
}

function handleDropOnBench(event) {
    event.preventDefault();
    if (!event.dataTransfer || !gameState.userTeam || !gameState.userTeam.startingXI) return;

    const playerIdStr = event.dataTransfer.getData('text/plain');
    const actualPlayerId = parseInt(playerIdStr.split('_')[0]);

    const indexInXI = gameState.userTeam.startingXI.indexOf(actualPlayerId);
    if (indexInXI !== -1) {
        gameState.userTeam.startingXI[indexInXI] = null;
    }
    if(typeof renderTacticsScreen === "function") renderTacticsScreen();
}

// Функции офиса
function callPressConference() {
    if (gameState.pressConferenceCooldown > 0) {
        if (typeof showMessage === "function") showMessage("Пресс-конференция", `Следующая доступна через ${gameState.pressConferenceCooldown} нед.`);
        return;
    }
    const topics = [
        {id: 1, question: "Как вы оцениваете текущую форму вашей команды?", choices: [
            { text: "Мы на пике формы!", effect: { morale: 6, fanHappiness: 4 } },
            { text: "Есть стабильность, но можем лучше.", effect: { morale: 1, boardConfidence: 2 } },
            { text: "Форма вызывает опасения.", effect: { morale: -4, fanHappiness: -3 } }
        ]},
        {id: 2, question: "Ваши ожидания от следующего важного матча?", choices: [
            { text: "Уверены в победе!", effect: { morale: 4, fanHappiness: 3, boardConfidence: 1, pressure: 5 } },
            { text: "Соперник силен, но мы будем бороться.", effect: { morale: 0, boardConfidence: 2 } },
            { text: "Игра покажет, результат непредсказуем.", effect: { fanHappiness: -1 } }
        ]},
        {id: 3, question: "Планируются ли трансферы для усиления состава?", choices: [
            { text: "Да, активно ищем усиление.", effect: { fanHappiness: 5, boardConfidence: 2 } },
            { text: "Довольны текущим составом.", effect: { morale: 3, fanHappiness: -2 } },
            { text: "Трансферные планы - секрет.", effect: { boardConfidence: -1 } }
        ]},
        {id: 4, question: "Как атмосфера в раздевалке перед решающими играми?", choices: [
            { text: "Команда едина и настроена на борьбу!", effect: { morale: 5, teamAtmosphere: 5 } },
            { text: "Рабочая атмосфера, все сосредоточены.", effect: { morale: 1 } },
            { text: "Есть некоторое напряжение, но мы справимся.", effect: { morale: -2, teamAtmosphere: -3 } }
        ]}
    ];
    currentPressConferenceContext = getRandomElement(topics);

    if (ui.pressConferenceOverlay && ui.pressTopicQuestion && ui.pressOptionsContainer) {
        ui.pressTopicQuestion.textContent = currentPressConferenceContext.question;
        ui.pressOptionsContainer.innerHTML = '';
        currentPressConferenceContext.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.classList.add('action-button');
            button.textContent = choice.text;
            button.onclick = () => applyPressConferenceEffect(choice.effect, currentPressConferenceContext.id, choice.text);
            ui.pressOptionsContainer.appendChild(button);
        });
        ui.pressConferenceOverlay.style.display = 'flex';
    } else {
        console.error("UI элементы для пресс-конференции не найдены.");
    }
}

function applyPressConferenceEffect(effect, topicId, choiceText) {
    gameState.fanHappiness = Math.min(100, Math.max(0, gameState.fanHappiness + (effect.fanHappiness || 0)));
    gameState.boardConfidence = Math.min(100, Math.max(0, gameState.boardConfidence + (effect.boardConfidence || 0)));
    if(gameState.userTeam && gameState.userTeam.players){
        gameState.userTeam.players.forEach(p => {
            if (p.status.type === 'fit') p.morale = Math.min(100, Math.max(0, p.morale + (effect.morale || 0)));
        });
    }
    if(gameState.userTeam && effect.teamAtmosphere) gameState.userTeam.teamAtmosphere = Math.min(100, Math.max(0, (gameState.userTeam.teamAtmosphere || 65) + effect.teamAtmosphere));

    addNews('pressConferenceChoice', `Ваш ответ "${choiceText}"`, `повлиял на мнения.`);
    gameState.pressConferenceCooldown = getRandomInt(2,3);
    if (ui.pressConferenceOverlay) ui.pressConferenceOverlay.style.display = 'none';
    if (typeof updateAllUIDisplays === "function") updateAllUIDisplays();
}

function holdTeamMeeting() {
     if (gameState.teamMeetingCooldown > 0) {
        if (typeof showMessage === "function") showMessage("Собрание команды", `Следующее доступно через ${gameState.teamMeetingCooldown} нед.`);
        return;
    }
    let effectText = "";
    let moraleChange = 0;
    let atmosphereChange = 0;

    const avgMorale = gameState.userTeam.players.reduce((sum, p) => sum + (p.morale || 0), 0) / Math.max(1, gameState.userTeam.players.length);
    const recentLosses = gameState.schedule.filter(m => m.isUserMatch && m.played && m.week > gameState.currentWeek - 4 && ((m.homeTeam === gameState.userTeam.name && m.homeScore < m.awayScore) || (m.awayTeam === gameState.userTeam.name && m.awayScore < m.homeScore))).length;

    if (avgMorale > 70 && recentLosses === 0) {
        moraleChange = getRandomInt(5,12); atmosphereChange = getRandomInt(4,8);
        effectText = "Высоко оценили настрой команды. Мораль и атмосфера значительно улучшились!";
    } else if (avgMorale < 40 || recentLosses >= 2) {
        if(Math.random() < 0.6) {
            moraleChange = getRandomInt(2,7); atmosphereChange = getRandomInt(1,4);
            effectText = "Вы провели серьезный разговор с командой. Это заставило игроков задуматься и немного собраться.";
        } else {
            moraleChange = getRandomInt(-5,-2); atmosphereChange = getRandomInt(-4,-1);
            effectText = "Ваша критика была воспринята негативно. Мораль и атмосфера ухудшились.";
        }
    } else {
        if(Math.random() < 0.5) {
            moraleChange = getRandomInt(1,5); atmosphereChange = getRandomInt(0,3);
            effectText = "Команда положительно отреагировала на ваши слова.";
        } else {
            moraleChange = getRandomInt(-2,1); atmosphereChange = getRandomInt(-1,1);
            effectText = "Собрание прошло без особых изменений в настрое команды.";
        }
    }

    gameState.userTeam.players.forEach(p => p.morale = Math.min(100, Math.max(0, p.morale + moraleChange)));
    gameState.userTeam.teamAtmosphere = Math.min(100, Math.max(0, (gameState.userTeam.teamAtmosphere || 65) + atmosphereChange));

    addNews('teamMeetingResult', effectText, gameState.userTeam.name);
    gameState.teamMeetingCooldown = getRandomInt(3,4);
    if (typeof updateAllUIDisplays === "function") updateAllUIDisplays();
}


function canUserTeamPlayMatch() {
    if (!gameState || !gameState.userTeam || !gameState.userTeam.startingXI || !gameState.userTeam.players) {
        console.error("canUserTeamPlayMatch: Отсутствуют данные о команде или составе.");
        return false;
    }

    const startingXI = gameState.userTeam.startingXI;
    const players = gameState.userTeam.players;
    const requiredStarters = window.REQUIRED_STARTERS || 11;

    if (startingXI.length !== requiredStarters) {
        return false;
    }

    for (const playerId of startingXI) {
        if (playerId === null) {
            return false;
        }

        const player = players.find(p => p.id === playerId);

        if (!player) {
            return false;
        }
        
        if (player.status.type !== 'fit' || player.onLoan || player.internationalDuty) {
            return false;
        }
    }
    
    return true;
}


function updateLeagueTableAfterMatch(match) {
    if (match.competition !== 'League' || !gameState.leagueTable) {
        return;
    }

    const homeTeamStats = gameState.leagueTable[match.homeTeam];
    const awayTeamStats = gameState.leagueTable[match.awayTeam];

    if (!homeTeamStats || !awayTeamStats) {
        console.error(`Не удалось обновить таблицу: одна из команд не найдена.`, match);
        return;
    }

    homeTeamStats.P++;
    awayTeamStats.P++;

    homeTeamStats.GF += match.homeScore;
    homeTeamStats.GA += match.awayScore;
    awayTeamStats.GF += match.awayScore;
    awayTeamStats.GA += match.homeScore;

    homeTeamStats.GD = homeTeamStats.GF - homeTeamStats.GA;
    awayTeamStats.GD = awayTeamStats.GF - awayTeamStats.GA;

    if (match.homeScore > match.awayScore) {
        homeTeamStats.W++;
        homeTeamStats.Pts += 3;
        awayTeamStats.L++;
    } else if (match.awayScore > match.homeScore) {
        awayTeamStats.W++;
        awayTeamStats.Pts += 3;
        homeTeamStats.L++;
    } else {
        homeTeamStats.D++;
        awayTeamStats.D++;
        homeTeamStats.Pts += 1;
        awayTeamStats.Pts += 1;
    }
}