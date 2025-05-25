// game_data.js - Список всех возможных SQL-функций и их частей
const ALL_CODE_PARTS = [
    {
        id: 'sql_select',
        name: 'SELECT',
        emoji: '🔍',
        description: 'Выбирает столбцы данных из базы данных.',
        example: 'SELECT column1, column2 FROM table_name;',
        type: 'SQL',
        rarity: 'common'
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
    {
        id: 'sql_where',
        name: 'WHERE',
        emoji: '🎯',
        description: 'Фильтрует записи, основываясь на заданном условии.',
        example: 'SELECT * FROM Products WHERE Price > 50;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_insert_into',
        name: 'INSERT INTO',
        emoji: '➕',
        description: 'Добавляет новые строки данных в таблицу.',
        example: 'INSERT INTO Customers (Name, City) VALUES (\'Alice\', \'New York\');',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_values',
        name: 'VALUES',
        emoji: '🔢',
        description: 'Указывает значения для вставки в столбцы.',
        example: 'INSERT INTO Orders (CustomerID, OrderDate) VALUES (1, \'2023-01-15\');',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_update',
        name: 'UPDATE',
        emoji: '✏️',
        description: 'Изменяет существующие данные в таблице.',
        example: 'UPDATE Products SET Price = 100 WHERE ProductID = 1;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_set',
        name: 'SET',
        emoji: '🔄',
        description: 'Устанавливает новые значения для столбцов при обновлении.',
        example: 'UPDATE Employees SET Salary = 60000 WHERE EmployeeID = 5;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_delete_from',
        name: 'DELETE FROM',
        emoji: '❌',
        description: 'Удаляет существующие строки из таблицы.',
        example: 'DELETE FROM Orders WHERE OrderID = 101;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_create_table',
        name: 'CREATE TABLE',
        emoji: '🧱',
        description: 'Создает новую таблицу в базе данных.',
        example: 'CREATE TABLE Users (UserID INT, UserName VARCHAR(255));',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_int',
        name: 'INT (целое число)',
        emoji: '🔢',
        description: 'Целочисленный тип данных.',
        example: 'CREATE TABLE Products (ProductID INT, ProductName VARCHAR(255));',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_varchar',
        name: 'VARCHAR (текст)',
        emoji: '📝',
        description: 'Строковый тип данных переменной длины.',
        example: 'CREATE TABLE Users (UserName VARCHAR(50));',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_date',
        name: 'DATE (дата)',
        emoji: '📅',
        description: 'Тип данных для хранения даты.',
        example: 'CREATE TABLE Orders (OrderDate DATE);',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_primary_key',
        name: 'PRIMARY KEY',
        emoji: '🔑',
        description: 'Уникальный идентификатор для каждой записи в таблице.',
        example: 'CREATE TABLE Customers (CustomerID INT PRIMARY KEY);',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_foreign_key',
        name: 'FOREIGN KEY',
        emoji: '🔗',
        description: 'Ссылается на первичный ключ в другой таблице.',
        example: 'CONSTRAINT FK_OrdersCustomers FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID);',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_join',
        name: 'JOIN',
        emoji: '🤝',
        description: 'Объединяет строки из двух или более таблиц на основе связанного столбца между ними.',
        example: 'SELECT Orders.OrderID, Customers.CustomerName FROM Orders JOIN Customers ON Orders.CustomerID = Customers.CustomerID;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_inner_join',
        name: 'INNER JOIN',
        emoji: '🤝',
        description: 'Возвращает только те строки, для которых есть совпадения в обеих таблицах.',
        example: 'SELECT A.col1, B.col2 FROM TableA A INNER JOIN TableB B ON A.id = B.id;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_left_join',
        name: 'LEFT JOIN',
        emoji: '⬅️',
        description: 'Возвращает все строки из левой таблицы и совпадающие из правой.',
        example: 'SELECT A.col1, B.col2 FROM TableA A LEFT JOIN TableB B ON A.id = B.id;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_right_join',
        name: 'RIGHT JOIN',
        emoji: '➡️',
        description: 'Возвращает все строки из правой таблицы и совпадающие из левой.',
        example: 'SELECT A.col1, B.col2 FROM TableA A RIGHT JOIN TableB B ON A.id = B.id;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_full_outer_join',
        name: 'FULL OUTER JOIN',
        emoji: '↔️',
        description: 'Возвращает все строки, если есть совпадения в одной из таблиц.',
        example: 'SELECT A.col1, B.col2 FROM TableA A FULL OUTER JOIN TableB B ON A.id = B.id;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_group_by',
        name: 'GROUP BY',
        emoji: '📊',
        description: 'Группирует строки, имеющие одинаковые значения в указанных столбцах.',
        example: 'SELECT Country, COUNT(CustomerID) FROM Customers GROUP BY Country;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_having',
        name: 'HAVING',
        emoji: '📏',
        description: 'Фильтрует группы, созданные с помощью GROUP BY.',
        example: 'SELECT Country, COUNT(CustomerID) FROM Customers GROUP BY Country HAVING COUNT(CustomerID) > 5;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_order_by',
        name: 'ORDER BY',
        emoji: '↕️',
        description: 'Сортирует результирующий набор по одному или нескольким столбцам.',
        example: 'SELECT ProductName, Price FROM Products ORDER BY Price DESC;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_asc',
        name: 'ASC (по возрастанию)',
        emoji: '⬆️',
        description: 'Сортирует данные в возрастающем порядке.',
        example: 'SELECT ProductName FROM Products ORDER BY ProductName ASC;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_desc',
        name: 'DESC (по убыванию)',
        emoji: '⬇️',
        description: 'Сортирует данные в убывающем порядке.',
        example: 'SELECT ProductName FROM Products ORDER BY ProductName DESC;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_count',
        name: 'COUNT()',
        emoji: '∑',
        description: 'Возвращает количество строк, которые соответствуют указанному условию.',
        example: 'SELECT COUNT(ProductID) FROM Products;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_sum',
        name: 'SUM()',
        emoji: '➕',
        description: 'Возвращает общую сумму числового столбца.',
        example: 'SELECT SUM(Quantity) FROM OrderDetails;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_avg',
        name: 'AVG()',
        emoji: '🧮',
        description: 'Возвращает среднее значение числового столбца.',
        example: 'SELECT AVG(Price) FROM Products;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_min',
        name: 'MIN()',
        emoji: '🔽',
        description: 'Возвращает наименьшее значение выбранного столбца.',
        example: 'SELECT MIN(Price) FROM Products;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_max',
        name: 'MAX()',
        emoji: '🔼',
        description: 'Возвращает наибольшее значение выбранного столбца.',
        example: 'SELECT MAX(Salary) FROM Employees;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_like',
        name: 'LIKE',
        emoji: '🎭',
        description: 'Используется в WHERE для поиска шаблона в столбце.',
        example: 'SELECT * FROM Customers WHERE CustomerName LIKE \'A%\';',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_wildcard_percent',
        name: '% (Wildcard)',
        emoji: '✨',
        description: 'Заменяет любое количество символов в LIKE.',
        example: 'SELECT * FROM Products WHERE ProductName LIKE \'%SQL%\';',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_wildcard_underscore',
        name: '_ (Wildcard)',
        emoji: '➖',
        description: 'Заменяет один любой символ в LIKE.',
        example: 'SELECT * FROM Customers WHERE City LIKE \'L_ndon\';',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_in',
        name: 'IN',
        emoji: '➡️',
        description: 'Позволяет указать несколько возможных значений в условии WHERE.',
        example: 'SELECT * FROM Orders WHERE ShipCity IN (\'London\', \'Paris\');',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_between',
        name: 'BETWEEN',
        emoji: '↔️',
        description: 'Выбирает значения в пределах заданного диапазона.',
        example: 'SELECT * FROM Products WHERE Price BETWEEN 10 AND 20;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_distinct',
        name: 'DISTINCT',
        emoji: '✨',
        description: 'Используется для возврата только уникальных значений.',
        example: 'SELECT DISTINCT Country FROM Customers;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_alias',
        name: 'AS (псевдоним)',
        emoji: '📛',
        description: 'Присваивает временное имя таблице или столбцу.',
        example: 'SELECT CustomerName AS Name FROM Customers;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_case',
        name: 'CASE',
        emoji: '❓',
        description: 'Условное выражение, как IF-THEN-ELSE.',
        example: 'SELECT ProductName, CASE WHEN Price > 100 THEN \'Expensive\' ELSE \'Cheap\' END AS PriceCategory FROM Products;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_union',
        name: 'UNION',
        emoji: '➕',
        description: 'Объединяет результирующие наборы двух или более операторов SELECT.',
        example: 'SELECT City FROM Customers UNION SELECT City FROM Suppliers;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_limit',
        name: 'LIMIT (MySQL/PostgreSQL)',
        emoji: '✂️',
        description: 'Ограничивает количество возвращаемых строк.',
        example: 'SELECT * FROM Customers LIMIT 10;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_top',
        name: 'TOP (SQL Server)',
        emoji: '🔝',
        description: 'Ограничивает количество возвращаемых строк.',
        example: 'SELECT TOP 10 * FROM Customers;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_offset',
        name: 'OFFSET',
        emoji: '➡️',
        description: 'Пропускает определенное количество строк перед возвратом.',
        example: 'SELECT * FROM Customers LIMIT 10 OFFSET 20;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_alter_table',
        name: 'ALTER TABLE',
        emoji: '🏗️',
        description: 'Добавляет, удаляет или изменяет столбцы в таблице.',
        example: 'ALTER TABLE Customers ADD Email VARCHAR(255);',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_add_column',
        name: 'ADD COLUMN',
        emoji: '➕',
        description: 'Добавляет новый столбец в таблицу.',
        example: 'ALTER TABLE Employees ADD COLUMN StartDate DATE;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_drop_column',
        name: 'DROP COLUMN',
        emoji: '🗑️',
        description: 'Удаляет столбец из таблицы.',
        example: 'ALTER TABLE Products DROP COLUMN Description;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_drop_table',
        name: 'DROP TABLE',
        emoji: '💥',
        description: 'Удаляет существующую таблицу из базы данных.',
        example: 'DROP TABLE Shippers;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_truncate_table',
        name: 'TRUNCATE TABLE',
        emoji: '🧹',
        description: 'Удаляет все строки из таблицы, но оставляет структуру таблицы.',
        example: 'TRUNCATE TABLE Logs;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_create_database',
        name: 'CREATE DATABASE',
        emoji: '🏢',
        description: 'Создает новую базу данных.',
        example: 'CREATE DATABASE MyNewDB;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_drop_database',
        name: 'DROP DATABASE',
        emoji: '💣',
        description: 'Удаляет существующую базу данных.',
        example: 'DROP DATABASE OldDB;',
        type: 'SQL',
        rarity: 'legendary'
    },
    {
        id: 'sql_index',
        name: 'CREATE INDEX',
        emoji: '📖',
        description: 'Создает индексы для ускорения запросов.',
        example: 'CREATE INDEX idx_lastname ON Persons (LastName);',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_union_all',
        name: 'UNION ALL',
        emoji: '➕➕',
        description: 'Объединяет результирующие наборы, включая дубликаты.',
        example: 'SELECT City FROM Customers UNION ALL SELECT City FROM Suppliers;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_exists',
        name: 'EXISTS',
        emoji: '❓',
        description: 'Проверяет наличие любых строк, возвращаемых подзапросом.',
        example: 'SELECT SupplierName FROM Suppliers WHERE EXISTS (SELECT ProductName FROM Products WHERE SupplierId = Suppliers.supplierId AND Price < 20);',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_any_all',
        name: 'ANY / ALL',
        emoji: '⚖️',
        description: 'ANY: TRUE, если сравнение TRUE для ЛЮБОГО из значений в подзапросе. ALL: TRUE, если сравнение TRUE для ВСЕХ значений.',
        example: 'SELECT ProductName FROM Products WHERE ProductID = ANY (SELECT ProductID FROM OrderDetails WHERE Quantity > 10);',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_is_null',
        name: 'IS NULL',
        emoji: '🚫',
        description: 'Проверяет, является ли значение NULL.',
        example: 'SELECT CustomerName FROM Customers WHERE Address IS NULL;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_is_not_null',
        name: 'IS NOT NULL',
        emoji: '✅',
        description: 'Проверяет, не является ли значение NULL.',
        example: 'SELECT CustomerName FROM Customers WHERE Address IS NOT NULL;',
        type: 'SQL',
        rarity: 'common'
    },
    {
        id: 'sql_top_n_percent',
        name: 'TOP N PERCENT (SQL Server)',
        emoji: '🎯%',
        description: 'Выбирает указанный процент строк сверху.',
        example: 'SELECT TOP 50 PERCENT * FROM Customers;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_rank',
        name: 'RANK()',
        emoji: '🏅',
        description: 'Функция ранжирования, присваивает ранг каждой строке внутри раздела.',
        example: 'SELECT EmployeeName, Salary, RANK() OVER (ORDER BY Salary DESC) as RankNo FROM Employees;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_dense_rank',
        name: 'DENSE_RANK()',
        emoji: '🏆',
        description: 'Функция ранжирования, аналогична RANK(), но без пропусков в рангах.',
        example: 'SELECT EmployeeName, Salary, DENSE_RANK() OVER (ORDER BY Salary DESC) as DenseRankNo FROM Employees;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_row_number',
        name: 'ROW_NUMBER()',
        emoji: '🔢',
        description: 'Присваивает уникальный последовательный номер каждой строке в разделе.',
        example: 'SELECT ProductName, Price, ROW_NUMBER() OVER (ORDER BY Price) as RowNum FROM Products;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_cte_with',
        name: 'WITH (CTE)',
        emoji: '🧠',
        description: 'Определяет временный, именованный набор результатов (Common Table Expression).',
        example: 'WITH ExpensiveProducts AS (SELECT ProductName, Price FROM Products WHERE Price > 100) SELECT ProductName FROM ExpensiveProducts;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_pivot',
        name: 'PIVOT (SQL Server)',
        emoji: '🔄',
        description: 'Превращает строки в столбцы, агрегируя данные.',
        example: 'SELECT Customer, [ProductA], [ProductB] FROM (SELECT Customer, Product, Quantity FROM Sales) AS SourceTable PIVOT (SUM(Quantity) FOR Product IN ([ProductA], [ProductB])) AS PivotTable;',
        type: 'SQL',
        rarity: 'legendary'
    },
    {
        id: 'sql_unpivot',
        name: 'UNPIVOT (SQL Server)',
        emoji: '↔️',
        description: 'Превращает столбцы в строки.',
        example: 'SELECT Product, Category, Quantity FROM (SELECT ProductA, ProductB FROM Sales) AS SourceTable UNPIVOT (Quantity FOR Category IN (ProductA, ProductB)) AS UnpivotTable;',
        type: 'SQL',
        rarity: 'legendary'
    },
    {
        id: 'sql_window_function',
        name: 'OVER (Window Function)',
        emoji: '🪟',
        description: 'Определяет оконные функции для выполнения вычислений по набору строк, связанных с текущей строкой.',
        example: 'SELECT EmployeeName, Salary, SUM(Salary) OVER (PARTITION BY Department) AS DepartmentTotal FROM Employees;',
        type: 'SQL',
        rarity: 'epic'
    }
];
