
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

    // Iterate through group stage matches (Stage 0, 1, 2 in SQL = Rounds 1, 2, 3 of Group Stage)
    // MatchesModel uses enum MatchStage.GroupStageRound1=0, etc.
    // We assume matches passed here are the raw list from API.

    // Filter only group matches (Stage 0, 1, 2)
    const groupMatches = matches.filter(m => m.stage <= 2);

    groupMatches.forEach(match => {
        // Guard: skip if teams are missing (e.g. malformed data)
        if (!match.homeTeam || !match.awayTeam) return;

        initTeam(match.homeTeamId, match.homeTeam.name, match.homeTeam.group, match.homeTeam.flagUrl);
        initTeam(match.awayTeamId, match.awayTeam.name, match.awayTeam.group, match.awayTeam.flagUrl);

        // Get prediction if exists
        const pred = predictions[match.id];

        // Only calculate if we have a full valid score (predicted or official)
        // If official match is finished (status 2), use official score? 
        // User wants "palpites", so likely use prediction overrides or fallback to official if provided?
        // Let's use predictions primarily for "Simulador".

        let hScore = undefined;
        let aScore = undefined;

        if (pred && pred.home !== undefined && pred.away !== undefined) {
            hScore = parseInt(pred.home);
            aScore = parseInt(pred.away);
        } else if (match.status === 2 || (match.homeTeamScore !== null && match.awayTeamScore !== null)) {
            // Fallback to official result if available and no prediction?
            // Or maybe just ignore? Let's ignore official if we are simulating predictions.
            // Actually user might want to see real standings. Let's use official if no prediction.
            hScore = match.homeTeamScore;
            aScore = match.awayTeamScore;
        }

        if (hScore !== undefined && aScore !== undefined) {
            const home = teams[match.homeTeamId];
            const away = teams[match.awayTeamId];

            home.matchesPlayed++;
            away.matchesPlayed++;
            home.goalsFor += hScore;
            home.goalsAgainst += aScore;
            away.goalsFor += aScore;
            away.goalsAgainst += hScore;

            if (hScore > aScore) {
                home.points += 3;
                home.wins++;
                away.losses++;
            } else if (hScore < aScore) {
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

    // Convert to array and sort
    // Rules: Points > GD > GF > Wins
    const sortedTeams = Object.values(teams).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const gdA = a.goalsFor - a.goalsAgainst;
        const gdB = b.goalsFor - b.goalsAgainst;
        if (gdB !== gdA) return gdB - gdA;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return b.wins - a.wins;
    });

    return sortedTeams;
};

export const getQualifiers = (standings) => {
    // Group teams by group
    const groups = {};
    standings.forEach(t => {
        if (!groups[t.group]) groups[t.group] = [];
        groups[t.group].push(t);
    });

    const firstPlace = {};
    const secondPlace = {};
    const thirdPlace = [];

    // Check total groups expected (12)
    // We can count keys in 'groups' to know how many we have data for
    const groupKeys = Object.keys(groups);
    let fullyCompletedGroups = 0;

    // Sort each group and extract qualifiers ONLY if complete
    groupKeys.forEach(g => {
        const teamList = groups[g];

        // Check completion: All 4 teams must have played 3 matches
        // (Or just check if total matches played by sum / 2 === 6?)
        // Safest: Check every team has matchesPlayed === 3
        const isGroupComplete = teamList.length === 4 && teamList.every(t => t.matchesPlayed === 3);

        if (isGroupComplete) {
            fullyCompletedGroups++;

            teamList.sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                const gdA = a.goalsFor - a.goalsAgainst;
                const gdB = b.goalsFor - b.goalsAgainst;
                if (gdB !== gdA) return gdB - gdA;
                if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
                return b.wins - a.wins;
            });

            if (teamList[0]) firstPlace[g] = teamList[0];
            if (teamList[1]) secondPlace[g] = teamList[1];
            if (teamList[2]) thirdPlace.push(teamList[2]);
        }
    });

    // Best 3rds logic: Only calculate if ALL 12 groups are complete
    // Why? Beacuse a 3rd place from an incomplete group could theoretically improve/worsen
    // and displace someone.
    let bestThirds = [];
    if (fullyCompletedGroups === 12) {
        thirdPlace.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            const gdA = a.goalsFor - a.goalsAgainst;
            const gdB = b.goalsFor - b.goalsAgainst;
            if (gdB !== gdA) return gdB - gdA;
            if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
            return b.wins - a.wins;
        });
        bestThirds = thirdPlace.slice(0, 8); // Top 8 best 3rds
    } else {
        // If not all groups are complete, we CANNOT determine the definitive 8 best 3rds.
        // So we return empty list for best 3rds.
        bestThirds = [];
    }

    return { firstPlace, secondPlace, bestThirds }; // Map of group -> team
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
    const { firstPlace, secondPlace, bestThirds } = getQualifiers(standings);

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
