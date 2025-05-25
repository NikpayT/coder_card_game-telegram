// game_data.js

const ALL_CODE_PARTS = [
    // --- SQL (50+ штук) ---
    {
        id: 'sql_select',
        name: 'SELECT (выборка)',
        emoji: '🔍',
        description: 'Выбирает данные из БД.',
        type: 'SQL'
    },
    {
        id: 'sql_from',
        name: 'FROM (источник)',
        emoji: '📚',
        description: 'Указывает таблицу для SELECT.',
        type: 'SQL'
    },
    {
        id: 'sql_where',
        name: 'WHERE (условие)',
        emoji: '❓',
        description: 'Фильтрует записи по условию.',
        type: 'SQL'
    },
    {
        id: 'sql_insert_into',
        name: 'INSERT INTO (вставка)',
        emoji: '➕',
        description: 'Добавляет новые записи.',
        type: 'SQL'
    },
    {
        id: 'sql_values',
        name: 'VALUES (значения)',
        emoji: '➡️',
        description: 'Указывает значения для INSERT.',
        type: 'SQL'
    },
    {
        id: 'sql_update',
        name: 'UPDATE (обновление)',
        emoji: '✏️',
        description: 'Изменяет существующие записи.',
        type: 'SQL'
    },
    {
        id: 'sql_set',
        name: 'SET (установить)',
        emoji: '⚙️',
        description: 'Задает новые значения в UPDATE.',
        type: 'SQL'
    },
    {
        id: 'sql_delete_from',
        name: 'DELETE FROM (удаление)',
        emoji: '🗑️',
        description: 'Удаляет записи из таблицы.',
        type: 'SQL'
    },
    {
        id: 'sql_create_table',
        name: 'CREATE TABLE (создать таблицу)',
        emoji: '🏗️',
        description: 'Создает новую таблицу.',
        type: 'SQL'
    },
    {
        id: 'sql_int',
        name: 'INT (целое число)',
        emoji: '🔢',
        description: 'Тип данных для целых чисел.',
        type: 'SQL'
    },
    {
        id: 'sql_varchar',
        name: 'VARCHAR (текст)',
        emoji: '📝',
        description: 'Тип данных для текста переменной длины.',
        type: 'SQL'
    },
    {
        id: 'sql_primary_key',
        name: 'PRIMARY KEY (ключ)',
        emoji: '🔑',
        description: 'Уникальный идентификатор записи.',
        type: 'SQL'
    },
    {
        id: 'sql_not_null',
        name: 'NOT NULL (не пусто)',
        emoji: '🚫',
        description: 'Поле не может быть пустым.',
        type: 'SQL'
    },
    {
        id: 'sql_alter_table',
        name: 'ALTER TABLE (изменить таблицу)',
        emoji: '🛠️',
        description: 'Изменяет структуру таблицы.',
        type: 'SQL'
    },
    {
        id: 'sql_add_column',
        name: 'ADD COLUMN (добавить столбец)',
        emoji: '➕C',
        description: 'Добавляет новый столбец.',
        type: 'SQL'
    },
    {
        id: 'sql_drop_table',
        name: 'DROP TABLE (удалить таблицу)',
        emoji: '💣',
        description: 'Удаляет таблицу из БД.',
        type: 'SQL'
    },
    {
        id: 'sql_join',
        name: 'JOIN (объединение)',
        emoji: '🤝',
        description: 'Объединяет строки из разных таблиц.',
        type: 'SQL'
    },
    {
        id: 'sql_inner_join',
        name: 'INNER JOIN (внутреннее)',
        emoji: '🔗',
        description: 'Возвращает совпадающие строки из двух таблиц.',
        type: 'SQL'
    },
    {
        id: 'sql_left_join',
        name: 'LEFT JOIN (левое)',
        emoji: '⬅️🔗',
        description: 'Возвращает все строки из левой таблицы.',
        type: 'SQL'
    },
    {
        id: 'sql_right_join',
        name: 'RIGHT JOIN (правое)',
        emoji: '➡️🔗',
        description: 'Возвращает все строки из правой таблицы.',
        type: 'SQL'
    },
    {
        id: 'sql_on',
        name: 'ON (условие JOIN)',
        emoji: '📌',
        description: 'Указывает условие для JOIN.',
        type: 'SQL'
    },
    {
        id: 'sql_order_by',
        name: 'ORDER BY (сортировка)',
        emoji: '⬇️⬆️',
        description: 'Сортирует результаты.',
        type: 'SQL'
    },
    {
        id: 'sql_asc',
        name: 'ASC (по возрастанию)',
        emoji: '⬆️',
        description: 'Сортировка по возрастанию.',
        type: 'SQL'
    },
    {
        id: 'sql_desc',
        name: 'DESC (по убыванию)',
        emoji: '⬇️',
        description: 'Сортировка по убыванию.',
        type: 'SQL'
    },
    {
        id: 'sql_group_by',
        name: 'GROUP BY (группировка)',
        emoji: '👥',
        description: 'Группирует строки по столбцам.',
        type: 'SQL'
    },
    {
        id: 'sql_having',
        name: 'HAVING (фильтр групп)',
        emoji: '🎯',
        description: 'Фильтрует группы после GROUP BY.',
        type: 'SQL'
    },
    {
        id: 'sql_count',
        name: 'COUNT() (количество)',
        emoji: '🔢',
        description: 'Считает количество строк.',
        type: 'SQL'
    },
    {
        id: 'sql_sum',
        name: 'SUM() (сумма)',
        emoji: '➕',
        description: 'Вычисляет сумму значений.',
        type: 'SQL'
    },
    {
        id: 'sql_avg',
        name: 'AVG() (среднее)',
        emoji: '📊',
        description: 'Вычисляет среднее значение.',
        type: 'SQL'
    },
    {
        id: 'sql_min',
        name: 'MIN() (минимум)',
        emoji: '📉',
        description: 'Находит минимальное значение.',
        type: 'SQL'
    },
    {
        id: 'sql_max',
        name: 'MAX() (максимум)',
        emoji: '📈',
        description: 'Находит максимальное значение.',
        type: 'SQL'
    },
    {
        id: 'sql_distinct',
        name: 'DISTINCT (уникальные)',
        emoji: '✨',
        description: 'Возвращает только уникальные значения.',
        type: 'SQL'
    },
    {
        id: 'sql_like',
        name: 'LIKE (поиск по шаблону)',
        emoji: '👻',
        description: 'Используется для поиска по шаблону.',
        type: 'SQL'
    },
    {
        id: 'sql_wildcards',
        name: 'Wildcards (% и _)',
        emoji: '🐾',
        description: 'Символы для шаблонов LIKE.',
        type: 'SQL'
    },
    {
        id: 'sql_and',
        name: 'AND (логическое И)',
        emoji: '&&',
        description: 'Комбинирует условия (все должны быть true).',
        type: 'SQL'
    },
    {
        id: 'sql_or',
        name: 'OR (логическое ИЛИ)',
        emoji: '||',
        description: 'Комбинирует условия (хотя бы одно true).',
        type: 'SQL'
    },
    {
        id: 'sql_not',
        name: 'NOT (логическое НЕ)',
        emoji: '✖️',
        description: 'Инвертирует условие.',
        type: 'SQL'
    },
    {
        id: 'sql_in',
        name: 'IN (в списке)',
        emoji: '✅',
        description: 'Проверяет, входит ли значение в список.',
        type: 'SQL'
    },
    {
        id: 'sql_between',
        name: 'BETWEEN (между)',
        emoji: '↔️',
        description: 'Проверяет, находится ли значение в диапазоне.',
        type: 'SQL'
    },
    {
        id: 'sql_is_null',
        name: 'IS NULL (пусто)',
        emoji: '⚪',
        description: 'Проверяет, является ли значение NULL.',
        type: 'SQL'
    },
    {
        id: 'sql_is_not_null',
        name: 'IS NOT NULL (не пусто)',
        emoji: '🚯',
        description: 'Проверяет, не является ли значение NULL.',
        type: 'SQL'
    },
    {
        id: 'sql_limit',
        name: 'LIMIT (ограничение)',
        emoji: '🛑',
        description: 'Ограничивает количество возвращаемых строк.',
        type: 'SQL'
    },
    {
        id: 'sql_offset',
        name: 'OFFSET (смещение)',
        emoji: '➡️➡️',
        description: 'Пропускает определенное количество строк.',
        type: 'SQL'
    },
    {
        id: 'sql_union',
        name: 'UNION (объединение SELECT)',
        emoji: '➕',
        description: 'Объединяет результаты двух или более SELECT запросов.',
        type: 'SQL'
    },
    {
        id: 'sql_union_all',
        name: 'UNION ALL (объединение с дубликатами)',
        emoji: '➕➕',
        description: 'Объединяет результаты, включая дубликаты.',
        type: 'SQL'
    },
    {
        id: 'sql_case',
        name: 'CASE (условие IF-THEN-ELSE)',
        emoji: '🧩',
        description: 'Выполняет условия, как IF-THEN-ELSE.',
        type: 'SQL'
    },
    {
        id: 'sql_subquery',
        name: 'Subquery (вложенный запрос)',
        emoji: '🕳️',
        description: 'Запрос внутри другого запроса.',
        type: 'SQL'
    },
    {
        id: 'sql_count_distinct',
        name: 'COUNT(DISTINCT)',
        emoji: '✨🔢',
        description: 'Считает уникальные значения.',
        type: 'SQL'
    },
    {
        id: 'sql_having_count',
        name: 'HAVING COUNT()',
        emoji: '🎯🔢',
        description: 'Фильтрует группы по количеству.',
        type: 'SQL'
    },
    {
        id: 'sql_as_alias',
        name: 'AS (псевдоним)',
        emoji: '📝',
        description: 'Дает столбцу или таблице временное имя.',
        type: 'SQL'
    },
    {
        id: 'sql_truncate_table',
        name: 'TRUNCATE TABLE (очистить таблицу)',
        emoji: '🧹',
        description: 'Быстро удаляет все данные из таблицы.',
        type: 'SQL'
    },
    {
        id: 'sql_drop_database',
        name: 'DROP DATABASE (удалить БД)',
        emoji: '💥',
        description: 'Удаляет базу данных.',
        type: 'SQL'
    },
    {
        id: 'sql_create_database',
        name: 'CREATE DATABASE (создать БД)',
        emoji: '🏠',
        description: 'Создает новую базу данных.',
        type: 'SQL'
    },
    {
        id: 'sql_use_database',
        name: 'USE (выбрать БД)',
        emoji: '🎯',
        description: 'Выбирает активную базу данных.',
        type: 'SQL'
    },
    {
        id: 'sql_auto_increment',
        name: 'AUTO_INCREMENT (автоинкремент)',
        emoji: '➕1',
        description: 'Автоматически увеличивает значение при вставке.',
        type: 'SQL'
    },
    {
        id: 'sql_default',
        name: 'DEFAULT (значение по умолчанию)',
        emoji: '➡️',
        description: 'Устанавливает значение по умолчанию для столбца.',
        type: 'SQL'
    }
];