// game_data.js - Список всех возможных SQL-функций и их частей, а также задания для конструктора запросов
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
        name: 'LIMIT',
        emoji: '✂️',
        description: 'Ограничивает количество возвращаемых строк. Характерно для MySQL/PostgreSQL.',
        example: 'SELECT * FROM Customers LIMIT 10;',
        type: 'SQL',
        rarity: 'uncommon',
        dbType: ['mysql', 'postgresql']
    },
    {
        id: 'sql_top',
        name: 'TOP',
        emoji: '🔝',
        description: 'Ограничивает количество возвращаемых строк. Характерно для SQL Server.',
        example: 'SELECT TOP 10 * FROM Customers;',
        type: 'SQL',
        rarity: 'uncommon',
        dbType: ['sqlserver']
    },
    {
        id: 'sql_offset',
        name: 'OFFSET',
        emoji: '➡️',
        description: 'Пропускает определенное количество строк перед возвратом. Часто с LIMIT или FETCH.',
        example: 'SELECT * FROM Customers ORDER BY CustomerID LIMIT 10 OFFSET 20; (PostgreSQL/MySQL)',
        type: 'SQL',
        rarity: 'rare',
        dbType: ['mysql', 'postgresql']
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
        name: 'TOP N PERCENT',
        emoji: '🎯%',
        description: 'Выбирает указанный процент строк сверху. Характерно для SQL Server.',
        example: 'SELECT TOP 50 PERCENT * FROM Customers;',
        type: 'SQL',
        rarity: 'rare',
        dbType: ['sqlserver']
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
        name: 'PIVOT',
        emoji: '🔄',
        description: 'Превращает строки в столбцы, агрегируя данные. Реализации отличаются, но SQL Server и Oracle имеют встроенный.',
        example: 'SELECT Customer, [ProductA], [ProductB] FROM (SELECT Customer, Product, Quantity FROM Sales) AS SourceTable PIVOT (SUM(Quantity) FOR Product IN ([ProductA], [ProductB])) AS PivotTable; (SQL Server)',
        type: 'SQL',
        rarity: 'legendary',
        dbType: ['sqlserver', 'oracle']
    },
    {
        id: 'sql_unpivot',
        name: 'UNPIVOT',
        emoji: '↔️',
        description: 'Превращает столбцы в строки.',
        example: 'SELECT Product, Category, Quantity FROM (SELECT ProductA, ProductB FROM Sales) AS SourceTable UNPIVOT (Quantity FOR Category IN (ProductA, ProductB)) AS UnpivotTable; (SQL Server)',
        type: 'SQL',
        rarity: 'legendary',
        dbType: ['sqlserver', 'oracle']
    },
    {
        id: 'sql_window_function',
        name: 'OVER (Window Function)',
        emoji: '🪟',
        description: 'Определяет оконные функции для выполнения вычислений по набору строк, связанных с текущей строкой.',
        example: 'SELECT EmployeeName, Salary, SUM(Salary) OVER (PARTITION BY Department) AS DepartmentTotal FROM Employees;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_left_outer_join',
        name: 'LEFT OUTER JOIN',
        emoji: '⬅️🤝',
        description: 'Возвращает все строки из левой таблицы и совпадающие из правой. Аналогично LEFT JOIN.',
        example: 'SELECT A.col1, B.col2 FROM TableA A LEFT OUTER JOIN TableB B ON A.id = B.id;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_right_outer_join',
        name: 'RIGHT OUTER JOIN',
        emoji: '➡️🤝',
        description: 'Возвращает все строки из правой таблицы и совпадающие из левой. Аналогично RIGHT JOIN.',
        example: 'SELECT A.col1, B.col2 FROM TableA A RIGHT OUTER JOIN TableB B ON A.id = B.id;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_cross_join',
        name: 'CROSS JOIN',
        emoji: '✖️',
        description: 'Возвращает декартово произведение строк двух таблиц.',
        example: 'SELECT A.col1, B.col2 FROM TableA A CROSS JOIN TableB B;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_self_join',
        name: 'SELF JOIN',
        emoji: '👤🤝',
        description: 'Объединение таблицы с самой собой.',
        example: 'SELECT A.EmployeeName AS Employee1, B.EmployeeName AS Employee2 FROM Employees A, Employees B WHERE A.ManagerID = B.EmployeeID;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_subquery',
        name: 'Подзапрос (Subquery)',
        emoji: '📦🔍',
        description: 'Запрос внутри другого запроса.',
        example: 'SELECT ProductName FROM Products WHERE Price > (SELECT AVG(Price) FROM Products);',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_exists_subquery',
        name: 'EXISTS (Subquery)',
        emoji: '❓📦',
        description: 'Используется для проверки существования строк, возвращаемых подзапросом.',
        example: 'SELECT CustomerName FROM Customers WHERE EXISTS (SELECT OrderID FROM Orders WHERE Customers.CustomerID = Orders.CustomerID);',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_not_exists',
        name: 'NOT EXISTS',
        emoji: '🚫❓',
        description: 'Используется для проверки отсутствия строк, возвращаемых подзапросом.',
        example: 'SELECT CustomerName FROM Customers WHERE NOT EXISTS (SELECT OrderID FROM Orders WHERE Customers.CustomerID = Orders.CustomerID);',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_create_view',
        name: 'CREATE VIEW',
        emoji: '👁️‍🗨️',
        description: 'Создает виртуальную таблицу, основанную на результате SQL-запроса.',
        example: 'CREATE VIEW ActiveCustomers AS SELECT CustomerName, City FROM Customers WHERE IsActive = 1;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_drop_view',
        name: 'DROP VIEW',
        emoji: '🚫👁️',
        description: 'Удаляет представление (виртуальную таблицу).',
        example: 'DROP VIEW ActiveCustomers;',
        type: 'SQL',
        rarity: 'uncommon'
    },
    {
        id: 'sql_stored_procedure',
        name: 'Хранимая Процедура',
        emoji: '⚙️',
        description: 'Набор операторов SQL, который может быть сохранен и выполнен многократно.',
        example: 'CREATE PROCEDURE GetCustomersByCity @City NVARCHAR(50) AS SELECT * FROM Customers WHERE City = @City;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_function',
        name: 'Пользовательская Функция',
        emoji: '🔧',
        description: 'Пользовательская функция, возвращающая скалярное значение или таблицу.',
        example: 'CREATE FUNCTION GetTotalSales (@ProductID INT) RETURNS DECIMAL(10,2) AS BEGIN DECLARE @TotalSales DECIMAL(10,2); SELECT @TotalSales = SUM(Quantity * Price) FROM OrderDetails WHERE ProductID = @ProductID; RETURN @TotalSales; END;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_trigger',
        name: 'Триггер (Trigger)',
        emoji: '⚡',
        description: 'Специальный тип хранимой процедуры, которая автоматически выполняется при возникновении события в базе данных.',
        example: 'CREATE TRIGGER UpdateStock AFTER INSERT ON OrderDetails FOR EACH ROW UPDATE Products SET Stock = Stock - NEW.Quantity WHERE ProductID = NEW.ProductID;',
        type: 'SQL',
        rarity: 'legendary'
    },
    {
        id: 'sql_transaction_begin',
        name: 'BEGIN TRANSACTION',
        emoji: '🎬',
        description: 'Начинает транзакцию, группируя несколько операций в единое целое.',
        example: 'BEGIN TRANSACTION; INSERT INTO Accounts ...;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_transaction_commit',
        name: 'COMMIT',
        emoji: '✅',
        description: 'Сохраняет все изменения, сделанные в текущей транзакции.',
        example: 'COMMIT;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_transaction_rollback',
        name: 'ROLLBACK',
        emoji: '↩️',
        description: 'Отменяет все изменения, сделанные в текущей транзакции.',
        example: 'ROLLBACK;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_grant',
        name: 'GRANT',
        emoji: '🔑',
        description: 'Предоставляет пользователю разрешения на базу данных.',
        example: 'GRANT SELECT ON Customers TO \'user1\';',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_revoke',
        name: 'REVOKE',
        emoji: '🚫🔑',
        description: 'Отзывает разрешения у пользователя.',
        example: 'REVOKE SELECT ON Products FROM \'user1\';',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_deny',
        name: 'DENY',
        emoji: '⛔',
        description: 'Запрещает разрешения на объект базы данных.',
        example: 'DENY DELETE ON Orders TO \'user2\';',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_alter_index',
        name: 'ALTER INDEX',
        emoji: '🔧📖',
        description: 'Изменяет свойства существующего индекса.',
        example: 'ALTER INDEX idx_lastname ON Persons REBUILD;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_drop_index',
        name: 'DROP INDEX',
        emoji: '🗑️📖',
        description: 'Удаляет индекс.',
        example: 'DROP INDEX idx_lastname ON Persons;',
        type: 'SQL',
        rarity: 'rare'
    },
    {
        id: 'sql_top_with_ties',
        name: 'TOP WITH TIES',
        emoji: '🔝🔗',
        description: 'Возвращает указанное количество строк, включая строки с равными значениями, если они попадают в топ N. (SQL Server)',
        example: 'SELECT TOP 3 WITH TIES ProductName, Price FROM Products ORDER BY Price DESC;',
        type: 'SQL',
        rarity: 'epic',
        dbType: ['sqlserver']
    },
    {
        id: 'sql_partition_by',
        name: 'PARTITION BY',
        emoji: '🧩',
        description: 'Разделяет результирующий набор на разделы, к которым применяется оконная функция.',
        example: 'SELECT EmployeeName, Department, Salary, AVG(Salary) OVER (PARTITION BY Department) AS AvgDeptSalary FROM Employees;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_lag',
        name: 'LAG()',
        emoji: '⏪',
        description: 'Получает значение из предыдущей строки в том же результирующем наборе без использования SELF JOIN.',
        example: 'SELECT OrderID, OrderDate, LAG(OrderDate, 1, \'1900-01-01\') OVER (ORDER BY OrderDate) AS PreviousOrderDate FROM Orders;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_lead',
        name: 'LEAD()',
        emoji: '⏩',
        description: 'Получает значение из последующей строки в том же результирующем наборе.',
        example: 'SELECT OrderID, OrderDate, LEAD(OrderDate, 1, \'2999-12-31\') OVER (ORDER BY OrderDate) AS NextOrderDate FROM Orders;',
        type: 'SQL',
        rarity: 'epic'
    },
    {
        id: 'sql_recursive_cte',
        name: 'Рекурсивный CTE',
        emoji: '♾️🧠',
        description: 'CTE, которое ссылается на себя, для обхода иерархических или графовых структур. (Синтаксис WITH RECURSIVE в PostgreSQL/MySQL, просто WITH в SQL Server/Oracle для рекурсии)',
        example: 'WITH RECURSIVE EmployeeHierarchy AS (...) SELECT * FROM EmployeeHierarchy;',
        type: 'SQL',
        rarity: 'legendary'
    },
    {
        id: 'sql_materialized_view',
        name: 'Материализованное Представление (MV)',
        emoji: '💾👁️‍🗨️',
        description: 'Представление, которое хранит результат запроса физически, а не вычисляет его каждый раз.',
        example: 'CREATE MATERIALIZED VIEW mv_daily_sales AS SELECT OrderDate, SUM(TotalAmount) AS DailySales FROM Orders GROUP BY OrderDate;',
        type: 'SQL',
        rarity: 'legendary'
    },
    {
        id: 'psql_jsonb_ops',
        name: 'Операторы JSONB',
        emoji: '📄',
        description: 'Операторы для работы с типом данных JSONB в PostgreSQL (например, ->, ->>, @>, <@).',
        example: 'SELECT data ->> \'name\' FROM users WHERE data @> \'{"status":"active"}\';',
        type: 'PostgreSQL',
        rarity: 'epic',
        dbType: ['postgresql']
    },
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
    { id: 'psql_generate_series', name: 'generate_series()', emoji: '📈', description: 'Генерирует ряд значений. PostgreSQL.', example: 'SELECT generate_series(1, 5);', type: 'PostgreSQL', rarity: 'uncommon', dbType: ['postgresql'] },
    { id: 'psql_array_agg', name: 'array_agg()', emoji: '📦', description: 'Агрегатная функция, собирает значения в массив. PostgreSQL.', example: 'SELECT array_agg(product_name) FROM products GROUP BY category_id;', type: 'PostgreSQL', rarity: 'rare', dbType: ['postgresql'] },
    { id: 'psql_ilike', name: 'ILIKE', emoji: '🎭i', description: 'Регистронезависимый LIKE. PostgreSQL.', example: 'SELECT * FROM customers WHERE name ILIKE \'john%\';', type: 'PostgreSQL', rarity: 'common', dbType: ['postgresql'] },
    { id: 'psql_distinct_on', name: 'DISTINCT ON ()', emoji: '✨🎯', description: 'Выбирает первую строку для каждой группы уникальных значений. PostgreSQL.', example: 'SELECT DISTINCT ON (category_id) * FROM products ORDER BY category_id, price DESC;', type: 'PostgreSQL', rarity: 'epic', dbType: ['postgresql'] },
    { id: 'psql_using', name: 'USING (JOIN)', emoji: '🤝💡', description: 'Сокращенный синтаксис для JOIN, если имена столбцов совпадают. PostgreSQL/MySQL.', example: 'SELECT * FROM orders o JOIN customers c USING (customer_id);', type: 'SQL', rarity: 'uncommon', dbType: ['postgresql', 'mysql'] },
    { id: 'mysql_group_concat', name: 'GROUP_CONCAT()', emoji: '🔗🔗', description: 'Конкатенирует значения из группы строк. MySQL.', example: 'SELECT GROUP_CONCAT(product_name SEPARATOR \', \') FROM products GROUP BY category_id;', type: 'MySQL', rarity: 'rare', dbType: ['mysql'] },
    { id: 'mysql_date_format', name: 'DATE_FORMAT()', emoji: '📅✍️', description: 'Форматирует дату в указанный строковый формат. MySQL.', example: 'SELECT DATE_FORMAT(order_date, \'%Y-%m-%d\') FROM orders;', type: 'MySQL', rarity: 'uncommon', dbType: ['mysql'] },
    { id: 'mysql_regexp', name: 'REGEXP / RLIKE', emoji: '🔍🔬', description: 'Поиск по регулярному выражению. MySQL.', example: 'SELECT * FROM messages WHERE content REGEXP \'error[0-9]+\';', type: 'MySQL', rarity: 'rare', dbType: ['mysql'] },
    { id: 'mysql_straight_join', name: 'STRAIGHT_JOIN', emoji: '➡️🤝', description: 'Принуждает оптимизатор соединять таблицы в указанном порядке. MySQL.', example: 'SELECT * FROM table1 STRAIGHT_JOIN table2 ON table1.id = table2.id;', type: 'MySQL', rarity: 'epic', dbType: ['mysql'] },
    { id: 'sqlserv_getdate', name: 'GETDATE()', emoji: '📅⏰', description: 'Возвращает текущую дату и время. SQL Server.', example: 'SELECT GETDATE();', type: 'SQL Server', rarity: 'common', dbType: ['sqlserver'] },
    { id: 'sqlserv_string_split', name: 'STRING_SPLIT()', emoji: '✂️📝', description: 'Разбивает строку на подстроки по разделителю. SQL Server 2016+.', example: 'SELECT value FROM STRING_SPLIT(\'apple,banana,orange\', \',\');', type: 'SQL Server', rarity: 'uncommon', dbType: ['sqlserver'] },
    { id: 'sqlserv_try_convert', name: 'TRY_CONVERT()', emoji: '❓🔄', description: 'Пытается преобразовать значение в указанный тип, возвращает NULL при ошибке. SQL Server.', example: 'SELECT TRY_CONVERT(INT, \'123x\');', type: 'SQL Server', rarity: 'uncommon', dbType: ['sqlserver'] },
    { id: 'sqlserv_for_xml_path', name: 'FOR XML PATH', emoji: '📄✍️', description: 'Формирует XML из результатов запроса. SQL Server.', example: 'SELECT name, type FROM sys.objects FOR XML PATH(\'object\'), ROOT(\'objects\');', type: 'SQL Server', rarity: 'epic', dbType: ['sqlserver'] },
    { id: 'sqlserv_merge', name: 'MERGE', emoji: '🔄🤝', description: 'Выполняет операции INSERT, UPDATE, DELETE в целевой таблице на основе результатов соединения с исходной. SQL Server/Oracle.', example: 'MERGE target AS T USING source AS S ON T.id = S.id WHEN MATCHED THEN UPDATE SET ... WHEN NOT MATCHED THEN INSERT ...;', type: 'SQL', rarity: 'epic', dbType: ['sqlserver', 'oracle'] },
    { id: 'ora_sysdate', name: 'SYSDATE', emoji: '📅⏰', description: 'Возвращает текущую дату и время. Oracle.', example: 'SELECT SYSDATE FROM dual;', type: 'Oracle', rarity: 'common', dbType: ['oracle'] },
    { id: 'ora_nvl', name: 'NVL()', emoji: '❓➡️', description: 'Заменяет NULL указанным значением. Oracle.', example: 'SELECT NVL(commission_pct, 0) FROM employees;', type: 'Oracle', rarity: 'common', dbType: ['oracle'] },
    { id: 'ora_listagg', name: 'LISTAGG()', emoji: '🔗🔗', description: 'Агрегатная функция для конкатенации строк. Oracle.', example: 'SELECT LISTAGG(last_name, \', \') WITHIN GROUP (ORDER BY last_name) FROM employees;', type: 'Oracle', rarity: 'rare', dbType: ['oracle'] },
    { id: 'ora_connect_by_prior', name: 'CONNECT BY PRIOR', emoji: '🌳🔗', description: 'Для иерархических запросов. Oracle.', example: 'SELECT last_name, employee_id, manager_id FROM employees START WITH manager_id IS NULL CONNECT BY PRIOR employee_id = manager_id;', type: 'Oracle', rarity: 'legendary', dbType: ['oracle'] },
    { id: 'ora_flashback_query', name: 'Flashback Query', emoji: '⏪🕰️', description: 'Позволяет запрашивать данные на определенный момент времени в прошлом. Oracle.', example: 'SELECT * FROM employees AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL \'1\' HOUR);', type: 'Oracle', rarity: 'legendary', dbType: ['oracle'] },
    { id: 'sql_coalesce', name: 'COALESCE()', emoji: '❓➡️✅', description: 'Возвращает первое не-NULL выражение из списка.', example: 'SELECT COALESCE(NULL, NULL, \'Default\', \'Value\');', type: 'SQL', rarity: 'common'},
    { id: 'sql_nullif', name: 'NULLIF()', emoji: '❓=🚫', description: 'Возвращает NULL, если два выражения равны, иначе первое выражение.', example: 'SELECT NULLIF(col1, col2);', type: 'SQL', rarity: 'uncommon'},
    { id: 'sql_fetch_first_rows', name: 'FETCH FIRST N ROWS ONLY', emoji: '✂️🔝', description: 'Стандартный способ ограничения строк (SQL:2008).', example: 'SELECT * FROM products ORDER BY price DESC FETCH FIRST 10 ROWS ONLY;', type: 'SQL', rarity: 'uncommon' },
    { id: 'sql_current_date', name: 'CURRENT_DATE', emoji: '📅', description: 'Возвращает текущую дату.', example: 'SELECT CURRENT_DATE;', type: 'SQL', rarity: 'common' },
    { id: 'sql_current_timestamp', name: 'CURRENT_TIMESTAMP', emoji: '📅⏰', description: 'Возвращает текущую дату и время с часовым поясом.', example: 'SELECT CURRENT_TIMESTAMP;', type: 'SQL', rarity: 'common' },
    { id: 'sql_extract', name: 'EXTRACT()', emoji: '📅✂️', description: 'Извлекает часть из даты/времени (YEAR, MONTH, DAY и т.д.).', example: 'SELECT EXTRACT(YEAR FROM order_date) FROM orders;', type: 'SQL', rarity: 'uncommon' },
    { id: 'sql_cast', name: 'CAST()', emoji: '🔄⚖️', description: 'Преобразует значение одного типа данных в другой.', example: 'SELECT CAST(\'123\' AS INT);', type: 'SQL', rarity: 'common' },
    { id: 'sql_convert', name: 'CONVERT()', emoji: '🔄🎨', description: 'Преобразует значение и может форматировать (зависит от СУБД, особенно SQL Server).', example: 'SELECT CONVERT(VARCHAR, GETDATE(), 103); (SQL Server)', type: 'SQL', rarity: 'uncommon', dbType: ['sqlserver'] },
    { id: 'sql_rowid', name: 'ROWID / OID', emoji: '📍🆔', description: 'Псевдостолбец, представляющий уникальный идентификатор строки (зависит от СУБД).', example: 'SELECT ROWID, name FROM customers; (Oracle, PostgreSQL OID)', type: 'SQL', rarity: 'rare', dbType: ['oracle', 'postgresql'] },
    { id: 'sql_except', name: 'EXCEPT / MINUS', emoji: '➖📋', description: 'Возвращает строки из первого запроса, которых нет во втором. (EXCEPT в SQL Server/PostgreSQL, MINUS в Oracle)', example: 'SELECT id FROM table1 EXCEPT SELECT id FROM table2;', type: 'SQL', rarity: 'rare' },
    { id: 'sql_intersect', name: 'INTERSECT', emoji: '∩📋', description: 'Возвращает строки, которые есть в обоих запросах.', example: 'SELECT id FROM table1 INTERSECT SELECT id FROM table2;', type: 'SQL', rarity: 'rare' },
    { id: 'sql_greatest_least', name: 'GREATEST() / LEAST()', emoji: '↕️🔢', description: 'Возвращает наибольшее/наименьшее значение из списка аргументов.', example: 'SELECT GREATEST(10, 20, 5);', type: 'SQL', rarity: 'uncommon', dbType: ['postgresql', 'mysql', 'oracle'] },
    { id: 'sql_returning', name: 'RETURNING / OUTPUT', emoji: '↩️🎁', description: 'Возвращает значения из измененных строк (INSERT, UPDATE, DELETE). (RETURNING в PostgreSQL/Oracle, OUTPUT в SQL Server)', example: 'INSERT INTO users (name) VALUES (\'Test\') RETURNING id;', type: 'SQL', rarity: 'epic', dbType: ['postgresql', 'oracle', 'sqlserver'] },
    { id: 'sql_lateral_join', name: 'LATERAL JOIN', emoji: '🔗➡️', description: 'Позволяет подзапросу в FROM ссылаться на столбцы из предыдущих таблиц. (LATERAL в PostgreSQL, APPLY в SQL Server/Oracle)', example: 'SELECT u.name, p.product_name FROM users u, LATERAL (SELECT * FROM products WHERE user_id = u.id ORDER BY price DESC LIMIT 1) p;', type: 'SQL', rarity: 'epic', dbType: ['postgresql', 'sqlserver', 'oracle'] },
    { id: 'sql_values_constructor', name: 'VALUES Constructor', emoji: '🧱🔢', description: 'Создает временную таблицу из набора значений.', example: 'SELECT * FROM (VALUES (1, \'A\'), (2, \'B\')) AS t (id, val);', type: 'SQL', rarity: 'uncommon' },
    { id: 'sql_for_update', name: 'FOR UPDATE / OF', emoji: '🔒✏️', description: 'Блокирует выбранные строки для предотвращения их изменения другими транзакциями.', example: 'SELECT * FROM accounts WHERE id = 1 FOR UPDATE;', type: 'SQL', rarity: 'epic' },
    { id: 'sql_sequence', name: 'CREATE SEQUENCE', emoji: '🔢⚙️', description: 'Создает генератор последовательных чисел.', example: 'CREATE SEQUENCE user_id_seq START WITH 100;', type: 'SQL', rarity: 'rare', dbType: ['postgresql', 'oracle', 'sqlserver'] },
    { id: 'sql_window_ntile', name: 'NTILE()', emoji: '📊🔪', description: 'Разделяет строки в упорядоченном разделе на указанное количество групп (квартили, децили и т.д.).', example: 'SELECT name, salary, NTILE(4) OVER (ORDER BY salary DESC) AS quartile FROM employees;', type: 'SQL', rarity: 'rare'},
    { id: 'sql_window_first_value', name: 'FIRST_VALUE()', emoji: '🥇🪟', description: 'Возвращает значение первого выражения в упорядоченном разделе.', example: 'SELECT name, department, salary, FIRST_VALUE(name) OVER (PARTITION BY department ORDER BY salary DESC) AS highest_paid FROM employees;', type: 'SQL', rarity: 'rare'},
    { id: 'sql_window_last_value', name: 'LAST_VALUE()', emoji: '🥉🪟', description: 'Возвращает значение последнего выражения в упорядоченном разделе. (Примечание: требует правильного задания рамки окна).', example: 'SELECT name, department, salary, LAST_VALUE(name) OVER (PARTITION BY department ORDER BY salary DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS lowest_paid_overall_in_dept FROM employees;', type: 'SQL', rarity: 'rare'}, // Emoji изменено для уникальности
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
            { keyword: 'JOIN', joinTable: 'Customers', onCondition: 'Orders.CustomerID=Customers.CustomerID' }
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
