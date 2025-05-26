// game_data.js - Список всех возможных SQL-функций и их частей, а также задания для конструктора запросов
const ALL_CODE_PARTS = [
    {
        id: 'sql_select',
        name: 'SELECT',
        emoji: '🔍',
        description: 'Выбирает столбцы данных из базы данных.',
        example: 'SELECT column1, column2 FROM table_name;',
        type: 'SQL',
        rarity: 'common' // dbType не указан - универсальная
    },
    {
        id: 'sql_from',
        name: 'FROM',
        emoji: '📦',
        description: 'Указывает, из какой таблицы извлекать данные.',
        example: 'SELECT * FROM Customers;',
        type: 'SQL',
        rarity: 'common'
    },
    // ... другие универсальные функции ...
    {
        id: 'sql_limit',
        name: 'LIMIT', // Уберем упоминание СУБД из имени, т.к. теперь есть dbType
        emoji: '✂️',
        description: 'Ограничивает количество возвращаемых строк. Характерно для MySQL/PostgreSQL.',
        example: 'SELECT * FROM Customers LIMIT 10;',
        type: 'SQL',
        rarity: 'uncommon',
        dbType: ['mysql', 'postgresql'] // НОВОЕ: Специфично для этих СУБД
    },
    {
        id: 'sql_top',
        name: 'TOP', // Уберем упоминание СУБД из имени
        emoji: '🔝',
        description: 'Ограничивает количество возвращаемых строк. Характерно для SQL Server.',
        example: 'SELECT TOP 10 * FROM Customers;',
        type: 'SQL',
        rarity: 'uncommon',
        dbType: ['sqlserver'] // НОВОЕ: Специфично для SQL Server
    },
    {
        id: 'sql_offset', // OFFSET часто используется с LIMIT
        name: 'OFFSET',
        emoji: '➡️',
        description: 'Пропускает определенное количество строк перед возвратом. Часто с LIMIT или FETCH.',
        example: 'SELECT * FROM Customers ORDER BY CustomerID LIMIT 10 OFFSET 20; (PostgreSQL/MySQL)',
        type: 'SQL',
        rarity: 'rare',
        dbType: ['mysql', 'postgresql'] // PostgreSQL, MySQL (SQLite тоже, но мы его не выделяем пока)
    },
    {
        id: 'sql_top_n_percent',
        name: 'TOP N PERCENT',
        emoji: '🎯%',
        description: 'Выбирает указанный процент строк сверху. Характерно для SQL Server.',
        example: 'SELECT TOP 50 PERCENT * FROM Customers;',
        type: 'SQL',
        rarity: 'rare',
        dbType: ['sqlserver']
    },
    {
        id: 'sql_pivot',
        name: 'PIVOT',
        emoji: '🔄',
        description: 'Превращает строки в столбцы, агрегируя данные. Реализации отличаются, но SQL Server имеет встроенный.',
        example: 'SELECT Customer, [ProductA], [ProductB] FROM (SELECT Customer, Product, Quantity FROM Sales) AS SourceTable PIVOT (SUM(Quantity) FOR Product IN ([ProductA], [ProductB])) AS PivotTable;',
        type: 'SQL',
        rarity: 'legendary',
        dbType: ['sqlserver', 'oracle'] // Oracle тоже имеет PIVOT
    },
    {
        id: 'sql_unpivot',
        name: 'UNPIVOT',
        emoji: '↔️',
        description: 'Превращает столбцы в строки.',
        example: 'SELECT Product, Category, Quantity FROM (SELECT ProductA, ProductB FROM Sales) AS SourceTable UNPIVOT (Quantity FOR Category IN (ProductA, ProductB)) AS UnpivotTable;',
        type: 'SQL',
        rarity: 'legendary',
        dbType: ['sqlserver', 'oracle']
    },
    {
        id: 'sql_recursive_cte',
        name: 'Рекурсивный CTE', // Уберем WITH RECURSIVE из имени, т.к. синтаксис может отличаться
        emoji: '♾️🧠',
        description: 'CTE, которое ссылается на себя, для обхода иерархических или графовых структур. (WITH RECURSIVE в PostgreSQL/MySQL, просто WITH в SQL Server/Oracle для рекурсии)',
        example: 'WITH RECURSIVE EmployeeHierarchy AS (...) SELECT * FROM EmployeeHierarchy;',
        type: 'SQL',
        rarity: 'legendary' // Можно считать универсальным по концепции, но синтаксис WITH RECURSIVE специфичен
        // dbType: ['postgresql', 'mysql'] // Если хотим подчеркнуть именно 'WITH RECURSIVE'
    },
    // Пример новой функции, специфичной для PostgreSQL
    {
        id: 'psql_jsonb_ops',
        name: 'Операторы JSONB',
        emoji: '📄',
        description: 'Операторы для работы с типом данных JSONB в PostgreSQL (например, ->, ->>, @>, <@).',
        example: 'SELECT data ->> \'name\' FROM users WHERE data @> \'{"status":"active"}\';',
        type: 'PostgreSQL', // Можно использовать такой тип или оставить SQL и указать dbType
        rarity: 'epic',
        dbType: ['postgresql']
    },
    // Пример новой функции, специфичной для Oracle
    {
        id: 'ora_decode',
        name: 'DECODE',
        emoji: '🔢',
        description: 'Функция DECODE в Oracle, аналогичная CASE, но с более компактным синтаксисом для простых условий.',
        example: 'SELECT DECODE(status, \'A\', \'Active\', \'I\', \'Inactive\', \'Unknown\') FROM employees;',
        type: 'Oracle',
        rarity: 'rare',
        dbType: ['oracle']
    },
    // Добавьте сюда еще ~37 функций, стараясь распределить их по универсальным и специфичным для СУБД.
    // Старайтесь давать уникальные id.
    // Вот несколько идей для вдохновения (некоторые уже могут быть у вас с другими ID):

    // PostgreSQL специфичные
    { id: 'psql_generate_series', name: 'generate_series()', emoji: '📈', description: 'Генерирует ряд значений. PostgreSQL.', example: 'SELECT generate_series(1, 5);', type: 'PostgreSQL', rarity: 'uncommon', dbType: ['postgresql'] },
    { id: 'psql_array_agg', name: 'array_agg()', emoji: '📦', description: 'Агрегатная функция, собирает значения в массив. PostgreSQL.', example: 'SELECT array_agg(product_name) FROM products GROUP BY category_id;', type: 'PostgreSQL', rarity: 'rare', dbType: ['postgresql'] },
    { id: 'psql_ilike', name: 'ILIKE', emoji: '🎭i', description: 'Регистронезависимый LIKE. PostgreSQL.', example: 'SELECT * FROM customers WHERE name ILIKE \'john%\';', type: 'PostgreSQL', rarity: 'common', dbType: ['postgresql'] },
    { id: 'psql_distinct_on', name: 'DISTINCT ON ()', emoji: '✨🎯', description: 'Выбирает первую строку для каждой группы уникальных значений. PostgreSQL.', example: 'SELECT DISTINCT ON (category_id) * FROM products ORDER BY category_id, price DESC;', type: 'PostgreSQL', rarity: 'epic', dbType: ['postgresql'] },
    { id: 'psql_using', name: 'USING (JOIN)', emoji: '🤝💡', description: 'Сокращенный синтаксис для JOIN, если имена столбцов совпадают. PostgreSQL/MySQL.', example: 'SELECT * FROM orders o JOIN customers c USING (customer_id);', type: 'SQL', rarity: 'uncommon', dbType: ['postgresql', 'mysql'] },

    // MySQL специфичные
    { id: 'mysql_group_concat', name: 'GROUP_CONCAT()', emoji: '🔗🔗', description: 'Конкатенирует значения из группы строк. MySQL.', example: 'SELECT GROUP_CONCAT(product_name SEPARATOR \', \') FROM products GROUP BY category_id;', type: 'MySQL', rarity: 'rare', dbType: ['mysql'] },
    { id: 'mysql_date_format', name: 'DATE_FORMAT()', emoji: '📅✍️', description: 'Форматирует дату в указанный строковый формат. MySQL.', example: 'SELECT DATE_FORMAT(order_date, \'%Y-%m-%d\') FROM orders;', type: 'MySQL', rarity: 'uncommon', dbType: ['mysql'] },
    { id: 'mysql_regexp', name: 'REGEXP / RLIKE', emoji: '🔍🔬', description: 'Поиск по регулярному выражению. MySQL.', example: 'SELECT * FROM messages WHERE content REGEXP \'error[0-9]+\';', type: 'MySQL', rarity: 'rare', dbType: ['mysql'] },
    { id: 'mysql_straight_join', name: 'STRAIGHT_JOIN', emoji: '➡️🤝', description: 'Принуждает оптимизатор соединять таблицы в указанном порядке. MySQL.', example: 'SELECT * FROM table1 STRAIGHT_JOIN table2 ON table1.id = table2.id;', type: 'MySQL', rarity: 'epic', dbType: ['mysql'] },

    // SQL Server специфичные
    { id: 'sqlserv_getdate', name: 'GETDATE()', emoji: '📅⏰', description: 'Возвращает текущую дату и время. SQL Server.', example: 'SELECT GETDATE();', type: 'SQL Server', rarity: 'common', dbType: ['sqlserver'] },
    { id: 'sqlserv_string_split', name: 'STRING_SPLIT()', emoji: '✂️📝', description: 'Разбивает строку на подстроки по разделителю. SQL Server 2016+.', example: 'SELECT value FROM STRING_SPLIT(\'apple,banana,orange\', \',\');', type: 'SQL Server', rarity: 'uncommon', dbType: ['sqlserver'] },
    { id: 'sqlserv_try_convert', name: 'TRY_CONVERT()', emoji: '❓🔄', description: 'Пытается преобразовать значение в указанный тип, возвращает NULL при ошибке. SQL Server.', example: 'SELECT TRY_CONVERT(INT, \'123x\');', type: 'SQL Server', rarity: 'uncommon', dbType: ['sqlserver'] },
    { id: 'sqlserv_for_xml_path', name: 'FOR XML PATH', emoji: '📄✍️', description: 'Формирует XML из результатов запроса. SQL Server.', example: 'SELECT name, type FROM sys.objects FOR XML PATH(\'object\'), ROOT(\'objects\');', type: 'SQL Server', rarity: 'epic', dbType: ['sqlserver'] },
    { id: 'sqlserv_merge', name: 'MERGE', emoji: '🔄🤝', description: 'Выполняет операции INSERT, UPDATE, DELETE в целевой таблице на основе результатов соединения с исходной. SQL Server/Oracle.', example: 'MERGE target AS T USING source AS S ON T.id = S.id WHEN MATCHED THEN UPDATE SET ... WHEN NOT MATCHED THEN INSERT ...;', type: 'SQL', rarity: 'epic', dbType: ['sqlserver', 'oracle'] },


    // Oracle специфичные
    { id: 'ora_sysdate', name: 'SYSDATE', emoji: '📅⏰', description: 'Возвращает текущую дату и время. Oracle.', example: 'SELECT SYSDATE FROM dual;', type: 'Oracle', rarity: 'common', dbType: ['oracle'] },
    { id: 'ora_nvl', name: 'NVL()', emoji: '❓➡️', description: 'Заменяет NULL указанным значением. Oracle.', example: 'SELECT NVL(commission_pct, 0) FROM employees;', type: 'Oracle', rarity: 'common', dbType: ['oracle'] },
    { id: 'ora_listagg', name: 'LISTAGG()', emoji: '🔗🔗', description: 'Агрегатная функция для конкатенации строк. Oracle.', example: 'SELECT LISTAGG(last_name, \', \') WITHIN GROUP (ORDER BY last_name) FROM employees;', type: 'Oracle', rarity: 'rare', dbType: ['oracle'] },
    { id: 'ora_connect_by_prior', name: 'CONNECT BY PRIOR', emoji: '🌳🔗', description: 'Для иерархических запросов. Oracle.', example: 'SELECT last_name, employee_id, manager_id FROM employees START WITH manager_id IS NULL CONNECT BY PRIOR employee_id = manager_id;', type: 'Oracle', rarity: 'legendary', dbType: ['oracle'] },
    { id: 'ora_flashback_query', name: 'Flashback Query', emoji: '⏪🕰️', description: 'Позволяет запрашивать данные на определенный момент времени в прошлом. Oracle.', example: 'SELECT * FROM employees AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL \'1\' HOUR);', type: 'Oracle', rarity: 'legendary', dbType: ['oracle'] },

    // Еще несколько универсальных или почти универсальных для разнообразия
    { id: 'sql_coalesce', name: 'COALESCE()', emoji: '❓➡️✅', description: 'Возвращает первое не-NULL выражение из списка.', example: 'SELECT COALESCE(NULL, NULL, \'Default\', \'Value\');', type: 'SQL', rarity: 'common'},
    { id: 'sql_nullif', name: 'NULLIF()', emoji: '❓=🚫', description: 'Возвращает NULL, если два выражения равны, иначе первое выражение.', example: 'SELECT NULLIF(col1, col2);', type: 'SQL', rarity: 'uncommon'},
    { id: 'sql_fetch_first_rows', name: 'FETCH FIRST N ROWS ONLY', emoji: '✂️🔝', description: 'Стандартный способ ограничения строк (SQL:2008).', example: 'SELECT * FROM products ORDER BY price DESC FETCH FIRST 10 ROWS ONLY;', type: 'SQL', rarity: 'uncommon' }, // Универсальный стандарт, но не все СУБД его сразу поддержали
    { id: 'sql_current_date', name: 'CURRENT_DATE', emoji: '📅', description: 'Возвращает текущую дату.', example: 'SELECT CURRENT_DATE;', type: 'SQL', rarity: 'common' },
    { id: 'sql_current_timestamp', name: 'CURRENT_TIMESTAMP', emoji: '📅⏰', description: 'Возвращает текущую дату и время с часовым поясом.', example: 'SELECT CURRENT_TIMESTAMP;', type: 'SQL', rarity: 'common' },
    { id: 'sql_extract', name: 'EXTRACT()', emoji: '📅✂️', description: 'Извлекает часть из даты/времени (YEAR, MONTH, DAY и т.д.).', example: 'SELECT EXTRACT(YEAR FROM order_date) FROM orders;', type: 'SQL', rarity: 'uncommon' },
    { id: 'sql_cast', name: 'CAST()', emoji: '🔄⚖️', description: 'Преобразует значение одного типа данных в другой.', example: 'SELECT CAST(\'123\' AS INT);', type: 'SQL', rarity: 'common' },
    { id: 'sql_convert', name: 'CONVERT()', emoji: '🔄🎨', description: 'Преобразует значение и может форматировать (зависит от СУБД, особенно SQL Server).', example: 'SELECT CONVERT(VARCHAR, GETDATE(), 103); (SQL Server)', type: 'SQL', rarity: 'uncommon', dbType: ['sqlserver'] }, // SQL Server имеет мощный CONVERT для дат
    { id: 'sql_rowid', name: 'ROWID / OID', emoji: '📍🆔', description: 'Псевдостолбец, представляющий уникальный идентификатор строки (зависит от СУБД).', example: 'SELECT ROWID, name FROM customers; (Oracle, PostgreSQL OID)', type: 'SQL', rarity: 'rare', dbType: ['oracle', 'postgresql'] }, // У PostgreSQL есть OID, у Oracle ROWID
    { id: 'sql_except', name: 'EXCEPT / MINUS', emoji: '➖📋', description: 'Возвращает строки из первого запроса, которых нет во втором. (EXCEPT в SQL Server/PostgreSQL, MINUS в Oracle)', example: 'SELECT id FROM table1 EXCEPT SELECT id FROM table2;', type: 'SQL', rarity: 'rare' }, // Название универсальное, реализация разная
    { id: 'sql_intersect', name: 'INTERSECT', emoji: '∩📋', description: 'Возвращает строки, которые есть в обоих запросах.', example: 'SELECT id FROM table1 INTERSECT SELECT id FROM table2;', type: 'SQL', rarity: 'rare' },
    { id: 'sql_greatest_least', name: 'GREATEST() / LEAST()', emoji: '↕️🔢', description: 'Возвращает наибольшее/наименьшее значение из списка аргументов.', example: 'SELECT GREATEST(10, 20, 5);', type: 'SQL', rarity: 'uncommon', dbType: ['postgresql', 'mysql', 'oracle'] }, // SQL Server не имеет их напрямую (нужно CASE или VALUES)

    // Продолжай в том же духе, пока не наберется ~40 новых.
    // Я добавил 30, так что еще 10.

    { id: 'sql_returning', name: 'RETURNING / OUTPUT', emoji: '↩️🎁', description: 'Возвращает значения из измененных строк (INSERT, UPDATE, DELETE). (RETURNING в PostgreSQL/Oracle, OUTPUT в SQL Server)', example: 'INSERT INTO users (name) VALUES (\'Test\') RETURNING id;', type: 'SQL', rarity: 'epic', dbType: ['postgresql', 'oracle', 'sqlserver'] },
    { id: 'sql_lateral_join', name: 'LATERAL JOIN', emoji: '🔗➡️', description: 'Позволяет подзапросу в FROM ссылаться на столбцы из предыдущих таблиц. (LATERAL в PostgreSQL, APPLY в SQL Server/Oracle)', example: 'SELECT u.name, p.product_name FROM users u, LATERAL (SELECT * FROM products WHERE user_id = u.id ORDER BY price DESC LIMIT 1) p;', type: 'SQL', rarity: 'epic', dbType: ['postgresql', 'sqlserver', 'oracle'] }, // APPLY - аналог
    { id: 'sql_values_constructor', name: 'VALUES Constructor', emoji: '🧱🔢', description: 'Создает временную таблицу из набора значений.', example: 'SELECT * FROM (VALUES (1, \'A\'), (2, \'B\')) AS t (id, val);', type: 'SQL', rarity: 'uncommon' },
    { id: 'sql_for_update', name: 'FOR UPDATE / OF', emoji: '🔒✏️', description: 'Блокирует выбранные строки для предотвращения их изменения другими транзакциями.', example: 'SELECT * FROM accounts WHERE id = 1 FOR UPDATE;', type: 'SQL', rarity: 'epic' }, // Общая концепция, синтаксис может чуть отличаться
    { id: 'sql_sequence', name: 'CREATE SEQUENCE', emoji: '🔢⚙️', description: 'Создает генератор последовательных чисел.', example: 'CREATE SEQUENCE user_id_seq START WITH 100;', type: 'SQL', rarity: 'rare', dbType: ['postgresql', 'oracle', 'sqlserver'] }, // SQL Server с SQL 2012
    { id: 'sql_window_ntile', name: 'NTILE()', emoji: '📊🔪', description: 'Разделяет строки в упорядоченном разделе на указанное количество групп (квартили, децили и т.д.).', example: 'SELECT name, salary, NTILE(4) OVER (ORDER BY salary DESC) AS quartile FROM employees;', type: 'SQL', rarity: 'rare'},
    { id: 'sql_window_first_value', name: 'FIRST_VALUE()', emoji: '🥇🪟', description: 'Возвращает значение первого выражения в упорядоченном разделе.', example: 'SELECT name, department, salary, FIRST_VALUE(name) OVER (PARTITION BY department ORDER BY salary DESC) AS highest_paid FROM employees;', type: 'SQL', rarity: 'rare'},
    { id: 'sql_window_last_value', name: 'LAST_VALUE()', emoji: '꼴🪟', description: 'Возвращает значение последнего выражения в упорядоченном разделе.', example: 'SELECT name, department, salary, LAST_VALUE(name) OVER (PARTITION BY department ORDER BY salary DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS lowest_paid_overall_in_dept FROM employees;', type: 'SQL', rarity: 'rare'},
    { id: 'sql_comments_single', name: '-- (Comment)', emoji: '💬➖', description: 'Однострочный комментарий в SQL.', example: '-- Это комментарий \nSELECT * FROM users;', type: 'SQL', rarity: 'common'},
    { id: 'sql_comments_multi', name: '/* */ (Comment)', emoji: '💬🧱', description: 'Многострочный комментарий в SQL.', example: '/* Это \n многострочный \n комментарий */\nSELECT * FROM users;', type: 'SQL', rarity: 'common'}

];

const QUERY_CONSTRUCTION_TASKS = [
    {
        id: 'task_select_all_users',
        name: 'Простая выборка пользователей',
        description: 'Создайте SQL-запрос, чтобы выбрать все столбцы (`*`) из таблицы `Users`.',
        targetQueryStructure: [
            { keyword: 'SELECT', value: '*' },
            { keyword: 'FROM', value: 'Users' }
        ],
        requiredFunctions: ['sql_select', 'sql_from'],
        availableTables: ['Users', 'Products', 'Orders'],
        availableColumns: {
            'Users': ['UserID', 'UserName', 'Email'],
            'Products': ['ProductID', 'ProductName', 'Price'],
            'Orders': ['OrderID', 'CustomerID', 'OrderDate']
        },
        rewardXp: 15,
        unlocksNextTaskId: 'task_select_specific_columns'
    },
    {
        id: 'task_select_specific_columns',
        name: 'Выборка конкретных столбцов',
        description: 'Создайте SQL-запрос, чтобы выбрать столбцы `ProductName` и `Price` из таблицы `Products`.',
        targetQueryStructure: [
            { keyword: 'SELECT', value: ['ProductName', 'Price'] },
            { keyword: 'FROM', value: 'Products' }
        ],
        requiredFunctions: ['sql_select', 'sql_from'],
        availableTables: ['Users', 'Products', 'Orders'],
        availableColumns: {
            'Users': ['UserID', 'UserName', 'Email'],
            'Products': ['ProductID', 'ProductName', 'Price'],
            'Orders': ['OrderID', 'CustomerID', 'OrderDate']
        },
        rewardXp: 20,
        unlocksNextTaskId: 'task_filter_products'
    },
    {
        id: 'task_filter_products',
        name: 'Фильтрация продуктов',
        description: 'Создайте SQL-запрос, чтобы выбрать `ProductName` из таблицы `Products`, где `Price` больше `100`.',
        targetQueryStructure: [
            { keyword: 'SELECT', value: 'ProductName' },
            { keyword: 'FROM', value: 'Products' },
            { keyword: 'WHERE', condition: { column: 'Price', operator: '>', value: 100 } }
        ],
        requiredFunctions: ['sql_select', 'sql_from', 'sql_where'],
        availableTables: ['Users', 'Products', 'Orders'],
        availableColumns: {
            'Products': ['ProductID', 'ProductName', 'Price']
        },
        rewardXp: 30,
        unlocksNextTaskId: 'task_join_tables'
    },
    {
        id: 'task_join_tables',
        name: 'Объединение таблиц',
        description: 'Создайте SQL-запрос, чтобы выбрать `Orders.OrderID` и `Customers.CustomerName` из таблиц `Orders` и `Customers`, объединив их по `CustomerID`.',
        targetQueryStructure: [
            { keyword: 'SELECT', value: ['Orders.OrderID', 'Customers.CustomerName'] },
            { keyword: 'FROM', value: 'Orders' },
            { keyword: 'JOIN', joinTable: 'Customers', onCondition: 'Orders.CustomerID=Customers.CustomerID' } // Убрал пробелы для более точного сравнения
        ],
        requiredFunctions: ['sql_select', 'sql_from', 'sql_join'],
        availableTables: ['Users', 'Products', 'Orders', 'Customers'],
        availableColumns: {
            'Users': ['UserID', 'UserName', 'Email'],
            'Products': ['ProductID', 'ProductName', 'Price'],
            'Orders': ['OrderID', 'CustomerID', 'OrderDate'],
            'Customers': ['CustomerID', 'CustomerName', 'City']
        },
        rewardXp: 50,
        unlocksNextTaskId: null
    }
];
