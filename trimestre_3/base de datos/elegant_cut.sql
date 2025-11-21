-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 21, 2025 at 04:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elegantcut`
--

-- --------------------------------------------------------

--
-- Table structure for table `codigos_verificacion`
--

CREATE TABLE `codigos_verificacion` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `codigo` varchar(6) NOT NULL,
  `tipo` enum('registro','recuperacion') NOT NULL,
  `expira_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `usado` tinyint(1) DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `codigos_verificacion`
--

INSERT INTO `codigos_verificacion` (`id`, `email`, `codigo`, `tipo`, `expira_en`, `usado`, `creado_en`) VALUES
(1, 'jn147860@gmail.com', '199333', 'recuperacion', '2025-11-21 03:31:01', 0, '2025-11-21 03:16:01'),
(2, 'jn147860@gmail.com', '278952', 'recuperacion', '2025-11-21 03:26:32', 1, '2025-11-21 03:25:16'),
(3, 'jn147870@gmail.com', '629229', 'recuperacion', '2025-11-21 03:42:51', 0, '2025-11-21 03:27:51');

-- --------------------------------------------------------

--
-- Table structure for table `detalle_cita_servicio`
--

CREATE TABLE `detalle_cita_servicio` (
  `id_detalle_cita_servicio` int(11) NOT NULL,
  `id_reservas` int(11) DEFAULT NULL,
  `id_servicio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `estado_cita`
--

CREATE TABLE `estado_cita` (
  `id_estado_cita` int(11) NOT NULL,
  `confirmada` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `horarios`
--

CREATE TABLE `horarios` (
  `id_horarios` int(11) NOT NULL,
  `hora_inicio` int(11) NOT NULL,
  `hora_fin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `id_tipo_pago` int(11) DEFAULT NULL,
  `id_reservas` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservas`
--

CREATE TABLE `reservas` (
  `id_reservas` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `observaciones` varchar(70) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_estado_cita` int(11) DEFAULT NULL,
  `id_horarios` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre_rol`) VALUES
(1, 'admin'),
(2, 'barbero'),
(3, 'cliente');

-- --------------------------------------------------------

--
-- Table structure for table `servicios`
--

CREATE TABLE `servicios` (
  `id_servicio` int(11) NOT NULL,
  `nombre` varchar(70) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `duracion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tipo_pago`
--

CREATE TABLE `tipo_pago` (
  `id_tipo_pago` int(11) NOT NULL,
  `nombre` varchar(70) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `prim_nombre` varchar(70) NOT NULL,
  `seg_nombre` varchar(70) DEFAULT NULL,
  `apellido1` varchar(70) NOT NULL,
  `apellido2` varchar(70) DEFAULT NULL,
  `email` varchar(70) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `id_rol` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `username`, `prim_nombre`, `seg_nombre`, `apellido1`, `apellido2`, `email`, `password_hash`, `telefono`, `estado`, `id_rol`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Admin', NULL, 'Sistema', NULL, 'admin@elegantcut.com', NULL, NULL, 1, 1, '2025-11-21 01:55:41', '2025-11-21 01:55:41'),
(2, 'pepe', 'Pepe', NULL, 'Admin', NULL, 'pepe@gmail.com', '$2b$10$RSKiGFWUovtH9wpLCKGz5u/z6x93tzjdJFQ63YqIY.xogofMJgO5u', NULL, 1, 1, '2025-11-21 02:10:00', '2025-11-21 02:10:00'),
(3, 'Nicolas_f', 'jorge', 'nicolas', 'echeverry', 'calvo', 'jn147860@gmail.com', '$2b$10$V/IopMP5Y/tO2dPMut5W/uDY.79tF6Opu3OZM9IrCuVmZ6GVOYudu', '3213925370', 1, 3, '2025-11-21 02:23:39', '2025-11-21 03:26:32'),
(4, 'nicolas2', 'jorge', 'nicolas', 'calvo', 'echeverry', 'jn147870@gmail.com', '$2b$10$x0i0EJa5AvMTZQCQtAzUxuPoFGvK.OTA3DZIOtlZH9ou/Y/kE8LVK', '3115502434', 1, 3, '2025-11-21 03:27:40', '2025-11-21 03:27:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `codigos_verificacion`
--
ALTER TABLE `codigos_verificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email_codigo` (`email`,`codigo`,`tipo`,`usado`);

--
-- Indexes for table `detalle_cita_servicio`
--
ALTER TABLE `detalle_cita_servicio`
  ADD PRIMARY KEY (`id_detalle_cita_servicio`),
  ADD KEY `fk_detalle_reserva` (`id_reservas`),
  ADD KEY `fk_detalle_servicio` (`id_servicio`);

--
-- Indexes for table `estado_cita`
--
ALTER TABLE `estado_cita`
  ADD PRIMARY KEY (`id_estado_cita`);

--
-- Indexes for table `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id_horarios`);

--
-- Indexes for table `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `fk_pago_tipo` (`id_tipo_pago`),
  ADD KEY `fk_pago_reserva` (`id_reservas`);

--
-- Indexes for table `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id_reservas`),
  ADD KEY `fk_reserva_usuario` (`id_usuario`),
  ADD KEY `fk_reserva_estado` (`id_estado_cita`),
  ADD KEY `fk_reserva_horario` (`id_horarios`);

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indexes for table `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id_servicio`);

--
-- Indexes for table `tipo_pago`
--
ALTER TABLE `tipo_pago`
  ADD PRIMARY KEY (`id_tipo_pago`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_rol_usuario` (`id_rol`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `codigos_verificacion`
--
ALTER TABLE `codigos_verificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `detalle_cita_servicio`
--
ALTER TABLE `detalle_cita_servicio`
  MODIFY `id_detalle_cita_servicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `estado_cita`
--
ALTER TABLE `estado_cita`
  MODIFY `id_estado_cita` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id_horarios` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id_reservas` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tipo_pago`
--
ALTER TABLE `tipo_pago`
  MODIFY `id_tipo_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detalle_cita_servicio`
--
ALTER TABLE `detalle_cita_servicio`
  ADD CONSTRAINT `fk_detalle_reserva` FOREIGN KEY (`id_reservas`) REFERENCES `reservas` (`id_reservas`),
  ADD CONSTRAINT `fk_detalle_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`);

--
-- Constraints for table `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pago_reserva` FOREIGN KEY (`id_reservas`) REFERENCES `reservas` (`id_reservas`),
  ADD CONSTRAINT `fk_pago_tipo` FOREIGN KEY (`id_tipo_pago`) REFERENCES `tipo_pago` (`id_tipo_pago`);

--
-- Constraints for table `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `fk_reserva_estado` FOREIGN KEY (`id_estado_cita`) REFERENCES `estado_cita` (`id_estado_cita`),
  ADD CONSTRAINT `fk_reserva_horario` FOREIGN KEY (`id_horarios`) REFERENCES `horarios` (`id_horarios`),
  ADD CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_rol_usuario` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
