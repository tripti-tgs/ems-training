-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 28, 2024 at 11:48 AM
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
-- Database: `ems`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteData` (IN `tableName` VARCHAR(255), IN `columnName` VARCHAR(255), IN `columnValue` VARCHAR(255))   BEGIN
  DECLARE value_found INT DEFAULT 0;
  DECLARE foreign_key_error BOOLEAN DEFAULT FALSE;
SET @columnValue=columnValue;
  -- Check if the value exists in the specified table
  SET @sql = CONCAT('SELECT id INTO @value_found FROM ', tableName, ' WHERE ', columnName, ' = ? LIMIT 1');
  PREPARE stmt FROM @sql;
  EXECUTE stmt USING @columnValue;
  DEALLOCATE PREPARE stmt;

  IF @value_found IS NOT NULL THEN
    BEGIN
      DECLARE CONTINUE HANDLER FOR 1451 BEGIN
        SET foreign_key_error = TRUE;
      END;

      SET @sql = CONCAT('DELETE FROM ', tableName, ' WHERE id = ?');
      PREPARE stmt FROM @sql;
      EXECUTE stmt USING @value_found;
      IF (foreign_key_error) THEN
        SELECT 'error' AS result, 'Cannot delete row because it is referenced by another table' AS message;
      ELSE
        IF (ROW_COUNT() = -1) THEN
          SELECT 'error' AS result, 'Value does not exist in the table' AS message;
        ELSE
          SELECT 'success' AS result;
        END IF;
      END IF;
      DEALLOCATE PREPARE stmt;
    END;
  ELSE
    SELECT 'error' AS result, 'No rows were deleted' AS message;
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteDepartment` (IN `deptId` INT)   BEGIN
  DECLARE error_message VARCHAR(255);
  DECLARE exit_handler BOOLEAN DEFAULT FALSE;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    SET exit_handler = TRUE;
    GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;
  END;

  IF EXISTS (SELECT * FROM employee WHERE dept_id = deptId) THEN
    SET error_message = 'Department is used in employees table';
    SELECT 'error' AS result, error_message AS message;
  ELSE
    UPDATE department SET isDeleted = 1, deleted_by = deptId, deleted_at = NOW() WHERE id = deptId;

    IF exit_handler THEN
      SELECT 'error' AS result, error_message AS message;
    ELSE
      SELECT 'success' AS result;
    END IF;
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteMultipleData` (IN `deleteDataArray` JSON)   BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE array_length INT DEFAULT JSON_LENGTH(deleteDataArray);
  DECLARE value_found INT DEFAULT 0;
  DECLARE foreign_key_error BOOLEAN DEFAULT FALSE;
  DECLARE current_table VARCHAR(255); 
  DECLARE continue_loop BOOLEAN DEFAULT TRUE;

  WHILE i < array_length AND continue_loop DO
    BEGIN
      DECLARE tableName VARCHAR(255);
      DECLARE columnName VARCHAR(255);
      DECLARE columnValue VARCHAR(255);
      SET current_table = '';
      
      SET tableName = JSON_UNQUOTE(JSON_EXTRACT(deleteDataArray, CONCAT('$[', i, '].tableName')));
      SET columnName = JSON_UNQUOTE(JSON_EXTRACT(deleteDataArray, CONCAT('$[', i, '].columnName')));
      SET columnValue = JSON_UNQUOTE(JSON_EXTRACT(deleteDataArray, CONCAT('$[', i, '].columnValue')));
      
      SET @columnValue=columnValue;
      
      -- Check if the value exists in the specified table
      SET @sql = CONCAT('SELECT id INTO @value_found FROM ', tableName, ' WHERE ', columnName, ' = ? LIMIT 1');
      PREPARE stmt FROM @sql;
      EXECUTE stmt USING @columnValue;
      DEALLOCATE PREPARE stmt;

      IF @value_found IS NOT NULL THEN
        BEGIN
          DECLARE CONTINUE HANDLER FOR 1451 BEGIN
            SET foreign_key_error = TRUE;
          END;

          SET @sql = CONCAT('DELETE FROM ', tableName, ' WHERE id = ?');
          PREPARE stmt FROM @sql;
          EXECUTE stmt USING @value_found;
          SET current_table = tableName;
          
          IF (foreign_key_error) THEN
            SELECT 'error' AS result, CONCAT('Cannot delete row in ', current_table, ' because it is referenced by another table') AS message;
            SET continue_loop = FALSE;
          ELSE
            IF (ROW_COUNT() = -1) THEN
              SELECT 'error' AS result, CONCAT('Value ', columnValue, ' does not exist in the table ', tableName) AS message;
            ELSE
              SELECT 'success' AS result;
            END IF;
          END IF;
          DEALLOCATE PREPARE stmt;
        END;
      ELSE
        SELECT 'error' AS result, CONCAT('No rows were deleted for ', tableName, " ,column Name: ",columnName," ,column Value: ",columnValue) AS message;
      END IF;

      SET i = i + 1;
    END;
  END WHILE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `isDeleted` tinyint(4) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`id`, `name`, `isDeleted`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(1, 'Tech', 1, NULL, NULL, '2024-04-16 09:55:42', 5, NULL, 7),
(2, 'HR', 0, '2024-04-16 09:16:41', NULL, NULL, 5, NULL, NULL),
(3, 'DMStecg-tsww', 1, '2024-04-16 09:39:22', '2024-04-17 07:32:21', '2024-04-17 07:32:37', 7, 9, 9),
(9, 'MK', 0, '2024-04-16 13:18:17', NULL, NULL, 7, NULL, NULL),
(10, 'DMStecg-ts', 1, '2024-04-17 06:20:37', '2024-04-17 06:22:34', '2024-04-17 06:23:02', 9, 9, 9),
(13, 'DMS-ts', 0, '2024-04-17 07:50:38', NULL, NULL, 9, NULL, NULL),
(16, 'HrR', 0, '2024-04-17 07:59:45', NULL, NULL, 9, NULL, NULL),
(17, 'DMS-ts', 0, '2024-04-17 08:01:47', NULL, NULL, 9, NULL, NULL),
(18, 'DMS-ts', 0, '2024-04-17 09:03:57', NULL, NULL, 9, NULL, NULL),
(19, 'DMS-ts', 0, '2024-04-17 09:04:15', NULL, NULL, 9, NULL, NULL),
(20, 'DMS-ts', 0, '2024-04-17 09:05:07', NULL, NULL, 9, NULL, NULL),
(21, 'HrRy', 0, '2024-04-17 09:06:33', NULL, NULL, 9, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` int(11) DEFAULT NULL,
  `gender` tinyint(4) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `isDeleted` tinyint(4) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `name`, `email`, `phone`, `gender`, `dob`, `dept_id`, `isDeleted`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(3, 'John Doe123', 'johndoe@example.com', 1234567890, 1, '1990-01-01', 1, 0, NULL, '2024-04-16 12:09:11', NULL, 7, 7, NULL),
(4, 'John Doe', 'johndoe@example.com', 1234567890, 1, '1990-01-01', 2, 0, '2024-04-16 10:38:15', NULL, NULL, 7, NULL, NULL),
(5, 'tripti Doe123', 'johndoe@example.com', 1234567890, 1, '1990-01-01', 1, 1, '2024-04-16 12:10:20', NULL, '2024-04-16 12:11:14', 7, NULL, 7),
(9, 'DMS', 'hellddfcdffghgcdhgjgo@gmail.com', 1246759756, 0, '2022-10-10', 9, 0, '2024-04-16 13:18:17', NULL, NULL, 7, NULL, NULL),
(13, 'DMS-ts', 'tr125673f3@gmail.com', 1246759756, 0, '2022-10-10', 3, 0, '2024-04-17 07:40:26', NULL, NULL, 9, NULL, NULL),
(14, 'HrR', 'tr1256w73f3@gmail.com', 1246759756, 0, '2022-10-10', 16, 0, '2024-04-17 07:59:45', NULL, NULL, 9, NULL, NULL),
(16, 'DMS-ts', 'tr125r6iw73f3@gmail.com', 1246759756, 0, '2022-10-10', 18, 0, '2024-04-17 09:03:57', NULL, NULL, 9, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `salary`
--

CREATE TABLE `salary` (
  `id` int(11) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `isDeleted` tinyint(4) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salary`
--

INSERT INTO `salary` (`id`, `emp_id`, `salary`, `date`, `isDeleted`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES
(2, 3, 30000.00, '1990-01-01', 0, '2024-04-16 12:03:45', NULL, NULL, 7, NULL, NULL),
(3, 3, 45000.00, '1990-01-01', 1, '2024-04-16 12:04:42', NULL, NULL, 7, NULL, NULL),
(4, 4, 95000.00, '1992-01-01', 1, '2024-04-16 12:13:27', '2024-04-16 12:15:57', '2024-04-16 12:16:12', 7, 7, 7),
(7, 5, 55000.00, '2022-06-12', 0, '2024-04-17 13:09:49', NULL, NULL, 13, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(5, 'tripti', 'tripti@gmail.com', '$2b$10$21IhmpTqMJu9URy5fUieYei2TUHo.z2C5ULeNI7BPPhs8Q3Wj5Mau'),
(6, 'tripti12', 'tri1pti@gmail.com', '$2b$10$PzCReEm7V1tPKjD4jOjRROEpqce0i7ZGR3q1lf1i/Ozg2GSjySPfe'),
(7, 'tripti14562', 'tri1pti678@gmail.com', '$2b$10$z2L8bAJcOLwrmhC2Qwy34.ZARgURDv4ctKBv5HWbOiKacIHnjRi86'),
(8, 'nikeee', 'tri1pti000@gmail.com', '$2b$10$vKMKB3evmuuP70GBjd8vveEyMNxBnUREbZJYQf9INwM7Xdnt83w1u'),
(9, 'nikeee54', 'tri1pti05600@gmail.com', '$2b$10$hEeFnrjP/lWODDCcDiCA8eVKfVxqe0Gp14ani69xTNiV.nJIyyVdO'),
(10, 'nikeee2354', 'tri1pti0560045@gmail.com', '$2b$10$s2VKlFSpuKZQogDq6y.c0uCPFJe0CQjepfuggyXn5KqXwkWaTv9Ua'),
(11, 'nikeTri', 'tripti123456789@gmail.com', '$2b$10$WxXdE8YTWd18rD.yyMr/J.bUylc84G1nD9jcl3Y1/sz//aMCbaUJy'),
(12, 'nikeTri1', 'tripti1234567898@gmail.com', '$2b$10$PuAJmUIYGD1rQqMMTDE9nOV5Km6nypBvBk6cB8F30xmFvz0DfG5DO'),
(13, 'nikeTri01', 'tripti123467898@gmail.com', '$2b$10$2SqhAABAnwr3ccmE0iN8c.7SnQnlDUnod6WrNcopu5QAvUj1xSikO'),
(14, 'nihkeui', 'triphti12hy478f9@gmail.com', '$2b$10$TWpf3Sia2mkcxAIZl4ioAO6/H0SZtnhact7G5bVQLVNF2E3tcb25.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `deleted_by` (`deleted_by`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dept_id` (`dept_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `deleted_by` (`deleted_by`);

--
-- Indexes for table `salary`
--
ALTER TABLE `salary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emp_id` (`emp_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `deleted_by` (`deleted_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `salary`
--
ALTER TABLE `salary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `department_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `department_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `department_ibfk_3` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `department` (`id`),
  ADD CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `employee_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `employee_ibfk_4` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `salary`
--
ALTER TABLE `salary`
  ADD CONSTRAINT `salary_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `salary_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `salary_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `salary_ibfk_4` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
