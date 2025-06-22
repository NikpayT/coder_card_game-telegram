// --- БАЗЫ ДАННЫХ ИГРЫ ---

export const COMPONENTS = {
    cpu: {
        name: "Процессор",
        items: [
            { id: 'c1', name: 'Бюджетный 4-ядра', cost: 20, performance: 10, power: 15, tech: 1, requiredLevel: 1 },
            { id: 'c1.5', name: 'Начальный 6-ядер', cost: 35, performance: 20, power: 20, tech: 1, requiredLevel: 3 },
            { id: 'c2', name: 'Средний 8-ядер', cost: 50, performance: 30, power: 25, tech: 2, requiredLevel: 6 },
            { id: 'c2.5', name: 'Средний+ 8-ядер', cost: 70, performance: 45, power: 30, tech: 2, requiredLevel: 9 },
            { id: 'c3', name: 'Предфлагман 8-ядер', cost: 90, performance: 55, power: 35, tech: 3, requiredLevel: 12 },
            { id: 'c3.5', name: 'Оптимизированный 8-ядер', cost: 120, performance: 75, power: 30, tech: 3, requiredLevel: 14 },
            { id: 'c4', name: 'Флагман AI', cost: 150, performance: 90, power: 40, tech: 4, requiredLevel: 15 },
            { id: 'c4.5', name: 'Флагман AI+', cost: 180, performance: 110, power: 42, tech: 4, requiredLevel: 17 },
            { id: 'c5', name: 'Нейро-чип', cost: 220, performance: 140, power: 45, tech: 5, requiredLevel: 18 },
            { id: 'c6', name: 'Квантовый сопроцессор', cost: 350, performance: 200, power: 55, tech: 6, requiredLevel: 21 },
            // --- ДОБАВЛЕННЫЕ КОМПОНЕНТЫ (ТОЛЬКО ПО УРОВНЮ) ---
            { id: 'c_lvl4_eff', name: 'Энергоэфф. 6-ядер', cost: 40, performance: 25, power: 18, tech: 1, requiredLevel: 4 },
            { id: 'c_lvl5_alt', name: 'Бюджетный 8-ядер', cost: 45, performance: 28, power: 28, tech: 1, requiredLevel: 5 },
            { id: 'c_lvl7_highfreq', name: 'Высокочастотный 6-ядер', cost: 60, performance: 35, power: 30, tech: 1, requiredLevel: 7 },
            { id: 'c_lvl8_balanced', name: 'Сбаланс. 8-ядер', cost: 65, performance: 40, power: 26, tech: 1, requiredLevel: 8 },
            { id: 'c_lvl10_gaming', name: 'Игровой 8-ядер (Gen 1)', cost: 80, performance: 50, power: 38, tech: 1, requiredLevel: 10 },
            { id: 'c_lvl11_lowheat', name: 'Малогреющийся 8-ядер', cost: 95, performance: 52, power: 32, tech: 1, requiredLevel: 11 },
            { id: 'c_lvl13_ai_lite', name: 'Предфлагман AI Lite', cost: 110, performance: 60, power: 36, tech: 1, requiredLevel: 13 },
            { id: 'c_lvl16_gaming2', name: 'Игровой 8-ядер (Gen 2)', cost: 140, performance: 85, power: 42, tech: 1, requiredLevel: 16 },
            { id: 'c_lvl19_ai_pro', name: 'Флагман AI Pro', cost: 200, performance: 120, power: 48, tech: 1, requiredLevel: 19 },
            { id: 'c_lvl20_eff_pro', name: 'Макс. Энергоэфф.', cost: 180, performance: 100, power: 35, tech: 1, requiredLevel: 20 },
        ]
    },
    ram: {
        name: "ОЗУ",
        items: [
            { id: 'r0', name: '3 GB LPDDR3', cost: 10, performance: 3, tech: 1, requiredLevel: 1 },
            { id: 'r1', name: '4 GB LPDDR4', cost: 15, performance: 5, tech: 1, requiredLevel: 1 },
            { id: 'r2', name: '6 GB LPDDR4X', cost: 25, performance: 10, tech: 2, requiredLevel: 4 },
            { id: 'r2.5', name: '8 GB LPDDR4X', cost: 35, performance: 15, tech: 2, requiredLevel: 7 },
            { id: 'r3', name: '8 GB LPDDR5', cost: 45, performance: 20, tech: 3, requiredLevel: 10 },
            { id: 'r3.5', name: '10 GB LPDDR5', cost: 60, performance: 28, tech: 3, requiredLevel: 12 },
            { id: 'r4', name: '12 GB LPDDR5', cost: 70, performance: 35, tech: 4, requiredLevel: 13 },
            { id: 'r5', name: '16 GB LPDDR5X', cost: 110, performance: 50, tech: 5, requiredLevel: 16 },
            { id: 'r6', name: '24 GB LPDDR5X', cost: 160, performance: 70, tech: 6, requiredLevel: 19 },
            { id: 'r7', name: '32 GB LPDDR6', cost: 250, performance: 90, tech: 7, requiredLevel: 22 },
             // --- ДОБАВЛЕННЫЕ КОМПОНЕНТЫ (ТОЛЬКО ПО УРОВНЮ) ---
            { id: 'r_lvl3_4gb_alt', name: '4 GB LPDDR4 (Optimized)', cost: 18, performance: 6, tech: 1, requiredLevel: 3 },
            { id: 'r_lvl5_5gb', name: '5 GB LPDDR4', cost: 20, performance: 7, tech: 1, requiredLevel: 5 },
            { id: 'r_lvl6_8gb_alt', name: '8 GB LPDDR4', cost: 30, performance: 12, tech: 1, requiredLevel: 6 },
            { id: 'r_lvl8_10gb_alt', name: '10 GB LPDDR4X', cost: 40, performance: 18, tech: 1, requiredLevel: 8 },
            { id: 'r_lvl9_12gb_alt', name: '12 GB LPDDR4X', cost: 50, performance: 22, tech: 1, requiredLevel: 9 },
            { id: 'r_lvl11_14gb_lp', name: '14 GB LPDDR5 (Low Power)', cost: 65, performance: 25, tech: 1, requiredLevel: 11 },
            { id: 'r_lvl14_18gb', name: '18 GB LPDDR5', cost: 100, performance: 40, tech: 1, requiredLevel: 14 },
            { id: 'r_lvl15_20gb', name: '20 GB LPDDR5X', cost: 130, performance: 55, tech: 1, requiredLevel: 15 },
            { id: 'r_lvl20_28gb', name: '28 GB LPDDR5X', cost: 180, performance: 75, tech: 1, requiredLevel: 20 },
            { id: 'r_lvl23_48gb', name: '48 GB LPDDR6', cost: 300, performance: 100, tech: 1, requiredLevel: 23 },
        ]
    },
    storage: {
        name: "Накопитель",
        items: [
            { id: 's0', name: '32 GB eMMC', cost: 7, performance: 1, tech: 1, requiredLevel: 1 },
            { id: 's1', name: '64 GB eMMC', cost: 10, performance: 2, tech: 1, requiredLevel: 1 },
            { id: 's2', name: '128 GB UFS 2.2', cost: 22, performance: 8, tech: 2, requiredLevel: 2 },
            { id: 's2.5', name: '256 GB UFS 2.2', cost: 30, performance: 12, tech: 2, requiredLevel: 5 },
            { id: 's3', name: '256 GB UFS 3.1', cost: 40, performance: 18, tech: 3, requiredLevel: 8 },
            { id: 's4', name: '512 GB UFS 4.0', cost: 75, performance: 30, tech: 4, requiredLevel: 11 },
            { id: 's4.5', name: '768 GB UFS 4.0', cost: 100, performance: 32, tech: 4, requiredLevel: 13 },
            { id: 's5', name: '1 TB UFS 4.0', cost: 130, performance: 35, tech: 5, requiredLevel: 14 },
            { id: 's6', name: '2 TB UFS 5.0', cost: 200, performance: 55, tech: 6, requiredLevel: 17 },
            { id: 's7', name: '4 TB UFS 5.0', cost: 350, performance: 70, tech: 7, requiredLevel: 20 },
             // --- ДОБАВЛЕННЫЕ КОМПОНЕНТЫ (ТОЛЬКО ПО УРОВНЮ) ---
            { id: 's_lvl3_ufs21', name: '128 GB UFS 2.1', cost: 18, performance: 6, tech: 1, requiredLevel: 3 },
            { id: 's_lvl4_64ufs', name: '64 GB UFS 2.0', cost: 15, performance: 4, tech: 1, requiredLevel: 4 },
            { id: 's_lvl6_ufs256_alt', name: '256 GB UFS 2.0', cost: 25, performance: 10, tech: 1, requiredLevel: 6 },
            { id: 's_lvl7_512emmc', name: '512 GB eMMC', cost: 12, performance: 3, tech: 1, requiredLevel: 7 }, // Большая eMMC
            { id: 's_lvl9_128ufs30', name: '128 GB UFS 3.0', cost: 30, performance: 15, tech: 1, requiredLevel: 9 },
            { id: 's_lvl10_256ufs30', name: '256 GB UFS 3.0', cost: 35, performance: 16, tech: 1, requiredLevel: 10 },
            { id: 's_lvl12_512ufs31', name: '512 GB UFS 3.1', cost: 60, performance: 25, tech: 1, requiredLevel: 12 },
            { id: 's_lvl15_768ufs40_alt', name: '768 GB UFS 4.0 (Cost Optimized)', cost: 90, performance: 31, tech: 1, requiredLevel: 15 },
            { id: 's_lvl18_1_5tb', name: '1.5 TB UFS 5.0', cost: 180, performance: 50, tech: 1, requiredLevel: 18 },
            { id: 's_lvl21_3tb', name: '3 TB UFS 5.0', cost: 300, performance: 65, tech: 1, requiredLevel: 21 },
        ]
    },
    screen: {
        name: "Экран",
        items: [
            { id: 'sc1', name: '6.1" HD+ IPS 60Hz', cost: 30, design: 10, power: 20, quality: 10, size: 61, tech: 1, requiredLevel: 1 },
            { id: 'sc1.5', name: '5.8" FHD+ IPS 60Hz (Compact)', cost: 45, design: 15, power: 18, quality: 20, size: 58, tech: 1, requiredLevel: 2 },
            { id: 'sc2', name: '6.5" FHD+ IPS 90Hz', cost: 50, design: 20, power: 30, quality: 25, size: 65, tech: 2, requiredLevel: 3 },
            { id: 'sc2.5', name: '6.2" FHD+ AMOLED 90Hz', cost: 65, design: 30, power: 22, quality: 40, size: 62, tech: 2, requiredLevel: 6 },
            { id: 'sc3', name: '6.4" FHD+ AMOLED 120Hz', cost: 80, design: 40, power: 25, quality: 50, size: 64, tech: 3, requiredLevel: 9 },
            { id: 'sc3.5', name: '6.9" FHD+ AMOLED 120Hz (Large)', cost: 100, design: 35, power: 30, quality: 55, size: 69, tech: 3, requiredLevel: 11 },
            { id: 'sc4', name: '6.7" QHD+ LTPO AMOLED 144Hz', cost: 140, design: 60, power: 35, quality: 80, size: 67, tech: 4, requiredLevel: 12 },
            { id: 'sc5', name: '6.8" 4K MicroLED 240Hz', cost: 250, design: 90, power: 40, quality: 120, size: 68, tech: 5, requiredLevel: 15 },
            { id: 'sc6', name: '7.6" Складной QHD+ 120Hz', cost: 400, design: 120, power: 50, quality: 100, size: 76, tech: 6, requiredLevel: 18 },
            { id: 'sc7', name: '6.7" E-Ink 120Hz', cost: 150, design: 40, power: 5, quality: 30, size: 67, tech: 5, requiredLevel: 16 }, // Special E-Ink screen
             // --- ДОБАВЛЕННЫЕ КОМПОНЕНТЫ (ТОЛЬКО ПО УРОВНЮ) ---
            { id: 'sc_lvl4_ips_75hz', name: '6.3" HD+ IPS 75Hz', cost: 35, design: 12, power: 22, quality: 15, size: 63, tech: 1, requiredLevel: 4 },
            { id: 'sc_lvl5_amo_60hz', name: '6.3" HD+ AMOLED 60Hz', cost: 40, design: 25, power: 15, quality: 30, size: 63, tech: 1, requiredLevel: 5 },
            { id: 'sc_lvl7_fhd_ips_120', name: '6.5" FHD+ IPS 120Hz', cost: 55, design: 22, power: 32, quality: 30, size: 65, tech: 1, requiredLevel: 7 },
            { id: 'sc_lvl8_ips_120hz', name: '6.6" FHD+ IPS 120Hz', cost: 60, design: 20, power: 35, quality: 35, size: 66, tech: 1, requiredLevel: 8 },
            { id: 'sc_lvl10_amo_fhd_highqual', name: '6.4" FHD+ AMOLED (High Qual)', cost: 75, design: 42, power: 28, quality: 52, size: 64, tech: 1, requiredLevel: 10 },
            { id: 'sc_lvl13_ltpo_fhd_120', name: '6.5" FHD+ LTPO AMOLED 120Hz', cost: 110, design: 45, power: 28, quality: 60, size: 65, tech: 1, requiredLevel: 13 },
            { id: 'sc_lvl14_compact_amo', name: '5.9" FHD+ AMOLED 120Hz (Compact Pro)', cost: 120, design: 55, power: 20, quality: 70, size: 59, tech: 1, requiredLevel: 14 },
            { id: 'sc_lvl17_7inch_amo', name: '7.0" FHD+ AMOLED 90Hz', cost: 105, design: 38, power: 32, quality: 58, size: 70, tech: 1, requiredLevel: 17 },
            { id: 'sc_lvl19_qhd_highbright', name: '6.6" QHD+ AMOLED 120Hz (High Bright)', cost: 180, design: 65, power: 38, quality: 90, size: 66, tech: 1, requiredLevel: 19 },
            { id: 'sc_lvl22_8inch_flex', name: '8.0" Складной FHD+ 90Hz', cost: 350, design: 110, power: 45, quality: 80, size: 80, tech: 1, requiredLevel: 22 },
        ]
    },
    battery: {
        name: "Батарея",
        items: [
            { id: 'b1', name: '3500 mAh', cost: 18, capacity: 35, design: 5, tech: 1, requiredLevel: 1 },
            { id: 'b1.5', name: '4000 mAh', cost: 22, capacity: 40, design: 2, tech: 1, requiredLevel: 2 },
            { id: 'b2', name: '4500 mAh', cost: 25, capacity: 45, design: 0, tech: 1, requiredLevel: 5 },
            { id: 'b2.5', name: '4800 mAh', cost: 30, capacity: 48, design: -2, tech: 2, requiredLevel: 7 },
            { id: 'b3', name: '5000 mAh', cost: 35, capacity: 50, design: -5, tech: 2, requiredLevel: 8 },
            { id: 'b4', name: '6000 mAh (PowerBank)', cost: 50, capacity: 60, design: -15, tech: 3, requiredLevel: 11 },
            { id: 'b5', name: '5500 mAh (Графен)', cost: 80, capacity: 70, design: 0, tech: 4, requiredLevel: 14 },
            { id: 'b6', name: '7000 mAh (Твердотельная)', cost: 120, capacity: 85, design: -10, tech: 5, requiredLevel: 17 },
             // --- ДОБАВЛЕННЫЕ КОМПОНЕНТЫ (ТОЛЬКО ПО УРОВНЮ) ---
            { id: 'b_lvl3_3800', name: '3800 mAh (Slim)', cost: 20, capacity: 38, design: 8, tech: 1, requiredLevel: 3 },
            { id: 'b_lvl4_4200', name: '4200 mAh', cost: 23, capacity: 42, design: 0, tech: 1, requiredLevel: 4 },
            { id: 'b_lvl6_4600', name: '4600 mAh (Balanced)', cost: 28, capacity: 46, design: -1, tech: 1, requiredLevel: 6 },
            { id: 'b_lvl9_5200', name: '5200 mAh', cost: 38, capacity: 52, design: -7, tech: 1, requiredLevel: 9 },
            { id: 'b_lvl10_5500', name: '5500 mAh', cost: 42, capacity: 55, design: -8, tech: 1, requiredLevel: 10 },
            { id: 'b_lvl12_5800', name: '5800 mAh (Optimized)', cost: 48, capacity: 58, design: -6, tech: 1, requiredLevel: 12 },
            { id: 'b_lvl13_6200', name: '6200 mAh', cost: 55, capacity: 62, design: -10, tech: 1, requiredLevel: 13 },
            { id: 'b_lvl15_6500', name: '6500 mAh (Power)', cost: 60, capacity: 65, design: -12, tech: 1, requiredLevel: 15 },
            { id: 'b_lvl18_7200', name: '7200 mAh (Large)', cost: 100, capacity: 72, design: -18, tech: 1, requiredLevel: 18 },
            { id: 'b_lvl20_6000_graph', name: '6000 mAh (Графен Lite)', cost: 90, capacity: 60, design: 2, tech: 1, requiredLevel: 20 },
        ]
    },
    mainCamera: {
        name: "Основная камера",
        items: [
            { id: 'cam1', name: '13 Мп', cost: 15, quality: 15, tech: 1, requiredLevel: 1 },
            { id: 'cam1.5', name: '16 Мп + 2Мп (Глубина)', cost: 25, quality: 25, tech: 1, requiredLevel: 3 },
            { id: 'cam2', name: '48 Мп (Два модуля)', cost: 40, quality: 40, tech: 2, requiredLevel: 4 },
            { id: 'cam2.5', name: '64 Мп (Основной + Широкий)', cost: 65, quality: 55, tech: 2, requiredLevel: 7 },
            { id: 'cam3', name: '108 Мп (Три модуля + OIS)', cost: 90, quality: 75, tech: 3, requiredLevel: 10 },
            { id: 'cam3.5', name: '50Мп (Sony) + 12Мп + 8Мп', cost: 120, quality: 95, tech: 3, requiredLevel: 12 },
            { id: 'cam4', name: '200 Мп (Pro-сенсор + Перископ)', cost: 160, quality: 110, tech: 4, requiredLevel: 13 },
            { id: 'cam5', name: '1-дюймовый сенсор Leica', cost: 280, quality: 180, tech: 5, requiredLevel: 16 },
            { id: 'cam6', name: 'Двойной сенсор с переменной диафрагмой', cost: 380, quality: 220, tech: 6, requiredLevel: 19 },
             // --- ДОБАВЛЕННЫЕ КОМПОНЕНТЫ (ТОЛЬКО ПО УРОВНЮ) ---
            { id: 'cam_lvl4_mono', name: 'Модуль Монохромный', cost: 8, quality: 3, tech: 1, requiredLevel: 4 }, // Дополнительный модуль
            { id: 'cam_lvl5_48mp_alt', name: '48 Мп (Simple)', cost: 35, quality: 35, tech: 1, requiredLevel: 5 },
            { id: 'cam_lvl6_macro', name: 'Модуль Макро', cost: 10, quality: 5, tech: 1, requiredLevel: 6 },
            { id: 'cam_lvl8_depth', name: 'Модуль Глубины (Улучш.)', cost: 5, quality: 2, tech: 1, requiredLevel: 8 }, // Улучшенный модуль глубины
            { id: 'cam_lvl9_uw', name: 'Модуль Ультра-широкий', cost: 20, quality: 10, tech: 1, requiredLevel: 9 },
            { id: 'cam_lvl11_tele', name: 'Модуль Телефото', cost: 30, quality: 15, tech: 1, requiredLevel: 11 },
            { id: 'cam_lvl14_50mp_sony_alt', name: '50Мп (Sony Lite) + 8Мп', cost: 100, quality: 80, tech: 1, requiredLevel: 14 },
            { id: 'cam_lvl15_periscope_lite', name: 'Модуль Перископ (Lite)', cost: 70, quality: 50, tech: 1, requiredLevel: 15 }, // Перископ без тех. 4
            { id: 'cam_lvl17_200mp_alt', name: '200 Мп (Basic)', cost: 140, quality: 100, tech: 1, requiredLevel: 17 },
            { id: 'cam_lvl20_cinematic', name: 'Киномодуль (Wide Angle)', cost: 150, quality: 120, tech: 1, requiredLevel: 20 }, // Кино-модуль
        ]
    },
    body: {
        name: "Корпус",
        items: [
            { id: 'bd1', name: 'Пластик', cost: 10, design: 10, tech: 1, requiredLevel: 1 },
            { id: 'bd2', name: 'Поликарбонат', cost: 18, design: 20, tech: 1, requiredLevel: 2 },
            { id: 'bd2.5', name: 'Закаленное стекло (Victus)', cost: 35, design: 40, tech: 2, requiredLevel: 5 },
            { id: 'bd3', name: 'Алюминий и стекло', cost: 45, design: 50, tech: 2, requiredLevel: 8 },
            { id: 'bd3.5', name: 'Стальная рама и стекло', cost: 60, design: 65, tech: 3, requiredLevel: 10 },
            { id: 'bd4', name: 'Титан и керамика', cost: 90, design: 80, tech: 3, requiredLevel: 11 },
            { id: 'bd5', name: 'Самовосстанавливающийся полимер', cost: 150, design: 100, tech: 4, requiredLevel: 14 },
            { id: 'bd6', name: 'Углеволокно (Carbon)', cost: 120, design: 90, tech: 4, requiredLevel: 16 },
            { id: 'bd7', name: 'Корпус из переработанных материалов', cost: 25, design: 30, tech: 2, requiredLevel: 6 }, // Eco-friendly option
             // --- ДОБАВЛЕННЫЕ КОМПОНЕНТЫ (ТОЛЬКО ПО УРОВНЮ) ---
            { id: 'bd_lvl3_glossy', name: 'Глянцевый пластик', cost: 12, design: 15, tech: 1, requiredLevel: 3 },
            { id: 'bd_lvl4_matte', name: 'Матовый поликарбонат', cost: 20, design: 25, tech: 1, requiredLevel: 4 },
            { id: 'bd_lvl7_ip67', name: 'Водозащита (IP67)', cost: 25, design: 15, tech: 1, requiredLevel: 7 },
            { id: 'bd_lvl9_slim', name: 'Ультратонкий корпус', cost: 30, design: 50, tech: 1, requiredLevel: 9 }, // Бонус к дизайну за тонкость
            { id: 'bd_lvl10_ip6x', name: 'Пылезащита (IP6X)', cost: 15, design: 10, tech: 1, requiredLevel: 10 },
            { id: 'bd_lvl12_ceramic_alt', name: 'Керамика (Lite)', cost: 70, design: 70, tech: 1, requiredLevel: 12 }, // Керамика без тех. 3
            { id: 'bd_lvl13_reinforced', name: 'Усиленный корпус (Drop Resist)', cost: 40, design: 30, tech: 1, requiredLevel: 13 }, // Прочность
            { id: 'bd_lvl15_carbon_lite', name: 'Углеволокно (Lite)', cost: 100, design: 80, tech: 1, requiredLevel: 15 },
            { id: 'bd_lvl18_foldable_prot', name: 'Защита для складных', cost: 80, design: 20, tech: 1, requiredLevel: 18 }, // Защита для складных (для sc6, sc_lvl22)
            { id: 'bd_lvl21_aerospace', name: 'Аэрокосмич. алюминий', cost: 100, design: 85, tech: 1, requiredLevel: 21 },
        ]
    }
};

export const COLORS = [
    { id: 'black', name: 'Классический черный', cost: 0, requiredLevel: 1 },
    { id: 'white', name: 'Элегантный белый', cost: 2, requiredLevel: 1 },
    { id: 'blue', name: 'Глубокий синий', cost: 5, requiredLevel: 5 },
    { id: 'red', name: 'Яркий красный', cost: 5, requiredLevel: 5 },
    { id: 'green', name: 'Изумрудный зеленый', cost: 10, requiredLevel: 10 },
    { id: 'gold', name: 'Золотой', cost: 15, requiredLevel: 15 },
    { id: 'silver', name: 'Серебристый', cost: 12, requiredLevel: 12 },
    { id: 'purple', name: 'Лавандовый', cost: 8, requiredLevel: 8 },
    // --- ДОБАВЛЕННЫЕ ЦВЕТА (ТОЛЬКО ПО УРОВНЮ) ---
    { id: 'pink', name: 'Нежный розовый', cost: 5, requiredLevel: 3 },
    { id: 'cyan', name: 'Бирюзовый', cost: 7, requiredLevel: 6 },
    { id: 'yellow', name: 'Солнечный желтый', cost: 7, requiredLevel: 7 },
    { id: 'orange', name: 'Энергичный оранжевый', cost: 8, requiredLevel: 9 },
    { id: 'grey', name: 'Космический серый', cost: 3, requiredLevel: 4 },
    { id: 'brown', name: 'Шоколадный', cost: 6, requiredLevel: 11 },
    { id: 'bronze', name: 'Бронзовый', cost: 13, requiredLevel: 13 },
    { id: 'midnight', name: 'Полуночный зеленый', cost: 11, requiredLevel: 14 },
    { id: 'coral', name: 'Коралловый', cost: 9, requiredLevel: 16 },
    { id: 'burgundy', name: 'Бордовый', cost: 10, requiredLevel: 17 },
];

export const SPECIAL_FEATURES = [
    { id: 'none', name: 'Нет', cost: 0, requiredLevel: 1 },
    { id: 'stylus', name: 'Стилус в корпусе', cost: 25, designBonus: 10, performanceBonus: 0, batteryPenalty: 0, requiredLevel: 8 },
    { id: 'haptic', name: 'Улучшенный вибромотор', cost: 15, designBonus: 5, performanceBonus: 5, batteryPenalty: 0, requiredLevel: 12 },
    { id: 'gamer_buttons', name: 'Доп. игровые кнопки', cost: 30, designBonus: 5, performanceBonus: 10, batteryPenalty: 0, requiredLevel: 16 },
    { id: 'projector', name: 'Пико-проектор', cost: 80, designBonus: 15, performanceBonus: 0, batteryPenalty: 10, requiredLevel: 20 },
    { id: 'ir_blaster', name: 'ИК-порт', cost: 5, designBonus: 2, performanceBonus: 0, batteryPenalty: 0, requiredLevel: 4 },
    { id: 'cooling_system', name: 'Система охлаждения', cost: 20, designBonus: 0, performanceBonus: 8, batteryPenalty: 0, requiredLevel: 10 },
    { id: 'fingerprint_in_screen', name: 'Сканер отпечатка в экране', cost: 18, designBonus: 8, performanceBonus: 0, batteryPenalty: 0, requiredLevel: 9 },
     // --- ДОБАВЛЕННЫЕ ОСОБЫЕ ФУНКЦИИ (ТОЛЬКО ПО УРОВНЮ) ---
    { id: 'dual_sim', name: 'Dual SIM', cost: 3, designBonus: 0, performanceBonus: 0, batteryPenalty: 0, requiredLevel: 3 },
    { id: 'fm_radio', name: 'FM-радио', cost: 2, designBonus: 0, performanceBonus: 0, batteryPenalty: 0, requiredLevel: 5 },
    { id: 'stereo_speakers', name: 'Стереодинамики', cost: 10, designBonus: 3, performanceBonus: 0, batteryPenalty: 0, requiredLevel: 6 },
    { id: 'expandable_storage', name: 'Слот MicroSD', cost: 5, designBonus: 0, performanceBonus: 0, batteryPenalty: 0, requiredLevel: 7 }, // Полезно с дешевыми накопителями
    { id: 'nfc', name: 'NFC', cost: 8, designBonus: 0, performanceBonus: 0, batteryPenalty: 0, requiredLevel: 8 },
    { id: 'wireless_charging', name: 'Беспроводная зарядка', cost: 20, designBonus: 5, performanceBonus: 0, batteryPenalty: 2, requiredLevel: 11 },
    { id: 'reverse_wireless_charging', name: 'Реверсивная беспроводная зарядка', cost: 25, designBonus: 5, performanceBonus: 0, batteryPenalty: 3, requiredLevel: 14 },
    { id: 'enhanced_audio_chip', name: 'Hi-Res Аудио чип', cost: 18, designBonus: 3, performanceBonus: 2, batteryPenalty: 0, requiredLevel: 15 },
    { id: 'ud_fingerprint_ultrasonic', name: 'Ультразвук. сканер отпечатка', cost: 25, designBonus: 10, performanceBonus: 0, batteryPenalty: 1, requiredLevel: 17 },
    { id: 'satellite_sos', name: 'Спутниковый SOS', cost: 30, designBonus: 0, performanceBonus: 0, batteryPenalty: 2, requiredLevel: 19 },
];


export const BUNDLED_ACCESSORIES = [
    { id: 'sim_tool', name: 'Скрепка для SIM', cost: 0.1, designBonus: 0, requiredLevel: 1 },
    { id: 'charger_5w', name: 'Зарядка 5W', cost: 2, designBonus: 1, requiredLevel: 1 },
    { id: 'case_silicone', name: 'Силиконовый чехол', cost: 3, designBonus: 2, requiredLevel: 2 },
    { id: 'headphones_wired', name: 'Проводные наушники', cost: 5, designBonus: 1, requiredLevel: 4 },
    { id: 'charger_25w', name: 'Быстрая зарядка 25W', cost: 8, designBonus: 3, requiredLevel: 7 },
    { id: 'case_leather', name: 'Кожаный чехол', cost: 12, designBonus: 8, requiredLevel: 9 },
    { id: 'headphones_tws', name: 'Беспроводные наушники TWS', cost: 25, designBonus: 5, requiredLevel: 12 },
    { id: 'screen_film', name: 'Защитная пленка', cost: 1, designBonus: 1, requiredLevel: 3 },
    { id: 'dongle_usb_35', name: 'Переходник USB-C на 3.5мм', cost: 4, designBonus: 0, requiredLevel: 6 },
    { id: 'premium_box', name: 'Премиальная упаковка', cost: 10, designBonus: 5, requiredLevel: 10 },
    { id: 'charger_gan', name: 'GaN Зарядка 65W', cost: 20, designBonus: 4, requiredLevel: 13 },
    { id: 'case_kevlar', name: 'Кевларовый чехол', cost: 22, designBonus: 10, requiredLevel: 15 },
    // Дополнительные аксессуары в комплекте можно добавить по аналогии, если нужно
];

export const STANDALONE_ACCESSORIES = [
    { id: 'case_tpu', name: 'Прозрачный чехол', cost: 2, requiredLevel: 2, demand: 1.2 },
    { id: 'case_hard', name: 'Противоударный чехол', cost: 5, requiredLevel: 6, demand: 0.8 },
    { id: 'case_fabric', name: 'Тканевый чехол', cost: 8, requiredLevel: 8, demand: 0.6 },
    { id: 'case_wood', name: 'Деревянный чехол', cost: 15, requiredLevel: 12, demand: 0.3 },
    { id: 'screen_protector', name: 'Защитное стекло', cost: 3, requiredLevel: 3, demand: 1.5 },
    { id: 'screen_protector_privacy', name: 'Приватное стекло', cost: 8, requiredLevel: 9, demand: 0.7 },
    { id: 'headphones_wired_pro', name: 'Проводные Hi-Fi наушники', cost: 15, requiredLevel: 5, demand: 0.6 },
    { id: 'headphones_tws_basic', name: 'TWS Наушники Basic', cost: 20, requiredLevel: 8, demand: 1.0 },
    { id: 'headphones_tws_pro', name: 'TWS Наушники Pro (ANC)', cost: 50, requiredLevel: 14, demand: 0.7 },
    { id: 'headphones_overear', name: 'Полноразмерные наушники', cost: 70, requiredLevel: 17, demand: 0.4 },
    { id: 'powerbank_5k', name: 'Power Bank 5000 mAh', cost: 10, requiredLevel: 4, demand: 1.1 },
    { id: 'powerbank_20k', name: 'Power Bank 20000 mAh', cost: 25, requiredLevel: 10, demand: 0.9 },
    { id: 'charger_fast', name: 'Быстрое З/У 45W', cost: 12, requiredLevel: 7, demand: 1.0 },
    { id: 'charger_wireless', name: 'Беспроводная зарядка', cost: 22, requiredLevel: 11, demand: 0.8 },
    { id: 'charger_multi', name: 'Зарядный хаб (4 порта)', cost: 30, requiredLevel: 15, demand: 0.6 },
    { id: 'gamepad', name: 'Мобильный геймпад', cost: 35, requiredLevel: 13, demand: 0.5 },
    { id: 'smart_watch_fit', name: 'Фитнес-браслет', cost: 30, requiredLevel: 9, demand: 0.9 },
    { id: 'smart_watch_pro', name: 'Умные часы Pro', cost: 90, requiredLevel: 18, demand: 0.4 },
    { id: 'car_holder', name: 'Автомобильный держатель', cost: 7, requiredLevel: 5, demand: 1.0 },
    { id: 'photo_printer', name: 'Мобильный фотопринтер', cost: 60, requiredLevel: 16, demand: 0.2 },
    { id: 'smart_tag', name: 'Умная метка (Трекер)', cost: 18, requiredLevel: 12, demand: 0.7 },
    { id: 'speaker_bt', name: 'Портативная BT колонка', cost: 28, requiredLevel: 10, demand: 0.8 },
    // Дополнительные отдельные аксессуары можно добавить по аналогии, если нужно
];


export const RESEARCH_PROJECTS = [
    { id: 'branding_1', name: 'Основы брендинга', description: 'Разработка простого, но узнаваемого логотипа. +0.02 к пассивному росту узнаваемости.', cost: 50000, time: 60, unlocks: { type: 'logo', level: 1 }, requires: null },
    { id: 'branding_2', name: 'Ребрендинг', description: 'Создание стильного и современного логотипа. +0.03 к пассивному росту узнаваемости.', cost: 200000, time: 150, unlocks: { type: 'logo', level: 2 }, requires: 'branding_1' },
    { id: 'xp_boost_1', name: 'Анализ Рынка', description: 'Улучшает понимание клиентов, увеличивая получаемый опыт на 25%.', cost: 75000, time: 60, unlocks: { type: 'xp_multiplier', value: 0.25 }, requires: null },
    { id: 'xp_boost_2', name: 'Фокус-группы', description: 'Увеличивает получаемый опыт еще на 25%.', cost: 250000, time: 120, unlocks: { type: 'xp_multiplier', value: 0.25 }, requires: 'xp_boost_1' },
    { id: 'cpu_t5', name: 'Нейро-чипы', description: 'Открывает доступ к процессорам 5-го поколения.', cost: 250000, time: 180, unlocks: { category: 'cpu', level: 5 }, requires: null },
    { id: 'cpu_t6', name: 'Квантовые вычисления', description: 'Доступ к экспериментальным квантовым сопроцессорам.', cost: 800000, time: 360, unlocks: { category: 'cpu', level: 6 }, requires: 'cpu_t5' },
    { id: 'ram_t5', name: 'Память LPDDR5X', description: 'Разблокирует ОЗУ объемом 16 ГБ.', cost: 150000, time: 120, unlocks: { category: 'ram', level: 5 }, requires: null },
    { id: 'ram_t6', name: 'Память LPDDR5X+', description: 'Разблокирует ОЗУ объемом 24 ГБ.', cost: 300000, time: 150, unlocks: { category: 'ram', level: 6 }, requires: 'ram_t5' },
    { id: 'ram_t7', name: 'Память LPDDR6', description: 'Новый стандарт сверхбыстрой памяти.', cost: 600000, time: 250, unlocks: { category: 'ram', level: 7 }, requires: 'ram_t6' },
    { id: 'storage_t5', name: 'Накопители UFS 4.0+', description: 'Доступ к накопителям 1 ТБ.', cost: 180000, time: 100, unlocks: { category: 'storage', level: 5 }, requires: null },
    { id: 'storage_t6', name: 'Накопители UFS 5.0', description: 'Доступ к накопителям 2 ТБ.', cost: 400000, time: 180, unlocks: { category: 'storage', level: 6 }, requires: 'storage_t5' },
    { id: 'storage_t7', name: 'Накопители UFS 5.0+', description: 'Доступ к накопителям 4 ТБ.', cost: 700000, time: 280, unlocks: { category: 'storage', level: 7 }, requires: 'storage_t6' },
    { id: 'screen_t5', name: 'Технология MicroLED', description: 'Позволяет производить экраны 4K.', cost: 500000, time: 250, unlocks: { category: 'screen', level: 5 }, requires: null },
    { id: 'screen_t6', name: 'Гибкие дисплеи', description: 'Открывает технологию складных экранов.', cost: 1000000, time: 400, unlocks: { category: 'screen', level: 6 }, requires: 'screen_t5' },
    { id: 'camera_t5', name: 'Профессиональная оптика', description: 'Разблокирует 1-дюймовые сенсоры.', cost: 600000, time: 300, unlocks: { category: 'mainCamera', level: 5 }, requires: null },
    { id: 'camera_t6', name: 'Адаптивная оптика', description: 'Доступ к камерам с переменной диафрагмой.', cost: 950000, time: 380, unlocks: { category: 'mainCamera', level: 6 }, requires: 'camera_t5' },
    { id: 'body_t4', name: 'Инновационные материалы', description: 'Открывает доступ к самовосстанавливающимся и карбоновым корпусам.', cost: 200000, time: 120, unlocks: { category: 'body', level: 4 }, requires: null },
    { id: 'battery_t4', name: 'Графеновые батареи', description: 'Разблокирует более емкие и легкие батареи.', cost: 350000, time: 200, unlocks: { category: 'battery', level: 4 }, requires: null },
    { id: 'battery_t5', name: 'Твердотельные батареи', description: 'Новый прорыв в хранении энергии.', cost: 750000, time: 320, unlocks: { category: 'battery', level: 5 }, requires: 'battery_t4' },
    { id: 'logistics_1', name: 'Оптимизация логистики', description: 'Увеличивает жизненный цикл моделей на 4 недели (28 дней).', cost: 100000, time: 90, unlocks: { type: 'lifecycle', value: 28 }, requires: null },
    { id: 'logistics_2', name: 'Глобальные поставки', description: 'Увеличивает жизненный цикл моделей еще на 4 недели.', cost: 400000, time: 180, unlocks: { type: 'lifecycle', value: 28 }, requires: 'logistics_1' },
];

export const MARKETING_CAMPAIGNS = [
    { id: 'm1', name: 'Реклама в соцсетях', cost: 5000, effect: 5, duration: 30 },
    { id: 'm2', name: 'Обзоры у техноблогеров', cost: 25000, effect: 15, duration: 60 },
    { id: 'm3', name: 'Наружная реклама', cost: 100000, effect: 30, duration: 90 },
    { id: 'm4', name: 'ТВ-реклама', cost: 500000, effect: 50, duration: 120 }
];

export const ALL_TRENDS = [
    { id: 't_perf', name: 'Высокая производительность', description: 'Рынок требует мощные процессоры для игр и тяжелых задач.', check: (phone) => phone.performance > 80 },
    { id: 't_cam', name: 'Качество камеры', description: 'Пользователи хотят заменить свои фотоаппараты смартфонами.', check: (phone) => phone.camera > 70 },
    { id: 't_bat', name: 'Долгое время работы', description: 'Никто не любит носить с собой power bank.', check: (phone) => phone.battery > 40 },
    { id: 't_des', name: 'Премиальный дизайн', description: 'Смартфон стал важным элементом стиля.', check: (phone) => phone.design > 60 },
    { id: 't_big_scr', name: 'Большой экран', description: 'Тренд на потребление медиаконтента в дороге.', check: (phone) => phone.components.screen.size >= 65 },
    { id: 't_compact', name: 'Компактность', description: 'Растет спрос на удобные телефоны, которые помещаются в любой карман.', check: (phone) => phone.components.screen.size <= 62 },
    { id: 't_budget', name: 'Доступная цена', description: 'Экономическая ситуация заставляет людей искать выгодные предложения.', check: (phone) => phone.price < 400 },
    { id: 't_color_blue', name: 'Модный цвет: Синий', description: 'В этом сезоне все без ума от синих оттенков.', check: (phone) => phone.color === 'blue' },
    { id: 't_color_green', name: 'Модный цвет: Зеленый', description: 'Экологичные и природные цвета на пике популярности.', check: (phone) => phone.color === 'green' },
];
