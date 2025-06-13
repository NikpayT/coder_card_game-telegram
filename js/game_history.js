// js/game_history.js

// --- Инициализация структур данных ---

/**
 * Инициализирует объекты истории и рекордов в gameState при старте новой игры.
 */
function initHistoryAndRecords() {
    if (!gameState) return;
    
    // История конкретного клуба игрока
    gameState.clubHistory = {
        trophies: [], // Список трофеев, например "Чемпион Лиги (Сезон 1)"
        seasonBySeason: [], // Результаты по каждому сезону
        records: {
            biggestWin: { score: "0-0", opponent: "", season: 0 },
            biggestLoss: { score: "0-0", opponent: "", season: 0 },
            topScorer: { name: "", goals: 0, season: 0 } // Для простоты, пока только клубный рекорд
        }
    };

    // Общие рекорды всей лиги
    gameState.leagueRecords = {
        biggestWin: { score: "0-0", teams: "", season: 0 },
        mostGoalsInMatch: { goals: 0, teams: "", score: "0-0", season: 0 },
        seasonTopScorer: { name: "", team: "", goals: 0, season: 0 } // Будет сложно, пока пропустим
    };
    
    console.log("Модуль истории и рекордов инициализирован.");
}


// --- Функции обновления данных ---

/**
 * Обновляет историю клуба в конце сезона.
 * Вызывается из endCurrentSeason() в game_logic_core.js
 * @param {Array} leagueStandings - Отсортированный массив команд из таблицы.
 */
function updateHistoryAfterSeason(leagueStandings) {
    if (!gameState || !gameState.clubHistory || !gameState.userTeam) return;

    const userTeamName = gameState.userTeam.name;
    const userTeamPosition = leagueStandings.findIndex(t => t.name === userTeamName) + 1;

    // Записываем результат сезона
    gameState.clubHistory.seasonBySeason.push({
        season: gameState.currentSeason,
        leaguePosition: userTeamPosition,
        points: leagueStandings[userTeamPosition - 1].Pts
    });

    // Проверяем на чемпионство
    if (userTeamPosition === 1) {
        const trophy = `Чемпион Лиги (Сезон ${gameState.currentSeason})`;
        gameState.clubHistory.trophies.push(trophy);
        addNews('generic', `🏆 Новое достижение! Клуб ${userTeamName} добавил трофей в свою историю: ${trophy}.`);
    }
}

/**
 * Обновляет рекорды (клубные и лиги) после КАЖДОГО матча.
 * Вызывается из finalizeMatchSimulation() в game_logic_match_sim.js
 * @param {object} match - Объект сыгранного матча.
 */
function updateRecordsAfterMatch(match) {
    if (!gameState || !match.played) return;

    // --- Обновление рекордов лиги ---
    const totalGoals = match.homeScore + match.awayScore;
    if (totalGoals > gameState.leagueRecords.mostGoalsInMatch.goals) {
        gameState.leagueRecords.mostGoalsInMatch = {
            goals: totalGoals,
            teams: `${match.homeTeam} vs ${match.awayTeam}`,
            score: `${match.homeScore}-${match.awayScore}`,
            season: gameState.currentSeason
        };
    }

    const scoreDiff = Math.abs(match.homeScore - match.awayScore);
    const currentBiggestWinDiff = parseInt(gameState.leagueRecords.biggestWin.score.split('-')[0]) - parseInt(gameState.leagueRecords.biggestWin.score.split('-')[1]);
    
    if (scoreDiff > Math.abs(currentBiggestWinDiff)) {
        gameState.leagueRecords.biggestWin = {
            score: `${match.homeScore}-${match.awayScore}`,
            teams: `${match.homeTeam} vs ${match.awayTeam}`,
            season: gameState.currentSeason
        };
    }
    
    // --- Обновление рекордов клуба игрока ---
    if (match.isUserMatch) {
        const userTeamName = gameState.userTeam.name;
        let userScore, opponentScore, opponentName;

        if (match.homeTeam === userTeamName) {
            userScore = match.homeScore;
            opponentScore = match.awayScore;
            opponentName = match.awayTeam;
        } else {
            userScore = match.awayScore;
            opponentScore = match.homeScore;
            opponentName = match.homeTeam;
        }

        const userBiggestWinDiff = parseInt(gameState.clubHistory.records.biggestWin.score.split('-')[0]) - parseInt(gameState.clubHistory.records.biggestWin.score.split('-')[1]);
        if (userScore > opponentScore && (userScore - opponentScore) > userBiggestWinDiff) {
            gameState.clubHistory.records.biggestWin = {
                score: `${userScore}-${opponentScore}`,
                opponent: opponentName,
                season: gameState.currentSeason
            };
        }

        const userBiggestLossDiff = parseInt(gameState.clubHistory.records.biggestLoss.score.split('-')[1]) - parseInt(gameState.clubHistory.records.biggestLoss.score.split('-')[0]);
        if (opponentScore > userScore && (opponentScore - userScore) > userBiggestLossDiff) {
            gameState.clubHistory.records.biggestLoss = {
                score: `${userScore}-${opponentScore}`,
                opponent: opponentName,
                season: gameState.currentSeason
            };
        }
    }
}

/**
 * Генерирует "реакцию СМИ" на основе результата матча.
 * Вызывается из finalizeMatchSimulation() в game_logic_match_sim.js
 * @param {object} match - Объект сыгранного матча.
 */
function generateMediaReaction(match) {
    if (!match.isUserMatch) return; // Только для матчей игрока

    const userTeamName = gameState.userTeam.name;
    let userScore, opponentScore, location;

    if (match.homeTeam === userTeamName) {
        userScore = match.homeScore;
        opponentScore = match.awayScore;
        location = "дома";
    } else {
        userScore = match.awayScore;
        opponentScore = match.homeScore;
        location = "в гостях";
    }

    const diff = userScore - opponentScore;
    let headline = "";

    if (diff > 3) {
        headline = `Сенсационный разгром! ${userTeamName} уничтожает соперника ${location} со счетом ${userScore}-${opponentScore}!`;
    } else if (diff > 0) {
        headline = `Уверенная победа! ${userTeamName} обыгрывает соперника и забирает 3 очка.`;
    } else if (diff === 0) {
        headline = `Боевая ничья. Команды не смогли выявить победителя, поделив очки.`;
    } else if (diff > -4) {
        headline = `Обидное поражение. ${userTeamName} уступает в напряженном матче.`;
    } else {
        headline = `Катастрофа! ${userTeamName} терпит сокрушительное поражение ${location}.`;
    }
    
    // Добавляем новость с специальным типом для стилизации
    addNews('media_headline', headline);
}