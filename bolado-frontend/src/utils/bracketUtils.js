
// ============================================================
// Critérios de Desempate FIFA 2026 - Fase de Grupos
// https://www.fifa.com/pt/tournaments/mens/worldcup/canadamexicousa2026/articles/copa-mundo-grupos-regulamento-classificacao-desempate
//
// Hierarquia:
// 1. Pontos totais
// 2. Confronto direto: pontos entre empatados
// 3. Confronto direto: saldo de gols entre empatados
// 4. Confronto direto: gols marcados entre empatados
//    (reaplicar entre subgrupo ainda empatado)
// 5. Saldo de gols geral
// 6. Gols marcados geral
// 7. Fair Play (não implementado - sem dados de cartões)
// 8. Ranking FIFA (não implementado - sem dados)
// ============================================================

/**
 * Resolve o placar de um jogo, priorizando palpite do usuário.
 */
const resolveMatchScore = (match, predictions) => {
    const pred = predictions[match.id];

    if (pred && pred.home !== undefined && pred.away !== undefined) {
        return { home: parseInt(pred.home), away: parseInt(pred.away) };
    }

    if (match.status === 2 || (match.homeTeamScore !== null && match.awayTeamScore !== null)) {
        return { home: match.homeTeamScore, away: match.awayTeamScore };
    }

    return null;
};

/**
 * Calcula stats de confronto direto entre um subconjunto de times.
 * Retorna mapa teamId -> { points, goalsFor, goalsAgainst }
 */
const getHeadToHeadStats = (teamIds, groupMatches, predictions) => {
    const teamIdSet = new Set(teamIds);
    const stats = {};

    teamIds.forEach(id => {
        stats[id] = { points: 0, goalsFor: 0, goalsAgainst: 0 };
    });

    groupMatches.forEach(match => {
        if (!match.homeTeam || !match.awayTeam) return;

        const hId = match.homeTeamId;
        const aId = match.awayTeamId;

        // Só considerar jogos entre os times empatados
        if (!teamIdSet.has(hId) || !teamIdSet.has(aId)) return;

        const score = resolveMatchScore(match, predictions);
        if (!score || score.home === undefined || score.away === undefined) return;

        stats[hId].goalsFor += score.home;
        stats[hId].goalsAgainst += score.away;
        stats[aId].goalsFor += score.away;
        stats[aId].goalsAgainst += score.home;

        if (score.home > score.away) {
            stats[hId].points += 3;
        } else if (score.home < score.away) {
            stats[aId].points += 3;
        } else {
            stats[hId].points += 1;
            stats[aId].points += 1;
        }
    });

    return stats;
};

/**
 * Ordena um array de times pelo critério geral (sem confronto direto).
 * Usado para melhores terceiros (grupos diferentes) e como fallback final.
 */
const sortByOverallCriteria = (a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    // Desempate final determinístico (nome alfabético)
    return a.name.localeCompare(b.name);
};

/**
 * Aplica os critérios FIFA de desempate a um grupo de times empatados em pontos.
 * Retorna o array ordenado.
 * 
 * @param {Array} tiedTeams - Times com mesma pontuação
 * @param {Array} groupMatches - Todos os jogos do grupo (filtrados por grupo)
 * @param {Object} predictions - Palpites do usuário
 * @returns {Array} Times ordenados segundo critérios FIFA
 */
const resolveTiedTeams = (tiedTeams, groupMatches, predictions) => {
    if (tiedTeams.length <= 1) return tiedTeams;

    const teamIds = tiedTeams.map(t => t.id);
    const h2h = getHeadToHeadStats(teamIds, groupMatches, predictions);

    // Tentar resolver por confronto direto: pontos → saldo → gols marcados
    const withH2H = tiedTeams.map(t => ({
        ...t,
        h2hPoints: h2h[t.id].points,
        h2hGD: h2h[t.id].goalsFor - h2h[t.id].goalsAgainst,
        h2hGF: h2h[t.id].goalsFor,
    }));

    withH2H.sort((a, b) => {
        if (b.h2hPoints !== a.h2hPoints) return b.h2hPoints - a.h2hPoints;
        if (b.h2hGD !== a.h2hGD) return b.h2hGD - a.h2hGD;
        if (b.h2hGF !== a.h2hGF) return b.h2hGF - a.h2hGF;
        return 0; // Ainda empatados após confronto direto
    });

    // Verificar se o confronto direto resolveu totalmente
    // Agrupar os que ainda ficaram empatados após H2H
    const result = [];
    let i = 0;
    while (i < withH2H.length) {
        let j = i + 1;
        while (j < withH2H.length &&
            withH2H[j].h2hPoints === withH2H[i].h2hPoints &&
            withH2H[j].h2hGD === withH2H[i].h2hGD &&
            withH2H[j].h2hGF === withH2H[i].h2hGF) {
            j++;
        }

        const stillTied = withH2H.slice(i, j);

        if (stillTied.length === 1) {
            result.push(stillTied[0]);
        } else if (stillTied.length < tiedTeams.length) {
            // Subgrupo menor ainda empatado — reaplicar confronto direto entre eles
            const resolved = resolveTiedTeams(stillTied, groupMatches, predictions);
            result.push(...resolved);
        } else {
            // Todos ainda empatados após H2H — aplicar critérios gerais (saldo geral → gols gerais)
            stillTied.sort((a, b) => {
                const gdA = a.goalsFor - a.goalsAgainst;
                const gdB = b.goalsFor - b.goalsAgainst;
                if (gdB !== gdA) return gdB - gdA;
                if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
                // Desempate final determinístico
                return a.name.localeCompare(b.name);
            });
            result.push(...stillTied);
        }

        i = j;
    }

    return result;
};

/**
 * Ordena times de um grupo usando critérios FIFA 2026.
 * 
 * @param {Array} teamsArray - Times do grupo
 * @param {Array} groupMatches - Jogos do grupo
 * @param {Object} predictions - Palpites
 * @returns {Array} Times ordenados
 */
const sortByFifaCriteria = (teamsArray, groupMatches, predictions) => {
    // Primeiro, ordenar por pontos
    teamsArray.sort((a, b) => b.points - a.points);

    // Agrupar times com mesma pontuação
    const result = [];
    let i = 0;
    while (i < teamsArray.length) {
        let j = i + 1;
        while (j < teamsArray.length && teamsArray[j].points === teamsArray[i].points) {
            j++;
        }

        const samePointsGroup = teamsArray.slice(i, j);

        if (samePointsGroup.length === 1) {
            result.push(samePointsGroup[0]);
        } else {
            // Aplicar critérios FIFA de desempate
            const resolved = resolveTiedTeams(samePointsGroup, groupMatches, predictions);
            result.push(...resolved);
        }

        i = j;
    }

    return result;
};

export const calculateStandings = (matches, predictions) => {
    // Collect all teams and their initial stats
    const teams = {};

    // Helper to init team
    const initTeam = (id, name, group, flagUrl) => {
        if (!teams[id]) {
            teams[id] = {
                id,
                name,
                group,
                flagUrl,
                points: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                matchesPlayed: 0,
            };
        }
    };

    // Filter only group matches (Stage 0, 1, 2)
    const groupMatches = matches.filter(m => m.stage <= 2);

    groupMatches.forEach(match => {
        // Guard: skip if teams are missing (e.g. malformed data)
        if (!match.homeTeam || !match.awayTeam) return;

        initTeam(match.homeTeamId, match.homeTeam.name, match.homeTeam.group, match.homeTeam.flagUrl);
        initTeam(match.awayTeamId, match.awayTeam.name, match.awayTeam.group, match.awayTeam.flagUrl);

        const score = resolveMatchScore(match, predictions);

        if (score && score.home !== undefined && score.away !== undefined) {
            const home = teams[match.homeTeamId];
            const away = teams[match.awayTeamId];

            home.matchesPlayed++;
            away.matchesPlayed++;
            home.goalsFor += score.home;
            home.goalsAgainst += score.away;
            away.goalsFor += score.away;
            away.goalsAgainst += score.home;

            if (score.home > score.away) {
                home.points += 3;
                home.wins++;
                away.losses++;
            } else if (score.home < score.away) {
                away.points += 3;
                away.wins++;
                home.losses++;
            } else {
                home.points += 1;
                away.points += 1;
                home.draws++;
                away.draws++;
            }
        }
    });

    // Agrupar por grupo e aplicar critérios FIFA dentro de cada grupo
    const teamsByGroup = {};
    Object.values(teams).forEach(t => {
        if (!teamsByGroup[t.group]) teamsByGroup[t.group] = [];
        teamsByGroup[t.group].push(t);
    });

    const sortedTeams = [];
    Object.keys(teamsByGroup).sort().forEach(group => {
        const groupTeams = teamsByGroup[group];
        // Filtrar jogos deste grupo específico
        const thisGroupMatches = groupMatches.filter(m =>
            m.homeTeam && m.homeTeam.group === group
        );
        const sorted = sortByFifaCriteria(groupTeams, thisGroupMatches, predictions);
        sortedTeams.push(...sorted);
    });

    return sortedTeams;
};

export const getQualifiers = (standings, matches, predictions) => {
    // Group teams by group
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

    // Filter group stage matches
    const groupMatches = matches ? matches.filter(m => m.stage <= 2) : [];

    groupKeys.forEach(g => {
        const teamList = groups[g];

        const isGroupComplete = teamList.length === 4 && teamList.every(t => t.matchesPlayed === 3);

        if (isGroupComplete) {
            fullyCompletedGroups++;

            // Filtrar jogos deste grupo
            const thisGroupMatches = groupMatches.filter(m =>
                m.homeTeam && m.homeTeam.group === g
            );

            // Aplicar critérios FIFA
            const sorted = sortByFifaCriteria([...teamList], thisGroupMatches, predictions || {});

            if (sorted[0]) firstPlace[g] = sorted[0];
            if (sorted[1]) secondPlace[g] = sorted[1];
            if (sorted[2]) thirdPlace.push(sorted[2]);
        }
    });

    // Best 3rds: critério geral (sem confronto direto, pois são de grupos diferentes)
    let bestThirds = [];
    if (fullyCompletedGroups === 12) {
        thirdPlace.sort(sortByOverallCriteria);
        bestThirds = thirdPlace.slice(0, 8);
    } else {
        bestThirds = [];
    }

    return { firstPlace, secondPlace, bestThirds };
};

// Bracket Map - simplified based on user's Match 73 hints & 104 matches total
// Mapping Match Number (ID) to sources.
// This is the hard part without the official full table.
// Based on 2026 bracket projections (12 groups):
export const BRACKET_MAP = {
    // Round of 32 (Matches 73-88)
    73: { home: '2A', away: '2B' }, // Confirmed
    74: { home: '1K', away: '1L' }, // Assumption/Placeholder
    75: { home: '1H', away: '2J' },
    76: { home: '1D', away: '3B' }, // Best 3rds usually play 1sts
    77: { home: '1A', away: '3C' },
    78: { home: '1C', away: '2F' },
    79: { home: '1G', away: '2K' },
    80: { home: '1F', away: '2D' },
    81: { home: '1B', away: '3E' },
    82: { home: '1E', away: '3A' },
    83: { home: '1I', away: '3G' },
    84: { home: '1J', away: '2H' },
    85: { home: '2E', away: '2I' },
    86: { home: '2C', away: '2G' },
    87: { home: '1L', away: '3H' }, // Fixed: 1L vs ?
    88: { home: '2L', away: '2F' }, // Placeholder

    // Round of 16 (Matches 89-96)
    // Typically Winner 73 vs Winner 74, etc. - CHECK SQL SEQUENCE
    89: { home: 'W73', away: 'W74' },
    90: { home: 'W75', away: 'W76' },
    91: { home: 'W77', away: 'W78' },
    92: { home: 'W79', away: 'W80' },
    93: { home: 'W81', away: 'W82' },
    94: { home: 'W83', away: 'W84' },
    95: { home: 'W85', away: 'W86' },
    96: { home: 'W87', away: 'W88' },

    // Quarter Finals (Matches 97-100)
    97: { home: 'W89', away: 'W90' },
    98: { home: 'W91', away: 'W92' },
    99: { home: 'W93', away: 'W94' },
    100: { home: 'W95', away: 'W96' },

    // Semi Finals (Matches 101-102)
    101: { home: 'W97', away: 'W98' },
    102: { home: 'W99', away: 'W100' },

    // 3rd Place (Match 103)
    103: { home: 'L101', away: 'L102' },

    // Final (Match 104)
    104: { home: 'W101', away: 'W102' }
};

export const simulateKnockout = (matches, predictions) => {
    // 1. Calculate standings
    const standings = calculateStandings(matches, predictions);

    // 2. Get qualifiers
    const { firstPlace, secondPlace, bestThirds } = getQualifiers(standings, matches, predictions);

    // Helper to find best third from specific groups? 
    // Usually strict table based on combination of groups providing 3rd place.
    // For simplicity, we just take the pool of best 3rds and assign them sequentially or by random slot if strict logic is too complex for this snippet.
    // Let's create a map of "3X" -> Team.
    // Since we don't know exactly which "3rd" string maps to which match without the combination table, 
    // we will map 3rd places available to the slots '3A', '3B', etc. if they qualify.
    // If 3A didn't qualify, we might need a fallback.
    // Simplified: Just match the top available best 3rds to the match slots required.

    // Create a map for quick lookup
    const qualMap = {};
    Object.keys(firstPlace).forEach(g => qualMap[`1${g}`] = firstPlace[g]);
    Object.keys(secondPlace).forEach(g => qualMap[`2${g}`] = secondPlace[g]);

    // Best 3rds mapping is tricky. We'll populate `3A`, `3B` etc IF they are in the top 8.
    // If 3A is NOT in top 8, `3A` is empty? But the bracket expects a team.
    // We will fill the "3X" slots with the actual Top 8 available, distributing them.
    // This is a simplification.
    bestThirds.forEach((t, i) => {
        // Just assigning to generic slots 3A..3H for lack of better logic calculation
        const slots = ['3A', '3B', '3C', '3D', '3E', '3F', '3G', '3H'];
        if (slots[i]) qualMap[slots[i]] = t;
    });

    const simulatedTeams = {}; // MatchID -> { homeTeam: Team, awayTeam: Team }

    // Sort matches by ID to process in order (73...104)
    // Note: Matches array contains ALL matches. We only care about 73+.
    const knockoutMatches = matches.filter(m => m.id >= 73).sort((a, b) => a.id - b.id);

    knockoutMatches.forEach(match => {
        const rule = BRACKET_MAP[match.id];
        if (!rule) return;

        // Resolve Home Team
        let homeTeam = resolveSource(rule.home, qualMap, simulatedTeams, predictions);
        let awayTeam = resolveSource(rule.away, qualMap, simulatedTeams, predictions);

        simulatedTeams[match.id] = { homeTeam, awayTeam };
    });

    return simulatedTeams;
};

const resolveSource = (source, qualMap, simulatedTeams, predictions) => {
    if (!source) return null;

    // Type 1: Group Position (e.g., '1A', '2B')
    if (qualMap[source]) return qualMap[source];

    // Type 2: Match Winner (e.g., 'W73')
    if (source.startsWith('W')) {
        const matchId = parseInt(source.substring(1));
        return getWinner(matchId, simulatedTeams, predictions);
    }

    // Type 3: Match Loser (e.g., 'L101')
    if (source.startsWith('L')) {
        const matchId = parseInt(source.substring(1));
        return getLoser(matchId, simulatedTeams, predictions);
    }

    // Fallback logic for Best 3rds if mapping failed (e.g., source is '3C' but 3C didn't qualify)
    // Try to find ANY best third? 
    if (source.startsWith('3')) {
        // Return null or undefined if exact match not found
        return null;
    }

    return null;
};

const getWinner = (matchId, simulatedTeams, predictions) => {
    // We need to know who played in matchId
    // simulatedTeams[matchId] has { homeTeam, awayTeam } calculated
    const match = simulatedTeams[matchId];
    if (!match || !match.homeTeam || !match.awayTeam) return null;

    const pred = predictions[matchId];
    if (pred && pred.home !== undefined && pred.away !== undefined) {
        if (parseInt(pred.home) > parseInt(pred.away)) return match.homeTeam;
        if (parseInt(pred.away) > parseInt(pred.home)) return match.awayTeam;
        // Penalties? Random for simulation?
        return match.homeTeam; // Default Home
    }
    return null;
};

const getLoser = (matchId, simulatedTeams, predictions) => {
    const match = simulatedTeams[matchId];
    if (!match || !match.homeTeam || !match.awayTeam) return null;

    const pred = predictions[matchId];
    if (pred && pred.home !== undefined && pred.away !== undefined) {
        const hScore = parseInt(pred.home);
        const aScore = parseInt(pred.away);
        if (hScore > aScore) return match.awayTeam;
        if (aScore > hScore) return match.homeTeam;
        return match.awayTeam; // Default Away (loser in case of draw/penalties)
    }
    return null;
};
