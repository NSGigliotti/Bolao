-- Script de inicialização para popular a tabela Teams com as seleções da Copa de 2026
-- Este script será executado automaticamente quando o banco de dados for criado

INSERT INTO Teams (Name, Abbreviation, `Group`, FlagUrl, Points, GamesPlayed, Wins, Draws, Losses, GoalsFor, GoalsAgainst)
VALUES
-- Grupo A
('Mexico', 'MEX', 'A', 'https://flagcdn.com/w320/mx.png', 0, 0, 0, 0, 0, 0, 0),
('Africa do Sul', 'RSA', 'A', 'https://flagcdn.com/w320/za.png', 0, 0, 0, 0, 0, 0, 0),
('Grecia', 'GRE', 'A', 'https://flagcdn.com/w320/gr.png', 0, 0, 0, 0, 0, 0, 0),
('Trinidad e Tobago', 'TRI', 'A', 'https://flagcdn.com/w320/tt.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo B
('Canada', 'CAN', 'B', 'https://flagcdn.com/w320/ca.png', 0, 0, 0, 0, 0, 0, 0),
('Coreia do Sul', 'KOR', 'B', 'https://flagcdn.com/w320/kr.png', 0, 0, 0, 0, 0, 0, 0),
('Polonia', 'POL', 'B', 'https://flagcdn.com/w320/pl.png', 0, 0, 0, 0, 0, 0, 0),
('Vencedor Repescagem 1', 'RP1', 'B', 'https://flagcdn.com/w320/un.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo C
('Brasil', 'BRA', 'C', 'https://flagcdn.com/w320/br.png', 0, 0, 0, 0, 0, 0, 0),
('Marrocos', 'MAR', 'C', 'https://flagcdn.com/w320/ma.png', 0, 0, 0, 0, 0, 0, 0),
('Haiti', 'HAI', 'C', 'https://flagcdn.com/w320/ht.png', 0, 0, 0, 0, 0, 0, 0),
('Escocia', 'SCO', 'C', 'https://flagcdn.com/w320/gb-sct.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo D
('Estados Unidos', 'USA', 'D', 'https://flagcdn.com/w320/us.png', 0, 0, 0, 0, 0, 0, 0),
('Austria', 'AUT', 'D', 'https://flagcdn.com/w320/at.png', 0, 0, 0, 0, 0, 0, 0),
('Ira', 'IRN', 'D', 'https://flagcdn.com/w320/ir.png', 0, 0, 0, 0, 0, 0, 0),
('Zambia', 'ZAM', 'D', 'https://flagcdn.com/w320/zm.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo E
('Argentina', 'ARG', 'E', 'https://flagcdn.com/w320/ar.png', 0, 0, 0, 0, 0, 0, 0),
('Australia', 'AUS', 'E', 'https://flagcdn.com/w320/au.png', 0, 0, 0, 0, 0, 0, 0),
('Servia', 'SRB', 'E', 'https://flagcdn.com/w320/rs.png', 0, 0, 0, 0, 0, 0, 0),
('Etiopia', 'ETH', 'E', 'https://flagcdn.com/w320/et.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo F
('Franca', 'FRA', 'F', 'https://flagcdn.com/w320/fr.png', 0, 0, 0, 0, 0, 0, 0),
('Dinamarca', 'DEN', 'F', 'https://flagcdn.com/w320/dk.png', 0, 0, 0, 0, 0, 0, 0),
('Uruguai', 'URU', 'F', 'https://flagcdn.com/w320/uy.png', 0, 0, 0, 0, 0, 0, 0),
('Catar', 'QAT', 'F', 'https://flagcdn.com/w320/qa.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo G
('Belgica', 'BEL', 'G', 'https://flagcdn.com/w320/be.png', 0, 0, 0, 0, 0, 0, 0),
('Suica', 'SUI', 'G', 'https://flagcdn.com/w320/ch.png', 0, 0, 0, 0, 0, 0, 0),
('Panama', 'PAN', 'G', 'https://flagcdn.com/w320/pa.png', 0, 0, 0, 0, 0, 0, 0),
('Burkina Faso', 'BFA', 'G', 'https://flagcdn.com/w320/bf.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo H
('Espanha', 'ESP', 'H', 'https://flagcdn.com/w320/es.png', 0, 0, 0, 0, 0, 0, 0),
('Equador', 'ECU', 'H', 'https://flagcdn.com/w320/ec.png', 0, 0, 0, 0, 0, 0, 0),
('Oma', 'OMA', 'H', 'https://flagcdn.com/w320/om.png', 0, 0, 0, 0, 0, 0, 0),
('Eslovaquia', 'SVK', 'H', 'https://flagcdn.com/w320/sk.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo I
('Inglaterra', 'ENG', 'I', 'https://flagcdn.com/w320/gb-eng.png', 0, 0, 0, 0, 0, 0, 0),
('Turquia', 'TUR', 'I', 'https://flagcdn.com/w320/tr.png', 0, 0, 0, 0, 0, 0, 0),
('Japao', 'JPN', 'I', 'https://flagcdn.com/w320/jp.png', 0, 0, 0, 0, 0, 0, 0),
('Bolivia', 'BOL', 'I', 'https://flagcdn.com/w320/bo.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo J
('Portugal', 'POR', 'J', 'https://flagcdn.com/w320/pt.png', 0, 0, 0, 0, 0, 0, 0),
('Colombia', 'COL', 'J', 'https://flagcdn.com/w320/co.png', 0, 0, 0, 0, 0, 0, 0),
('Iraque', 'IRQ', 'J', 'https://flagcdn.com/w320/iq.png', 0, 0, 0, 0, 0, 0, 0),
('Vencedor Repescagem 2', 'RP2', 'J', 'https://flagcdn.com/w320/un.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo K
('Alemanha', 'GER', 'K', 'https://flagcdn.com/w320/de.png', 0, 0, 0, 0, 0, 0, 0),
('Egito', 'EGY', 'K', 'https://flagcdn.com/w320/eg.png', 0, 0, 0, 0, 0, 0, 0),
('Paises Baixos', 'NED', 'K', 'https://flagcdn.com/w320/nl.png', 0, 0, 0, 0, 0, 0, 0),
('Jamaica', 'JAM', 'K', 'https://flagcdn.com/w320/jm.png', 0, 0, 0, 0, 0, 0, 0),

-- Grupo L
('Italia', 'ITA', 'L', 'https://flagcdn.com/w320/it.png', 0, 0, 0, 0, 0, 0, 0),
('Senegal', 'SEN', 'L', 'https://flagcdn.com/w320/sn.png', 0, 0, 0, 0, 0, 0, 0),
('Arabia Saudita', 'KSA', 'L', 'https://flagcdn.com/w320/sa.png', 0, 0, 0, 0, 0, 0, 0),
('Suecia', 'SWE', 'L', 'https://flagcdn.com/w320/se.png', 0, 0, 0, 0, 0, 0, 0);

INSERT INTO Matches (MatchDate, Stage, Status, HomeTeamId, AwayTeamId, HomeTeamScore, AwayTeamScore) VALUES
-- Quinta-feira, 11 de junho de 2026
('2026-06-11 16:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Mexico'), (SELECT Id FROM Teams WHERE Name = 'Africa do Sul'), 0, 0),
('2026-06-11 23:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Coreia do Sul'), (SELECT Id FROM Teams WHERE Name = 'Dinamarca'), 0, 0),

-- Sexta-feira, 12 de junho de 2026
('2026-06-12 16:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Canada'), (SELECT Id FROM Teams WHERE Name = 'Italia'), 0, 0),
('2026-06-12 22:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Estados Unidos'), (SELECT Id FROM Teams WHERE Name = 'Paraguai'), 0, 0),

-- Sábado, 13 de junho de 2026
('2026-06-13 16:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Catar'), (SELECT Id FROM Teams WHERE Name = 'Suica'), 0, 0),
('2026-06-13 19:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Brasil'), (SELECT Id FROM Teams WHERE Name = 'Marrocos'), 0, 0),
('2026-06-13 22:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Haiti'), (SELECT Id FROM Teams WHERE Name = 'Escocia'), 0, 0),
('2026-06-14 01:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Australia'), (SELECT Id FROM Teams WHERE Name = 'Eslovaquia'), 0, 0),

-- Domingo, 14 de junho de 2026
('2026-06-14 14:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Alemanha'), (SELECT Id FROM Teams WHERE Name = 'Curaçau'), 0, 0),
('2026-06-14 20:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Costa do Marfim'), (SELECT Id FROM Teams WHERE Name = 'Equador'), 0, 0),
('2026-06-14 17:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Paises Baixos'), (SELECT Id FROM Teams WHERE Name = 'Japao'), 0, 0),
('2026-06-14 22:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Polonia'), (SELECT Id FROM Teams WHERE Name = 'Tunisia'), 0, 0),

-- Segunda-feira, 15 de junho de 2026
('2026-06-15 13:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Espanha'), (SELECT Id FROM Teams WHERE Name = 'Cabo Verde'), 0, 0),
('2026-06-15 19:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Arabia Saudita'), (SELECT Id FROM Teams WHERE Name = 'Uruguai'), 0, 0),
('2026-06-15 16:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Belgica'), (SELECT Id FROM Teams WHERE Name = 'Egito'), 0, 0),
('2026-06-15 22:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Ira'), (SELECT Id FROM Teams WHERE Name = 'Nova Zelandia'), 0, 0),

-- Terça-feira, 16 de junho de 2026
('2026-06-17 01:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Austria'), (SELECT Id FROM Teams WHERE Name = 'Jordania'), 0, 0),
('2026-06-16 16:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Franca'), (SELECT Id FROM Teams WHERE Name = 'Senegal'), 0, 0),
('2026-06-16 19:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Iraque'), (SELECT Id FROM Teams WHERE Name = 'Noruega'), 0, 0),
('2026-06-16 22:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Argentina'), (SELECT Id FROM Teams WHERE Name = 'Argelia'), 0, 0),

-- Quarta-feira, 17 de junho de 2026
('2026-06-17 14:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Portugal'), (SELECT Id FROM Teams WHERE Name = 'Jamaica'), 0, 0),
('2026-06-17 17:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Inglaterra'), (SELECT Id FROM Teams WHERE Name = 'Croacia'), 0, 0),
('2026-06-17 20:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Gana'), (SELECT Id FROM Teams WHERE Name = 'Panama'), 0, 0),
('2026-06-17 21:00:00', 0, 0, (SELECT Id FROM Teams WHERE Name = 'Uzbequistão'), (SELECT Id FROM Teams WHERE Name = 'Colombia'), 0, 0);

INSERT INTO Matches (MatchDate, Stage, Status, HomeTeamId, AwayTeamId, HomeTeamScore, AwayTeamScore) VALUES
-- Quinta-feira, 18 de junho de 2026
('2026-06-18 13:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Dinamarca'), (SELECT Id FROM Teams WHERE Name = 'Africa do Sul'), 0, 0),
('2026-06-18 16:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Suica'), (SELECT Id FROM Teams WHERE Name = 'Italia'), 0, 0),
('2026-06-18 19:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Canada'), (SELECT Id FROM Teams WHERE Name = 'Catar'), 0, 0),
('2026-06-18 22:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Mexico'), (SELECT Id FROM Teams WHERE Name = 'Coreia do Sul'), 0, 0),

-- Sexta-feira, 19 de junho de 2026
('2026-06-19 01:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Eslovaquia'), (SELECT Id FROM Teams WHERE Name = 'Paraguai'), 0, 0),
('2026-06-19 16:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Estados Unidos'), (SELECT Id FROM Teams WHERE Name = 'Australia'), 0, 0),
('2026-06-19 19:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Escocia'), (SELECT Id FROM Teams WHERE Name = 'Marrocos'), 0, 0),
('2026-06-19 22:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Brasil'), (SELECT Id FROM Teams WHERE Name = 'Haiti'), 0, 0),

-- Sábado, 20 de junho de 2026
('2026-06-20 23:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Tunisia'), (SELECT Id FROM Teams WHERE Name = 'Japao'), 0, 0),
('2026-06-20 14:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Paises Baixos'), (SELECT Id FROM Teams WHERE Name = 'Polonia'), 0, 0),
('2026-06-20 17:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Alemanha'), (SELECT Id FROM Teams WHERE Name = 'Egito'), 0, 0),
('2026-06-20 21:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Equador'), (SELECT Id FROM Teams WHERE Name = 'Curaçau'), 0, 0),

-- Domingo, 21 de junho de 2026
('2026-06-21 13:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Espanha'), (SELECT Id FROM Teams WHERE Name = 'Arabia Saudita'), 0, 0),
('2026-06-21 16:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Belgica'), (SELECT Id FROM Teams WHERE Name = 'Ira'), 0, 0),
('2026-06-21 19:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Uruguai'), (SELECT Id FROM Teams WHERE Name = 'Cabo Verde'), 0, 0),
('2026-06-21 22:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Nova Zelandia'), (SELECT Id FROM Teams WHERE Name = 'Egito'), 0, 0),

-- Segunda-feira, 22 de junho de 2026
('2026-06-22 14:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Argentina'), (SELECT Id FROM Teams WHERE Name = 'Austria'), 0, 0),
('2026-06-22 18:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Franca'), (SELECT Id FROM Teams WHERE Name = 'Bolivia'), 0, 0),
('2026-06-22 21:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Noruega'), (SELECT Id FROM Teams WHERE Name = 'Senegal'), 0, 0),
('2026-06-23 00:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Jordania'), (SELECT Id FROM Teams WHERE Name = 'Argelia'), 0, 0),

-- Terça-feira, 23 de junho de 2026
('2026-06-23 14:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Portugal'), (SELECT Id FROM Teams WHERE Name = 'Uzbequistão'), 0, 0),
('2026-06-23 17:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Inglaterra'), (SELECT Id FROM Teams WHERE Name = 'Gana'), 0, 0),
('2026-06-23 20:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Panama'), (SELECT Id FROM Teams WHERE Name = 'Croacia'), 0, 0),
('2026-06-23 23:00:00', 1, 0, (SELECT Id FROM Teams WHERE Name = 'Colombia'), (SELECT Id FROM Teams WHERE Name = 'Jamaica'), 0, 0);

INSERT INTO Matches (MatchDate, Stage, Status, HomeTeamId, AwayTeamId, HomeTeamScore, AwayTeamScore) VALUES
-- Quarta-feira, 24 de junho de 2026
('2026-06-24 16:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Suica'), (SELECT Id FROM Teams WHERE Name = 'Canada'), 0, 0),
('2026-06-24 16:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Italia'), (SELECT Id FROM Teams WHERE Name = 'Catar'), 0, 0),
('2026-06-24 19:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Escocia'), (SELECT Id FROM Teams WHERE Name = 'Brasil'), 0, 0),
('2026-06-24 19:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Marrocos'), (SELECT Id FROM Teams WHERE Name = 'Haiti'), 0, 0),
('2026-06-24 20:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Dinamarca'), (SELECT Id FROM Teams WHERE Name = 'Mexico'), 0, 0),
('2026-06-24 22:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Africa do Sul'), (SELECT Id FROM Teams WHERE Name = 'Coreia do Sul'), 0, 0),

-- Quinta-feira, 25 de junho de 2026
('2026-06-25 17:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Equador'), (SELECT Id FROM Teams WHERE Name = 'Alemanha'), 0, 0),
('2026-06-25 17:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Curaçau'), (SELECT Id FROM Teams WHERE Name = 'Costa do Marfim'), 0, 0),
('2026-06-25 20:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Japao'), (SELECT Id FROM Teams WHERE Name = 'Polonia'), 0, 0),
('2026-06-25 20:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Tunisia'), (SELECT Id FROM Teams WHERE Name = 'Paises Baixos'), 0, 0),
('2026-06-25 23:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Eslovaquia'), (SELECT Id FROM Teams WHERE Name = 'Estados Unidos'), 0, 0),
('2026-06-25 23:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Paraguai'), (SELECT Id FROM Teams WHERE Name = 'Australia'), 0, 0),

-- Sexta-feira, 26 de junho de 2026
('2026-06-26 16:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Noruega'), (SELECT Id FROM Teams WHERE Name = 'Franca'), 0, 0),
('2026-06-26 16:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Senegal'), (SELECT Id FROM Teams WHERE Name = 'Iraque'), 0, 0),
('2026-06-26 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Cabo Verde'), (SELECT Id FROM Teams WHERE Name = 'Arabia Saudita'), 0, 0),
('2026-06-26 21:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Uruguai'), (SELECT Id FROM Teams WHERE Name = 'Espanha'), 0, 0),
('2026-06-27 00:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Egito'), (SELECT Id FROM Teams WHERE Name = 'Ira'), 0, 0),
('2026-06-27 00:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Nova Zelandia'), (SELECT Id FROM Teams WHERE Name = 'Belgica'), 0, 0),

-- Sábado, 27 de junho de 2026
('2026-06-27 18:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Panama'), (SELECT Id FROM Teams WHERE Name = 'Inglaterra'), 0, 0),
('2026-06-27 18:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Croacia'), (SELECT Id FROM Teams WHERE Name = 'Gana'), 0, 0),
('2026-06-27 20:30:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Colombia'), (SELECT Id FROM Teams WHERE Name = 'Portugal'), 0, 0),
('2026-06-27 20:30:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Jamaica'), (SELECT Id FROM Teams WHERE Name = 'Uzbequistão'), 0, 0),
('2026-06-27 23:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Argelia'), (SELECT Id FROM Teams WHERE Name = 'Austria'), 0, 0),
('2026-06-27 23:00:00', 2, 0, (SELECT Id FROM Teams WHERE Name = 'Jordania'), (SELECT Id FROM Teams WHERE Name = 'Argentina'), 0, 0);

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