// data.js

const PLAYER_FIRST_NAMES = [
    "Александр", "Дмитрий", "Максим", "Сергей", "Андрей", "Алексей", "Артем", "Илья",
    "Кирилл", "Михаил", "Никита", "Роман", "Егор", "Арсений", "Иван", "Денис",
    "Владислав", "Павел", "Даниил", "Марк", "Лев", "Мирон", "Ярослав", "Тимур",
    "Герман", "Остап", "Платон", "Родион", "Степан", "Феликс", "Захар", "Матвей"
];

const PLAYER_LAST_NAMES = [
    "Смирнов", "Иванов", "Кузнецов", "Соколов", "Попов", "Лебедев", "Козлов", "Новиков",
    "Морозов", "Петров", "Волков", "Соловьёв", "Васильев", "Зайцев", "Павлов", "Семёнов",
    "Голубев", "Виноградов", "Богданов", "Воробьёв", "Фёдоров", "Михайлов", "Беляев", "Тарасов",
    "Орлов", "Комаров", "Жуков", "Белов", "Давыдов", "Киселев", "Макаров", "Андреев"
];

const CPU_TEAM_NAMES = [ // 17 команд
    "Зенит", "Спартак", "ЦСКА", "Локомотив", "Краснодар", "Динамо М", "Рубин", "Ростов",
    "Ахмат", "Урал", "Сочи", "Крылья Советов", "Пари НН", "Факел", "Оренбург", "Балтика",
    "Химки"
];

const PLAYER_POSITIONS = ['ВРТ', 'ЗАЩ', 'ПЗЩ', 'НАП'];
const DETAILED_PLAYER_POSITIONS = {
    'ВРТ': ['ВРТ'],
    'ЗАЩ': ['ЛЗ', 'ЦЗ', 'ПЗ'],
    'ПЗЩ': ['ЛП', 'ЦОП', 'ЦАП', 'ПП'],
    'НАП': ['ЛФА', 'ЦФД', 'ПФА']
};

const PLAYER_PERSONALITIES = ['Лидер', 'Командный игрок', 'Индивидуалист', 'Спокойный', 'Темпераментный', 'Неконфликтный', 'Амбициозный', 'Трудолюбивый', 'Дисциплинированный', 'Креативный', 'Профессионал', 'Решительный', 'Неуступчивый', 'Эксцентричный'];

const COACH_NAMES = [
    "Сергей Семак", "Валерий Карпин", "Станислав Черчесов", "Юрий Сёмин", "Курбан Бердыев",
    "Виктор Гончаренко", "Леонид Слуцкий", "Владимир Федотов", "Марцел Личка", "Игорь Осинькин",
    "Паоло Ваноли", "Гильермо Абаскаль", "Владимир Ивич", "Славиша Йоканович", "Миодраг Божович", "Доменико Тедеско"
];

const STAFF_NAMES_GENERIC = [
    "Игорь", "Олег", "Вадим", "Юрий", "Борис", "Глеб", "Артур", "Виталий",
    "Константин", "Леонид", "Анатолий", "Геннадий", "Эдуард", "Руслан", "Евгений", "Станислав"
];

const COACH_SPECIALIZATIONS = {
    'balanced': { name: "Баланс", attackBoost: 3, defenseBoost: 3, trainingBonus: 0.15, moraleBoost: 2, youthFocus: 0.05, preferredFormation: "4-4-2"  },
    'attacking': { name: "Атака", attackBoost: 5, defenseBoost: 0, trainingBonus: 0.1, moraleBoost: 1, youthFocus: 0.02, preferredFormation: "4-3-3"  },
    'defensive': { name: "Защита", attackBoost: 0, defenseBoost: 5, trainingBonus: 0.1, moraleBoost: 1, youthFocus: 0.02, preferredFormation: "5-3-2"  }, // Изменено на 5-3-2 для разнообразия
    'youth_focus': { name: "Молодежь", attackBoost: 2, defenseBoost: 2, trainingBonus: 0.20, moraleBoost: 1, youthFocus: 0.20, preferredFormation: "4-3-3"  },
    'high_press': { name: "Прессинг", attackBoost: 4, defenseBoost: 1, trainingBonus: 0.12, moraleBoost: 0, staminaDrainFactor: 1.15, preferredFormation: "4-2-3-1"  },
    'possession': { name: "Контроль мяча", attackBoost: 2, defenseBoost: 3, trainingBonus: 0.15, moraleBoost: 2, youthFocus: 0.03, possessionBonus: 0.1, preferredFormation: "4-1-4-1"  }, // Добавлена 4-1-4-1
    'counter_attack': { name: "Контратака", attackBoost: 3, defenseBoost: 4, trainingBonus: 0.1, moraleBoost: 1, youthFocus: 0.01, preferredFormation: "4-4-1-1" } // Добавлена 4-4-1-1
};


const STAFF_ROLES = {
    assistantCoach: { name: "Ассистент тренера", effect: "Бонус к тактике и тренировкам", salaryRange: [600, 2200], maxCount: 1, skillEffectiveness: { tacticalAdaptability: 0.25, trainingBoost: 0.06} },
    chiefScout: { name: "Главный скаут", effect: "Улучшает поиск талантов, точность оценки", salaryRange: [900, 2800], maxCount: 1, skillEffectiveness: { scoutingAccuracy: 0.35, networkRange: 1.2 } },
    scout: { name: "Скаут", effect: "Разведывает игроков, предоставляет отчеты", salaryRange: [400,1600], maxCount: 4, skillEffectiveness: { scoutingSpeed: 0.25, reportDetail: 0.15 } },
    physio: { name: "Физиотерапевт", effect: "Ускоряет восстановление, снижает риск травм", salaryRange: [700, 2600], maxCount: 2, skillEffectiveness: { recoverySpeed: 0.30, injuryPrevention: 0.20 }  },
    youthCoach: { name: "Тренер молодежи", effect: "Улучшает развитие в академии", salaryRange: [500, 2000], maxCount: 2, skillEffectiveness: { youthDevelopmentRate: 0.35, potentialDiscovery: 0.15 } }
};

const NEWS_EVENTS = {
    playerBought: (playerName, buyingTeam, sellingTeam, price) => `${buyingTeam} подписал игрока ${playerName} из ${sellingTeam} за ${price.toLocaleString()}$.`,
    playerSold: (playerName, sellingTeam, buyingTeam, price) => `${playerName} продан из ${sellingTeam} в ${buyingTeam} за ${price.toLocaleString()}$.`,
    matchResult: (homeTeam, awayTeam, homeScore, awayScore, isUserMatch, competition = "Лига") =>
        `${competition}: ${isUserMatch ? 'Ваш матч: ' : ''}${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`,
    playerInjured: (playerName, duration, teamName, incidentType = "в матче") => `Игрок ${playerName} (${teamName}) получил травму ${incidentType} и выбыл на ${duration} нед.`,
    playerRecovered: (playerName, teamName) => `Игрок ${playerName} (${teamName}) восстановился после травмы.`,
    playerSuspended: (playerName, duration, teamName, reason = "красная карточка") => `Игрок ${playerName} (${teamName}) дисквалифицирован на ${duration} матч(а) (${reason}).`,
    playerSuspensionOver: (playerName, teamName) => `Дисквалификация игрока ${playerName} (${teamName}) завершена.`,
    budgetChange: (reason, amount, isPositive) =>
        isPositive ?
        `${reason}: +${amount.toLocaleString()}$` :
        `${reason}: -${amount.toLocaleString()}$`,
    newCoach: (coachName, teamName, specKey) => `Новый тренер ${coachName} (спец.: ${COACH_SPECIALIZATIONS[specKey] ? COACH_SPECIALIZATIONS[specKey].name : specKey}) возглавил ${teamName}.`,
    firedCoach: (coachName, teamName) => `Тренер ${coachName} покинул ${teamName}.`,
    trainingComplete: (playerName, statImproved, improvement) => `Тренировка: ${playerName} улучшил ${statImproved} на +${improvement}.`,
    seasonEndLeague: (winnerName) => `Сезон окончен! Чемпион Лиги: ${winnerName}!`,
    seasonEndCup: (winnerName, cupName) => `${cupName} выиграл ${winnerName}! Поздравляем!`,
    newSeason: (seasonNumber) => `Начинается новый сезон #${seasonNumber}!`,
    contractExpiringSoon: (playerName, weeksLeft) => `КОНТРАКТ: У игрока ${playerName} истекает контракт через ${weeksLeft} нед.!`,
    contractRenewed: (playerName, newSalary, newLengthWeeks) => `КОНТРАКТ: С ${playerName} продлен. Новая з/п: ${newSalary.toLocaleString()}$/нед, срок: ${Math.round(newLengthWeeks/(WEEKS_IN_YEAR/12))} мес.`,
    contractRenewalFailed: (playerName, reason) => `КОНТРАКТ: Продление с ${playerName} не удалось: ${reason}.`,
    playerLeftOnFree: (playerName, teamName) => `ТРАНСФЕР: ${playerName} покинул ${teamName} по истечении контракта.`,
    generic: (message) => message,
    youthPlayerPromoted: (playerName, teamName) => `АКАДЕМИЯ: ${playerName} переведен в основную команду ${teamName}.`,
    newYouthIntake: (count, teamName) => `АКАДЕМИЯ: В академию ${teamName} поступило ${count} новых талантов.`,
    facilityUpgradeStarted: (facilityName, level, teamName) => `СТРОИТЕЛЬСТВО (${teamName}): Начато улучшение "${facilityName}" до уровня ${level}.`,
    facilityUpgradeComplete: (facilityName, level, teamName) => `СТРОИТЕЛЬСТВО (${teamName}): Улучшение "${facilityName}" до уровня ${level} завершено!`,
    newSponsor: (sponsorName, weeklyIncome, duration, teamName) => `СПОНСОР (${teamName}): Подписан контракт с "${sponsorName}". Доход: ${weeklyIncome.toLocaleString()}$/нед. на ${duration} нед.`,
    staffHired: (staffName, roleName, teamName) => `ПЕРСОНАЛ (${teamName}): ${roleName} ${staffName} нанят.`,
    staffFired: (staffName, roleName, teamName) => `ПЕРСОНАЛ (${teamName}): ${roleName} ${staffName} уволен.`,
    playerCalledUp: (playerName, nationalTeam, teamName) => `СБОРНАЯ: ${playerName} (${teamName}) вызван в ${nationalTeam}.`,
    playerReturnedFromNationalTeam: (playerName, teamName) => `СБОРНАЯ: ${playerName} (${teamName}) вернулся из расположения сборной.`,
    cupDraw: (roundName, team1, team2, competitionName) => `${competitionName}: Жеребьевка ${roundName}. ${team1} сыграет с ${team2}.`,
    cupWinner: (teamName, cupName) => `КУБОК: ${teamName} выигрывает ${cupName}!`,
    pressConferenceChoice: (topic, effect) => `ПРЕССА: Ваше заявление на тему "${topic}" имело ${effect}.`,
    playerUnhappy: (playerName, reason, teamName) => `МОРАЛЬ (${teamName}): ${playerName} недоволен (${reason}).`,
    teamMeetingResult: (effect, teamName) => `КОМАНДА (${teamName}): Собрание команды имело ${effect}.`,
    scoutingReportReady: (playerName, potentialRating, scoutName) => `СКАУТИНГ: ${scoutName} подготовил отчет по ${playerName}. Оценка потенциала: ${potentialRating}.`,
    playerTrainingInjury: (playerName, duration, teamName) => `ТРЕНИРОВКА (${teamName}): ${playerName} получил травму на тренировке! Выбыл на ${duration} нед.`,
    loanOfferReceived: (playerName, offeringTeam, loaningTeam, fee, wageSplit) => `АРЕНДА: ${offeringTeam} предлагает арендовать ${playerName} из ${loaningTeam}. Плата: ${fee}$, з/п: ${wageSplit}% платит ${offeringTeam}.`,
    loanOfferSent: (playerName, targetTeam, offeringTeam) => `АРЕНДА: ${offeringTeam} отправил предложение аренды ${playerName} в ${targetTeam}.`,
    playerLoanedOut: (playerName, fromTeam, toTeam) => `АРЕНДА: ${playerName} уходит из ${fromTeam} в аренду в ${toTeam}.`,
    playerReturnedFromLoan: (playerName, fromTeam, toTeam) => `АРЕНДА: ${playerName} вернулся в ${toTeam} из аренды в ${fromTeam}.`,
    transferOfferReceived: (playerName, offeringTeam, sellingTeam, offerAmount) => `ТРАНСФЕР: ${offeringTeam} предлагает ${offerAmount.toLocaleString()}$ за ${playerName} из ${sellingTeam}.`,
    transferOfferSent: (playerName, buyingTeam, targetTeam, offerAmount) => `ТРАНСФЕР: ${buyingTeam} сделал предложение ${targetTeam} о покупке ${playerName} за ${offerAmount.toLocaleString()}$.`,
    boardTakeoverRumour: (newOwnerNationality) => `СЛУХИ: Появилась информация о возможной смене владельца клуба. Потенциальные инвесторы из ${newOwnerNationality}.`,
    boardConfidenceChange: (reason, change, currentConfidence) => `РУКОВОДСТВО: ${reason}. Доверие изменилось на ${change > 0 ? '+' : ''}${change}% (текущее: ${currentConfidence}%).`,
    fanHappinessChange: (reason, change, currentHappiness) => `ФАНАТЫ: ${reason}. Уровень счастья изменился на ${change > 0 ? '+' : ''}${change}% (текущий: ${currentHappiness}%).`,
};


const CONTRACT_LENGTHS_WEEKS = {
    short: 26,
    medium: 52,
    long: 104,
    veryLong: 156
};
const MIN_CONTRACT_WEEKS_RENEWAL = 13;

const YOUTH_ACADEMY_MAX_PLAYERS = 20;
const YOUTH_PLAYER_POTENTIAL_RANGE = [90, 180];
const YOUTH_INTAKE_WEEKS = [8, 24, 38];

const FACILITY_LEVELS = {
    stadium: {
        name: "Стадион", maxLevel: 5,
        costs: [0, 200000, 500000, 1000000, 2500000, 5000000],
        upgradeTimeWeeks: [0, 6, 8, 10, 14, 18],
        effects: {
            incomePerMatchTicketBase: [0, 1500, 3500, 7000, 15000, 30000],
            fanHappinessBonus: [0, 1, 2, 4, 6, 8],
            matchdayRevenueMultiplier: [1.0, 1.06, 1.12, 1.18, 1.25, 1.35]
        }
    },
    trainingGround: {
        name: "Тренировочная база", maxLevel: 5,
        costs: [0, 150000, 300000, 600000, 1200000, 2000000],
        upgradeTimeWeeks: [0, 5, 7, 9, 12, 15],
        effects: {
            trainingEffectivenessBonus: [0, 0.06, 0.12, 0.18, 0.24, 0.30],
            injuryRiskReduction: [0, 0.025, 0.05, 0.075, 0.10, 0.13],
            playerConditionRecoveryRate: [0, 0.035, 0.07, 0.105, 0.14, 0.175]
        }
    },
    youthAcademyFacility: {
        name: "Молодежная академия", maxLevel: 5,
        costs: [0, 100000, 250000, 500000, 1000000, 1800000],
        upgradeTimeWeeks: [0, 4, 6, 8, 11, 14],
        effects: {
            youthPlayerDevelopmentRate: [0, 0.06, 0.12, 0.18, 0.25, 0.32],
            newIntakeQualityBonus: [0, 4, 8, 12, 17, 22],
            maxYouthPlayersBonus: [0, 2, 5, 8, 12, 15]
        }
    },
    scoutingNetwork: {
        name: "Скаутская сеть", maxLevel: 3,
        costs: [0, 80000, 180000, 400000],
        upgradeTimeWeeks: [0, 4, 6, 8],
        effects: {
            scoutingAccuracyBonus: [0, 7, 15, 25],
            transferMarketVisibilityRange: [0, 1, 2, 4],
            scoutingSpeedFactor: [1.0, 0.88, 0.75, 0.60]
        }
    },
    commercialDepartment: {
        name: "Коммерческий отдел", maxLevel: 3,
        costs: [0, 70000, 150000, 350000],
        upgradeTimeWeeks: [0, 3, 5, 7],
        effects: {
            sponsorIncomeMultiplier: [1.0, 1.08, 1.18, 1.30],
            merchandiseSalesBase: [0, 750, 1800, 4000]
        }
    }
};

const SPONSOR_TYPES = {
    kit: { name: "Титульный спонсор", baseIncomePerWeek: [2000, 7000], durationWeeks: [26, 52], requiredReputation: 25 },
    stadiumNaming: { name: "Спонсор стадиона", baseIncomePerWeek: [3000, 15000], durationWeeks: [52, 104], requiresFacilityLevel: { stadium: 3 }, requiredReputation: 45 },
    secondary: { name: "Региональный спонсор", baseIncomePerWeek: [800, 3500], durationWeeks: [13, 39], requiredReputation: 15 },
    technical: { name: "Технический спонсор", baseIncomePerWeek: [1200, 5000], durationWeeks: [52, 156], requiredReputation: 35 }
};
const MAX_SPONSORS_PER_TYPE = {
    kit: 1, stadiumNaming: 1, secondary: 3, technical: 1
};


const NATIONAL_TEAMS_DATA = {
    Russia: { shortName: "RUS", baseStrength: 75, playerPoolTags: ["russian"] },
    Germany: { shortName: "GER", baseStrength: 88, playerPoolTags: ["german"] },
    Brazil: { shortName: "BRA", baseStrength: 85, playerPoolTags: ["brazilian"] },
};
const INTERNATIONAL_BREAK_WEEKS = [7, 15, 30, 39, 47];

const CUP_COMPETITIONS = {
    nationalCup: {
        name: "Национальный Кубок", shortName: "Кубок",
        rounds: ["1/8 финала", "Четвертьфинал", "Полуфинал", "Финал"], // Убрал 1/16 для меньшего кол-ва команд
        teams: 16, // Изменено на 16
        prizeMoney: [25000, 50000, 100000, 200000], // Обновил призовые под 4 раунда
        winnerBonus: 500000, // Снизил бонус, т.к. кубок короче
        startWeek: 5, // Можно оставить или сдвинуть
        frequencyWeeks: 6 // Увеличил частоту для меньшего кол-ва раундов
    }
};

const PRESS_CONFERENCE_TOPICS = [];

const MAX_SUBSTITUTIONS_PER_MATCH = 5;
const PLAYER_TRAINING_INJURY_CHANCE = 0.0025;

// --- ГЛОБАЛЬНЫЕ ИГРОВЫЕ КОНСТАНТЫ ---
const STARTING_BUDGET = 500000;
const REQUIRED_STARTERS = 11;
const MIN_SQUAD_SIZE_TEAM = 18; // Имя унифицировано
const MAX_SQUAD_SIZE_TEAM = 28; // Имя унифицировано
const NEWS_FEED_LIMIT_UI = 50;    // Имя унифицировано
const TRANSACTION_HISTORY_LIMIT_UI = 30; // Имя унифицировано
const WEEKS_IN_YEAR = 52;
const BASE_FAN_HAPPINESS = 60;
const BASE_BOARD_CONFIDENCE = 55;
const MAX_TRAINING_SLOTS = 3;
const SCOUTING_BASE_COST = 1200;
const YOUTH_INTAKE_MIN_PLAYERS = 2;
const YOUTH_INTAKE_MAX_PLAYERS = 6;