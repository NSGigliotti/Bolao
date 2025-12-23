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