-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2024 at 03:32 PM
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
(3, 'DMS', 0, '2024-04-16 09:39:22', '2024-04-16 09:52:35', NULL, 7, 7, NULL),
(4, 'DMS', 0, '2024-04-16 10:03:11', NULL, NULL, 7, NULL, NULL),
(5, 'DMS', 0, '2024-04-16 10:03:24', NULL, NULL, 7, NULL, NULL),
(8, 'MK', 0, '2024-04-16 13:16:15', NULL, NULL, 7, NULL, NULL),
(9, 'MK', 0, '2024-04-16 13:18:17', NULL, NULL, 7, NULL, NULL);

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
(2, 'John Doe', 'johndoe@example.com', 1234567890, 1, '1990-01-01', 2, 1, NULL, NULL, NULL, 7, NULL, NULL),
(3, 'John Doe123', 'johndoe@example.com', 1234567890, 1, '1990-01-01', 1, 0, NULL, '2024-04-16 12:09:11', NULL, 7, 7, NULL),
(4, 'John Doe', 'johndoe@example.com', 1234567890, 1, '1990-01-01', 2, 0, '2024-04-16 10:38:15', NULL, NULL, 7, NULL, NULL),
(5, 'tripti Doe123', 'johndoe@example.com', 1234567890, 1, '1990-01-01', 1, 1, '2024-04-16 12:10:20', NULL, '2024-04-16 12:11:14', 7, NULL, 7),
(6, 'DMS', 'hellddfcdfco@gmail.com', 1246759756, 0, '2022-10-10', 5, 0, '2024-04-16 13:02:28', NULL, NULL, 7, NULL, NULL),
(7, 'MK', 'hellddfcdfcdhgjgo@gmail.com', 1246759756, 0, '2022-10-10', 8, 0, '2024-04-16 13:16:15', NULL, NULL, 7, NULL, NULL),
(9, 'DMS', 'hellddfcdffghgcdhgjgo@gmail.com', 1246759756, 0, '2022-10-10', 9, 0, '2024-04-16 13:18:17', NULL, NULL, 7, NULL, NULL);

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
(1, 3, 30000.00, '1990-01-01', 0, '2024-04-16 10:53:10', NULL, NULL, 7, NULL, NULL),
(2, 3, 30000.00, '1990-01-01', 0, '2024-04-16 12:03:45', NULL, NULL, 7, NULL, NULL),
(3, 3, 45000.00, '1990-01-01', 1, '2024-04-16 12:04:42', NULL, NULL, 7, NULL, NULL),
(4, 4, 95000.00, '1992-01-01', 1, '2024-04-16 12:13:27', '2024-04-16 12:15:57', '2024-04-16 12:16:12', 7, 7, 7);

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
(7, 'tripti14562', 'tri1pti678@gmail.com', '$2b$10$z2L8bAJcOLwrmhC2Qwy34.ZARgURDv4ctKBv5HWbOiKacIHnjRi86');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `salary`
--
ALTER TABLE `salary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
