-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-10-2024 a las 03:18:26
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `applawyer`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `case_process`
--

CREATE TABLE `case_process` (
  `id_case` int(11) NOT NULL,
  `name_case` varchar(50) NOT NULL,
  `description_case` text NOT NULL,
  `date_init_case` datetime NOT NULL,
  `date_end_case` datetime DEFAULT NULL,
  `status_case` varchar(50) NOT NULL,
  `id_client_case` int(11) NOT NULL,
  `user_register_case` varchar(50) NOT NULL,
  `date_register_case` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_user_case` varchar(50) NOT NULL,
  `update_date_case` datetime NOT NULL,
  `type_case` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client`
--

CREATE TABLE `client` (
  `id_client` int(11) NOT NULL,
  `name_client` varchar(100) NOT NULL,
  `address_client` text NOT NULL,
  `phone_client` varchar(30) NOT NULL,
  `email_client` varchar(100) NOT NULL,
  `type_client` varchar(50) NOT NULL,
  `user_register_client` varchar(50) NOT NULL,
  `date_register_client` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_user_client` varchar(50) NOT NULL,
  `date_update_client` datetime NOT NULL,
  `type_document_client` varchar(50) NOT NULL,
  `document_client` varchar(30) NOT NULL,
  `status_client` tinyint(1) NOT NULL,
  `id_user_client` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `document`
--

CREATE TABLE `document` (
  `id_document` int(11) NOT NULL,
  `url_document` text NOT NULL,
  `name_document` varchar(100) NOT NULL,
  `type_document` varchar(50) NOT NULL,
  `status_document` tinyint(1) NOT NULL,
  `user_register_document` varchar(50) NOT NULL,
  `date_document` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_update_document` varchar(50) NOT NULL,
  `date_update_document` datetime NOT NULL,
  `id_case` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lawyer`
--

CREATE TABLE `lawyer` (
  `id_lawyer` int(11) NOT NULL,
  `name_lawyer` varchar(100) NOT NULL,
  `phone_lawyer` varchar(30) NOT NULL,
  `email_lawyer` varchar(150) NOT NULL,
  `type_lawyer` varchar(50) NOT NULL,
  `user_register_lawyer` varchar(50) NOT NULL,
  `date_register_lawyer` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_update_lawyer` varchar(50) NOT NULL,
  `date_update_lawyer` datetime NOT NULL,
  `type_document_lawyer` varchar(50) NOT NULL,
  `document_lawyer` varchar(30) NOT NULL,
  `status_lawyer` tinyint(1) NOT NULL,
  `user_id_lawyer` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lawyer_case`
--

CREATE TABLE `lawyer_case` (
  `id_lawyer_case` int(11) NOT NULL,
  `id_lawyer` int(11) NOT NULL,
  `id_case` int(11) NOT NULL,
  `date_register_lawyer` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_register_lawyer` varchar(50) NOT NULL,
  `status_lawyer_case` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `name_user` varchar(50) NOT NULL,
  `password_user` varchar(300) NOT NULL,
  `user_register` varchar(50) NOT NULL,
  `date_register` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_update` varchar(50) NOT NULL,
  `last_update` datetime NOT NULL,
  `photo_user` text NOT NULL,
  `status_user` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `case_process`
--
ALTER TABLE `case_process`
  ADD PRIMARY KEY (`id_case`),
  ADD KEY `pk_caseProcess_client` (`id_client_case`);

--
-- Indices de la tabla `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id_client`),
  ADD KEY `client_user` (`id_user_client`);

--
-- Indices de la tabla `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id_document`),
  ADD KEY `pk_document_case` (`id_case`);

--
-- Indices de la tabla `lawyer`
--
ALTER TABLE `lawyer`
  ADD PRIMARY KEY (`id_lawyer`),
  ADD KEY `lawyer_user` (`user_id_lawyer`);

--
-- Indices de la tabla `lawyer_case`
--
ALTER TABLE `lawyer_case`
  ADD PRIMARY KEY (`id_lawyer_case`),
  ADD KEY `pk_lawyer_case` (`id_lawyer`),
  ADD KEY `pk_lawyer_caseProcess` (`id_case`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `case_process`
--
ALTER TABLE `case_process`
  MODIFY `id_case` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `client`
--
ALTER TABLE `client`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `document`
--
ALTER TABLE `document`
  MODIFY `id_document` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lawyer`
--
ALTER TABLE `lawyer`
  MODIFY `id_lawyer` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lawyer_case`
--
ALTER TABLE `lawyer_case`
  MODIFY `id_lawyer_case` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `case_process`
--
ALTER TABLE `case_process`
  ADD CONSTRAINT `pk_caseProcess_client` FOREIGN KEY (`id_client_case`) REFERENCES `client` (`id_client`);

--
-- Filtros para la tabla `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_user` FOREIGN KEY (`id_user_client`) REFERENCES `user` (`id_user`);

--
-- Filtros para la tabla `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `pk_document_case` FOREIGN KEY (`id_case`) REFERENCES `case_process` (`id_case`);

--
-- Filtros para la tabla `lawyer`
--
ALTER TABLE `lawyer`
  ADD CONSTRAINT `lawyer_user` FOREIGN KEY (`user_id_lawyer`) REFERENCES `user` (`id_user`);

--
-- Filtros para la tabla `lawyer_case`
--
ALTER TABLE `lawyer_case`
  ADD CONSTRAINT `pk_lawyer_case` FOREIGN KEY (`id_lawyer`) REFERENCES `lawyer` (`id_lawyer`),
  ADD CONSTRAINT `pk_lawyer_caseProcess` FOREIGN KEY (`id_case`) REFERENCES `case_process` (`id_case`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
