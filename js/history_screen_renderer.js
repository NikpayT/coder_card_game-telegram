// js/history_screen_renderer.js

function renderHistoryScreen() {
    // Проверка, что мы на нужном экране и данные существуют
    if (!ui.screens.history || !ui.screens.history.classList.contains('active') || !gameState || !gameState.clubHistory) {
        return;
    }

    // --- Отрисовка трофеев клуба ---
    const trophiesList = ui.clubTrophiesList;
    trophiesList.innerHTML = '';
    if (gameState.clubHistory.trophies.length > 0) {
        gameState.clubHistory.trophies.forEach(trophy => {
            trophiesList.innerHTML += `<li>🏆 ${trophy}</li>`;
        });
    } else {
        trophiesList.innerHTML = '<li>У клуба пока нет трофеев.</li>';
    }

    // --- Отрисовка результатов по сезонам ---
    const seasonsList = ui.clubSeasonsList;
    seasonsList.innerHTML = '';
    if (gameState.clubHistory.seasonBySeason.length > 0) {
        // Сортируем, чтобы последний сезон был сверху
        [...gameState.clubHistory.seasonBySeason].reverse().forEach(season => {
            seasonsList.innerHTML += `<li>Сезон ${season.season}: ${season.leaguePosition}-е место в лиге (${season.points} очков)</li>`;
        });
    } else {
        seasonsList.innerHTML = '<li>История выступлений пока пуста.</li>';
    }

    // --- Отрисовка рекордов клуба ---
    const clubRecords = ui.clubRecordsList;
    const cr = gameState.clubHistory.records;
    clubRecords.innerHTML = `
        <li>Самая крупная победа: ${cr.biggestWin.score} (против ${cr.biggestWin.opponent}, Сезон ${cr.biggestWin.season})</li>
        <li>Самое крупное поражение: ${cr.biggestLoss.score} (против ${cr.biggestLoss.opponent}, Сезон ${cr.biggestLoss.season})</li>
    `;

    // --- Отрисовка рекордов лиги ---
    const leagueRecords = ui.leagueRecordsList;
    const lr = gameState.leagueRecords;
    leagueRecords.innerHTML = `
        <li>Самая крупная победа в истории: ${lr.biggestWin.score} (${lr.biggestWin.teams}, Сезон ${lr.biggestWin.season})</li>
        <li>Самый результативный матч: ${lr.mostGoalsInMatch.goals} голов (${lr.mostGoalsInMatch.score} в матче ${lr.mostGoalsInMatch.teams}, Сезон ${lr.mostGoalsInMatch.season})</li>
    `;
}