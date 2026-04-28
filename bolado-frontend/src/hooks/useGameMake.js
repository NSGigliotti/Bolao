import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../services/api';
import { simulateKnockout } from '../utils/bracketUtils';
import toast from 'react-hot-toast';

export const useGameMake = () => {
    const navigate = useNavigate();
    const { user, login, updateUser } = useAuthContext();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [predictions, setPredictions] = useState({});
    const [activeTab, setActiveTab] = useState('Groups');
    const [simulatedTeams, setSimulatedTeams] = useState({}); // MatchID -> { home, away }

    // Track prediction GUIDs and saving state per match
    const [predictionIds, setPredictionIds] = useState({}); // matchId -> guid
    const [savingMatches, setSavingMatches] = useState({}); // matchId -> boolean
    const [savedMatches, setSavedMatches] = useState({}); // matchId -> boolean
    const [existingPredictionsLoaded, setExistingPredictionsLoaded] = useState(false);
    const hasAutoNavigated = useRef(false);

    useEffect(() => {
        fetchMatches();
    }, []);

    // Fetch existing predictions when user and matches are available
    useEffect(() => {
        if (user && user.id && matches.length > 0 && !existingPredictionsLoaded) {
            fetchExistingPredictions();
        }
    }, [user, matches, existingPredictionsLoaded]);

    useEffect(() => {
        if (matches.length > 0) {
            const simulated = simulateKnockout(matches, predictions);
            setSimulatedTeams(simulated);
        }
    }, [predictions, matches]);

    // Auto-navigate to the first incomplete tab after loading existing predictions
    useEffect(() => {
        if (existingPredictionsLoaded && Object.keys(predictions).length > 0 && !hasAutoNavigated.current && matches.length > 0) {
            hasAutoNavigated.current = true;
            const tabs = ['Groups', 'Round of 32', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'Final'];
            for (const tab of tabs) {
                const stageMatches = groupedMatches[tab];
                if (!stageMatches || stageMatches.length === 0) continue;
                const complete = stageMatches.every(m => {
                    const pred = predictions[m.id];
                    return pred && pred.home !== undefined && pred.home !== '' && pred.away !== undefined && pred.away !== '';
                });
                if (!complete) {
                    setActiveTab(tab);
                    break;
                }
            }
        }
    }, [existingPredictionsLoaded, predictions, matches]);

    const fetchMatches = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.GET_MATCHES);
            if (!response.ok) throw new Error('Falha ao carregar jogos');
            const data = await response.json();

            let flatMatches = [];
            if (Array.isArray(data)) {
                if (data.length > 0 && data[0].matchs) {
                    data.forEach(group => {
                        if (group.matchs) flatMatches.push(...group.matchs);
                    });
                } else {
                    flatMatches = data;
                }
            }
            flatMatches.sort((a, b) => a.id - b.id);
            setMatches(flatMatches);
        } catch (error) {
            console.error("Erro ao buscar jogos:", error);
            toast.error("Erro ao carregar os jogos.");
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingPredictions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.GET_MATCHES_BY_USER, {
                method: 'POST',
                headers: {
                    'bypass-tunnel-reminder': 'true',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user.id)
            });

            if (!response.ok) throw new Error('Falha ao carregar palpites existentes');

            const data = await response.json();

            if (data && data.length > 0) {
                const existingPredictions = {};
                const existingIds = {};
                const existingSaved = {};

                data.forEach(pred => {
                    existingPredictions[pred.matchId] = {
                        home: pred.homeTeamScore,
                        away: pred.awayTeamScore
                    };
                    existingIds[pred.matchId] = pred.id;
                    existingSaved[pred.matchId] = true;
                });

                setPredictions(existingPredictions);
                setPredictionIds(existingIds);
                setSavedMatches(existingSaved);
            }
        } catch (error) {
            console.error("Erro ao buscar palpites existentes:", error);
        } finally {
            setExistingPredictionsLoaded(true);
        }
    };

    const handleScoreChange = (matchId, team, value) => {
        // Clear saved indicator when score changes
        setSavedMatches(prev => ({ ...prev, [matchId]: false }));

        if (value === '') {
            setPredictions(prev => ({
                ...prev,
                [matchId]: {
                    ...prev[matchId],
                    [team]: ''
                }
            }));
            return;
        }

        const score = parseInt(value, 10);
        if (isNaN(score) || score < 0) return;

        setPredictions(prev => ({
            ...prev,
            [matchId]: {
                ...prev[matchId],
                [team]: score
            }
        }));
    };

    const savePrediction = async (matchId, predValues) => {
        if (!user) return;

        const { home, away } = predValues;
        if (home === undefined || home === '' || away === undefined || away === '') return;

        const match = matches.find(m => m.id === matchId);
        if (!match) return;

        const sim = simulatedTeams[matchId];
        const homeTeam = match.homeTeam || (sim ? sim.homeTeam : null);
        const awayTeam = match.awayTeam || (sim ? sim.awayTeam : null);

        // Don't save knockout matches with tied scores
        if (match.stage >= 3 && parseInt(home) === parseInt(away)) return;

        const token = localStorage.getItem('token');
        setSavingMatches(prev => ({ ...prev, [matchId]: true }));

        try {
            const existingId = predictionIds[matchId];

            if (existingId) {
                // Update existing prediction
                await fetch(API_ENDPOINTS.UPDATE_PREDICTION, {
                    method: 'POST',
                    headers: {
                        'bypass-tunnel-reminder': 'true',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        machID: matchId,
                        homeTeamScore: parseInt(home),
                        homeTeamId: homeTeam ? homeTeam.id : 0,
                        awayTeamScore: parseInt(away),
                        awayTeamId: awayTeam ? awayTeam.id : 0
                    })
                });
            } else {
                // Create new prediction
                const response = await fetch(API_ENDPOINTS.CREATE_A_PREDICTION, {
                    method: 'POST',
                    headers: {
                        'bypass-tunnel-reminder': 'true',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        matchId: matchId,
                        idHomeTeam: homeTeam ? homeTeam.id : 0,
                        homeTeamName: homeTeam ? homeTeam.name : 'A Definir',
                        homeTeamScore: parseInt(home),
                        idAwayTeam: awayTeam ? awayTeam.id : 0,
                        awayTeamName: awayTeam ? awayTeam.name : 'A Definir',
                        awayTeamScore: parseInt(away)
                    })
                });

                if (response.ok) {
                    const guid = await response.json();
                    setPredictionIds(prev => ({ ...prev, [matchId]: guid }));
                }
            }

            setSavedMatches(prev => ({ ...prev, [matchId]: true }));
        } catch (error) {
            console.error(`Erro ao salvar palpite para jogo ${matchId}:`, error);
            toast.error('Erro ao salvar palpite.');
        } finally {
            setSavingMatches(prev => ({ ...prev, [matchId]: false }));
        }
    };

    const handleBlur = (matchId, team, value) => {
        const effectiveValue = (value === '' || value === undefined) ? 0 : parseInt(value, 10);

        if (value === '' || value === undefined) {
            setPredictions(prev => ({
                ...prev,
                [matchId]: {
                    ...prev[matchId],
                    [team]: 0
                }
            }));
        }

        // Build complete prediction from current state + effective blur value
        const currentPred = predictions[matchId] || {};
        const completePred = {
            ...currentPred,
            [team]: effectiveValue
        };

        // Save if both scores are filled
        if (completePred.home !== undefined && completePred.home !== '' &&
            completePred.away !== undefined && completePred.away !== '') {
            savePrediction(matchId, completePred);
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Você precisa estar logado para salvar palpites.");
            navigate('/auth');
            return;
        }

        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(API_ENDPOINTS.FINISH_PREDICTIONS, {
                method: 'POST',
                headers: {
                    'bypass-tunnel-reminder': 'true',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success("Palpites finalizados com sucesso!");
                updateUser({ GameMake: true });
                navigate('/mygame');
            } else {
                toast.error("Erro ao finalizar palpites.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro de conexão.");
        } finally {
            setSubmitting(false);
        }
    };

    const groupedMatches = useMemo(() => {
        const groups = {
            'Groups': [],
            'Round of 32': [],
            'Round of 16': [],
            'Quarter-finals': [],
            'Semi-finals': [],
            'Final': []
        };

        matches.forEach(match => {
            if (match.stage <= 2) groups['Groups'].push(match);
            else if (match.stage === 3) groups['Round of 32'].push(match);
            else if (match.stage === 4) groups['Round of 16'].push(match);
            else if (match.stage === 5) groups['Quarter-finals'].push(match);
            else if (match.stage === 6) groups['Semi-finals'].push(match);
            else groups['Final'].push(match);
        });
        return groups;
    }, [matches]);

    const isStageComplete = (stageName) => {
        const stageMatches = groupedMatches[stageName];
        if (!stageMatches || stageMatches.length === 0) return false;

        return stageMatches.every(m => {
            const pred = predictions[m.id];
            return pred && pred.home !== undefined && pred.home !== '' && pred.away !== undefined && pred.away !== '';
        });
    };

    const unlockedTabs = useMemo(() => {
        const tabs = ['Groups'];
        if (isStageComplete('Groups')) tabs.push('Round of 32');
        if (isStageComplete('Groups') && isStageComplete('Round of 32')) tabs.push('Round of 16');
        if (isStageComplete('Groups') && isStageComplete('Round of 32') && isStageComplete('Round of 16')) tabs.push('Quarter-finals');
        if (isStageComplete('Groups') && isStageComplete('Round of 32') && isStageComplete('Round of 16') && isStageComplete('Quarter-finals')) tabs.push('Semi-finals');
        if (isStageComplete('Groups') && isStageComplete('Round of 32') && isStageComplete('Round of 16') && isStageComplete('Quarter-finals') && isStageComplete('Semi-finals')) tabs.push('Final');
        return tabs;
    }, [predictions, groupedMatches]);

    const isTournamentComplete = useMemo(() => {
        if (matches.length === 0) return false;
        return matches.every(m => {
            const pred = predictions[m.id];
            const sim = simulatedTeams[m.id];
            const homeTeam = m.homeTeam || (sim ? sim.homeTeam : null);
            const awayTeam = m.awayTeam || (sim ? sim.awayTeam : null);

            return pred &&
                pred.home !== undefined && pred.home !== '' &&
                pred.away !== undefined && pred.away !== '' &&
                homeTeam && awayTeam &&
                (m.stage < 3 || pred.home !== pred.away); // No draws in knockout stages
        });
    }, [matches, predictions, simulatedTeams]);

    return {
        matches,
        loading,
        submitting,
        predictions,
        activeTab,
        simulatedTeams,
        savingMatches,
        savedMatches,
        setActiveTab,
        handleScoreChange,
        handleBlur,
        handleSubmit,
        groupedMatches,
        unlockedTabs,
        isTournamentComplete
    };
};
