-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2024 at 03:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hr`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddOrUpdateEmployee` (IN `EMPLOYEE_ID` INT, IN `FIRST_NAME` VARCHAR(50), IN `LAST_NAME` VARCHAR(50), IN `EMAIL` VARCHAR(50), IN `PHONE_NUMBER` VARCHAR(15), IN `HIRE_DATE` DATE, IN `JOB_ID` VARCHAR(50), IN `SALARY` DECIMAL(10,2), IN `EMPLOYEE_PHOTO` VARCHAR(255), IN `COMMISSION_PCT` DECIMAL(3,2), IN `MANAGER_ID` INT, IN `DEPARTMENT_ID` INT)   BEGIN
    DECLARE old_name VARCHAR(255);
    DECLARE old_email VARCHAR(255);
    
    SELECT FIRST_NAME, EMAIL INTO old_name, old_email 
    FROM tbl_employees 
    WHERE EMPLOYEE_ID = EMPLOYEE_ID 
    LIMIT 1;
 
 INSERT INTO Tbl_Employees (EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUMBER, HIRE_DATE, JOB_ID, SALARY, EMPLOYEE_PHOTO, COMMISSION_PCT, MANAGER_ID, DEPARTMENT_ID)
  VALUES (EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUMBER, HIRE_DATE, JOB_ID, SALARY, EMPLOYEE_PHOTO, COMMISSION_PCT, MANAGER_ID, DEPARTMENT_ID)
  ON DUPLICATE KEY UPDATE FIRST_NAME = FIRST_NAME, LAST_NAME = LAST_NAME, EMAIL = EMAIL, PHONE_NUMBER = PHONE_NUMBER, HIRE_DATE = HIRE_DATE, JOB_ID = JOB_ID, SALARY = SALARY, EMPLOYEE_PHOTO = EMPLOYEE_PHOTO, COMMISSION_PCT = COMMISSION_PCT, MANAGER_ID = MANAGER_ID, DEPARTMENT_ID = DEPARTMENT_ID;
    
    IF old_name = FIRST_NAME THEN
        INSERT INTO tbl_employee_history (
            EmployeeId, 
            FieldName, 
            OldValue, 
            NewValue, 
            CreatedBy
        ) VALUES (
            EMPLOYEE_ID, 
            'name', 
            old_name, 
            FIRST_NAME, 
            'System'
        );
    END IF;
    
    IF old_email = EMAIL THEN
        INSERT INTO tbl_employee_history (
            EmployeeId, 
            FieldName, 
            OldValue, 
            NewValue, 
            CreatedBy
        ) VALUES (
            EMPLOYEE_ID, 
            'email', 
            old_email, 
            EMAIL, 
            'System'
        );
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteEmployee` (IN `employeeId` INT)   BEGIN
  UPDATE Tbl_Employees SET JOB_ID = NULL, DEPARTMENT_ID = NULL, MANAGER_ID = NULL WHERE EMPLOYEE_ID = employeeId;
  UPDATE Tbl_Departments SET MANAGER_ID = NULL WHERE MANAGER_ID = employeeId;
  DELETE FROM Tbl_Employees WHERE EMPLOYEE_ID = employeeId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllEmployees` (IN `p_offset` INT, IN `p_limit` INT)   BEGIN
  SELECT * FROM Tbl_Employees LIMIT p_limit OFFSET p_offset;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetEmployeeById` (IN `employeeId` INT)   BEGIN
    SELECT * FROM Tbl_Employees WHERE EMPLOYEE_ID = employeeId;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_countries`
--

CREATE TABLE `tbl_countries` (
  `COUNTRY_ID` varchar(50) NOT NULL,
  `COUNTRY_NAME` varchar(50) DEFAULT NULL,
  `REGION_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_countries`
--

INSERT INTO `tbl_countries` (`COUNTRY_ID`, `COUNTRY_NAME`, `REGION_ID`) VALUES
('AR', 'Argentina', 2),
('AU', 'Australia', 3),
('BE', 'Belgium', 1),
('BR', 'Brazil', 2),
('CA', 'Canada', 2),
('CH', 'Switzerland', 1),
('CN', 'China', 3),
('DE', 'Germany', 1),
('DK', 'Denmark', 1),
('EG', 'Egypt', 4),
('FR', 'France', 1),
('IL', 'Israel', 4),
('IN', 'India', 3),
('IT', 'Italy', 1),
('JP', 'Japan', 3),
('KW', 'Kuwait', 4),
('ML', 'Malaysia', 3),
('MX', 'Mexico', 2),
('NG', 'Nigeria', 4),
('NL', 'Netherlands', 1),
('SG', 'Singapore', 3),
('UK', 'United Kingdom', 1),
('US', 'United States of America', 2),
('ZM', 'Zambia', 4),
('ZW', 'Zimbabwe', 4);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_departments`
--

CREATE TABLE `tbl_departments` (
  `DEPARTMENT_ID` int(11) NOT NULL,
  `DEPARTMENT_NAME` varchar(50) DEFAULT NULL,
  `MANAGER_ID` int(11) DEFAULT NULL,
  `LOCATION_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_departments`
--

INSERT INTO `tbl_departments` (`DEPARTMENT_ID`, `DEPARTMENT_NAME`, `MANAGER_ID`, `LOCATION_ID`) VALUES
(10, 'Administration', 200, 1700),
(20, 'Marketing', 201, 1800),
(30, 'Purchasing', 114, 1700),
(40, 'Human Resources', 203, 2400),
(50, 'Shipping', 121, 1500),
(60, 'IT', 103, 1400),
(70, 'Public Relations', 204, 2700),
(80, 'Sales', 145, 2500),
(90, 'Executive', NULL, 1700),
(100, 'Finance', 108, 1700),
(110, 'Accounting', 205, 1700),
(120, 'Treasury', 0, 1700),
(130, 'Corporate Tax', 0, 1700),
(140, 'Control And Credit', 0, 1700),
(150, 'Shareholder Services', 0, 1700),
(160, 'Benefits', 0, 1700),
(170, 'Manufacturing', 0, 1700),
(180, 'Construction', 0, 1700),
(190, 'Contracting', 0, 1700),
(200, 'Operations', 0, 1700),
(210, 'IT Support', 0, 1700),
(220, 'NOC', 0, 1700),
(230, 'IT Helpdesk', 0, 1700),
(240, 'Government Sales', 0, 1700),
(250, 'Retail Sales', 0, 1700),
(260, 'Recruiting', 0, 1700),
(270, 'Payroll', 0, 1700);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_employees`
--

CREATE TABLE `tbl_employees` (
  `EMPLOYEE_ID` int(11) NOT NULL,
  `FIRST_NAME` varchar(50) DEFAULT NULL,
  `LAST_NAME` varchar(50) DEFAULT NULL,
  `EMAIL` varchar(50) DEFAULT NULL,
  `PHONE_NUMBER` varchar(15) DEFAULT NULL,
  `HIRE_DATE` date DEFAULT NULL,
  `JOB_ID` varchar(50) DEFAULT NULL,
  `SALARY` decimal(10,2) DEFAULT NULL,
  `EMPLOYEE_PHOTO` varchar(255) DEFAULT NULL,
  `COMMISSION_PCT` decimal(3,2) DEFAULT NULL,
  `MANAGER_ID` int(11) DEFAULT NULL,
  `DEPARTMENT_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_employees`
--

INSERT INTO `tbl_employees` (`EMPLOYEE_ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL`, `PHONE_NUMBER`, `HIRE_DATE`, `JOB_ID`, `SALARY`, `EMPLOYEE_PHOTO`, `COMMISSION_PCT`, `MANAGER_ID`, `DEPARTMENT_ID`) VALUES
(0, 'Diana', 'Lorentz', 'DLORENTZ', '590.423.5567', '2024-04-08', 'IT_PROG', 4200.00, '', 0.00, 103, 60),
(1, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', '2024-04-22', 'AD_VP', 50000.00, '/path/to/photo.jpg', 0.10, 106, 10),
(2, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', '2024-04-22', 'AD_VP', 50000.00, '/path/to/photo.jpg', 0.10, 106, 10),
(3, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', '2024-04-22', 'AD_VP', 50000.00, '/path/to/photo.jpg', 0.10, 106, 10),
(44, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', '2024-04-22', 'FI_MGR', 50000.00, '/path/to/photo.jpg', 0.10, 106, 10),
(54, 'Nanette', 'Cambrault', 'NCAMBRAU', '011.44.1344.987', '2006-12-09', 'SA_REP', 7500.00, NULL, 0.20, 145, 80),
(100, 'Steven', 'King', 'SKING', '515.123.4567', '2003-06-17', 'AD_PRES', 24000.00, NULL, 0.00, 0, 90),
(101, 'Neena', 'Kochhar', 'NKOCHHAR', '515.123.4568', '2005-09-21', NULL, 17000.00, '', 0.00, NULL, NULL),
(102, 'Lex', 'DeHaan', 'LDEHAAN', '515.123.4569', '2001-01-13', 'AD_VP', 17000.00, '', 0.00, NULL, 90),
(103, 'Alexander', 'Hunold', 'AHUNOLD', '590.423.4567', '2006-01-03', 'IT_PROG', 9000.00, '', 0.00, 102, 60),
(104, 'Bruce', 'Ernst', 'BERNST', '590.423.4568', '2007-05-21', 'IT_PROG', 6000.00, '', 0.00, 103, 60),
(105, 'David', 'Austin', 'DAUSTIN', '590.423.4569', '2005-06-25', 'IT_PROG', 4800.00, '', 0.00, 103, 60),
(106, 'Valli', 'Pataballa', 'VPATABAL', '590.423.4560', '0000-00-00', 'IT_PROG', 4800.00, '', 0.00, 103, 60),
(108, 'Nancy', 'Greenberg', 'NGREENBE', '515.124.4569', '2002-08-17', 'FI_MGR', 12008.00, '', 0.00, 101, 100),
(109, 'Daniel', 'Faviet', 'DFAVIET', '515.124.4169', '2002-08-16', 'FI_ACCOUNT', 9000.00, '', 0.00, 108, 100),
(110, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', '2005-09-28', 'FI_MGR', 50000.00, '/path/to/photo.jpg', 0.10, 106, 10),
(111, 'Ismael', 'Sciarra', 'ISCIARRA', '515.124.4369', '0000-00-00', 'FI_ACCOUNT', 7700.00, '', 0.00, 108, 100),
(112, 'Jose Manuel', 'Urman', 'JMURMAN', '515.124.4469', '2006-03-07', 'FI_ACCOUNT', 7800.00, '', 0.00, 108, 100),
(113, 'Luis', 'Popp', 'LPOPP', '515.124.4567', '2007-12-07', 'FI_ACCOUNT', 6900.00, '', 0.00, 108, 100),
(114, 'Den', 'Raphaely', 'DRAPHEAL', '515.127.4561', '0000-00-00', 'PU_MAN', 11000.00, '', 0.00, NULL, 30),
(115, 'Alexander', 'Khoo', 'AKHOO', '515.127.4562', '2003-05-18', 'PU_CLERK', 3100.00, '', 0.00, 114, 30),
(116, 'Shelli', 'Baida', 'SBAIDA', '515.127.4563', '2005-12-24', 'PU_CLERK', 2900.00, '', 0.00, 114, 30),
(117, 'Sigal', 'Tobias', 'STOBIAS', '515.127.4564', '0000-00-00', 'PU_CLERK', 2800.00, '', 0.00, 114, 30),
(118, 'Guy', 'Himuro', 'GHIMURO', '515.127.4565', '2006-11-15', 'PU_CLERK', 2600.00, '', 0.00, 114, 30),
(119, 'Karen', 'Colmenares', 'KCOLMENA', '515.127.4566', '2007-08-10', 'PU_CLERK', 2500.00, '', 0.00, 114, 30),
(120, 'Matthew', 'Weiss', 'MWEISS', '650.123.1234', '2004-07-18', 'ST_MAN', 8000.00, '', 0.00, NULL, 50),
(121, 'Adam', 'Fripp', 'AFRIPP', '650.123.2234', '2005-04-10', 'ST_MAN', 8200.00, '', 0.00, NULL, 50),
(122, 'Payam', 'Kaufling', 'PKAUFLIN', '650.123.3234', '2003-05-01', 'ST_MAN', 7900.00, '', 0.00, NULL, 50),
(123, 'Shanta', 'Vollman', 'SVOLLMAN', '650.123.4234', '2005-10-10', 'ST_MAN', 6500.00, '', 0.00, NULL, 50),
(124, 'Kevin', 'Mourgos', 'KMOURGOS', '650.123.5234', '2007-11-16', 'ST_MAN', 5800.00, '', 0.00, NULL, 50),
(125, 'Julia', 'Nayer', 'JNAYER', '650.124.1214', '2005-07-16', 'ST_CLERK', 3200.00, '', 0.00, 120, 50),
(126, 'Irene', 'Mikkilineni', 'IMIKKILI', '650.124.1224', '2006-09-28', 'ST_CLERK', 2700.00, '', 0.00, 120, 50),
(127, 'James', 'Landry', 'JLANDRY', '650.124.1334', '2007-01-15', 'ST_CLERK', 2400.00, '', 0.00, 120, 50),
(128, 'Steven', 'Markle', 'SMARKLE', '650.124.1434', '2008-03-08', 'ST_CLERK', 2200.00, '', 0.00, 120, 50),
(129, 'Laura', 'Bissot', 'LBISSOT', '650.124.5234', '2005-08-20', 'ST_CLERK', 3300.00, '', 0.00, 121, 50),
(130, 'Mozhe', 'Atkinson', 'MATKINSO', '650.124.6234', '2005-10-30', 'ST_CLERK', 2800.00, '', 0.00, 121, 50),
(131, 'James', 'Marlow', 'JAMRLOW', '650.124.7234', '2005-02-16', 'ST_CLERK', 2500.00, '', 0.00, 121, 50),
(132, 'TJ', 'Olson', 'TJOLSON', '650.124.8234', '2007-04-10', 'ST_CLERK', 2100.00, '', 0.00, 121, 50),
(133, 'Jason', 'Mallin', 'JMALLIN', '650.127.1934', '0000-00-00', 'ST_CLERK', 3300.00, '', 0.00, 122, 50),
(134, 'Michael', 'Rogers', 'MROGERS', '650.127.1834', '2006-08-26', 'ST_CLERK', 2900.00, '', 0.00, 122, 50),
(135, 'Ki', 'Gee', 'KGEE', '650.127.1734', '2007-12-12', 'ST_CLERK', 2400.00, '', 0.00, 122, 50),
(136, 'Hazel', 'Philtanker', 'HPHILTAN', '650.127.1634', '2008-02-06', 'ST_CLERK', 2200.00, '', 0.00, 122, 50),
(137, 'Renske', 'Ladwig', 'RLADWIG', '650.121.1234', '2003-07-14', 'ST_CLERK', 3600.00, '', 0.00, 123, 50),
(138, 'Stephen', 'Stiles', 'SSTILES', '650.121.2034', '2005-10-26', 'ST_CLERK', 3200.00, '', 0.00, 123, 50),
(139, 'John', 'Seo', 'JSEO', '650.121.2019', '2006-02-12', 'ST_CLERK', 2700.00, '', 0.00, 123, 50),
(140, 'Joshua', 'Patel', 'JPATEL', '650.121.1834', '2006-04-06', 'ST_CLERK', 2500.00, '', 0.00, 123, 50),
(141, 'Trenna', 'Rajs', 'TRAJS', '650.121.8009', '2003-10-17', 'ST_CLERK', 3500.00, '', 0.00, 124, 50),
(142, 'Curtis', 'Davies', 'CDAVIES', '650.121.2994', '2005-01-29', 'ST_CLERK', 3100.00, '', 0.00, 124, 50),
(143, 'Randall', 'Matos', 'RMATOS', '650.121.2874', '2006-03-15', 'ST_CLERK', 2600.00, '', 0.00, 124, 50),
(144, 'Peter', 'Vargas', 'PVARGAS', '650.121.2004', '2006-07-09', 'ST_CLERK', 2500.00, '', 0.00, 124, 50),
(145, 'John', 'Russell', 'JRUSSEL', '011.44.1344.429', '2004-10-01', 'SA_MAN', 14000.00, '', 0.40, NULL, 80),
(146, 'Karen', 'Partners', 'KPARTNER', '011.44.1344.467', '0000-00-00', 'SA_MAN', 13500.00, '', 0.30, NULL, 80),
(147, 'Alberto', 'Errazuriz', 'AERRAZUR', '011.44.1344.429', '2005-03-10', 'SA_MAN', 12000.00, '', 0.30, NULL, 80),
(148, 'Gerald', 'Cambrault', 'GCAMBRAU', '011.44.1344.619', '2007-10-15', 'SA_MAN', 11000.00, '', 0.30, NULL, 80),
(149, 'Eleni', 'Zlotkey', 'EZLOTKEY', '011.44.1344.429', '2008-01-29', 'SA_MAN', 10500.00, '', 0.20, NULL, 80),
(150, 'Peter', 'Tucker', 'PTUCKER', '011.44.1344.129', '2005-01-30', 'SA_REP', 10000.00, '', 0.30, 145, 80),
(151, 'David', 'Bernstein', 'DBERNSTE', '011.44.1344.345', '2005-03-24', 'SA_REP', 9500.00, '', 0.25, 145, 80),
(152, 'Peter', 'Hall', 'PHALL', '011.44.1344.478', '2005-08-20', 'SA_REP', 9000.00, '', 0.25, 145, 80),
(153, 'Christopher', 'Olsen', 'COLSEN', '011.44.1344.498', '2006-03-30', 'SA_REP', 8000.00, '', 0.20, 145, 80),
(154, 'Nanette', 'Cambrault', 'NCAMBRAU', '011.44.1344.987', '2006-12-09', 'SA_REP', 7500.00, '', 0.20, 145, 80),
(155, 'Oliver', 'Tuvault', 'OTUVAULT', '011.44.1344.486', '2007-11-23', 'SA_REP', 7000.00, '', 0.15, 145, 80),
(156, 'Janette', 'King', 'JKING', '011.44.1345.429', '2004-01-30', 'SA_REP', 10000.00, '', 0.35, 146, 80),
(157, 'Patrick', 'Sully', 'PSULLY', '011.44.1345.929', '2004-03-04', 'SA_REP', 9500.00, '', 0.35, 146, 80),
(158, 'Allan', 'McEwen', 'AMCEWEN', '011.44.1345.829', '2004-08-01', 'SA_REP', 9000.00, '', 0.35, 146, 80),
(159, 'Lindsey', 'Smith', 'LSMITH', '011.44.1345.729', '2005-03-10', 'SA_REP', 8000.00, '', 0.30, 146, 80),
(160, 'Louise', 'Doran', 'LDORAN', '011.44.1345.629', '2005-12-15', 'SA_REP', 7500.00, '', 0.30, 146, 80),
(161, 'Sarath', 'Sewall', 'SSEWALL', '011.44.1345.529', '2006-11-03', 'SA_REP', 7000.00, '', 0.25, 146, 80),
(162, 'Clara', 'Vishney', 'CVISHNEY', '011.44.1346.129', '2005-11-11', 'SA_REP', 10500.00, '', 0.25, 147, 80),
(163, 'Danielle', 'Greene', 'DGREENE', '011.44.1346.229', '2007-03-19', 'SA_REP', 9500.00, '', 0.15, 147, 80),
(164, 'Mattea', 'Marvins', 'MMARVINS', '011.44.1346.329', '2008-01-24', 'SA_REP', 7200.00, '', 0.10, 147, 80),
(165, 'David', 'Lee', 'DLEE', '011.44.1346.529', '2008-02-23', 'SA_REP', 6800.00, '', 0.10, 147, 80),
(166, 'Sundar', 'Ande', 'SANDE', '011.44.1346.629', '2008-03-24', 'SA_REP', 6400.00, '', 0.10, 147, 80),
(167, 'Amit', 'Banda', 'ABANDA', '011.44.1346.729', '2008-04-21', 'SA_REP', 6200.00, '', 0.10, 147, 80),
(168, 'Lisa', 'Ozer', 'LOZER', '011.44.1343.929', '2005-03-11', 'SA_REP', 11500.00, '', 0.25, 148, 80),
(169, 'Harrison', 'Bloom', 'HBLOOM', '011.44.1343.829', '2006-03-23', 'SA_REP', 10000.00, '', 0.20, 148, 80),
(170, 'Tayler', 'Fox', 'TFOX', '011.44.1343.729', '2006-01-24', 'SA_REP', 9600.00, '', 0.20, 148, 80),
(171, 'William', 'Smith', 'WSMITH', '011.44.1343.629', '2007-02-23', 'SA_REP', 7400.00, '', 0.15, 148, 80),
(172, 'Elizabeth', 'Bates', 'EBATES', '011.44.1343.529', '2007-03-24', 'SA_REP', 7300.00, '', 0.15, 148, 80),
(173, 'Sundita', 'Kumar', 'SKUMAR', '011.44.1343.329', '2008-04-21', 'SA_REP', 6100.00, '', 0.10, 148, 80),
(174, 'Ellen', 'Abel', 'EABEL', '011.44.1644.429', '2004-05-11', 'SA_REP', 11000.00, '', 0.30, 149, 80),
(175, 'Alyssa', 'Hutton', 'AHUTTON', '011.44.1644.429', '2005-03-19', 'SA_REP', 8800.00, '', 0.25, 149, 80),
(176, 'Jonathon', 'Taylor', 'JTAYLOR', '011.44.1644.429', '2006-03-24', 'SA_REP', 8600.00, '', 0.20, 149, 80),
(177, 'Jack', 'Livingston', 'JLIVINGS', '011.44.1644.429', '2006-04-23', 'SA_REP', 8400.00, '', 0.20, 149, 80),
(178, 'Kimberely', 'Grant', 'KGRANT', '011.44.1644.429', '2007-05-24', 'SA_REP', 7000.00, '', 0.15, 149, 80),
(179, 'Charles', 'Johnson', 'CJOHNSON', '011.44.1644.429', '2008-01-04', 'SA_REP', 6200.00, '', 0.10, 149, 80),
(180, 'Winston', 'Taylor', 'WTAYLOR', '650.507.9876', '2006-01-24', 'SH_CLERK', 3200.00, '', 0.00, 120, 50),
(181, 'Jean', 'Fleaur', 'JFLEAUR', '650.507.9877', '2006-02-23', 'SH_CLERK', 3100.00, '', 0.00, 120, 50),
(182, 'Martha', 'Sullivan', 'MSULLIVA', '650.507.9878', '2007-06-21', 'SH_CLERK', 2500.00, '', 0.00, 120, 50),
(183, 'Girard', 'Geoni', 'GGEONI', '650.507.9879', '2008-02-03', 'SH_CLERK', 2800.00, '', 0.00, 120, 50),
(184, 'Nandita', 'Sarchand', 'NSARCHAN', '650.509.1876', '2004-01-27', 'SH_CLERK', 4200.00, '', 0.00, 121, 50),
(185, 'Alexis', 'Bull', 'ABULL', '650.509.2876', '2005-02-20', 'SH_CLERK', 4100.00, '', 0.00, 121, 50),
(186, 'Julia', 'Dellinger', 'JDELLING', '650.509.3876', '2006-06-24', 'SH_CLERK', 3400.00, '', 0.00, 121, 50),
(187, 'Anthony', 'Cabrio', 'ACABRIO', '650.509.4876', '2006-04-22', 'SH_CLERK', 3000.00, '', 0.00, 121, 50),
(188, 'Kelly', 'Chung', 'KCHUNG', '650.505.1876', '2007-07-21', 'SH_CLERK', 3800.00, '', 0.00, 122, 50),
(189, 'Jennifer', 'Dilly', 'JDILLY', '650.505.2876', '2008-03-12', 'SH_CLERK', 3600.00, '', 0.00, 122, 50),
(190, 'Timothy', 'Gates', 'TGATES', '650.505.3876', '2004-05-24', 'SH_CLERK', 2900.00, '', 0.00, 122, 50),
(191, 'Randall', 'Perkins', 'RPERKINS', '650.505.4876', '2005-04-23', 'SH_CLERK', 2500.00, '', 0.00, 122, 50),
(192, 'Sarah', 'Bell', 'SBELL', '650.501.1876', '2006-07-21', 'SH_CLERK', 4000.00, '', 0.00, 123, 50),
(193, 'Britney', 'Everett', 'BEVERETT', '650.501.2876', '2006-12-23', 'SH_CLERK', 3900.00, '', 0.00, 123, 50),
(194, 'Samuel', 'McCain', 'SMCCAIN', '650.501.3876', '2008-02-28', 'SH_CLERK', 3200.00, '', 0.00, 123, 50),
(195, 'Vance', 'Jones', 'VJONES', '650.501.4876', '2007-03-25', 'SH_CLERK', 2800.00, '', 0.00, 123, 50),
(196, 'Alana', 'Walsh', 'AWALSH', '650.507.9811', '2007-08-24', 'SH_CLERK', 3100.00, '', 0.00, 124, 50),
(197, 'Kevin', 'Feeney', 'KFEENEY', '650.507.9822', '2008-01-02', 'SH_CLERK', 3000.00, '', 0.00, 124, 50),
(198, 'Donald', 'OConnell', 'DOCONNEL', '650.507.9833', '2005-02-28', 'SH_CLERK', 2600.00, '', 0.00, 124, 50),
(199, 'Douglas', 'Grant', 'DGRANT', '650.507.9844', '2006-05-27', 'SH_CLERK', 2600.00, '', 0.00, 124, 50),
(200, 'Jennifer', 'Whalen', 'JWHALEN', '515.123.4444', '2007-09-23', 'AD_ASST', 4400.00, '', 0.00, 101, 10),
(201, 'Michael', 'Hartstein', 'MHARTSTE', '515.123.5555', '2008-04-14', 'MK_MAN', 13000.00, '', 0.00, NULL, 20),
(202, 'Pat', 'Fay', 'PFAY', '603.123.6666', '2005-06-25', 'MK_REP', 6000.00, '', 0.00, 201, 20),
(203, 'Susan', 'Mavris', 'SMAVRIS', '515.123.7777', '2006-02-24', 'HR_REP', 6500.00, '', 0.00, 101, 40),
(204, 'Hermann', 'Baer', 'HBAER', '515.123.8888', '2006-04-23', 'PR_REP', 10000.00, '', 0.00, 101, 70),
(205, 'Shelley', 'Higgins', 'SHIGGINS', '515.123.8080', '2007-05-24', 'AC_MGR', 12008.00, '', 0.00, 101, 110),
(206, 'William', 'Gietz', 'WGIETZ', '515.123.8181', '2007-06-23', 'AC_ACCOUNT', 8300.00, '', 0.00, 205, 110);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_employee_history`
--

CREATE TABLE `tbl_employee_history` (
  `Id` int(11) NOT NULL,
  `EmployeeId` int(11) DEFAULT NULL,
  `FieldName` varchar(255) DEFAULT NULL,
  `OldValue` varchar(255) DEFAULT NULL,
  `NewValue` varchar(255) DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_employee_history`
--

INSERT INTO `tbl_employee_history` (`Id`, `EmployeeId`, `FieldName`, `OldValue`, `NewValue`, `CreatedBy`, `CreatedAt`) VALUES
(1, 110, 'name', 'John', 'John', 'System', '2024-04-22 11:17:56'),
(2, 110, 'email', 'john.doe@example.com', 'john.doe@example.com', 'System', '2024-04-22 11:17:56'),
(3, 110, 'name', 'John', 'John', 'System', '2024-04-22 11:18:03'),
(4, 110, 'email', 'john.doe@example.com', 'john.doe@example.com', 'System', '2024-04-22 11:18:03'),
(5, 100, 'name', 'Steven', 'Steven', 'System', '2024-04-22 12:02:31'),
(6, 100, 'email', 'SKING', 'SKING', 'System', '2024-04-22 12:02:31'),
(7, 100, 'name', 'Steven', 'Steven', 'System', '2024-04-22 12:03:00'),
(8, 100, 'email', 'SKING', 'SKING', 'System', '2024-04-22 12:03:00'),
(9, 100, 'name', 'Steven', 'Steven', 'System', '2024-04-22 12:03:30'),
(10, 100, 'email', 'SKING', 'SKING', 'System', '2024-04-22 12:03:30'),
(11, 100, 'name', 'Steven', 'Steven', 'System', '2024-04-22 12:03:42'),
(12, 100, 'email', 'SKING', 'SKING', 'System', '2024-04-22 12:03:42');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_jobhistory`
--

CREATE TABLE `tbl_jobhistory` (
  `EMPLOYEE_ID` int(11) NOT NULL,
  `START_DATE` date DEFAULT NULL,
  `END_DATE` date DEFAULT NULL,
  `JOB_ID` varchar(50) DEFAULT NULL,
  `DEPARTMENT_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_jobhistory`
--

INSERT INTO `tbl_jobhistory` (`EMPLOYEE_ID`, `START_DATE`, `END_DATE`, `JOB_ID`, `DEPARTMENT_ID`) VALUES
(101, '0000-00-00', '0000-00-00', 'AC_ACCOUNT', 110),
(102, '0000-00-00', '0000-00-00', 'IT_PROG', 60),
(114, '0000-00-00', '0000-00-00', 'ST_CLERK', 50),
(122, '0000-00-00', '0000-00-00', 'ST_CLERK', 50),
(176, '0000-00-00', '0000-00-00', 'SA_REP', 80),
(200, '0000-00-00', '0000-00-00', 'AD_ASST', 90),
(201, '0000-00-00', '0000-00-00', 'MK_REP', 20);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_jobs`
--

CREATE TABLE `tbl_jobs` (
  `job_id` varchar(255) NOT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `min_salary` decimal(10,2) DEFAULT NULL,
  `max_salary` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_jobs`
--

INSERT INTO `tbl_jobs` (`job_id`, `job_title`, `min_salary`, `max_salary`) VALUES
('AC_ACCOUNT', 'Public Accountant', 4200.00, 9000.00),
('AC_MGR', 'Accounting Manager', 8200.00, 16000.00),
('AD_ASST', 'Administration Assistant', 3000.00, 6000.00),
('AD_PRES', 'President', 20080.00, 40000.00),
('AD_VP', 'Administration Vice President', 15000.00, 30000.00),
('FI_ACCOUNT', 'Accountant', 4200.00, 9000.00),
('FI_MGR', 'Finance Manager', 8200.00, 16000.00),
('HR_REP', 'Human Resources Representative', 4000.00, 9000.00),
('IT_PROG', 'Programmer', 4000.00, 10000.00),
('MK_MAN', 'Marketing Manager', 9000.00, 15000.00),
('MK_REP', 'Marketing Representative', 4000.00, 9000.00),
('PR_REP', 'Public Relations Representative', 4500.00, 10500.00),
('PU_CLERK', 'Purchasing Clerk', 2500.00, 5500.00),
('PU_MAN', 'Purchasing Manager', 8000.00, 15000.00),
('SA_MAN', 'Sales Manager', 10000.00, 20080.00),
('SA_REP', 'Sales Representative', 6000.00, 12008.00),
('SH_CLERK', 'Shipping Clerk', 2500.00, 5500.00),
('ST_CLERK', 'Stock Clerk', 2008.00, 5000.00),
('ST_MAN', 'Stock Manager', 5500.00, 8500.00);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_job_grade`
--

CREATE TABLE `tbl_job_grade` (
  `GRADE_LEVEL` char(1) NOT NULL,
  `LOWEST_SAL` decimal(10,2) DEFAULT NULL,
  `HIGHEST_SAL` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_job_grade`
--

INSERT INTO `tbl_job_grade` (`GRADE_LEVEL`, `LOWEST_SAL`, `HIGHEST_SAL`) VALUES
('A', 1000.00, 2999.00),
('B', 3000.00, 5999.00),
('C', 6000.00, 9999.00),
('D', 10000.00, 14999.00),
('E', 15000.00, 24999.00),
('F', 25000.00, 40000.00);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_locations`
--

CREATE TABLE `tbl_locations` (
  `LOCATION_ID` int(11) NOT NULL,
  `STREET_ADDRESS` varchar(255) DEFAULT NULL,
  `POSTAL_CODE` varchar(10) DEFAULT NULL,
  `CITY` varchar(50) DEFAULT NULL,
  `STATE_PROVINCE` varchar(50) DEFAULT NULL,
  `COUNTRY_ID` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_locations`
--

INSERT INTO `tbl_locations` (`LOCATION_ID`, `STREET_ADDRESS`, `POSTAL_CODE`, `CITY`, `STATE_PROVINCE`, `COUNTRY_ID`) VALUES
(1000, '1297 Via Cola di Rie', '989', 'Roma', '', 'IT'),
(1100, '93091 Calle della Testa', '10934', 'Venice', '', 'IT'),
(1200, '2017 Shinjuku-ku', '1689', 'Tokyo', 'Tokyo Prefecture', 'JP'),
(1300, '9450 Kamiya-cho', '6823', 'Hiroshima', '', 'JP'),
(1400, '2014 Jabberwocky Rd', '26192', 'Southlake', 'Texas', 'US'),
(1500, '2011 Interiors Blvd', '99236', 'South San Francisco', 'California', 'US'),
(1600, '2007 Zagora St', '50090', 'South Brunswick', 'New Jersey', 'US'),
(1700, '2004 Charade Rd', '98199', 'Seattle', 'Washington', 'US'),
(1800, '147 Spadina Ave', 'M5V 2L7', 'Toronto', 'Ontario', 'CA'),
(1900, '6092 Boxwood St', 'YSW 9T2', 'Whitehorse', 'Yukon', 'CA'),
(2000, '40-5-12 Laogianggen', '190518', 'Beijing', '', 'CN'),
(2100, '1298 Vileparle (E)', '490231', 'Bombay', 'Maharashtra', 'IN'),
(2200, '12-98 Victoria Street', '2901', 'Sydney', 'New South Wales', 'AU'),
(2300, '198 Clementi North', '540198', 'Singapore', '', 'SG'),
(2400, '8204 Arthur St', '', 'London', '', 'UK'),
(2500, 'Magdalen Centre, The Oxford Science Park', 'OX9 9ZB', 'Oxford', 'Oxford', 'UK'),
(2600, '9702 Chester Road', '9629850293', 'Stretford', 'Manchester', 'UK'),
(2700, 'Schwanthalerstr. 7031', '80925', 'Munich', 'Bavaria', 'DE'),
(2800, 'Rua Frei Caneca 1360', '01307-002', 'Sao Paulo', 'Sao Paulo', 'BR'),
(2900, '20 Rue des Corps-Saints', '1730', 'Geneva', 'Geneve', 'CH'),
(3000, 'Murtenstrasse 921', '3095', 'Bern', 'BE', 'CH'),
(3100, 'Pieter Breughelstraat 837', '3029SK', 'Utrecht', 'Utrecht', 'NL'),
(3200, 'Mariano Escobedo 9991', '11932', 'Mexico City', 'Distrito Federal', 'MX');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_region`
--

CREATE TABLE `tbl_region` (
  `REGION_ID` int(11) NOT NULL,
  `REGION_NAME` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_region`
--

INSERT INTO `tbl_region` (`REGION_ID`, `REGION_NAME`) VALUES
(1, 'Europe'),
(2, 'South America'),
(3, 'Asia'),
(4, 'Africa');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_countries`
--
ALTER TABLE `tbl_countries`
  ADD PRIMARY KEY (`COUNTRY_ID`),
  ADD KEY `REGION_ID` (`REGION_ID`);

--
-- Indexes for table `tbl_departments`
--
ALTER TABLE `tbl_departments`
  ADD PRIMARY KEY (`DEPARTMENT_ID`),
  ADD KEY `FK_Manager` (`MANAGER_ID`),
  ADD KEY `FK_Location` (`LOCATION_ID`);

--
-- Indexes for table `tbl_employees`
--
ALTER TABLE `tbl_employees`
  ADD PRIMARY KEY (`EMPLOYEE_ID`),
  ADD KEY `FK_JobID` (`JOB_ID`),
  ADD KEY `FK_DepartmentID` (`DEPARTMENT_ID`),
  ADD KEY `FK_ManagerID` (`MANAGER_ID`);

--
-- Indexes for table `tbl_employee_history`
--
ALTER TABLE `tbl_employee_history`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `tbl_jobhistory`
--
ALTER TABLE `tbl_jobhistory`
  ADD PRIMARY KEY (`EMPLOYEE_ID`),
  ADD KEY `FK_JobID_JH` (`JOB_ID`),
  ADD KEY `FK_DepartmentID_JobHistory` (`DEPARTMENT_ID`);

--
-- Indexes for table `tbl_jobs`
--
ALTER TABLE `tbl_jobs`
  ADD PRIMARY KEY (`job_id`);

--
-- Indexes for table `tbl_job_grade`
--
ALTER TABLE `tbl_job_grade`
  ADD PRIMARY KEY (`GRADE_LEVEL`);

--
-- Indexes for table `tbl_locations`
--
ALTER TABLE `tbl_locations`
  ADD PRIMARY KEY (`LOCATION_ID`),
  ADD KEY `tbl_locations_ibfk_1` (`COUNTRY_ID`);

--
-- Indexes for table `tbl_region`
--
ALTER TABLE `tbl_region`
  ADD PRIMARY KEY (`REGION_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_employee_history`
--
ALTER TABLE `tbl_employee_history`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_countries`
--
ALTER TABLE `tbl_countries`
  ADD CONSTRAINT `tbl_countries_ibfk_1` FOREIGN KEY (`REGION_ID`) REFERENCES `tbl_region` (`REGION_ID`);

--
-- Constraints for table `tbl_departments`
--
ALTER TABLE `tbl_departments`
  ADD CONSTRAINT `FK_Location` FOREIGN KEY (`LOCATION_ID`) REFERENCES `tbl_locations` (`LOCATION_ID`),
  ADD CONSTRAINT `FK_Manager` FOREIGN KEY (`MANAGER_ID`) REFERENCES `tbl_employees` (`EMPLOYEE_ID`);

--
-- Constraints for table `tbl_employees`
--
ALTER TABLE `tbl_employees`
  ADD CONSTRAINT `FK_DepartmentID` FOREIGN KEY (`DEPARTMENT_ID`) REFERENCES `tbl_departments` (`DEPARTMENT_ID`),
  ADD CONSTRAINT `FK_JobID` FOREIGN KEY (`JOB_ID`) REFERENCES `tbl_jobs` (`job_id`),
  ADD CONSTRAINT `FK_ManagerID` FOREIGN KEY (`MANAGER_ID`) REFERENCES `tbl_employees` (`EMPLOYEE_ID`);

--
-- Constraints for table `tbl_jobhistory`
--
ALTER TABLE `tbl_jobhistory`
  ADD CONSTRAINT `FK_DepartmentID_JobHistory` FOREIGN KEY (`DEPARTMENT_ID`) REFERENCES `tbl_departments` (`DEPARTMENT_ID`),
  ADD CONSTRAINT `FK_EmployeeID` FOREIGN KEY (`EMPLOYEE_ID`) REFERENCES `tbl_employees` (`EMPLOYEE_ID`),
  ADD CONSTRAINT `FK_JobID_JH` FOREIGN KEY (`JOB_ID`) REFERENCES `tbl_jobs` (`job_id`);

--
-- Constraints for table `tbl_locations`
--
ALTER TABLE `tbl_locations`
  ADD CONSTRAINT `tbl_locations_ibfk_1` FOREIGN KEY (`COUNTRY_ID`) REFERENCES `tbl_countries` (`COUNTRY_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
