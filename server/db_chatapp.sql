-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 19 Feb 2024 pada 11.28
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_chatapp`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `andijoko`
--

CREATE TABLE `andijoko` (
  `user` varchar(12) NOT NULL,
  `text` text NOT NULL,
  `tanggal` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `chat`
--

CREATE TABLE `chat` (
  `user1` varchar(12) NOT NULL,
  `user2` varchar(12) NOT NULL,
  `table_chat` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `chat`
--

INSERT INTO `chat` (`user1`, `user2`, `table_chat`) VALUES
('joko', 'santo', 'jokosanto'),
('joko', 'anton', 'jokoanton'),
('andi', 'joko', 'andijoko');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jokoanton`
--

CREATE TABLE `jokoanton` (
  `user` varchar(12) NOT NULL,
  `text` text NOT NULL,
  `tanggal` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jokoanton`
--

INSERT INTO `jokoanton` (`user`, `text`, `tanggal`) VALUES
('joko', 'hai', '2024-02-11 17:21:07'),
('anton', 'hallo', '2024-02-11 17:21:19'),
('joko', 'cok', '2024-02-17 21:31:22'),
('anton', 'sdsdsd', '2024-02-19 16:45:25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jokosanto`
--

CREATE TABLE `jokosanto` (
  `user` varchar(12) NOT NULL,
  `text` text NOT NULL,
  `tanggal` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jokosanto`
--

INSERT INTO `jokosanto` (`user`, `text`, `tanggal`) VALUES
('joko', 'heehe', '2024-02-09 21:04:45'),
('joko', 'heehe', '2024-02-09 21:05:01'),
('joko', 'cok', '2024-02-09 21:05:06'),
('joko', '12345', '2024-02-09 21:06:13'),
('santo', 'opo si', '2024-02-09 21:09:49'),
('santo', 'lgi opo jok', '2024-02-09 21:09:53'),
('joko', 'hai santo', '2024-02-09 21:09:59'),
('santo', 'opo jok', '2024-02-09 21:10:11'),
('joko', 'kontol', '2024-02-17 21:30:24'),
('joko', 'hai cok', '2024-02-19 16:39:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(21) NOT NULL,
  `password` varchar(21) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_user`, `username`, `password`) VALUES
(1, 'joko', '12345'),
(2, 'anton', '12345'),
(3, 'santo', '12345'),
(4, 'andi', '12344');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
