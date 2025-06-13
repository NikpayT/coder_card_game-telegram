// js/ui_renderer.js

// Предполагается, что ui объект (из main.js) и gameState (из game_state.js) доступны глобально.
// Также доступны константы из data.js и функции из game_logic_core.js / game_logic_match_sim.js

function updateAllUIDisplays() {
    if (!gameState || !gameState.gameInitialized) {
        return;
    }

    if(ui.budget) ui.budget.textContent = gameState.budget.toLocaleString();
    if(ui.currentWeek) ui.currentWeek.textContent = gameState.currentWeek;
    if(ui.currentSeason) ui.currentSeason.textContent = gameState.currentSeason;
    if(ui.totalWeeks) ui.totalWeeks.textContent = gameState.seasonLength;
    if(ui.fanHappiness) ui.fanHappiness.textContent = gameState.fanHappiness;
    if(ui.boardConfidence) ui.boardConfidence.textContent = gameState.boardConfidence;
    if(ui.clubNameHeader) ui.clubNameHeader.textContent = `${gameState.clubName} ${gameState.avatar}`;

    // Рендерим только активный экран для оптимизации
    const activeScreen = Object.keys(ui.screens).find(key => ui.screens[key] && ui.screens[key].classList.contains('active'));
    if (activeScreen) {
        const renderFunctionName = `render${activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)}Screen`;
        if (typeof window[renderFunctionName] === "function") {
            window[renderFunctionName]();
        } else { // Для экранов с другим форматом имени функции рендера
            if (activeScreen === "league" && typeof renderLeagueTable === "function") {
                renderLeagueTable();
            } else if (activeScreen === "cup" && typeof renderCupScreen === "function") {
                renderCupScreen();
            } else if (activeScreen === "fixtures" && typeof renderSchedule === "function" && ui.fixtureFilters) {
                 renderSchedule(ui.fixtureFilters.querySelector('button.active')?.dataset.filter || "current_week");
            }
            // ===== ИСПРАВЛЕНИЕ: Добавлено сюда, в правильное место =====
            else if (activeScreen === "history" && typeof renderHistoryScreen === "function") {
                renderHistoryScreen();
            }
            // =======================================================
        }
    } else if (ui.screens.news) { // Если нет активного, рендерим новости (например, при первой загрузке)
        renderNewsFeed();
    }


    if (ui.newGameBtn) ui.newGameBtn.style.display = 'inline-block';
}

function renderNewsFeed() {
    if (!ui.newsFeed || !gameState || !gameState.news) return;
    ui.newsFeed.innerHTML = '';
    if (gameState.news.length === 0) {
        ui.newsFeed.innerHTML = '<li>Лента новостей пуста.</li>';
        return;
    }
    gameState.news.slice(0, NEWS_FEED_LIMIT_UI).forEach(item => {
        const li = document.createElement('li');
        // Добавляем класс для стилизации заголовков СМИ
        if (item.type === 'media_headline') {
            li.classList.add('media-headline');
        }
        const datePrefix = item.week && item.season ? `(С:${item.season},Н:${item.week}) ` : '';
        li.textContent = `${datePrefix}${item.message}`;
        ui.newsFeed.appendChild(li);
    });
}


function renderOfficeScreen() {
    if (!ui.screens.office || !ui.screens.office.classList.contains('active') || !gameState) return;

    if(ui.boardConfidenceValue) ui.boardConfidenceValue.textContent = gameState.boardConfidence;
    if(ui.boardConfidenceText && typeof getBoardConfidenceText === "function") ui.boardConfidenceText.textContent = getBoardConfidenceText();
    if(ui.fanHappinessValue) ui.fanHappinessValue.textContent = gameState.fanHappiness;
    if(ui.fanHappinessText && typeof getFanHappinessText === "function") ui.fanHappinessText.textContent = getFanHappinessText();
    if(ui.teamAtmosphereDisplay && typeof getTeamAtmosphereText === "function" && gameState.userTeam) ui.teamAtmosphereDisplay.textContent = getTeamAtmosphereText();

    if(ui.holdTeamMeetingBtn) ui.holdTeamMeetingBtn.disabled = gameState.teamMeetingCooldown > 0;
    if(ui.callPressConferenceBtn) ui.callPressConferenceBtn.disabled = gameState.pressConferenceCooldown > 0;
    if(ui.teamMeetingCooldownDisplay) ui.teamMeetingCooldownDisplay.textContent = gameState.teamMeetingCooldown > 0 ? `(Доступно через ${gameState.teamMeetingCooldown} нед.)` : 'Готово';
    if(ui.pressConferenceCooldownDisplay) ui.pressConferenceCooldownDisplay.textContent = gameState.pressConferenceCooldown > 0 ? `(Доступно через ${gameState.pressConferenceCooldown} нед.)` : 'Готово';

    if(ui.seasonObjectivesList && gameState.userTeam && gameState.userTeam.seasonObjectives) {
        ui.seasonObjectivesList.innerHTML = '';
        ui.seasonObjectivesList.innerHTML += `<li>Лига: Занять место не ниже ${gameState.userTeam.seasonObjectives.leaguePosition}</li>`;
        if (gameState.userTeam.seasonObjectives.cupProgress) {
             ui.seasonObjectivesList.innerHTML += `<li>Кубок: Дойти до ${gameState.userTeam.seasonObjectives.cupProgress}</li>`;
        }
    } else if (ui.seasonObjectivesList) {
        ui.seasonObjectivesList.innerHTML = '<li>Цели на сезон пока не определены.</li>';
    }
}

function calculateTeamOverallStats() {
    if (!gameState || !gameState.userTeam || !gameState.userTeam.players) {
        if(ui.totalAttack) ui.totalAttack.textContent = "0";
        if(ui.totalDefense) ui.totalDefense.textContent = "0";
        if(ui.avgMorale) ui.avgMorale.textContent = "0";
        if(ui.avgForm) ui.avgForm.textContent = "0";
        if(ui.teamCohesionDisplay) ui.teamCohesionDisplay.textContent = "0";
        if(ui.squadSizeDisplay) ui.squadSizeDisplay.textContent = `0/${MAX_SQUAD_SIZE_TEAM}`;
        return;
    }

    let totalMorale = 0, totalForm = 0;
    const playerCount = gameState.userTeam.players.length;
    const activePlayers = gameState.userTeam.players.filter(p => p && p.status && p.status.type === 'fit' && !p.internationalDuty && !p.onLoan);

    if (activePlayers.length > 0) {
        activePlayers.forEach(p => {
            totalMorale += p.morale;
            totalForm += p.form;
        });
        if (ui.avgMorale) ui.avgMorale.textContent = Math.round(totalMorale / activePlayers.length);
        if (ui.avgForm) ui.avgForm.textContent = Math.round(totalForm / activePlayers.length);
    } else {
        if (ui.avgMorale) ui.avgMorale.textContent = "0";
        if (ui.avgForm) ui.avgForm.textContent = "0";
    }

    const teamOverallStrength = typeof calculateTeamStrength === "function" ? calculateTeamStrength(gameState.userTeam) : { attack: 0, defense: 0, cohesion: 0};

    if (ui.totalAttack) ui.totalAttack.textContent = teamOverallStrength.attack;
    if (ui.totalDefense) ui.totalDefense.textContent = teamOverallStrength.defense;
    if (ui.teamCohesionDisplay) ui.teamCohesionDisplay.textContent = teamOverallStrength.cohesion;
    if (ui.squadSizeDisplay) ui.squadSizeDisplay.textContent = `${playerCount}/${MAX_SQUAD_SIZE_TEAM}`;
}

function renderTeamScreen(){
    if (!ui.screens.team || !ui.screens.team.classList.contains('active') || !gameState || !gameState.userTeam) return;
    calculateTeamOverallStats();
    renderPlayerListWithFilters();
}

function renderPlayerListItem(player, listElement, actions = [], isYouth = false) {
    if (!player || !listElement || !player.contract) {
        return;
    }

    const li = document.createElement('li');
    li.classList.add('list-item', 'player-item');
    if (player.status && player.status.type === 'injured') li.classList.add('status-injured');
    else if (player.status && player.status.type === 'suspended') li.classList.add('status-suspended');
    if (player.internationalDuty) li.classList.add('status-international');
    if (player.onLoan) li.classList.add('status-on-loan');

    li.dataset.playerId = player.id;
    li.draggable = actions.includes('drag') && player.status && player.status.type === 'fit' && !player.internationalDuty && !player.onLoan;

    const weeksLeft = typeof getWeeksLeftInContract === "function" ? getWeeksLeftInContract(player) : 0;
    let contractInfo = `З/П: ${player.contract.salary.toLocaleString()}$`;
    if (!isYouth && player.contract.endDate) {
        contractInfo += `, До: ${player.contract.endDate.week}/${player.contract.endDate.season} (${weeksLeft} нед.)`;
    } else if (isYouth) {
        const potentialValue = typeof getPlayerPotentialValue === "function" ? getPlayerPotentialValue(player) : 0;
        contractInfo = `Юниорский контракт (до ${player.age + Math.max(1, 3 - Math.floor(potentialValue/40))} лет)`;
    }
    if (!isYouth && player.isUserPlayer && weeksLeft <= MIN_CONTRACT_WEEKS_RENEWAL && weeksLeft > 0 ) {
         li.classList.add('contract-warning');
         contractInfo += ' ⚠️';
    }

    const displayStats = (player.isUserPlayer || player.isYouth || player.scoutedLevel >=3) ? player : (typeof getScoutedPlayerDisplayStats === "function" ? getScoutedPlayerDisplayStats(player) : player);
    const potentialRatingText = typeof getPlayerPotentialRating === "function" ? getPlayerPotentialRating(player) : '?';
    const statusText = player.onLoan ? `В аренде у ${player.onLoan.teamName} (${player.onLoan.weeksLeft} нед.)` :
                       (player.internationalDuty ? 'В сборной' :
                       (player.status && player.status.type === 'fit' ? 'Готов' :
                       (player.status && player.status.type === 'injured' ? `Травма (${player.status.duration} нед.)` :
                       (player.status && player.status.type === 'suspended' ? `Дискв. (${player.status.duration} м.)` : 'Неизвестно'))));


    let playerInfoHtml = `
        <div class="player-info">
            <strong>${displayStats.name || 'Неизвестно'}</strong> (Поз: ${displayStats.position || '?'}, Воз: ${displayStats.age || '?'})<br>
            <span class="item-details">Ата: ${displayStats.attack || '?'} / Защ: ${displayStats.defense || '?'} / Пот: ${potentialRatingText} / Фор: ${displayStats.form || '?'}% / Мор: ${displayStats.morale || '?'}%</span>
            <span class="player-status">${contractInfo}. ${statusText}</span>
        </div>
    `;
    if (player.scoutedLevel < 3 && !player.isUserPlayer && !isYouth) {
         playerInfoHtml = `
            <div class="player-info">
                <strong>${displayStats.name || 'Неизвестно'}</strong> (Поз: ${displayStats.position || '?'}, Воз: ${displayStats.age || '?'})<br>
                <span class="item-details">Ата: ${displayStats.attack || '?'} / Защ: ${displayStats.defense || '?'} / Пот: ? / Фор: ? / Мор: ?</span>
                <span class="player-status">З/П: ?, Контракт: ?. Скаутинг: ${player.scoutedLevel}/3</span>
            </div>`;
    }

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('player-actions');

    if (actions.includes('sell') && player.isUserPlayer && !player.isYouth && player.price > 0 && !player.onLoan) {
        const sellButton = document.createElement('button'); sellButton.className = 'sell-btn small-action-button';
        sellButton.textContent = `Продать ($${player.price.toLocaleString()})`;
        sellButton.onclick = () => { if(typeof handleSellPlayer === "function") handleSellPlayer(player.id); }; buttonsDiv.appendChild(sellButton);
    }
    if (actions.includes('buy') && !player.isUserPlayer && player.scoutedLevel >=3 && gameState.userTeam) {
        const buyButton = document.createElement('button'); buyButton.className = 'buy-btn small-action-button';
        buyButton.textContent = `Купить ($${player.price.toLocaleString()})`;
        buyButton.disabled = gameState.budget < player.price || gameState.userTeam.players.length >= MAX_SQUAD_SIZE_TEAM;
        buyButton.onclick = () => { if(typeof handleBuyPlayer === "function") handleBuyPlayer(player.id); }; buttonsDiv.appendChild(buyButton);
    }
    if (actions.includes('scout') && player.scoutedLevel < 3 && !player.isUserPlayer && !isYouth && typeof getAllScoutsWithAssignments === "function" && gameState.userTeam) {
        const scoutAssignment = getAllScoutsWithAssignments().find(s => s.assignment === player.id);
        const chiefScoutSkill = (gameState.userTeam.staff && gameState.userTeam.staff.chiefScout) ? gameState.userTeam.staff.chiefScout.skillLevel : 0;
        const scoutCost = Math.floor(SCOUTING_BASE_COST * (player.scoutedLevel + 1.2) * (1 - (chiefScoutSkill / 280)));
        const scoutButton = document.createElement('button'); scoutButton.className = 'scout-btn small-action-button';
        if(scoutAssignment) {
            scoutButton.textContent = `Разведка (${scoutAssignment.weeksLeft}н)`; scoutButton.disabled = true;
        } else {
            scoutButton.textContent = `Скаут (${player.scoutedLevel+1}/3) $${scoutCost.toLocaleString()}`;
            const availableScouts = ((gameState.userTeam.staff && gameState.userTeam.staff.chiefScout && !gameState.userTeam.staff.chiefScout.assignment) ? 1:0) + (gameState.userTeam.staff && gameState.userTeam.staff.scouts ? gameState.userTeam.staff.scouts.filter(s=>!s.assignment).length : 0);
            scoutButton.disabled = gameState.budget < scoutCost || availableScouts === 0;
            scoutButton.onclick = () => { if(typeof handleScoutPlayer === "function") handleScoutPlayer(player.id, scoutCost); };
        }
        buttonsDiv.appendChild(scoutButton);
    }
    if (actions.includes('renew') && player.isUserPlayer && !player.isYouth && weeksLeft > 0 && weeksLeft <= MIN_CONTRACT_WEEKS_RENEWAL * 3 && !player.onLoan) {
        const renewButton = document.createElement('button'); renewButton.className = 'action-button small-action-button';
        renewButton.textContent = 'Продлить'; renewButton.onclick = () => { if(typeof openContractNegotiation === "function") openContractNegotiation(player.id); };
        buttonsDiv.appendChild(renewButton);
    }
    if (actions.includes('promote') && isYouth && gameState.userTeam) {
        const promoteButton = document.createElement('button'); promoteButton.className = 'promote-btn small-action-button';
        promoteButton.textContent = 'В основу';
        promoteButton.disabled = gameState.userTeam.players.length >= MAX_SQUAD_SIZE_TEAM;
        promoteButton.onclick = () => { if(typeof handlePromoteYouthPlayer === "function") handlePromoteYouthPlayer(player.id); }; buttonsDiv.appendChild(promoteButton);
    }
    if (actions.includes('loan') && player.isUserPlayer && !player.isYouth && player.age < 25 && !player.onLoan && player.status && player.status.type === 'fit') {
        const loanButton = document.createElement('button'); loanButton.className = 'action-button yellow small-action-button';
        loanButton.textContent = 'В аренду'; loanButton.onclick = () => { if(typeof offerPlayerForLoan === "function") offerPlayerForLoan(player.id); };
        buttonsDiv.appendChild(loanButton);
    }
     if (actions.includes('details') && gameState.userTeam) {
        const detailsButton = document.createElement('button'); detailsButton.className = 'small-action-button';
        detailsButton.textContent = 'Инфо';
        const sourceArray = isYouth ? (gameState.userTeam.youthAcademy ? gameState.userTeam.youthAcademy.players : []) : (player.isUserPlayer ? gameState.userTeam.players : (gameState.transferMarket ? gameState.transferMarket.players : []));
        detailsButton.onclick = () => { if(typeof showPlayerDetails === "function") showPlayerDetails(player.id, sourceArray ); };
        buttonsDiv.appendChild(detailsButton);
    }

    li.innerHTML = playerInfoHtml;
    li.appendChild(buttonsDiv);
    listElement.appendChild(li);

    if (li.draggable) {
        li.addEventListener('dragstart', (e) => { if(e.dataTransfer) e.dataTransfer.setData('text/plain', player.id.toString()); li.classList.add('dragging'); });
        li.addEventListener('dragend', () => li.classList.remove('dragging'));
    }
}

function renderPlayerListWithFilters() {
    if (!ui.playerList || !gameState || !gameState.userTeam || !gameState.userTeam.players) return;
    ui.playerList.innerHTML = '';
    if (gameState.userTeam.players.length === 0) {
        ui.playerList.innerHTML = '<li>В команде нет игроков.</li>'; return;
    }

    const filterPosition = ui.playerListFilterPosition ? ui.playerListFilterPosition.value : "all";
    const filterStatus = ui.playerListFilterStatus ? ui.playerListFilterStatus.value : "all";
    const sortBy = ui.playerListSort ? ui.playerListSort.value : "default";
    let filteredPlayers = [...gameState.userTeam.players];

    if (filterPosition !== "all") filteredPlayers = filteredPlayers.filter(p => p.position === filterPosition);
    if (filterStatus !== "all") {
        if (filterStatus === "on_loan") filteredPlayers = filteredPlayers.filter(p => p.onLoan);
        else if (filterStatus === "international_duty") filteredPlayers = filteredPlayers.filter(p => p.internationalDuty);
        else filteredPlayers = filteredPlayers.filter(p => p.status && p.status.type === filterStatus && !p.onLoan && !p.internationalDuty);
    }
    const getOverallForSort = (p) => (typeof getEffectivePlayerStats === "function" ? getEffectivePlayerStats(p).overall : (p.attack + p.defense) / 2);

    switch (sortBy) {
        case "overall": filteredPlayers.sort((a, b) => getOverallForSort(b) - getOverallForSort(a)); break;
        case "age": filteredPlayers.sort((a, b) => a.age - b.age); break;
        case "contract_left": filteredPlayers.sort((a, b) => (typeof getWeeksLeftInContract === "function" ? getWeeksLeftInContract(a) : 0) - (typeof getWeeksLeftInContract === "function" ? getWeeksLeftInContract(b) : 0)); break;
        case "morale": filteredPlayers.sort((a,b) => (b.morale || 0) - (a.morale || 0)); break;
        case "form": filteredPlayers.sort((a,b) => (b.form || 0) - (a.form || 0)); break;
        default:
             filteredPlayers.sort((a,b) => PLAYER_POSITIONS.indexOf(a.position) - PLAYER_POSITIONS.indexOf(b.position) || getOverallForSort(b) - getOverallForSort(a));
            break;
    }
    filteredPlayers.forEach(player => { renderPlayerListItem(player, ui.playerList, ['sell', 'renew', 'loan', 'details']); });
}


function renderTacticsScreen() {
    if (!ui.screens.tactics || !ui.screens.tactics.classList.contains('active') || !gameState || !gameState.userTeam || !gameState.userTeam.formation || typeof getFormationStructure !== 'function') {
        if (ui.startingLineupFormation) ui.startingLineupFormation.innerHTML = 'Не удалось загрузить тактику (отсутствуют данные).';
        if (ui.benchPlayersList) ui.benchPlayersList.innerHTML = '';
        return;
    }
    if (ui.formationSelect) ui.formationSelect.value = gameState.userTeam.formation;
    if (ui.tacticSelect) ui.tacticSelect.value = gameState.userTeam.tactic;
    if (ui.startingLineupFormation) ui.startingLineupFormation.innerHTML = '';

    const formationStructure = getFormationStructure(gameState.userTeam.formation);
    if (!Array.isArray(formationStructure) || formationStructure.length === 0) {
        console.error("renderTacticsScreen: formationStructure не является корректным массивом.");
        if (ui.startingLineupFormation) ui.startingLineupFormation.innerHTML = 'Ошибка загрузки структуры формации.';
        return;
    }

    let slotIndex = 0;
    formationStructure.forEach(line => {
        if (!line || !Array.isArray(line.positions)) return;
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('formation-line', `line-${line.line ? line.line.toLowerCase().replace(/\s+/g, '-') : 'unknown'}`);
        line.positions.forEach(posDetail => {
            if (slotIndex >= REQUIRED_STARTERS) return;
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('formation-slot');
            slotDiv.dataset.slotIndex = slotIndex;
            slotDiv.dataset.targetPosition = posDetail.base;
            const playerIdInSlot = gameState.userTeam.startingXI ? gameState.userTeam.startingXI[slotIndex] : null;
            const player = playerIdInSlot ? gameState.userTeam.players.find(p => p.id === playerIdInSlot) : null;

            if (player) {
                const effStats = typeof getEffectivePlayerStats === "function" ? getEffectivePlayerStats(player) : {overall: Math.round((player.attack+player.defense)/2)};
                slotDiv.innerHTML = `<span class="player-name">${player.name.split(' ')[0][0]}. ${player.name.split(' ')[1]}</span><span class="player-pos-skill">${player.position} (${effStats.overall})</span>`;
                slotDiv.classList.add('has-player');
                if (player.status && (player.status.type !== 'fit' || player.internationalDuty || player.onLoan)) {
                    slotDiv.classList.add('player-unavailable');
                     slotDiv.title = `Недоступен: ${player.status.type === 'injured' ? 'Травма' : (player.status.type === 'suspended' ? 'Дискв.' : (player.internationalDuty ? 'Сборная' : 'Аренда'))}`;
                }
                if (player.position !== posDetail.base && posDetail.base !== "ANY") slotDiv.style.outline = '2px solid orange'; else slotDiv.style.outline = 'none';
                slotDiv.draggable = player.status && player.status.type === 'fit' && !player.internationalDuty && !player.onLoan;
                if(slotDiv.draggable) {
                    slotDiv.addEventListener('dragstart', (e) => { if(e.dataTransfer) e.dataTransfer.setData('text/plain', player.id + '_fromslot_' + slotIndex); slotDiv.classList.add('dragging'); });
                    slotDiv.addEventListener('dragend', () => slotDiv.classList.remove('dragging'));
                }
            } else {
                slotDiv.textContent = `(${posDetail.label || posDetail.base})`;
                if(gameState.userTeam.startingXI && gameState.userTeam.startingXI[slotIndex] !== null) gameState.userTeam.startingXI[slotIndex] = null;
            }
            slotDiv.addEventListener('dragover', (e) => e.preventDefault());
            slotDiv.addEventListener('drop', (e) => { if (typeof handleDropOnFormationSlot === "function") handleDropOnFormationSlot(e); });
            lineDiv.appendChild(slotDiv);
            slotIndex++;
        });
        if (ui.startingLineupFormation) ui.startingLineupFormation.appendChild(lineDiv);
    });
    while(slotIndex < REQUIRED_STARTERS && ui.startingLineupFormation) {
        const slotDiv = document.createElement('div');
        slotDiv.classList.add('formation-slot', 'empty-extra-slot');
        slotDiv.textContent = `(Пусто ${slotIndex + 1})`;
        const lastLine = ui.startingLineupFormation.lastElementChild || document.createElement('div');
        if (!ui.startingLineupFormation.lastElementChild) {
            lastLine.classList.add('formation-line', 'line-extra');
            ui.startingLineupFormation.appendChild(lastLine);
        }
        lastLine.appendChild(slotDiv);
        slotIndex++;
    }

    if (ui.benchPlayersList) ui.benchPlayersList.innerHTML = '';
    const benchPlayers = gameState.userTeam.players.filter(p => gameState.userTeam.startingXI && !gameState.userTeam.startingXI.includes(p.id));
    if (ui.benchCountDisplay) ui.benchCountDisplay.textContent = benchPlayers.length;
    benchPlayers.sort((a,b) => (a.status && a.status.type !== 'fit' ? 1 : (a.internationalDuty ? 0.5 : (a.onLoan ? 0.6 : -1))) - (b.status && b.status.type !== 'fit' ? 1 : (b.internationalDuty ? 0.5 : (b.onLoan ? 0.6 : -1))) || PLAYER_POSITIONS.indexOf(a.position) - PLAYER_POSITIONS.indexOf(b.position))
    .forEach(player => { renderPlayerListItem(player, ui.benchPlayersList, ['drag', 'renew', 'loan', 'details']); });

    if (ui.benchPlayersList) {
        ui.benchPlayersList.addEventListener('dragover', e => e.preventDefault());
        ui.benchPlayersList.addEventListener('drop', (e) => { if(typeof handleDropOnBench === "function") handleDropOnBench(e); });
    }
}

function renderTrainingScreen() {
    if (!ui.screens.training || !ui.screens.training.classList.contains('active') || !gameState || !gameState.userTeam) return;
    const baseEff = 50;
    const coachB = gameState.userTeam.coach ? (gameState.userTeam.coach.trainingBonus * 100) : 0;
    const fac = gameState.userTeam.facilities ? gameState.userTeam.facilities.trainingGround : null;
    const facB = fac && FACILITY_LEVELS.trainingGround ? (FACILITY_LEVELS.trainingGround.effects.trainingEffectivenessBonus[fac.level] * 100) : 0;
    const assistantB = (gameState.userTeam.staff && gameState.userTeam.staff.assistantCoach && STAFF_ROLES.assistantCoach) ? (STAFF_ROLES.assistantCoach.skillEffectiveness.trainingBoost * gameState.userTeam.staff.assistantCoach.skillLevel) : 0;
    if (ui.trainingEffectivenessBonus) ui.trainingEffectivenessBonus.textContent = Math.round(baseEff + coachB + facB + assistantB);

    const baseInjuryR = PLAYER_TRAINING_INJURY_CHANCE * 100;
    const injuryRedFac = fac && FACILITY_LEVELS.trainingGround ? (FACILITY_LEVELS.trainingGround.effects.injuryRiskReduction[fac.level] * 100) : 0;
    const physio = gameState.userTeam.staff ? gameState.userTeam.staff.physio : null;
    const injuryRedPhysio = physio && STAFF_ROLES.physio ? (STAFF_ROLES.physio.skillEffectiveness.injuryPrevention * physio.skillLevel) : 0;
    if (ui.trainingInjuryRisk) ui.trainingInjuryRisk.textContent = Math.max(0.05, Math.round((baseInjuryR - injuryRedFac - injuryRedPhysio)*10)/10 );

    const maxSlots = MAX_TRAINING_SLOTS + (fac ? Math.floor(fac.level / 2) : 0) + ((gameState.userTeam.staff && gameState.userTeam.staff.assistantCoach) ? 1 :0);
    if (ui.trainingSlotsMax) ui.trainingSlotsMax.textContent = maxSlots;
    const currentSlotsUsed = gameState.userTeam.trainingSlotsUsed || 0;
    if (ui.trainingSlotsAvailable) ui.trainingSlotsAvailable.textContent = maxSlots - currentSlotsUsed;

    if (ui.trainingPlayerSelection) {
        ui.trainingPlayerSelection.innerHTML = '';
        gameState.userTeam.players.filter(p => p.trainingFocus).forEach(player => {
            const div = document.createElement('div');
            div.classList.add('training-item');
            div.innerHTML = `<span>${player.name} - Фокус: ${player.trainingFocus.stat}, Интенс: ${player.trainingFocus.intensity}</span>
                             <button class="small-action-button red" data-player-id="${player.id}">Убрать</button>`;
            div.querySelector('button').onclick = () => {
                player.trainingFocus = null;
                gameState.userTeam.trainingSlotsUsed = Math.max(0, (gameState.userTeam.trainingSlotsUsed || 0) - 1);
                renderTrainingScreen();
            };
            ui.trainingPlayerSelection.appendChild(div);
        });

        if (currentSlotsUsed < maxSlots) {
            const formDiv = document.createElement('div');
            formDiv.classList.add('training-add-form');
            const selectPlayer = document.createElement('select');
            selectPlayer.innerHTML = '<option value="">-- Выбрать игрока --</option>';
            gameState.userTeam.players
                .filter(p => !p.trainingFocus && p.status && p.status.type === 'fit' && !p.onLoan && !p.internationalDuty)
                .sort((a,b) => a.name.localeCompare(b.name))
                .forEach(p => selectPlayer.innerHTML += `<option value="${p.id}">${p.name} (А:${p.attack}, З:${p.defense})</option>`);

            const selectFocus = document.createElement('select');
            selectFocus.innerHTML = `<option value="attack">Атака</option><option value="defense">Защита</option><option value="stamina">Форма</option>`;
            const selectIntensity = document.createElement('select');
            selectIntensity.innerHTML = `<option value="medium">Средняя</option><option value="low">Низкая</option><option value="high">Высокая</option>`;
            const addButton = document.createElement('button');
            addButton.textContent = "Добавить"; addButton.classList.add('small-action-button', 'green');
            addButton.onclick = () => {
                const playerId = selectPlayer.value;
                const player = gameState.userTeam.players.find(p => p.id.toString() === playerId);
                if (player) {
                    player.trainingFocus = { stat: selectFocus.value, intensity: selectIntensity.value };
                    gameState.userTeam.trainingSlotsUsed = (gameState.userTeam.trainingSlotsUsed || 0) + 1;
                    renderTrainingScreen();
                }
            };
            formDiv.append(selectPlayer, selectFocus, selectIntensity, addButton);
            ui.trainingPlayerSelection.appendChild(formDiv);
        }
    }

    if (ui.teamTrainingFocus) ui.teamTrainingFocus.value = gameState.userTeam.teamTrainingFocus;
    if (ui.teamTrainingDescription && typeof getTeamTrainingDescription === "function") {
        ui.teamTrainingDescription.textContent = getTeamTrainingDescription(gameState.userTeam.teamTrainingFocus);
    }
}

function renderYouthAcademyScreen() {
    if (!ui.screens.youth_academy || !ui.screens.youth_academy.classList.contains('active') || !gameState || !gameState.userTeam || !gameState.userTeam.facilities || !gameState.userTeam.youthAcademy) return;
    const facility = gameState.userTeam.facilities.youthAcademyFacility;
    if (!facility || !FACILITY_LEVELS.youthAcademyFacility) return; // Доп. проверка

    if (ui.youthFacilityLevel) ui.youthFacilityLevel.textContent = facility.level;
    const devBonus = (FACILITY_LEVELS.youthAcademyFacility.effects.youthPlayerDevelopmentRate[facility.level] * 100) +
                     ((gameState.userTeam.staff && gameState.userTeam.staff.youthCoach && STAFF_ROLES.youthCoach) ? STAFF_ROLES.youthCoach.skillEffectiveness.youthDevelopmentRate * gameState.userTeam.staff.youthCoach.skillLevel : 0) +
                     ((gameState.userTeam.coach?.youthFocus || 0) * 100);
    if (ui.youthDevBonus) ui.youthDevBonus.textContent = Math.round(devBonus);

    const maxPlayersInAcademy = YOUTH_ACADEMY_MAX_PLAYERS + FACILITY_LEVELS.youthAcademyFacility.effects.maxYouthPlayersBonus[facility.level];
    if (ui.youthSquadMax) ui.youthSquadMax.textContent = maxPlayersInAcademy;
    if (ui.youthSquadSize) ui.youthSquadSize.textContent = gameState.userTeam.youthAcademy.players ? gameState.userTeam.youthAcademy.players.length : 0;
    if (ui.youthCoachNameDisplay) ui.youthCoachNameDisplay.textContent = (gameState.userTeam.staff && gameState.userTeam.staff.youthCoach) ? gameState.userTeam.staff.youthCoach.name : "Нет";

    let weeksToNextIntake = gameState.userTeam.youthAcademy.nextIntakeWeek - gameState.currentWeek;
    if (gameState.userTeam.youthAcademy.nextIntakeWeek < gameState.currentWeek ||
        (gameState.userTeam.youthAcademy.nextIntakeWeek === gameState.currentWeek && gameState.currentWeek >= YOUTH_INTAKE_WEEKS[YOUTH_INTAKE_WEEKS.length-1] && !YOUTH_INTAKE_WEEKS.includes(gameState.currentWeek) )) { // Если текущая неделя набора уже прошла
        const nextSeasonIntakeWeek = YOUTH_INTAKE_WEEKS.find(w => w > 0) || YOUTH_INTAKE_WEEKS[0];
        weeksToNextIntake = (gameState.seasonLength - gameState.currentWeek) + nextSeasonIntakeWeek;
    } else if (weeksToNextIntake < 0) {
         const nextIntakeOptionInCurrentSeason = YOUTH_INTAKE_WEEKS.find(w => w > gameState.currentWeek);
         if (nextIntakeOptionInCurrentSeason) {
            weeksToNextIntake = nextIntakeOptionInCurrentSeason - gameState.currentWeek;
         } else { // Все наборы в этом сезоне прошли, считаем до первого в следующем
            weeksToNextIntake = (gameState.seasonLength - gameState.currentWeek) + YOUTH_INTAKE_WEEKS[0];
         }
    }
     if (weeksToNextIntake <=0 && YOUTH_INTAKE_WEEKS.includes(gameState.currentWeek)) weeksToNextIntake = 0;


    if (ui.youthIntakeCountdown) ui.youthIntakeCountdown.textContent = weeksToNextIntake >= 0 ? weeksToNextIntake : "N/A";

    if (ui.youthPlayerList) {
        ui.youthPlayerList.innerHTML = '';
        const youthPlayers = gameState.userTeam.youthAcademy.players || [];
        if (youthPlayers.length === 0) {
            ui.youthPlayerList.innerHTML = '<li>В академии пока нет игроков.</li>'; return;
        }
        youthPlayers
        .sort((a,b) => (typeof getPlayerPotentialValue === "function" ? getPlayerPotentialValue(b) : 0) - (typeof getPlayerPotentialValue === "function" ? getPlayerPotentialValue(a) : 0))
        .forEach(player => { renderPlayerListItem(player, ui.youthPlayerList, ['promote', 'details'], true); });
    }
}

function renderStaffScreen() {
    if (!ui.screens.staff || !ui.screens.staff.classList.contains('active') || !gameState || !gameState.userTeam) return;
    const coach = gameState.userTeam.coach;
    if (ui.currentCoachInfo) {
      if (coach && COACH_SPECIALIZATIONS[coach.specKey]) { // Проверка COACH_SPECIALIZATIONS[coach.specKey]
        ui.currentCoachInfo.innerHTML = `
            <p><strong>${coach.name}</strong> (${coach.role})</p>
            <p>Спец: ${COACH_SPECIALIZATIONS[coach.specKey].name || coach.specKey}, З/П: ${coach.salary.toLocaleString()}$</p>
            <p>Эффекты: Атака +${coach.attackBoost}, Защита +${coach.defenseBoost}, Тренировки +${Math.round(coach.trainingBonus*100)}%, Мораль +${coach.moraleBoost}, Молодежь +${Math.round((coach.youthFocus||0)*100)}%</p>
            <button class="action-button red small-action-button" onclick="if(typeof handleFireCoach === 'function') handleFireCoach();">Уволить</button>
        `;
      } else if (coach) { // Если спец. не найдена, но тренер есть
         ui.currentCoachInfo.innerHTML = `<p><strong>${coach.name}</strong> (Ошибка данных специализации)</p>`;
      } else {
        ui.currentCoachInfo.innerHTML = `<p>Главный тренер не нанят.</p>`;
      }
    }
    if (ui.availableCoachesList && gameState.availableCoaches) {
        ui.availableCoachesList.innerHTML = '';
        gameState.availableCoaches.forEach(c => {
            const li = document.createElement('li');
            const specName = COACH_SPECIALIZATIONS[c.specKey] ? COACH_SPECIALIZATIONS[c.specKey].name : c.specKey;
            li.innerHTML = `<span>${c.name} (Спец: ${specName}, З/П: ${c.salary.toLocaleString()}$)</span>
                            <button class="action-button green small-action-button" onclick="if(typeof handleHireCoach === 'function') handleHireCoach('${c.id}');">Нанять</button>`;
            ui.availableCoachesList.appendChild(li);
        });
        if(gameState.availableCoaches.length === 0) ui.availableCoachesList.innerHTML = '<li>Нет доступных тренеров.</li>';
    }
    if (ui.otherStaffSectionsContainer && gameState.availableStaff && gameState.userTeam.staff && typeof STAFF_ROLES === 'object') {
        ui.otherStaffSectionsContainer.innerHTML = '';
        for (const roleKey in STAFF_ROLES) {
            if (STAFF_ROLES.hasOwnProperty(roleKey)) {
                const role = STAFF_ROLES[roleKey];
                const sectionDiv = document.createElement('div');
                sectionDiv.classList.add('staff-section');
                sectionDiv.innerHTML = `<h4>${role.name} (Макс: ${role.maxCount})</h4>`;

                const hiredStaffList = document.createElement('ul');
                const currentStaffArray = Array.isArray(gameState.userTeam.staff[roleKey]) ? gameState.userTeam.staff[roleKey] : (gameState.userTeam.staff[roleKey] ? [gameState.userTeam.staff[roleKey]] : []);

                if (currentStaffArray.length > 0) {
                    currentStaffArray.forEach(staff => {
                        if(staff){
                            const staffLi = document.createElement('li');
                            staffLi.innerHTML = `<span>${staff.name} (Навык: ${staff.skillLevel}, З/П: ${staff.salary.toLocaleString()}$)</span>
                                            <button class="action-button red small-action-button" onclick="if(typeof handleFireStaff === 'function') handleFireStaff('${staff.id}', '${roleKey}');">Уволить</button>`;
                            hiredStaffList.appendChild(staffLi);
                        }
                    });
                } else {
                    hiredStaffList.innerHTML = `<li>Нет нанятого персонала для этой роли.</li>`;
                }
                sectionDiv.appendChild(hiredStaffList);

                if (currentStaffArray.length < role.maxCount) {
                    const availableList = document.createElement('ul');
                    availableList.classList.add('compact-list');
                    availableList.innerHTML = `<h5>Доступные ${role.name.toLowerCase()}:</h5>`;
                    if (gameState.availableStaff[roleKey] && gameState.availableStaff[roleKey].length > 0) {
                        gameState.availableStaff[roleKey].forEach(cand => {
                            const candLi = document.createElement('li');
                            candLi.innerHTML = `<span>${cand.name} (Навык: ${cand.skillLevel}, З/П: ${cand.salary.toLocaleString()}$)</span>
                                            <button class="action-button green small-action-button" onclick="if(typeof handleHireStaff === 'function') handleHireStaff('${cand.id}', '${roleKey}');">Нанять</button>`;
                            availableList.appendChild(candLi);
                        });
                    } else {
                        availableList.innerHTML += '<li>Нет доступных кандидатов.</li>';
                    }
                    sectionDiv.appendChild(availableList);
                }
                ui.otherStaffSectionsContainer.appendChild(sectionDiv);
            }
        }
    }
}


function renderTransferMarket() {
    if (!ui.screens.transfers || !ui.screens.transfers.classList.contains('active') || !gameState || !gameState.transferMarket) return;
    if (ui.transferMarketList) ui.transferMarketList.innerHTML = '';
    if (ui.scoutingAccuracyDisplay && typeof calculateScoutingAccuracy === "function") ui.scoutingAccuracyDisplay.textContent = calculateScoutingAccuracy();
    if (ui.scoutingAssignmentsDisplay && gameState.userTeam) ui.scoutingAssignmentsDisplay.textContent = gameState.userTeam.totalScoutingAssignments || 0;
    if (ui.scoutingCapacityDisplay && gameState.userTeam && gameState.userTeam.staff) {
        ui.scoutingCapacityDisplay.textContent = ((gameState.userTeam.staff.chiefScout ? 1 : 0) + (gameState.userTeam.staff.scouts ? gameState.userTeam.staff.scouts.length : 0));
    }

    const positionFilter = ui.transferFilterPosition ? ui.transferFilterPosition.value : "all";
    const ageFilterInput = ui.transferFilterAge ? ui.transferFilterAge.value : "";
    const priceFilterInput = ui.transferFilterPrice ? ui.transferFilterPrice.value : "";

    const ageFilter = parseInt(ageFilterInput) || 45;
    const priceFilter = parseInt(priceFilterInput) || Infinity;

    const filteredMarket = (gameState.transferMarket.players || []).filter(player => {
        if (!player) return false; // Добавлена проверка
        if (positionFilter !== "all" && player.position !== positionFilter) return false;
        if (player.age > ageFilter) return false;
        if (player.price > priceFilter && player.scoutedLevel >=3) return false;
        return true;
    });

    if (filteredMarket.length === 0) {
        if (ui.transferMarketList) ui.transferMarketList.innerHTML = '<li>Нет игроков, соответствующих фильтрам.</li>'; return;
    }
    filteredMarket.sort((a,b) => {
        if (a.scoutedLevel !== b.scoutedLevel) return b.scoutedLevel - a.scoutedLevel;
        const potA = a.scoutedLevel >= 2 ? (typeof getPlayerPotentialValue === "function" ? getPlayerPotentialValue(a) : 0) : 0;
        const potB = b.scoutedLevel >= 2 ? (typeof getPlayerPotentialValue === "function" ? getPlayerPotentialValue(b) : 0) : 0;
        if (potA !== potB) return potB - potA;
        return (b.price || 0) - (a.price || 0);
    })
    .forEach(player => {
        const actions = ['details'];
        if (player.scoutedLevel < 3) actions.push('scout');
        else actions.push('buy');
        if (ui.transferMarketList) renderPlayerListItem(player, ui.transferMarketList, actions);
    });
}

function renderFacilitiesScreen() {
    if (!ui.screens.facilities || !ui.screens.facilities.classList.contains('active') || !gameState || !gameState.userTeam || !gameState.userTeam.facilities) return;
    if (ui.facilitiesList && typeof FACILITY_LEVELS === 'object') {
        ui.facilitiesList.innerHTML = '';
        for (const key in gameState.userTeam.facilities) {
            if (FACILITY_LEVELS.hasOwnProperty(key)) {
                const facilityState = gameState.userTeam.facilities[key];
                const facilityData = FACILITY_LEVELS[key];
                const card = document.createElement('div');
                card.classList.add('facility-card', 'list-item');
                let effectsHtml = '<ul>';
                for (const effectKey in facilityData.effects) {
                    const effectValues = facilityData.effects[effectKey];
                    let currentEffectValue = effectValues[facilityState.level];
                    if (typeof currentEffectValue === 'number' && !Number.isInteger(currentEffectValue) && currentEffectValue !== 0 && (effectKey.toLowerCase().includes("bonus") || effectKey.toLowerCase().includes("rate") || effectKey.toLowerCase().includes("reduction"))) {
                        currentEffectValue = Math.round(currentEffectValue * 100);
                    }
                    effectsHtml += `<li>${effectKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${currentEffectValue}${effectKey.toLowerCase().includes("bonus") || effectKey.toLowerCase().includes("rate") || effectKey.toLowerCase().includes("multiplier") || effectKey.toLowerCase().includes("reduction") ? (effectKey.toLowerCase().includes("multiplier") ? 'x' : '%') : ''}</li>`;
                }
                effectsHtml += '</ul>';

                let buttonHtml = '';
                if (facilityState.upgradeInProgress) {
                    buttonHtml = `<p>Улучшается... Осталось: ${facilityState.weeksToComplete} нед. (До Ур. ${facilityState.level})</p>`;
                } else if (facilityState.level < facilityData.maxLevel) {
                    const cost = facilityData.costs[facilityState.level + 1];
                    const time = facilityData.upgradeTimeWeeks[facilityState.level + 1];
                    buttonHtml = `<button class="action-button ${gameState.budget < cost ? 'disabled' : ''}" ${gameState.budget < cost ? 'disabled' : ''} onclick="if(typeof handleUpgradeFacility === 'function') handleUpgradeFacility('${key}');">Улучшить (Ур. ${facilityState.level + 1}) - ${cost.toLocaleString()}$ (${time} нед.)</button>`;
                } else {
                    buttonHtml = `<p>Максимальный уровень</p>`;
                }

                card.innerHTML = `
                    <h3>${facilityData.name} (Уровень ${facilityState.level})</h3>
                    ${effectsHtml}
                    ${buttonHtml}
                `;
                ui.facilitiesList.appendChild(card);
            }
        }
    }
}

function renderFinancesScreen() {
    if (!ui.screens.finances || !ui.screens.finances.classList.contains('active') || !gameState) return;
    if (ui.financeBudgetDisplay) ui.financeBudgetDisplay.textContent = gameState.budget.toLocaleString();
    if (ui.financeWeeklyIncome) ui.financeWeeklyIncome.textContent = gameState.userTeam?.weeklyIncome?.toLocaleString() || '0'; // Из gameState.userTeam
    if (ui.financeWeeklyExpense) ui.financeWeeklyExpense.textContent = gameState.userTeam?.weeklyExpense?.toLocaleString() || '0'; // Из gameState.userTeam
    if (ui.financeWeeklyBalance) ui.financeWeeklyBalance.textContent = ( (gameState.userTeam?.weeklyIncome || 0) - (gameState.userTeam?.weeklyExpense || 0) ).toLocaleString();

    if (ui.sponsorsList && gameState.userTeam && gameState.userTeam.sponsors && typeof SPONSOR_TYPES === 'object') {
        ui.sponsorsList.innerHTML = '';
        if (gameState.userTeam.sponsors.length > 0) {
            gameState.userTeam.sponsors.forEach(s => {
                ui.sponsorsList.innerHTML += `<li>${s.name} (${SPONSOR_TYPES[s.type] ? SPONSOR_TYPES[s.type].name : s.type}): ${s.weeklyIncome.toLocaleString()}$/нед. (осталось ${s.weeksLeft} нед.)</li>`;
            });
        } else {
            ui.sponsorsList.innerHTML = `<li>Нет активных спонсоров.</li>`;
        }
    }

    if (ui.transactionHistory && gameState.transactions) {
        ui.transactionHistory.innerHTML = '';
        gameState.transactions.slice(0, TRANSACTION_HISTORY_LIMIT_UI).forEach(t => {
            const li = document.createElement('li');
            li.classList.add(t.type);
            li.textContent = `(Н:${t.week},С:${t.season}) ${t.description}: ${t.amount !== 0 ? t.amount.toLocaleString()+'$' : ''} (Кат: ${t.category})`;
            ui.transactionHistory.appendChild(li);
        });
        if(gameState.transactions.length === 0) ui.transactionHistory.innerHTML = `<li>История пуста.</li>`;
    }
    if (ui.transactionHistoryLimitDisplay) ui.transactionHistoryLimitDisplay.textContent = TRANSACTION_HISTORY_LIMIT_UI;
    renderIncomeExpenseBreakdown();
}

function renderIncomeExpenseBreakdown() {
    if (!ui.incomeBreakdownList || !ui.expenseBreakdownList || !gameState || !gameState.lastTransactionsBreakdown) return;
    ui.incomeBreakdownList.innerHTML = ''; ui.expenseBreakdownList.innerHTML = '';
    const breakdown = gameState.lastTransactionsBreakdown;

    if (breakdown.income && Object.keys(breakdown.income).length > 0) {
        for(const cat in breakdown.income) { ui.incomeBreakdownList.innerHTML += `<li>${cat}: ${breakdown.income[cat].toLocaleString()}$</li>`; }
    } else {
        ui.incomeBreakdownList.innerHTML = `<li>Нет данных по доходам.</li>`;
    }

    if (breakdown.expense && Object.keys(breakdown.expense).length > 0) {
        for(const cat in breakdown.expense) { ui.expenseBreakdownList.innerHTML += `<li>${cat}: ${breakdown.expense[cat].toLocaleString()}$</li>`; }
    } else {
        ui.expenseBreakdownList.innerHTML = `<li>Нет данных по расходам.</li>`;
    }
}


function renderSchedule(filter = "current_week") {
    if (!ui.matchSchedule || !gameState || !gameState.schedule) return;
    ui.matchSchedule.innerHTML = '';
    let matchesToShow = [];
    const userTeamName = gameState.userTeam ? gameState.userTeam.name : "";

    switch (filter) {
        case "all_season": matchesToShow = [...gameState.schedule]; break;
        case "user": matchesToShow = gameState.schedule.filter(m => m.homeTeam === userTeamName || m.awayTeam === userTeamName); break;
        case "league": matchesToShow = gameState.schedule.filter(m => m.competition === 'League'); break;
        case "cup": matchesToShow = gameState.schedule.filter(m => m.competition && m.competition !== "League"); break;
        case "current_week":
        default: matchesToShow = gameState.schedule.filter(m => m.week === gameState.currentWeek); break;
    }
    matchesToShow.sort((a,b) => a.week - b.week || (a.isUserMatch ? -1 : (b.isUserMatch ? 1 : 0)) || (a.competition === "League" ? -1 : (b.competition === "League" ? 1 : 0)) );


    if (matchesToShow.length === 0) { ui.matchSchedule.innerHTML = '<li>Нет матчей по текущему фильтру.</li>'; return; }

    matchesToShow.forEach(match => {
        const matchDiv = document.createElement('div');
        matchDiv.classList.add('match-item', 'list-item');
        if (match.played) matchDiv.classList.add('played');
        if (match.isUserMatch) matchDiv.classList.add('user-match');

        let resultText = match.played ? `${match.homeScore} - ${match.awayScore}` : "vs";
        let playButton = '';
        if (match.isUserMatch && !match.played && match.week === gameState.currentWeek && typeof canUserTeamPlayMatch === "function" && canUserTeamPlayMatch()) {
             playButton = `<button class="action-button small-action-button green play-match-btn" data-match-id="${match.matchId}">Играть</button>`;
        } else if (match.isUserMatch && !match.played && match.week === gameState.currentWeek) {
            playButton = `<button class="action-button small-action-button disabled" disabled title="Проверьте состав или дождитесь недели матча">Играть</button>`;
        }
        const competitionDisplay = match.competition === "League" ? "Лига" : (match.cupData && CUP_COMPETITIONS[match.cupData.cupKey] ? CUP_COMPETITIONS[match.cupData.cupKey].name : (match.competition || "Кубок"));
        const roundDisplay = match.round && match.competition !== "League" ? ` (${match.round})` : '';

        matchDiv.innerHTML = `
            <span>Нед.${match.week}, ${competitionDisplay}${roundDisplay}</span>
            <span>${match.homeTeam} <strong>${resultText}</strong> ${match.awayTeam}</span>
            ${playButton}
        `;
        ui.matchSchedule.appendChild(matchDiv);
    });
    document.querySelectorAll('.play-match-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const matchId = e.currentTarget.dataset.matchId;
            if(typeof initiateMatchSimulation === "function" && matchId) initiateMatchSimulation(matchId); // initiateMatchSimulation из game_logic_match_sim.js
        });
    });
}

function renderLeagueTable() {
    if (!ui.leagueTableBody || !gameState || !gameState.leagueTable) return;
    ui.leagueTableBody.innerHTML = '';
    const tableArray = Object.values(gameState.leagueTable).sort((a, b) => {
        if (b.Pts !== a.Pts) return b.Pts - a.Pts;
        if (b.GD !== a.GD) return b.GD - a.GD;
        if (b.GF !== a.GF) return b.GF - a.GF;
        return a.name.localeCompare(b.name);
    });
    tableArray.forEach((team, index) => {
        const row = ui.leagueTableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${team.name} ${team.name === (gameState.userTeam ? gameState.userTeam.name : "") ? ' (Вы)' : ''}</td>
            <td>${team.P || 0}</td><td>${team.W || 0}</td><td>${team.D || 0}</td><td>${team.L || 0}</td>
            <td>${team.GF || 0}</td><td>${team.GA || 0}</td><td>${team.GD || 0}</td><td><strong>${team.Pts || 0}</strong></td>
        `;
        if (team.name === (gameState.userTeam ? gameState.userTeam.name : "")) row.classList.add('user-team-row');
    });
}

function renderCupScreen() {
    if (!ui.screens.cup || !ui.screens.cup.classList.contains('active') || !gameState || !gameState.schedule) return;

    const activeUserCupState = gameState.userTeam?.activeNationalCup;
    const cupKey = activeUserCupState?.name === "Кубок" ? "nationalCup" : activeUserCupState?.name; // Определяем ключ
    const cupData = cupKey ? CUP_COMPETITIONS[cupKey] : null;

    if (!activeUserCupState || !cupData) {
        if(ui.cupNameDisplay) ui.cupNameDisplay.textContent = "Кубок"; // Общее название
        if(ui.cupCurrentRound) ui.cupCurrentRound.textContent = "N/A";
        if(ui.cupBracketOrNextMatch) ui.cupBracketOrNextMatch.innerHTML = "<p>Вы не участвуете в активном кубке или информация недоступна.</p>";
        return;
    }

    if(ui.cupNameDisplay) ui.cupNameDisplay.textContent = cupData.name;

    const userTeamName = gameState.userTeam.name;
    const cupMatchesForUser = gameState.schedule.filter(m => m.competition === cupData.shortName && (m.homeTeam === userTeamName || m.awayTeam === userTeamName));

    let currentRoundName = "N/A";
    if (activeUserCupState.currentRoundIndex >= 0 && activeUserCupState.currentRoundIndex < cupData.rounds.length) {
        currentRoundName = cupData.rounds[activeUserCupState.currentRoundIndex];
    } else if (activeUserCupState.currentRoundIndex === -1) {
        currentRoundName = "Завершено";
    }

    let nextMatchHtml = "<p>Информация о матчах в кубке отсутствует.</p>";
    const upcomingMatches = cupMatchesForUser.filter(m => !m.played).sort((a,b) => a.week - b.week);

    if (upcomingMatches.length > 0) {
        const nextMatch = upcomingMatches[0];
        currentRoundName = nextMatch.round || cupData.rounds[nextMatch.cupData.roundIndex] || "N/A"; // Обновляем на основе фактического матча
        nextMatchHtml = `
            <h4>Следующий матч (${currentRoundName}): Неделя ${nextMatch.week}</h4>
            <div class="match-item list-item ${nextMatch.isUserMatch ? 'user-match' : ''}">
                <span>${nextMatch.homeTeam} <strong>vs</strong> ${nextMatch.awayTeam}</span>
                ${nextMatch.isUserMatch && nextMatch.week === gameState.currentWeek && typeof canUserTeamPlayMatch === "function" && canUserTeamPlayMatch() ? `<button class="action-button small-action-button green play-match-btn" data-match-id="${nextMatch.matchId}">Играть</button>` : ''}
            </div>`;
    } else {
        const playedMatches = cupMatchesForUser.filter(m => m.played).sort((a,b) => b.week - a.week);
        if (playedMatches.length > 0) {
            const lastMatch = playedMatches[0];
            currentRoundName = lastMatch.round || cupData.rounds[lastMatch.cupData.roundIndex] || "Завершено";
            const userLost = (lastMatch.homeTeam === userTeamName && lastMatch.homeScore < lastMatch.awayScore) ||
                             (lastMatch.awayTeam === userTeamName && lastMatch.awayScore < lastMatch.homeScore);
            if(userLost) {
                nextMatchHtml = `<p>Вы выбыли из кубка в раунде: ${currentRoundName}.</p>`;
                 if(activeUserCupState) activeUserCupState.currentRoundIndex = -1;
            } else {
                if (lastMatch.cupData.roundIndex === cupData.rounds.length -1) {
                     nextMatchHtml = `<p>Поздравляем! Вы выиграли ${cupData.name}!</p>`;
                     if(activeUserCupState) activeUserCupState.currentRoundIndex = -1;
                } else {
                     nextMatchHtml = `<p>Вы прошли в следующий раунд. Ожидайте жеребьевку.</p>`;
                }
            }
        } else {
             nextMatchHtml = `<p>Ваша команда еще не играла в этом розыгрыше кубка.</p>`;
        }
    }

    if(ui.cupCurrentRound) ui.cupCurrentRound.textContent = currentRoundName;
    if(ui.cupBracketOrNextMatch) ui.cupBracketOrNextMatch.innerHTML = nextMatchHtml;

    document.querySelectorAll('#cup-bracket-or-next-match .play-match-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const matchId = e.currentTarget.dataset.matchId;
            if(typeof initiateMatchSimulation === "function" && matchId) initiateMatchSimulation(matchId);
        });
    });
}


// --- Вспомогательные функции для UI ---
function getTeamTrainingDescription(focusKey) {
    const descriptions = {
        none: "Общая физическая подготовка, поддержание формы.",
        attack_cohesion: "Отработка атакующих комбинаций, улучшение взаимопонимания в нападении, создание голевых моментов.",
        defense_cohesion: "Улучшение оборонительных построений, сыгранности в защите, прессинг и отбор мяча.",
        set_pieces: "Тренировка стандартных положений: штрафные, угловые, пенальти. Как в атаке, так и в защите.",
        fitness_recovery: "Акцент на восстановлении физической формы, предотвращении переутомления и снижении риска травм.",
        morale_boost: "Командные мероприятия для поднятия духа, сплоченности и улучшения атмосферы в раздевалке."
    };
    return descriptions[focusKey] || "Описание для данного фокуса не найдено.";
}

function loadPlayerFilterOptions() { 
    if (ui.playerListFilterPosition) ui.playerListFilterPosition.innerHTML = '<option value="all">Все позиции</option>' + PLAYER_POSITIONS.map(p => `<option value="${p}">${p}</option>`).join('');
    if (ui.playerListFilterStatus) ui.playerListFilterStatus.innerHTML = `
        <option value="all">Все статусы</option><option value="fit">Готовы</option>
        <option value="injured">Травмы</option><option value="suspended">Дисквалификации</option>
        <option value="international_duty">В сборной</option><option value="on_loan">В аренде</option>`;
    if (ui.playerListSort) ui.playerListSort.innerHTML = `
        <option value="default">По умолчанию</option><option value="overall">По силе</option>
        <option value="position">По позиции</option><option value="age">По возрасту</option>
        <option value="contract_left">По контракту</option><option value="morale">По морали</option>
        <option value="form">По форме</option>`;

    if (ui.transferFilterPosition) ui.transferFilterPosition.innerHTML = '<option value="all">Все позиции</option>' + PLAYER_POSITIONS.map(p => `<option value="${p}">${p}</option>`).join('');
}
function loadFormationOptions() {
    const formations = ["4-4-2", "4-3-3", "3-5-2", "4-2-3-1", "5-3-2",  "4-1-4-1", "4-4-1-1", "3-4-3"];
    if (ui.formationSelect) ui.formationSelect.innerHTML = formations.map(f => `<option value="${f}">${f}</option>`).join('');
}
function loadTacticOptions() {
    const tactics = {
        balanced: "Сбалансированная", attacking: "Атакующая", defensive: "Оборонительная",
        "counter-attacking": "Контратакующая", possession: "Владение мячом", "high-press": "Высокий прессинг"
    };
    const optionsHtml = Object.entries(tactics).map(([key, value]) => `<option value="${key}">${value}</option>`).join('');
    if (ui.tacticSelect) ui.tacticSelect.innerHTML = optionsHtml;
    if (ui.inMatchTacticSelect) ui.inMatchTacticSelect.innerHTML = optionsHtml;
}
function loadTeamTrainingOptions() {
    const focuses = {
        none: "Нет фокуса", attack_cohesion: "Атакующая сыгранность", defense_cohesion: "Оборонительная сыгранность",
        set_pieces: "Стандартные положения", fitness_recovery: "Фитнес и восстановление", morale_boost: "Повышение морали"
    };
    if (ui.teamTrainingFocus) ui.teamTrainingFocus.innerHTML = Object.entries(focuses).map(([key, value]) => `<option value="${key}">${value}</option>`).join('');
}
function loadContractDurationOptions() {
    if (ui.newDurationSelect && typeof CONTRACT_LENGTHS_WEEKS !== 'undefined' && typeof WEEKS_IN_YEAR !== 'undefined') {
        ui.newDurationSelect.innerHTML = '';
        for (const key in CONTRACT_LENGTHS_WEEKS) {
            const weeks = CONTRACT_LENGTHS_WEEKS[key];
            const years = Math.round(weeks / WEEKS_IN_YEAR * 10) / 10;
            ui.newDurationSelect.innerHTML += `<option value="${weeks}">${weeks} нед. (~${years} г.)</option>`;
        }
    }
}