// js/game_logic_match_sim.js

// Предполагается, что gameState, ui объекты и константы из data.js доступны глобально,
// а также функции из game_logic_core.js (например, getTeamReference, addNews, addMatchEventToUI и т.д.)


// ===== НАЧАЛО ИСПРАВЛЕНИЯ 1: ДОБАВЛЕНА НЕДОСТАЮЩАЯ ФУНКЦИЯ =====
/**
 * Симулирует матч между двумя CPU командами в фоновом режиме.
 * @param {object} match - Объект матча из gameState.schedule.
 */
function simulateCPUMatch(match) {
    if (!match || match.played) return;

    const homeTeam = getTeamReference(match.homeTeam);
    const awayTeam = getTeamReference(match.awayTeam);

    if (!homeTeam || !awayTeam) {
        console.error("Не удалось симулировать матч CPU, команда не найдена:", match);
        // В случае ошибки, присуждаем техническое поражение, чтобы не блокировать сезон
        match.homeScore = 0;
        match.awayScore = 0;
        match.played = true;
        if (typeof updateLeagueTableAfterMatch === "function") {
            updateLeagueTableAfterMatch(match);
        }
        return;
    }

    // Рассчитываем силу команд
    const homeStrength = calculateTeamStrength(homeTeam, false); // false, т.к. это быстрая симуляция
    const awayStrength = calculateTeamStrength(awayTeam, false);

    // Простая логика определения счета на основе силы атаки и защиты
    let homeGoals = 0;
    let awayGoals = 0;

    const homeAttackPower = homeStrength.attack / awayStrength.defense;
    const awayAttackPower = awayStrength.attack / homeStrength.defense;

    for (let i = 0; i < 5; i++) { // 5 "атак" для каждой команды
        if (Math.random() < homeAttackPower * 0.15) {
            homeGoals++;
        }
        if (Math.random() < awayAttackPower * 0.15) {
            awayGoals++;
        }
    }
    
    // Добавляем немного случайности
    if (Math.random() < 0.08) homeGoals++;
    if (Math.random() < 0.08) awayGoals++;


    match.homeScore = homeGoals;
    match.awayScore = awayGoals;
    match.played = true;

    // Вызываем нашу функцию для обновления таблицы
    if (typeof updateLeagueTableAfterMatch === "function") {
        updateLeagueTableAfterMatch(match);
    }

    // Добавляем новость о результате
    if (typeof addNews === "function") {
        const competitionDisplay = match.competition === "League" ? "Лига" : (match.cupData && CUP_COMPETITIONS[match.cupData.cupKey] ? CUP_COMPETITIONS[match.cupData.cupKey].name : match.competition);
        addNews('matchResult', match.homeTeam, match.awayTeam, match.homeScore, match.awayScore, false, competitionDisplay + (match.round ? ` (${match.round})` : ''));
    }
}
// ===== КОНЕЦ ИСПРАВЛЕНИЯ 1 =====


// --- Вспомогательные функции для симуляции ---

// Находит игрока в команде (используется в симуляции для доступа к статам)
function getMatchPlayerReference(playerId, teamObject) {
    if (teamObject && teamObject.players) {
        const player = teamObject.players.find(p => p.id === playerId);
        if (player) return player; // Возвращаем ссылку на игрока из команды симуляции
    }
    // Если вдруг не нашли в переданной команде, пробуем глобально (хотя это не должно происходить в идеале)
    return getPlayerReference(playerId); // getPlayerReference из game_logic_core.js
}


// Расчет силы команды для конкретного матча
function calculateTeamStrength(teamObject, forMatch = true) {
    if (!teamObject || !teamObject.players || !teamObject.startingXI) {
        return { attack: 30, defense: 30, overall: 30, cohesion: 50 };
    }

    let totalAttack = 0;
    let totalDefense = 0;
    let playerCountInXI = 0;
    let totalMoraleInXI = 0;
    let totalFormInXI = 0; // В симуляции используется playerStamina, но form для общей оценки
    let positionMatchBonus = 0;

    teamObject.startingXI.forEach((playerId, slotIndex) => {
        if (playerId) {
            const player = teamObject.players.find(p => p.id === playerId); // Ищем в составе команды (не в gameState.userTeam)
            if (player && player.status.type === 'fit' && (!player.internationalDuty || !forMatch) && !player.onLoan) {
                const effStats = getEffectivePlayerStats(player, forMatch); // getEffectivePlayerStats из game_logic_core.js
                totalAttack += effStats.attack;
                totalDefense += effStats.defense;
                totalMoraleInXI += player.morale;
                totalFormInXI += currentMatchSimulation && currentMatchSimulation.playerStamina[playerId] !== undefined ? currentMatchSimulation.playerStamina[playerId] : player.form; // Используем актуальную стамину если есть
                playerCountInXI++;

                const formationStruct = typeof getFormationStructure === "function" ? getFormationStructure(teamObject.formation) : null; // getFormationStructure из game_logic_core.js
                if (formationStruct) {
                    let currentLineSlot = 0;
                    foundPosInFormation:
                    for (const line of formationStruct) {
                        for (const posDetail of line.positions) {
                            if (currentLineSlot === slotIndex) {
                                if (player.position === posDetail.base) positionMatchBonus += 2;
                                else if (player.position.slice(0,1) === posDetail.base.slice(0,1)) positionMatchBonus += 0.5; // Небольшой бонус за совпадение линии
                                break foundPosInFormation;
                            }
                            currentLineSlot++;
                        }
                    }
                }
            }
        }
    });

    if (playerCountInXI < 7 && forMatch) {
        return { attack: 10, defense: 10, overall: 10, cohesion: 20 };
    }
    if (playerCountInXI === 0) playerCountInXI = 1;

    let avgAttack = totalAttack / playerCountInXI;
    let avgDefense = totalDefense / playerCountInXI;
    let avgMorale = totalMoraleInXI / playerCountInXI;
    let avgFormOrStamina = totalFormInXI / playerCountInXI; // Это будет средняя форма или стамина

    if (teamObject.coach) {
        avgAttack += teamObject.coach.attackBoost || 0;
        avgDefense += teamObject.coach.defenseBoost || 0;
        avgMorale += (teamObject.coach.moraleBoost || 0) * 3; // Уменьшил влияние на мораль в расчете силы
    }
    if (teamObject.staff && teamObject.staff.assistantCoach) {
        const assistantSkillFactor = (teamObject.staff.assistantCoach.skillLevel || 50) / 100;
        avgAttack += (STAFF_ROLES.assistantCoach.skillEffectiveness.tacticalAdaptability * 10) * assistantSkillFactor;
        avgDefense += (STAFF_ROLES.assistantCoach.skillEffectiveness.tacticalAdaptability * 10) * assistantSkillFactor;
    }

    if (teamObject.tactic === 'attacking') { avgAttack *= 1.12; avgDefense *= 0.9; }
    else if (teamObject.tactic === 'defensive') { avgAttack *= 0.9; avgDefense *= 1.12; }
    else if (teamObject.tactic === 'high-press') { avgAttack *= 1.08; avgDefense *= 0.92; }
    else if (teamObject.tactic === 'counter-attacking') { avgAttack *= 0.95; avgDefense *= 1.08; }
    else if (teamObject.tactic === 'possession') { avgAttack *= 1.03; avgDefense *= 1.03; }


    let teamCohesion = teamObject.name === gameState.userTeam.name ? (gameState.userTeam.teamAtmosphere || 65) : getRandomInt(55,80);
    teamCohesion += positionMatchBonus;
    teamCohesion = Math.min(100, Math.max(20, teamCohesion)); // Мин. сыгранность 20

    const cohesionFactor = (teamCohesion - 50) / 50 * 0.12; // +/- 12%
    const formFactor = (avgFormOrStamina - 50) / 50 * 0.15; // +/- 15% от формы/стамины
    const moraleFactorMatch = (avgMorale - 50) / 50 * 0.10; // +/- 10% от морали

    avgAttack = avgAttack * (1 + cohesionFactor + formFactor + moraleFactorMatch);
    avgDefense = avgDefense * (1 + cohesionFactor + formFactor + moraleFactorMatch);

    avgAttack = Math.max(15, Math.min(125, Math.round(avgAttack)));
    avgDefense = Math.max(15, Math.min(125, Math.round(avgDefense)));

    return {
        attack: avgAttack,
        defense: avgDefense,
        overall: Math.round((avgAttack + avgDefense) / 2),
        cohesion: Math.round(teamCohesion)
    };
}


// --- Симуляция матча ---
function initiateMatchSimulation(matchId) {
    const match = gameState.schedule.find(m => m.matchId === matchId);
    if (!match || match.played) {
        console.error("Матч не найден или уже сыгран:", matchId);
        if(typeof showMessage === "function") showMessage("Ошибка", "Матч не найден или уже сыгран.");
        return;
    }
     if (match.isUserMatch && typeof canUserTeamPlayMatch === "function" && !canUserTeamPlayMatch()) {
        if(typeof showMessage === "function") showMessage("Ошибка состава", "Недостаточно здоровых игроков в стартовом составе для начала матча (минимум 7).");
        return;
    }

    const homeTeamRef = getTeamReference(match.homeTeam); // getTeamReference из game_logic_core.js
    const awayTeamRef = getTeamReference(match.awayTeam);

    if (!homeTeamRef || !awayTeamRef) {
        console.error(`Не удалось найти одну из команд для матча: ${match.homeTeam} vs ${match.awayTeam}`);
        if(typeof showMessage === "function") showMessage("Ошибка", "Не удалось найти одну из команд для матча.");
        match.played = true; match.homeScore = 0; match.awayScore = 0;
        
        if (typeof updateLeagueTableAfterMatch === "function") {
             updateLeagueTableAfterMatch(match);
        }
        
        if(typeof updateAllUIDisplays === "function") updateAllUIDisplays();
        return;
    }

    currentMatchSimulation = {
        matchId: matchId,
        homeTeam: JSON.parse(JSON.stringify(homeTeamRef)), // Глубокая копия, чтобы не менять gameState напрямую во время симуляции
        awayTeam: JSON.parse(JSON.stringify(awayTeamRef)),
        homeScore: 0,
        awayScore: 0,
        currentTime: 0,
        events: [],
        playerStamina: {},
        substitutionsMade: 0,
        matchFinalized: false,
        isPaused: false,
        isUserMatch: match.isUserMatch
    };

    const initializeStamina = (team) => {
        if (team && team.startingXI && team.players) {
            team.startingXI.forEach(playerId => {
                if (playerId) {
                    const player = team.players.find(p => p.id === playerId);
                    if (player) {
                        currentMatchSimulation.playerStamina[playerId] = player.form;
                    }
                }
            });
        }
    };
    initializeStamina(currentMatchSimulation.homeTeam);
    initializeStamina(currentMatchSimulation.awayTeam);

    if(ui.matchSimOverlay) {
        ui.matchSimOverlay.style.display = 'flex';
        if(ui.matchTeamsInfo) ui.matchTeamsInfo.textContent = `${match.homeTeam} vs ${match.awayTeam}`;
        if(ui.matchEvents) ui.matchEvents.innerHTML = '';
        if(ui.matchCurrentScore) ui.matchCurrentScore.textContent = `0 - 0`;
        if(ui.matchTimeDisplay) ui.matchTimeDisplay.textContent = `00:00`;
        if(ui.finalScore) ui.finalScore.textContent = '';
        if(ui.continueMatchSimBtn) ui.continueMatchSimBtn.style.display = 'none';
        if(ui.skipToResultBtn) ui.skipToResultBtn.style.display = 'inline-block';
        if(ui.closeMatchSimBtn) {
            ui.closeMatchSimBtn.style.display = 'inline-block';
            ui.closeMatchSimBtn.textContent = "Пропустить матч";
        }
        if(ui.matchSimTacticsPanel) ui.matchSimTacticsPanel.style.display = match.isUserMatch ? 'block' : 'none';
        if(match.isUserMatch && ui.userTeamSimName && gameState.userTeam) ui.userTeamSimName.textContent = gameState.userTeam.name;
        if(match.isUserMatch && ui.substitutionsLeft) ui.substitutionsLeft.textContent = MAX_SUBSTITUTIONS_PER_MATCH - currentMatchSimulation.substitutionsMade;
        if(match.isUserMatch && ui.substitutionsMax) ui.substitutionsMax.textContent = MAX_SUBSTITUTIONS_PER_MATCH;
        if(match.isUserMatch && ui.inMatchTacticSelect && gameState.userTeam) ui.inMatchTacticSelect.value = gameState.userTeam.tactic;

        addMatchEventToUI(0, "Матч начался!"); // addMatchEventToUI из main.js
        runMatchMinute();
    } else {
        console.error("UI для симуляции матча не найдено! Пропускаем матч до результата.");
        finalizeMatchSimulation(true);
    }
}

function runMatchMinute() {
    if (!currentMatchSimulation || currentMatchSimulation.matchFinalized || currentMatchSimulation.isPaused) {
        return;
    }

    currentMatchSimulation.currentTime++;

    const processStaminaDrain = (team) => {
        if (team && team.startingXI) {
            team.startingXI.forEach(playerId => {
                if (playerId && currentMatchSimulation.playerStamina[playerId] !== undefined) {
                    const playerRef = getMatchPlayerReference(playerId, team);
                    let staminaDrain = 0.5 + (playerRef ? (100 - (playerRef.workRate || 60)) / 200 : 0.25); // workRate от 20 до 80
                    if (team.tactic === "high-press") staminaDrain *= 1.3;
                    else if (team.tactic === "defensive") staminaDrain *= 0.8;
                    else if (team.tactic === "possession") staminaDrain *= 0.9;


                    currentMatchSimulation.playerStamina[playerId] = Math.max(0, currentMatchSimulation.playerStamina[playerId] - staminaDrain);
                }
            });
        }
    };
    processStaminaDrain(currentMatchSimulation.homeTeam);
    processStaminaDrain(currentMatchSimulation.awayTeam);

    handleMatchIncident(currentMatchSimulation.homeTeam, currentMatchSimulation.awayTeam, currentMatchSimulation.currentTime);
    handleMatchIncident(currentMatchSimulation.awayTeam, currentMatchSimulation.homeTeam, currentMatchSimulation.currentTime);

    if(ui.matchTimeDisplay) ui.matchTimeDisplay.textContent = `${String(currentMatchSimulation.currentTime).padStart(2, '0')}:00`;
    if(ui.matchCurrentScore) ui.matchCurrentScore.textContent = `${currentMatchSimulation.homeScore} - ${currentMatchSimulation.awayScore}`;

    if (currentMatchSimulation.currentTime >= 90) {
        finalizeMatchSimulation();
    } else {
        if (currentMatchSimulation.isUserMatch && currentMatchSimulation.currentTime % 15 === 0 && currentMatchSimulation.currentTime > 0) {
            currentMatchSimulation.isPaused = true;
            if(ui.continueMatchSimBtn) ui.continueMatchSimBtn.style.display = 'inline-block';
            if(ui.skipToResultBtn) ui.skipToResultBtn.style.display = 'inline-block';
            if(ui.closeMatchSimBtn) ui.closeMatchSimBtn.textContent = "Завершить";
            addMatchEventToUI(currentMatchSimulation.currentTime, "Тактическая пауза.");
        } else {
            const simSpeed = (gameState && gameState.settings && gameState.settings.matchSimulationSpeed) ? gameState.settings.matchSimulationSpeed : 100;
            setTimeout(runMatchMinute, simSpeed);
        }
    }
}

function handleMatchIncident(attackingTeam, defendingTeam, currentTime) {
    if (!currentMatchSimulation || Math.random() > 0.3) return; // Шанс 30% на событие

    const attStrength = calculateTeamStrength(attackingTeam, true);
    const defStrength = calculateTeamStrength(defendingTeam, true);

    const attackRoll = Math.random() * (attStrength.attack + (attStrength.cohesion / 4));
    const defenseRoll = Math.random() * (defStrength.defense + (defStrength.cohesion / 4));

    if (attackRoll > defenseRoll * 0.9) { // Момент для атаки (0.9 - чтобы было больше моментов)
        const goalChanceBase = 0.12;
        const goalChance = goalChanceBase + (attStrength.attack - defStrength.defense) / 250 + (attStrength.cohesion - defStrength.cohesion) / 350;
        
        if (Math.random() < Math.max(0.03, Math.min(0.45, goalChance))) {
            const scorers = attackingTeam.startingXI.filter(id => {
                if (!id) return false;
                const p = getMatchPlayerReference(id, attackingTeam);
                return p && p.position !== 'ВРТ';
            });
            const scorerId = getRandomElement(scorers.length > 0 ? scorers : attackingTeam.startingXI.filter(id => id)); // Если нет полевых, может забить кто угодно из состава
            const scorer = scorerId ? getMatchPlayerReference(scorerId, attackingTeam) : null;
            const scorerName = scorer ? scorer.name.split(" ")[1] : attackingTeam.name;

            if (attackingTeam.name === currentMatchSimulation.homeTeam.name) currentMatchSimulation.homeScore++;
            else currentMatchSimulation.awayScore++;
            
            const eventMsg = `ГОЛ! ${scorerName} (${attackingTeam.name}) забивает! Счет: ${currentMatchSimulation.homeScore}-${currentMatchSimulation.awayScore}`;
            currentMatchSimulation.events.push({time: currentTime, text: eventMsg, type: 'goal', team: attackingTeam.name});
            addMatchEventToUI(currentTime, eventMsg);
            if(ui.matchCurrentScore) ui.matchCurrentScore.textContent = `${currentMatchSimulation.homeScore} - ${currentMatchSimulation.awayScore}`;
        } else if (Math.random() < 0.05) { // Шанс на карточку
            const cardedPlayerId = getRandomElement(defendingTeam.startingXI.filter(id => id));
            const cardedPlayer = cardedPlayerId ? getMatchPlayerReference(cardedPlayerId, defendingTeam) : null;
            if (cardedPlayer) {
                const cardedPlayerName = cardedPlayer.name.split(" ")[1];
                const eventMsg = `Желтая карточка игроку ${cardedPlayerName} (${defendingTeam.name}).`;
                currentMatchSimulation.events.push({time: currentTime, text: eventMsg, type: 'card', team: defendingTeam.name});
                addMatchEventToUI(currentTime, eventMsg);
            }
        }
    }
}

function finalizeMatchSimulation(skippedToResult = false) {
    if (!currentMatchSimulation || currentMatchSimulation.matchFinalized) return;
    currentMatchSimulation.matchFinalized = true;

    const match = gameState.schedule.find(m => m.matchId === currentMatchSimulation.matchId);
    if (!match) {
        console.error("Original match data not found in schedule during finalize!");
        currentMatchSimulation = null;
        return;
    }

    if (skippedToResult && currentMatchSimulation.currentTime < 90) {
        addMatchEventToUI(currentMatchSimulation.currentTime, `Матч пропущен до результата...`);
        for (let t = currentMatchSimulation.currentTime + 1; t <= 90; t++) {
             if (Math.random() < 0.15) { // Уменьшил шанс на событие при пропуске
                handleMatchIncident(currentMatchSimulation.homeTeam, currentMatchSimulation.awayTeam, t);
                handleMatchIncident(currentMatchSimulation.awayTeam, currentMatchSimulation.homeTeam, t);
            }
        }
         currentMatchSimulation.currentTime = 90;
         addMatchEventToUI(90, `Матч завершен (пропущен до результата).`);
    } else if (currentMatchSimulation.currentTime >= 90 || !skippedToResult) { // Если доиграли или не пропускали
         addMatchEventToUI(90, "Финальный свисток!");
    }

    match.homeScore = currentMatchSimulation.homeScore;
    match.awayScore = currentMatchSimulation.awayScore;
    match.played = true;

    if(ui.finalScore) ui.finalScore.textContent = `Итоговый счет: ${match.homeScore} - ${match.awayScore}`;
    if(ui.continueMatchSimBtn) ui.continueMatchSimBtn.style.display = 'none';
    if(ui.skipToResultBtn) ui.skipToResultBtn.style.display = 'none';
    if(ui.closeMatchSimBtn) ui.closeMatchSimBtn.textContent = "Закрыть";

    if (typeof addNews === "function") { // addNews из game_logic_core.js
        const competitionDisplay = match.competition === "League" ? "Лига" : (match.cupData && CUP_COMPETITIONS[match.cupData.cupKey] ? CUP_COMPETITIONS[match.cupData.cupKey].name : match.competition);
        addNews('matchResult', match.homeTeam, match.awayTeam, match.homeScore, match.awayScore, match.isUserMatch, competitionDisplay + (match.round ? ` (${match.round})` : ''));
    }

    // ===== НАЧАЛО ИСПРАВЛЕНИЯ 2 =====
    // Вызываем единую функцию для обновления таблицы, если она существует
    if (typeof updateLeagueTableAfterMatch === "function") {
        updateLeagueTableAfterMatch(match);
    }
    // ===== КОНЕЦ ИСПРАВЛЕНИЯ 2 =====
// ===== НАЧАЛО ИНТЕГРАЦИИ ИСТОРИИ =====
    if (typeof updateRecordsAfterMatch === "function") {
        updateRecordsAfterMatch(match);
    }
    if (typeof generateMediaReaction === "function") {
        generateMediaReaction(match);
    }

    // Обновляем данные игроков в основном gameState, а не в копиях из currentMatchSimulation
    const originalHomeTeam = getTeamReference(currentMatchSimulation.homeTeam.name);
    const originalAwayTeam = getTeamReference(currentMatchSimulation.awayTeam.name);

    if(originalHomeTeam) processPostMatchPlayerChanges(originalHomeTeam, match.homeScore, match.awayScore, currentMatchSimulation.playerStamina);
    if(originalAwayTeam) processPostMatchPlayerChanges(originalAwayTeam, match.awayScore, match.homeScore, currentMatchSimulation.playerStamina);


    if (match.isUserMatch && ui.lastUserMatchResultText) {
        const competitionDisplay = match.competition === "League" ? "Лига" : (match.cupData && CUP_COMPETITIONS[match.cupData.cupKey] ? CUP_COMPETITIONS[match.cupData.cupKey].name : match.competition);
        ui.lastUserMatchResultText.textContent = `${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam} (${competitionDisplay} ${match.round || ''})`;
    }
}

function processPostMatchPlayerChanges(teamObjectInGameState, goalsFor, goalsAgainst, playerStaminaMap) {
    if (!teamObjectInGameState || !teamObjectInGameState.players) return; // Работаем с объектом из gameState
    const isUserTeam = teamObjectInGameState.name === gameState.userTeam.name;
    const win = goalsFor > goalsAgainst;
    const draw = goalsFor === goalsAgainst;

    teamObjectInGameState.players.forEach(player => {
        if (!player) return;
        // Игрок считается игравшим, если он был в стартовом составе ЭТОЙ команды в симуляции ИЛИ вышел на замену
        const simTeam = currentMatchSimulation.homeTeam.name === teamObjectInGameState.name ? currentMatchSimulation.homeTeam : currentMatchSimulation.awayTeam;
        const playedInMatch = simTeam.startingXI.includes(player.id) || player.playedInMatch; // player.playedInMatch устанавливается при замене

        if (playedInMatch) {
            if (playerStaminaMap[player.id] !== undefined) {
                player.form = Math.max(5, Math.min(100, Math.floor(playerStaminaMap[player.id]) - getRandomInt(1,6)));
            } else {
                player.form = Math.max(25, player.form - getRandomInt(4, 10));
            }

            if (win) player.morale = Math.min(100, player.morale + getRandomInt(4, 10));
            else if (draw) player.morale = Math.min(100, Math.max(0, player.morale + getRandomInt(-3, 3)));
            else player.morale = Math.max(0, player.morale - getRandomInt(4, 10));

            if (player.status.type === 'fit' && Math.random() < 0.015 * (1 + player.injuryProneness / 70)) {
                const injuryDuration = getRandomInt(1, (goalsFor < goalsAgainst ? 5:4) );
                player.status = {type: 'injured', duration: injuryDuration, affectedStat: null};
                if(isUserTeam && typeof addNews === "function") { // addNews из game_logic_core.js
                    addNews('playerInjured', player.name, injuryDuration, teamObjectInGameState.name, "в матче");
                }
            }
        } else {
             player.form = Math.min(100, player.form + getRandomInt(0,3));
             player.morale = Math.max(0, player.morale - getRandomInt(0,4));
        }
        player.playedInMatch = false;
    });
}

function makeSubstitution() {
    if (!currentMatchSimulation || !currentMatchSimulation.isUserMatch || currentMatchSimulation.substitutionsMade >= MAX_SUBSTITUTIONS_PER_MATCH) {
        if(typeof showMessage === "function") showMessage("Замены", "Лимит замен исчерпан или это не ваш матч.");
        if(ui.substitutionOverlay) ui.substitutionOverlay.style.display = 'none';
        return;
    }

    const subOutId = ui.subOutPlayerSelect ? parseInt(ui.subOutPlayerSelect.value) : null;
    const subInId = ui.subInPlayerSelect ? parseInt(ui.subInPlayerSelect.value) : null;

    if (!subOutId || !subInId || subOutId === subInId) {
        if(typeof showMessage === "function") showMessage("Замены", "Выберите корректных игроков для замены.");
        return;
    }

    const userTeamInSim = currentMatchSimulation.homeTeam.name === gameState.userTeam.name ? currentMatchSimulation.homeTeam : currentMatchSimulation.awayTeam;

    const playerOut = userTeamInSim.players.find(p => p.id === subOutId);
    const playerIn = userTeamInSim.players.find(p => p.id === subInId);

    if (!playerOut || !playerIn || !userTeamInSim.startingXI.includes(subOutId) || playerIn.status.type !== 'fit' || userTeamInSim.startingXI.includes(subInId)) {
         if(typeof showMessage === "function") showMessage("Замены", "Ошибка данных для замены (игрок не в старте, не готов или уже на поле).");
        return;
    }

    const indexOut = userTeamInSim.startingXI.indexOf(subOutId);
    userTeamInSim.startingXI[indexOut] = subInId;
    // Устанавливаем флаг для вышедшего игрока В КОПИИ команды в симуляции
    const playerInRefSim = userTeamInSim.players.find(p => p.id === subInId);
    if(playerInRefSim) playerInRefSim.playedInMatch = true;


    currentMatchSimulation.playerStamina[subInId] = playerIn.form; // Выносливость для вышедшего

    currentMatchSimulation.substitutionsMade++;
    if(ui.substitutionsLeft) ui.substitutionsLeft.textContent = MAX_SUBSTITUTIONS_PER_MATCH - currentMatchSimulation.substitutionsMade;
    addMatchEventToUI(currentMatchSimulation.currentTime, `Замена в ${userTeamInSim.name}: ${playerIn.name.split(" ")[1]} вместо ${playerOut.name.split(" ")[1]}.`);

    if(ui.substitutionOverlay) ui.substitutionOverlay.style.display = 'none';
}