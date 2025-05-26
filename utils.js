// utils.js - Вспомогательные функции для игры

/**
 * Форматирует время из миллисекунд в строку типа "Xч Yм" или "Yм Zс" или "Zс".
 * @param {number} ms - Время в миллисекундах.
 * @returns {string} - Отформатированная строка времени.
 */
function formatTime(ms) {
    if (ms < 0) ms = 0; // Обработка отрицательного времени
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}ч ${minutes}м`;
    }
    if (minutes > 0) {
        return `${minutes}м ${seconds}с`;
    }
    return `${seconds}с`;
}

// Сюда можно добавлять другие утилитарные функции по мере необходимости,
// например, функции для генерации случайных чисел в диапазоне,
// глубокого копирования объектов и т.д.
