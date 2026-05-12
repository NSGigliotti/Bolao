
// ============================================================
// Critérios de Desempate FIFA 2026 - Fase de Grupos
// Atualizado com lógica Greedy para 3º colocados e Prioridade Sede
// ============================================================

export const FIFA_RANKINGS = {
    "franca": 1877.32, "espanha": 1876.40, "argentina": 1874.81, "inglaterra": 1825.97, "portugal": 1763.83,
    "brasil": 1761.16, "paises baixos": 1757.87, "marrocos": 1755.87, "belgica": 1734.71, "alemanha": 1730.37,
    "croacia": 1717.07, "italia": 1700.37, "colombia": 1693.09, "senegal": 1688.99, "mexico": 1681.03,
    "estados unidos": 1673.13, "uruguai": 1673.07, "japao": 1660.43, "suica": 1649.40, "dinamarca": 1620.81,
    "ira": 1615.30, "turquia": 1599.03, "equador": 1594.79, "austria": 1593.45, "coreia do sul": 1588.67,
    "nigeria": 1585.08, "australia": 1580.68, "argelia": 1564.26, "egito": 1563.24, "canada": 1556.48,
    "noruega": 1550.95, "ucrania": 1546.88, "panama": 1540.64, "costa do marfim": 1532.97, "polonia": 1528.00,
    "russia": 1525.60, "suecia": 1514.77, "republica tcheca": 1513.74, "pais de gales": 1511.90, "servia": 1508.65,
    "paraguai": 1503.51, "hungria": 1500.58, "escocia": 1498.35, "tunisia": 1483.05, "camaroes": 1481.24,
    "rd congo": 1479.64, "grecia": 1475.82, "eslovaquia": 1473.94, "uzbequistao": 1469.40, "venezuela": 1463.03,
    "catar": 1458.00, "costa rica": 1456.20, "arabia saudita": 1443.53, "peru": 1442.29, "eslovenia": 1427.84,
    "mali": 1427.11, "jamaica": 1425.84, "iraque": 1420.47, "africa do sul": 1410.23, "irlanda": 1403.84,
    "finlandia": 1394.73, "burkina faso": 1390.38, "romenia": 1388.25, "cabo verde": 1383.44, "chile": 1380.00,
    "albania": 1379.40, "emirados arabes unidos": 1366.45, "gana": 1358.77, "macedonia do norte": 1354.19, "montenegro": 1351.72,
    "jordania": 1350.21, "bolivia": 1347.21, "islandia": 1346.82, "bosnia e herzegovina": 1343.32, "irlanda do norte": 1341.05,
    "georgia": 1333.76, "honduras": 1331.07, "israel": 1311.39, "el salvador": 1306.14, "guine": 1305.92,
    "oma": 1305.00, "bahrein": 1302.86, "gabao": 1289.52, "bulgaria": 1289.17, "zambia": 1278.26,
    "uganda": 1275.11, "angola": 1275.00, "siria": 1265.51, "china": 1264.44, "haiti": 1262.50,
    "curacao": 1262.48, "guine equatorial": 1260.50, "armenia": 1229.18, "benin": 1225.10, "palestina": 1224.23,
    "trindade e tobago": 1220.65, "quirguistao": 1218.48, "tadjiquistao": 1216.76, "libano": 1210.60, "nova zelandia": 1204.16
};

const removeDiacritics = (text) => {
    if (!text) return "";
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getFifaRanking = (name) => {
    if (!name) return 0;
    const normalized = removeDiacritics(name).toLowerCase().trim();
    return FIFA_RANKINGS[normalized] || 0.0;
};

const isHostNation = (name) => {
    const normalized = removeDiacritics(name).toLowerCase().trim();
    return normalized === "mexico" || normalized === "estados unidos" || normalized === "canada";
};

const resolveMatchScore = (match, predictions) => {
    const pred = predictions[match.id];
    if (pred && pred.home !== undefined && pred.away !== undefined && pred.home !== '' && pred.away !== '') {
        return { home: parseInt(pred.home), away: parseInt(pred.away) };
    }
    if (match.status === 2 || (match.homeTeamScore !== null && match.awayTeamScore !== null)) {
        return { home: match.homeTeamScore, away: match.awayTeamScore };
    }
    return null;
};

const getHeadToHeadStats = (teamIds, groupMatches, predictions) => {
    const teamIdSet = new Set(teamIds);
    const stats = {};
    teamIds.forEach(id => { stats[id] = { points: 0, goalsFor: 0, goalsAgainst: 0 }; });

    groupMatches.forEach(match => {
        if (!match.homeTeam || !match.awayTeam) return;
        const hId = match.homeTeamId;
        const aId = match.awayTeamId;
        if (!teamIdSet.has(hId) || !teamIdSet.has(aId)) return;

        const score = resolveMatchScore(match, predictions);
        if (!score) return;

        stats[hId].goalsFor += score.home;
        stats[hId].goalsAgainst += score.away;
        stats[aId].goalsFor += score.away;
        stats[aId].goalsAgainst += score.home;

        if (score.home > score.away) stats[hId].points += 3;
        else if (score.home < score.away) stats[aId].points += 3;
        else { stats[hId].points += 1; stats[aId].points += 1; }
    });
    return stats;
};

const resolveTiedTeams = (tiedTeams, groupMatches, predictions) => {
    if (tiedTeams.length <= 1) return tiedTeams;

    const teamIds = tiedTeams.map(t => t.id);
    const h2h = getHeadToHeadStats(teamIds, groupMatches, predictions);

    // Adiciona stats H2H temporárias
    const withH2H = tiedTeams.map(t => ({
        ...t,
        h2hPoints: h2h[t.id].points,
        h2hGD: h2h[t.id].goalsFor - h2h[t.id].goalsAgainst,
        h2hGF: h2h[t.id].goalsFor,
    }));

    withH2H.sort((a, b) => {
        // 1. Saldo Geral
        const gdA = a.goalsFor - a.goalsAgainst;
        const gdB = b.goalsFor - b.goalsAgainst;
        if (gdB !== gdA) return gdB - gdA;
        // 2. Gols Pró Geral
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        // 3. Vitórias Geral
        if (b.wins !== a.wins) return b.wins - a.wins;
        // 4. Confronto Direto
        if (b.h2hPoints !== a.h2hPoints) return b.h2hPoints - a.h2hPoints;
        if (b.h2hGD !== a.h2hGD) return b.h2hGD - a.h2hGD;
        if (b.h2hGF !== a.h2hGF) return b.h2hGF - a.h2hGF;
        // 5. País Sede
        const hostA = isHostNation(a.name) ? 1 : 0;
        const hostB = isHostNation(b.name) ? 1 : 0;
        if (hostB !== hostA) return hostB - hostA;
        // 6. Ranking FIFA
        const rankA = getFifaRanking(a.name);
        const rankB = getFifaRanking(b.name);
        if (rankB !== rankA) return rankB - rankA;
        // Desempate de software
        return a.name.localeCompare(b.name);
    });

    return withH2H;
};

const sortByFifaCriteria = (teamsArray, groupMatches, predictions) => {
    teamsArray.sort((a, b) => b.points - a.points);
    const result = [];
    let i = 0;
    while (i < teamsArray.length) {
        let j = i + 1;
        while (j < teamsArray.length && teamsArray[j].points === teamsArray[i].points) j++;
        const samePointsGroup = teamsArray.slice(i, j);
        if (samePointsGroup.length === 1) result.push(samePointsGroup[0]);
        else result.push(...resolveTiedTeams(samePointsGroup, groupMatches, predictions));
        i = j;
    }
    return result;
};

export const calculateStandings = (matches, predictions) => {
    const teams = {};
    const initTeam = (id, name, group, flagUrl) => {
        if (!teams[id]) {
            teams[id] = {
                id, name, group, flagUrl,
                points: 0, goalsFor: 0, goalsAgainst: 0,
                wins: 0, draws: 0, losses: 0, matchesPlayed: 0,
            };
        }
    };

    const groupMatches = matches.filter(m => m.stage <= 2);
    groupMatches.forEach(match => {
        if (!match.homeTeam || !match.awayTeam) return;
        initTeam(match.homeTeamId, match.homeTeam.name, match.homeTeam.group, match.homeTeam.flagUrl);
        initTeam(match.awayTeamId, match.awayTeam.name, match.awayTeam.group, match.awayTeam.flagUrl);

        const score = resolveMatchScore(match, predictions);
        if (score) {
            const home = teams[match.homeTeamId];
            const away = teams[match.awayTeamId];
            home.matchesPlayed++; away.matchesPlayed++;
            home.goalsFor += score.home; home.goalsAgainst += score.away;
            away.goalsFor += score.away; away.goalsAgainst += score.home;

            if (score.home > score.away) { home.points += 3; home.wins++; away.losses++; }
            else if (score.home < score.away) { away.points += 3; away.wins++; home.losses++; }
            else { home.points += 1; away.points += 1; home.draws++; away.draws++; }
        }
    });

    const teamsByGroup = {};
    Object.values(teams).forEach(t => {
        if (!teamsByGroup[t.group]) teamsByGroup[t.group] = [];
        teamsByGroup[t.group].push(t);
    });

    const sortedTeams = [];
    Object.keys(teamsByGroup).sort().forEach(group => {
        const groupTeams = teamsByGroup[group];
        const thisGroupMatches = groupMatches.filter(m => m.homeTeam && m.homeTeam.group === group);
        sortedTeams.push(...sortByFifaCriteria(groupTeams, thisGroupMatches, predictions));
    });
    return sortedTeams;
};

export const getQualifiers = (standings, matches, predictions) => {
    const groups = {};
    standings.forEach(t => {
        if (!groups[t.group]) groups[t.group] = [];
        groups[t.group].push(t);
    });

    const firstPlace = {};
    const secondPlace = {};
    const thirdPlace = [];

    const groupKeys = Object.keys(groups);
    let fullyCompletedGroups = 0;
    const groupMatches = matches ? matches.filter(m => m.stage <= 2) : [];

    groupKeys.forEach(g => {
        const teamList = groups[g];
        const isGroupComplete = teamList.length === 4 && teamList.every(t => t.matchesPlayed === 3);

        if (isGroupComplete) {
            fullyCompletedGroups++;
            const thisGroupMatches = groupMatches.filter(m => m.homeTeam && m.homeTeam.group === g);
            const sorted = sortByFifaCriteria([...teamList], thisGroupMatches, predictions || {});
            if (sorted[0]) firstPlace[g] = sorted[0];
            if (sorted[1]) secondPlace[g] = sorted[1];
            if (sorted[2]) thirdPlace.push(sorted[2]);
        }
    });

    let bestThirds = [];
    if (fullyCompletedGroups === 12 && thirdPlace.length >= 8) {
        // Ordena os 12 terceiros usando a mesma lógica (Pontos > Saldo > Gols > Vitória > Sede > FIFA)
        thirdPlace.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            const gdA = a.goalsFor - a.goalsAgainst;
            const gdB = b.goalsFor - b.goalsAgainst;
            if (gdB !== gdA) return gdB - gdA;
            if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
            if (b.wins !== a.wins) return b.wins - a.wins;
            const hostA = isHostNation(a.name) ? 1 : 0;
            const hostB = isHostNation(b.name) ? 1 : 0;
            if (hostB !== hostA) return hostB - hostA;
            const rankA = getFifaRanking(a.name);
            const rankB = getFifaRanking(b.name);
            if (rankB !== rankA) return rankB - rankA;
            return a.name.localeCompare(b.name);
        });
        bestThirds = thirdPlace.slice(0, 8);
    }

    return { firstPlace, secondPlace, bestThirds };
};

export const BRACKET_MAP = {
    // 32-avos
    73: { home: '2A', away: '2B' },         74: { home: '1E', away: '3rd_74' },
    75: { home: '1F', away: '2C' },         76: { home: '1C', away: '2F' },
    77: { home: '1I', away: '3rd_77' },     78: { home: '2E', away: '2I' },
    79: { home: '1A', away: '3rd_79' },     80: { home: '1L', away: '3rd_80' },
    81: { home: '1D', away: '3rd_81' },     82: { home: '1G', away: '3rd_82' },
    83: { home: '2K', away: '2L' },         84: { home: '1H', away: '2J' },
    85: { home: '1B', away: '3rd_85' },     86: { home: '1J', away: '2H' },
    87: { home: '1K', away: '3rd_87' },     88: { home: '2D', away: '2G' },
    // Oitavas
    89: { home: 'W73', away: 'W75' }, 90: { home: 'W74', away: 'W76' },
    91: { home: 'W77', away: 'W79' }, 92: { home: 'W78', away: 'W80' },
    93: { home: 'W81', away: 'W83' }, 94: { home: 'W82', away: 'W84' },
    95: { home: 'W85', away: 'W87' }, 96: { home: 'W86', away: 'W88' },
    // Quartas
    97: { home: 'W89', away: 'W91' }, 98: { home: 'W90', away: 'W92' },
    99: { home: 'W93', away: 'W95' }, 100: { home: 'W94', away: 'W96' },
    // Semi
    101: { home: 'W97', away: 'W99' }, 102: { home: 'W98', away: 'W100' },
    // 3º Lugar e Final
    103: { home: 'L101', away: 'L102' }, 104: { home: 'W101', away: 'W102' }
};

export const simulateKnockout = (matches, predictions) => {
    const standings = calculateStandings(matches, predictions);
    const { firstPlace, secondPlace, bestThirds } = getQualifiers(standings, matches, predictions);

    const qualMap = {};
    Object.keys(firstPlace).forEach(g => qualMap[`1${g}`] = firstPlace[g]);
    Object.keys(secondPlace).forEach(g => qualMap[`2${g}`] = secondPlace[g]);

    // Greedy Third Place Assignment
    const availableThirds = [...bestThirds];
    const thirdPlaceSlots = [
        { matchId: 74, allowed: 'ABCDF', key: '3rd_74' },
        { matchId: 77, allowed: 'CDFGH', key: '3rd_77' },
        { matchId: 79, allowed: 'CEFHI', key: '3rd_79' },
        { matchId: 80, allowed: 'EHIJK', key: '3rd_80' },
        { matchId: 81, allowed: 'BEFIJ', key: '3rd_81' },
        { matchId: 82, allowed: 'AEHIJ', key: '3rd_82' },
        { matchId: 85, allowed: 'EFGIJ', key: '3rd_85' },
        { matchId: 87, allowed: 'DEIJL', key: '3rd_87' }
    ];

    thirdPlaceSlots.forEach(slot => {
        const teamIndex = availableThirds.findIndex(t => slot.allowed.includes(t.group));
        if (teamIndex !== -1) {
            qualMap[slot.key] = availableThirds[teamIndex];
            availableThirds.splice(teamIndex, 1);
        }
    });
    
    // Fallback if strict slots didn't match
    thirdPlaceSlots.forEach(slot => {
        if (!qualMap[slot.key] && availableThirds.length > 0) {
            qualMap[slot.key] = availableThirds.shift();
        }
    });

    const simulatedTeams = {};
    const knockoutMatches = matches.filter(m => m.id >= 73).sort((a, b) => a.id - b.id);

    knockoutMatches.forEach(match => {
        const rule = BRACKET_MAP[match.id];
        if (!rule) return;
        const homeTeam = resolveSource(rule.home, qualMap, simulatedTeams, predictions);
        const awayTeam = resolveSource(rule.away, qualMap, simulatedTeams, predictions);
        simulatedTeams[match.id] = { homeTeam, awayTeam };
    });

    return simulatedTeams;
};

const resolveSource = (source, qualMap, simulatedTeams, predictions) => {
    if (!source) return null;
    if (qualMap[source]) return qualMap[source];
    if (source.startsWith('W')) return getWinner(parseInt(source.substring(1)), simulatedTeams, predictions);
    if (source.startsWith('L')) return getLoser(parseInt(source.substring(1)), simulatedTeams, predictions);
    return null;
};

const getWinner = (matchId, simulatedTeams, predictions) => {
    const match = simulatedTeams[matchId];
    if (!match || !match.homeTeam || !match.awayTeam) return null;
    const pred = predictions[matchId];
    if (pred && pred.home !== undefined && pred.away !== undefined && pred.home !== '' && pred.away !== '') {
        if (parseInt(pred.home) > parseInt(pred.away)) return match.homeTeam;
        if (parseInt(pred.away) > parseInt(pred.home)) return match.awayTeam;
        return match.homeTeam; // Default Home
    }
    return null;
};

const getLoser = (matchId, simulatedTeams, predictions) => {
    const match = simulatedTeams[matchId];
    if (!match || !match.homeTeam || !match.awayTeam) return null;
    const pred = predictions[matchId];
    if (pred && pred.home !== undefined && pred.away !== undefined && pred.home !== '' && pred.away !== '') {
        const hScore = parseInt(pred.home);
        const aScore = parseInt(pred.away);
        if (hScore > aScore) return match.awayTeam;
        if (aScore > hScore) return match.homeTeam;
        return match.awayTeam; // Default Away
    }
    return null;
};
