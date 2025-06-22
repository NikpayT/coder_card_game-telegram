// --- БАЗА ДАННЫХ КОНКУРЕНТОВ ---
export let competitors = [
    { id: 'alpha_tech', name: 'AlphaTech', money: 150000, level: 2, brandAwareness: 8, activeModel: null, salesFactor: 1.0 },
    { id: 'nexus_inc', name: 'Nexus Inc.', money: 200000, level: 3, brandAwareness: 12, activeModel: null, salesFactor: 1.2 },
    { id: 'photon_devices', name: 'Photon Devices', money: 80000, level: 1, brandAwareness: 5, activeModel: null, salesFactor: 0.9 },
    { id: 'zenith_mobile', name: 'Zenith Mobile', money: 500000, level: 5, brandAwareness: 20, activeModel: null, salesFactor: 1.5 },
    { id: 'titan_comms', name: 'Titan Comms', money: 120000, level: 2, brandAwareness: 7, activeModel: null, salesFactor: 1.0 },
    { id: 'horizon_phones', name: 'Horizon Phones', money: 90000, level: 1, brandAwareness: 6, activeModel: null, salesFactor: 0.95 },
    { id: 'galaxy_corp', name: 'Galaxy Corp.', money: 1000000, level: 8, brandAwareness: 35, activeModel: null, salesFactor: 1.8 },
    { id: 'nova_electronics', name: 'Nova Electronics', money: 75000, level: 1, brandAwareness: 4, activeModel: null, salesFactor: 0.8 },
    { id: 'pulse_mobile', name: 'Pulse Mobile', money: 180000, level: 3, brandAwareness: 10, activeModel: null, salesFactor: 1.1 },
    { id: 'omega_solutions', name: 'Omega Solutions', money: 300000, level: 4, brandAwareness: 15, activeModel: null, salesFactor: 1.3 },
    { id: 'vertex_digital', name: 'Vertex Digital', money: 60000, level: 1, brandAwareness: 3, activeModel: null, salesFactor: 0.85 },
    { id: 'element_phones', name: 'Element Phones', money: 110000, level: 2, brandAwareness: 6, activeModel: null, salesFactor: 1.0 },
    { id: 'stratos_group', name: 'Stratos Group', money: 400000, level: 5, brandAwareness: 18, activeModel: null, salesFactor: 1.4 },
    { id: 'cygnus_tech', name: 'Cygnus Tech', money: 130000, level: 2, brandAwareness: 7, activeModel: null, salesFactor: 1.05 },
    { id: 'aether_dynamics', name: 'Aether Dynamics', money: 250000, level: 4, brandAwareness: 14, activeModel: null, salesFactor: 1.25 },
    { id: 'orion_systems', name: 'Orion Systems', money: 750000, level: 7, brandAwareness: 30, activeModel: null, salesFactor: 1.7 },
    { id: 'quantum_devices', name: 'Quantum Devices', money: 160000, level: 3, brandAwareness: 9, activeModel: null, salesFactor: 1.15 },
    { id: 'pinnacle_mobile', name: 'Pinnacle Mobile', money: 100000, level: 2, brandAwareness: 5, activeModel: null, salesFactor: 1.0 },
    { id: 'fusion_electronics', name: 'Fusion Electronics', money: 220000, level: 4, brandAwareness: 13, activeModel: null, salesFactor: 1.2 },
    { id: 'infinity_labs', name: 'Infinity Labs', money: 600000, level: 6, brandAwareness: 25, activeModel: null, salesFactor: 1.6 },
];

const PHONE_NAME_PARTS = {
    prefixes: ["Aura", "Zen", "Pulse", "Nova", "Stratos", "Vertex", "Titan", "Photon", "Orion", "Cygnus"],
    suffixes: ["X", "Pro", "Max", "Lite", "GT", "Z", "S", "One", "Edge", "Ultra"],
    numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
};

function createCompetitorPhone(level) {
    const name = `${PHONE_NAME_PARTS.prefixes[Math.floor(Math.random() * PHONE_NAME_PARTS.prefixes.length)]} ${PHONE_NAME_PARTS.suffixes[Math.floor(Math.random() * PHONE_NAME_PARTS.suffixes.length)]}${PHONE_NAME_PARTS.numbers[Math.floor(Math.random() * PHONE_NAME_PARTS.numbers.length)]}`;
    
    // Генерируем характеристики на основе уровня
    const baseQuality = level * 10;
    const quality = baseQuality + (Math.random() * 20 - 10); // +- 10 от базового
    const cost = 50 + (level * 25) + (Math.random() * 50 - 25);
    const sales = Math.floor((Math.random() * 5000 + 1000) * (level / 5));

    return {
        name: name,
        quality: Math.max(10, quality),
        cost: Math.max(50, cost),
        estimatedSales: Math.max(1000, sales),
    };
}

// --- ОСНОВНАЯ ФУНКЦИЯ СИМУЛЯЦИИ КОНКУРЕНТОВ ---
export function simulateCompetitors() {
    competitors.forEach(comp => {
        // 1. Шанс выпустить новый телефон (зависит от времени и денег)
        if (!comp.activeModel || Math.random() < 0.05) { // 5% шанс каждый "симуляционный тик"
            if (comp.money > 100000) { // Только если есть деньги на R&D и запуск
                comp.activeModel = createCompetitorPhone(comp.level);
                comp.money -= 50000; // Расходы на R&D
            }
        }

        // 2. Симуляция продаж и дохода
        if (comp.activeModel) {
            const dailySales = (comp.activeModel.estimatedSales / 90) * (comp.brandAwareness / 20) * comp.salesFactor;
            const dailyIncome = dailySales * (comp.activeModel.cost * 2); // Продают по цене 2x себестоимости
            const dailyProfit = dailySales * comp.activeModel.cost;
            comp.money += dailyProfit;
        }

        // 3. Рост узнаваемости бренда
        comp.brandAwareness += (0.01 + Math.random() * 0.05) * (comp.level / 10);
        comp.brandAwareness = Math.min(100, comp.brandAwareness);

        // 4. Рост уровня
        // Повышаем уровень за каждые $250,000 заработка
        if (comp.money > (comp.level * 250000)) {
            comp.level++;
        }
    });
}
