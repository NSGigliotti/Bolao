-- Script de inicialização completo para a Copa do Mundo 2026
-- Versão de Teste: Repescagens substituídas por países reais

-- 1. POPULAR SELEÇÕES (48 TIMES)
INSERT INTO Teams (Name, Abbreviation, `Group`, FlagUrl, Points, GamesPlayed, Wins, Draws, Losses, GoalsFor, GoalsAgainst)
VALUES
-- Grupo A
('Mexico', 'MEX', 'A', 'https://flagcdn.com/w320/mx.png', 0, 0, 0, 0, 0, 0, 0),
('Africa do Sul', 'RSA', 'A', 'https://flagcdn.com/w320/za.png', 0, 0, 0, 0, 0, 0, 0),
('Coreia do Sul', 'KOR', 'A', 'https://flagcdn.com/w320/kr.png', 0, 0, 0, 0, 0, 0, 0),
('Turquia', 'TUR', 'A', 'https://flagcdn.com/w320/tr.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo B
('Canada', 'CAN', 'B', 'https://flagcdn.com/w320/ca.png', 0, 0, 0, 0, 0, 0, 0),
('Hungria', 'HUN', 'B', 'https://flagcdn.com/w320/hu.png', 0, 0, 0, 0, 0, 0, 0),
('Catar', 'QAT', 'B', 'https://flagcdn.com/w320/qa.png', 0, 0, 0, 0, 0, 0, 0),
('Suica', 'SUI', 'B', 'https://flagcdn.com/w320/ch.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo C
('Brasil', 'BRA', 'C', 'https://flagcdn.com/w320/br.png', 0, 0, 0, 0, 0, 0, 0),
('Marrocos', 'MAR', 'C', 'https://flagcdn.com/w320/ma.png', 0, 0, 0, 0, 0, 0, 0),
('Haiti', 'HAI', 'C', 'https://flagcdn.com/w320/ht.png', 0, 0, 0, 0, 0, 0, 0),
('Escocia', 'SCO', 'C', 'https://flagcdn.com/w320/gb-sct.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo D
('Estados Unidos', 'USA', 'D', 'https://flagcdn.com/w320/us.png', 0, 0, 0, 0, 0, 0, 0),
('Paraguai', 'PAR', 'D', 'https://flagcdn.com/w320/py.png', 0, 0, 0, 0, 0, 0, 0),
('Australia', 'AUS', 'D', 'https://flagcdn.com/w320/au.png', 0, 0, 0, 0, 0, 0, 0),
('Ucrania', 'UKR', 'D', 'https://flagcdn.com/w320/ua.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo E
('Alemanha', 'GER', 'E', 'https://flagcdn.com/w320/de.png', 0, 0, 0, 0, 0, 0, 0),
('Curacao', 'CUW', 'E', 'https://flagcdn.com/w320/cw.png', 0, 0, 0, 0, 0, 0, 0),
('Costa do Marfim', 'CIV', 'E', 'https://flagcdn.com/w320/ci.png', 0, 0, 0, 0, 0, 0, 0),
('Equador', 'ECU', 'E', 'https://flagcdn.com/w320/ec.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo F
('Paises Baixos', 'NED', 'F', 'https://flagcdn.com/w320/nl.png', 0, 0, 0, 0, 0, 0, 0),
('Japao', 'JPN', 'F', 'https://flagcdn.com/w320/jp.png', 0, 0, 0, 0, 0, 0, 0),
('Grecia', 'GRE', 'F', 'https://flagcdn.com/w320/gr.png', 0, 0, 0, 0, 0, 0, 0),
('Tunisia', 'TUN', 'F', 'https://flagcdn.com/w320/tn.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo G
('Belgica', 'BEL', 'G', 'https://flagcdn.com/w320/be.png', 0, 0, 0, 0, 0, 0, 0),
('Egito', 'EGY', 'G', 'https://flagcdn.com/w320/eg.png', 0, 0, 0, 0, 0, 0, 0),
('Ira', 'IRN', 'G', 'https://flagcdn.com/w320/ir.png', 0, 0, 0, 0, 0, 0, 0),
('Nova Zelandia', 'NZL', 'G', 'https://flagcdn.com/w320/nz.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo H
('Espanha', 'ESP', 'H', 'https://flagcdn.com/w320/es.png', 0, 0, 0, 0, 0, 0, 0),
('Cabo Verde', 'CPV', 'H', 'https://flagcdn.com/w320/cv.png', 0, 0, 0, 0, 0, 0, 0),
('Arabia Saudita', 'KSA', 'H', 'https://flagcdn.com/w320/sa.png', 0, 0, 0, 0, 0, 0, 0),
('Uruguai', 'URU', 'H', 'https://flagcdn.com/w320/uy.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo I
('Franca', 'FRA', 'I', 'https://flagcdn.com/w320/fr.png', 0, 0, 0, 0, 0, 0, 0),
('Senegal', 'SEN', 'I', 'https://flagcdn.com/w320/sn.png', 0, 0, 0, 0, 0, 0, 0),
('Peru', 'PER', 'I', 'https://flagcdn.com/w320/pe.png', 0, 0, 0, 0, 0, 0, 0),
('Noruega', 'NOR', 'I', 'https://flagcdn.com/w320/no.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo J
('Argentina', 'ARG', 'J', 'https://flagcdn.com/w320/ar.png', 0, 0, 0, 0, 0, 0, 0),
('Argelia', 'ALG', 'J', 'https://flagcdn.com/w320/dz.png', 0, 0, 0, 0, 0, 0, 0),
('Austria', 'AUT', 'J', 'https://flagcdn.com/w320/at.png', 0, 0, 0, 0, 0, 0, 0),
('Jordania', 'JOR', 'J', 'https://flagcdn.com/w320/jo.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo K
('Portugal', 'POR', 'K', 'https://flagcdn.com/w320/pt.png', 0, 0, 0, 0, 0, 0, 0),
('Camaroes', 'CMR', 'K', 'https://flagcdn.com/w320/cm.png', 0, 0, 0, 0, 0, 0, 0),
('Colombia', 'COL', 'K', 'https://flagcdn.com/w320/co.png', 0, 0, 0, 0, 0, 0, 0),
('Uzbequistao', 'UZB', 'K', 'https://flagcdn.com/w320/uz.png', 0, 0, 0, 0, 0, 0, 0),
-- Grupo L
('Inglaterra', 'ENG', 'L', 'https://flagcdn.com/w320/gb-eng.png', 0, 0, 0, 0, 0, 0, 0),
('Croacia', 'CRO', 'L', 'https://flagcdn.com/w320/hr.png', 0, 0, 0, 0, 0, 0, 0),
('Gana', 'GHA', 'L', 'https://flagcdn.com/w320/gh.png', 0, 0, 0, 0, 0, 0, 0),
('Panama', 'PAN', 'L', 'https://flagcdn.com/w320/pa.png', 0, 0, 0, 0, 0, 0, 0);

-- 2. POPULAR JOGOS DA FASE DE GRUPOS (72 JOGOS)
-- Nota: 'Stage' 0=Rodada 1, 1=Rodada 2, 2=Rodada 3
INSERT INTO Matches (MatchDate, Stage, Status, HomeTeamId, AwayTeamId, HomeTeamScore, AwayTeamScore) VALUES
('2026-06-11 18:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Mexico'), (SELECT Id FROM Teams WHERE Name = 'Africa do Sul'), 0, 0),
('2026-06-11 21:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Coreia do Sul'), (SELECT Id FROM Teams WHERE Name = 'Turquia'), 0, 0),
('2026-06-12 15:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Canada'), (SELECT Id FROM Teams WHERE Name = 'Hungria'), 0, 0),
('2026-06-12 18:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Catar'), (SELECT Id FROM Teams WHERE Name = 'Suica'), 0, 0),
('2026-06-12 21:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Estados Unidos'), (SELECT Id FROM Teams WHERE Name = 'Paraguai'), 0, 0),
('2026-06-12 23:59:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Australia'), (SELECT Id FROM Teams WHERE Name = 'Ucrania'), 0, 0),
('2026-06-13 15:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Alemanha'), (SELECT Id FROM Teams WHERE Name = 'Curacao'), 0, 0),
('2026-06-13 18:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Costa do Marfim'), (SELECT Id FROM Teams WHERE Name = 'Equador'), 0, 0),
('2026-06-13 21:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Brasil'), (SELECT Id FROM Teams WHERE Name = 'Marrocos'), 0, 0),
('2026-06-13 23:59:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Haiti'), (SELECT Id FROM Teams WHERE Name = 'Escocia'), 0, 0),
('2026-06-14 15:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Paises Baixos'), (SELECT Id FROM Teams WHERE Name = 'Japao'), 0, 0),
('2026-06-14 18:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Grecia'), (SELECT Id FROM Teams WHERE Name = 'Tunisia'), 0, 0),
('2026-06-14 21:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Belgica'), (SELECT Id FROM Teams WHERE Name = 'Egito'), 0, 0),
('2026-06-14 23:59:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Ira'), (SELECT Id FROM Teams WHERE Name = 'Nova Zelandia'), 0, 0),
('2026-06-15 15:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Espanha'), (SELECT Id FROM Teams WHERE Name = 'Cabo Verde'), 0, 0),
('2026-06-15 18:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Arabia Saudita'), (SELECT Id FROM Teams WHERE Name = 'Uruguai'), 0, 0),
('2026-06-15 21:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Franca'), (SELECT Id FROM Teams WHERE Name = 'Senegal'), 0, 0),
('2026-06-15 23:59:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Peru'), (SELECT Id FROM Teams WHERE Name = 'Noruega'), 0, 0),
('2026-06-16 15:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Argentina'), (SELECT Id FROM Teams WHERE Name = 'Argelia'), 0, 0),
('2026-06-16 18:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Austria'), (SELECT Id FROM Teams WHERE Name = 'Jordania'), 0, 0),
('2026-06-16 21:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Portugal'), (SELECT Id FROM Teams WHERE Name = 'Camaroes'), 0, 0),
('2026-06-16 23:59:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Colombia'), (SELECT Id FROM Teams WHERE Name = 'Uzbequistao'), 0, 0),
('2026-06-17 15:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Inglaterra'), (SELECT Id FROM Teams WHERE Name = 'Croacia'), 0, 0),
('2026-06-17 18:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Gana'), (SELECT Id FROM Teams WHERE Name = 'Panama'), 0, 0);

-- RODADA 2 (Fase de Grupos)
INSERT INTO Matches (MatchDate, Stage, Status, HomeTeamId, AwayTeamId, HomeTeamScore, AwayTeamScore) VALUES
('2026-06-17 21:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Mexico'), (SELECT Id FROM Teams WHERE Name = 'Coreia do Sul'), 0, 0),
('2026-06-18 15:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Turquia'), (SELECT Id FROM Teams WHERE Name = 'Africa do Sul'), 0, 0),
('2026-06-18 18:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Canada'), (SELECT Id FROM Teams WHERE Name = 'Catar'), 0, 0),
('2026-06-18 21:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Suica'), (SELECT Id FROM Teams WHERE Name = 'Hungria'), 0, 0),
('2026-06-19 15:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Estados Unidos'), (SELECT Id FROM Teams WHERE Name = 'Australia'), 0, 0),
('2026-06-19 18:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Ucrania'), (SELECT Id FROM Teams WHERE Name = 'Paraguai'), 0, 0),
('2026-06-19 21:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Brasil'), (SELECT Id FROM Teams WHERE Name = 'Haiti'), 0, 0),
('2026-06-20 15:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Escocia'), (SELECT Id FROM Teams WHERE Name = 'Marrocos'), 0, 0),
('2026-06-20 18:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Alemanha'), (SELECT Id FROM Teams WHERE Name = 'Costa do Marfim'), 0, 0),
('2026-06-20 21:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Equador'), (SELECT Id FROM Teams WHERE Name = 'Curacao'), 0, 0),
('2026-06-21 15:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Paises Baixos'), (SELECT Id FROM Teams WHERE Name = 'Grecia'), 0, 0),
('2026-06-21 18:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Tunisia'), (SELECT Id FROM Teams WHERE Name = 'Japao'), 0, 0),
('2026-06-21 21:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Belgica'), (SELECT Id FROM Teams WHERE Name = 'Ira'), 0, 0),
('2026-06-22 15:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Nova Zelandia'), (SELECT Id FROM Teams WHERE Name = 'Egito'), 0, 0),
('2026-06-22 18:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Espanha'), (SELECT Id FROM Teams WHERE Name = 'Arabia Saudita'), 0, 0),
('2026-06-22 21:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Uruguai'), (SELECT Id FROM Teams WHERE Name = 'Cabo Verde'), 0, 0),
('2026-06-23 15:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Franca'), (SELECT Id FROM Teams WHERE Name = 'Peru'), 0, 0),
('2026-06-23 18:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Noruega'), (SELECT Id FROM Teams WHERE Name = 'Senegal'), 0, 0),
('2026-06-23 21:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Argentina'), (SELECT Id FROM Teams WHERE Name = 'Austria'), 0, 0),
('2026-06-24 15:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Jordania'), (SELECT Id FROM Teams WHERE Name = 'Argelia'), 0, 0),
('2026-06-24 18:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Portugal'), (SELECT Id FROM Teams WHERE Name = 'Colombia'), 0, 0),
('2026-06-24 21:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Uzbequistao'), (SELECT Id FROM Teams WHERE Name = 'Camaroes'), 0, 0),
('2026-06-25 15:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Inglaterra'), (SELECT Id FROM Teams WHERE Name = 'Gana'), 0, 0),
('2026-06-25 18:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Panama'), (SELECT Id FROM Teams WHERE Name = 'Croacia'), 0, 0);

-- RODADA 3 (Fase de Grupos)
INSERT INTO Matches (MatchDate, Stage, Status, HomeTeamId, AwayTeamId, HomeTeamScore, AwayTeamScore) VALUES
('2026-06-24 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Turquia'), (SELECT Id FROM Teams WHERE Name = 'Mexico'), 0, 0),
('2026-06-24 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Africa do Sul'), (SELECT Id FROM Teams WHERE Name = 'Coreia do Sul'), 0, 0),
('2026-06-25 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Suica'), (SELECT Id FROM Teams WHERE Name = 'Canada'), 0, 0),
('2026-06-25 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Hungria'), (SELECT Id FROM Teams WHERE Name = 'Catar'), 0, 0),
('2026-06-26 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Ucrania'), (SELECT Id FROM Teams WHERE Name = 'Estados Unidos'), 0, 0),
('2026-06-26 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Paraguai'), (SELECT Id FROM Teams WHERE Name = 'Australia'), 0, 0),
('2026-06-26 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Escocia'), (SELECT Id FROM Teams WHERE Name = 'Brasil'), 0, 0),
('2026-06-26 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Marrocos'), (SELECT Id FROM Teams WHERE Name = 'Haiti'), 0, 0),
('2026-06-27 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Equador'), (SELECT Id FROM Teams WHERE Name = 'Alemanha'), 0, 0),
('2026-06-27 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Curacao'), (SELECT Id FROM Teams WHERE Name = 'Costa do Marfim'), 0, 0),
('2026-06-27 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Tunisia'), (SELECT Id FROM Teams WHERE Name = 'Paises Baixos'), 0, 0),
('2026-06-27 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Japao'), (SELECT Id FROM Teams WHERE Name = 'Grecia'), 0, 0),
('2026-06-28 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Nova Zelandia'), (SELECT Id FROM Teams WHERE Name = 'Belgica'), 0, 0),
('2026-06-28 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Egito'), (SELECT Id FROM Teams WHERE Name = 'Ira'), 0, 0),
('2026-06-28 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Uruguai'), (SELECT Id FROM Teams WHERE Name = 'Espanha'), 0, 0),
('2026-06-28 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Cabo Verde'), (SELECT Id FROM Teams WHERE Name = 'Arabia Saudita'), 0, 0),
('2026-06-29 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Noruega'), (SELECT Id FROM Teams WHERE Name = 'Franca'), 0, 0),
('2026-06-29 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Senegal'), (SELECT Id FROM Teams WHERE Name = 'Peru'), 0, 0),
('2026-06-29 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Jordania'), (SELECT Id FROM Teams WHERE Name = 'Argentina'), 0, 0),
('2026-06-29 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Argelia'), (SELECT Id FROM Teams WHERE Name = 'Austria'), 0, 0),
('2026-06-30 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Uzbequistao'), (SELECT Id FROM Teams WHERE Name = 'Portugal'), 0, 0),
('2026-06-30 15:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Camaroes'), (SELECT Id FROM Teams WHERE Name = 'Colombia'), 0, 0),
('2026-06-30 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Panama'), (SELECT Id FROM Teams WHERE Name = 'Inglaterra'), 0, 0),
('2026-06-30 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Croacia'), (SELECT Id FROM Teams WHERE Name = 'Gana'), 0, 0);

INSERT INTO Matches (MatchDate, Stage, Status, HomeTeamId, AwayTeamId, HomeTeamScore, AwayTeamScore) VALUES

-- 32-AVOS DE FINAL (STAGE 3)
('2026-06-28 22:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 73
('2026-06-29 16:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 74
('2026-06-29 19:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 75
('2026-06-29 21:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 76
('2026-06-30 16:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 77
('2026-06-30 19:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 78
('2026-06-30 21:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 79
('2026-07-01 16:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 80
('2026-07-01 19:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 81
('2026-07-01 22:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 82
('2026-07-02 16:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 83
('2026-07-02 19:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 84
('2026-07-02 22:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 85
('2026-07-03 16:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 86
('2026-07-03 19:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 87
('2026-07-03 22:00:00', 3, 0, NULL, NULL, NULL, NULL), -- Jogo 88

-- OITAVAS DE FINAL (STAGE 4)
('2026-07-04 16:00:00', 4, 0, NULL, NULL, NULL, NULL), -- Jogo 89
('2026-07-04 20:00:00', 4, 0, NULL, NULL, NULL, NULL), -- Jogo 90
('2026-07-05 16:00:00', 4, 0, NULL, NULL, NULL, NULL), -- Jogo 91
('2026-07-05 20:00:00', 4, 0, NULL, NULL, NULL, NULL), -- Jogo 92
('2026-07-06 16:00:00', 4, 0, NULL, NULL, NULL, NULL), -- Jogo 93
('2026-07-06 20:00:00', 4, 0, NULL, NULL, NULL, NULL), -- Jogo 94
('2026-07-07 16:00:00', 4, 0, NULL, NULL, NULL, NULL), -- Jogo 95
('2026-07-07 20:00:00', 4, 0, NULL, NULL, NULL, NULL), -- Jogo 96

-- QUARTAS DE FINAL (STAGE 5)
('2026-07-09 20:00:00', 5, 0, NULL, NULL, NULL, NULL), -- Jogo 97
('2026-07-10 20:00:00', 5, 0, NULL, NULL, NULL, NULL), -- Jogo 98
('2026-07-11 16:00:00', 5, 0, NULL, NULL, NULL, NULL), -- Jogo 99
('2026-07-11 20:00:00', 5, 0, NULL, NULL, NULL, NULL), -- Jogo 100

-- SEMIFINAIS (STAGE 6)
('2026-07-14 20:00:00', 6, 0, NULL, NULL, NULL, NULL), -- Jogo 101
('2026-07-15 20:00:00', 6, 0, NULL, NULL, NULL, NULL), -- Jogo 102

-- DISPUTA DE 3º LUGAR (STAGE 7)
('2026-07-18 16:00:00', 7, 0, NULL, NULL, NULL, NULL), -- Jogo 103

-- GRANDE FINAL (STAGE 8)
('2026-07-19 16:00:00', 8, 0, NULL, NULL, NULL, NULL); -- Jogo 104