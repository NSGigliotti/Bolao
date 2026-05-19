export const knockoutMatches = {
    73: { home: "2º colocado Grupo A", away: "2º colocado Grupo B" },
    74: { home: "Vencedor Grupo E", away: "3º colocado A/B/C/D/F" },
    75: { home: "Vencedor Grupo F", away: "2º colocado Grupo C" },
    76: { home: "Vencedor Grupo C", away: "2º colocado Grupo F" },
    77: { home: "Vencedor Grupo I", away: "3º colocado C/D/F/G/H" },
    78: { home: "2º colocado Grupo E", away: "2º colocado Grupo I" },
    79: { home: "Vencedor Grupo A", away: "3º colocado C/E/F/H/I" },
    80: { home: "Vencedor Grupo L", away: "3º colocado E/H/I/J/K" },
    81: { home: "Vencedor Grupo D", away: "3º colocado B/E/F/I/J" },
    82: { home: "Vencedor Grupo G", away: "3º colocado A/E/H/I/J" },
    83: { home: "2º colocado Grupo K", away: "2º colocado Grupo L" },
    84: { home: "Vencedor Grupo H", away: "2º colocado Grupo J" },
    85: { home: "Vencedor Grupo B", away: "3º colocado E/F/G/I/J" },
    86: { home: "Vencedor Grupo J", away: "2º colocado Grupo H" },
    87: { home: "Vencedor Grupo K", away: "3º colocado D/E/I/J/L" },
    88: { home: "2º colocado Grupo D", away: "2º colocado Grupo G" },
    
    89: { home: "Vencedor do jogo 74", away: "Vencedor do jogo 77" },
    90: { home: "Vencedor do jogo 73", away: "Vencedor do jogo 75" },
    91: { home: "Vencedor do jogo 76", away: "Vencedor do jogo 78" },
    92: { home: "Vencedor do jogo 79", away: "Vencedor do jogo 80" },
    93: { home: "Vencedor do jogo 83", away: "Vencedor do jogo 84" },
    94: { home: "Vencedor do jogo 81", away: "Vencedor do jogo 82" },
    95: { home: "Vencedor do jogo 86", away: "Vencedor do jogo 88" },
    96: { home: "Vencedor do jogo 85", away: "Vencedor do jogo 87" },

    97: { home: "Vencedor do jogo 89", away: "Vencedor do jogo 90" },
    98: { home: "Vencedor do jogo 93", away: "Vencedor do jogo 94" },
    99: { home: "Vencedor do jogo 91", away: "Vencedor do jogo 92" },
    100: { home: "Vencedor do jogo 95", away: "Vencedor do jogo 96" },

    101: { home: "Vencedor do jogo 97", away: "Vencedor do jogo 98" },
    102: { home: "Vencedor do jogo 99", away: "Vencedor do jogo 100" },

    103: { home: "Perdedor do jogo 101", away: "Perdedor do jogo 102" },
    104: { home: "Vencedor do jogo 101", away: "Vencedor do jogo 102" }
};

export const getMatchLabel = (matchId, stage) => {
    if (matchId >= 73 && matchId <= 104) {
        return `Jogo ${matchId}`;
    }
    return stage || "";
};

export const getTeamDescription = (matchId, type) => {
    const matchInfo = knockoutMatches[matchId];
    if (matchInfo) {
        return type === 'home' ? matchInfo.home : matchInfo.away;
    }
    return "A Definir";
};
