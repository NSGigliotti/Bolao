import { useState, useEffect, useMemo } from 'react';
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

    useEffect(() => {
        fetchMatches();
    }, []);

    useEffect(() => {
        if (matches.length > 0) {
            const simulated = simulateKnockout(matches, predictions);
            setSimulatedTeams(simulated);
        }
    }, [predictions, matches]);

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

    const handleScoreChange = (matchId, team, value) => {
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

    const handleBlur = (matchId, team, value) => {
        if (value === '' || value === undefined) {
            setPredictions(prev => ({
                ...prev,
                [matchId]: {
                    ...prev[matchId],
                    [team]: 0
                }
            }));
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
        const payload = [];

        matches.forEach(match => {
            const pred = predictions[match.id];
            if (pred && pred.home !== undefined && pred.home !== '' && pred.away !== undefined && pred.away !== '') {
                const sim = simulatedTeams[match.id];
                const homeTeam = match.homeTeam || (sim ? sim.homeTeam : null);
                const awayTeam = match.awayTeam || (sim ? sim.awayTeam : null);

                payload.push({
                    matchId: match.id,
                    idHomeTeam: homeTeam ? homeTeam.id : 0,
                    homeTeamName: homeTeam ? homeTeam.name : 'A Definir',
                    homeTeamScore: pred.home,
                    idAwayTeam: awayTeam ? awayTeam.id : 0,
                    awayTeamName: awayTeam ? awayTeam.name : 'A Definir',
                    awayTeamScore: pred.away
                });
            }
        });

        if (payload.length === 0) {
            toast.error("Preencha pelo menos um palpite completo.");
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.CREATE_PREDICTION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("Palpites salvos com sucesso!");
                if (data.token) {
                    login(data.token);
                } else {
                    updateUser({ GameMake: true });
                }
                navigate('/mygame');
            } else {
                toast.error("Erro ao salvar palpites.");
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
            return pred && pred.home !== undefined && pred.home !== '' && pred.away !== undefined && pred.away !== '';
        });
    }, [matches, predictions]);

    return {
        matches,
        loading,
        submitting,
        predictions,
        activeTab,
        simulatedTeams,
        setActiveTab,
        handleScoreChange,
        handleBlur,
        handleSubmit,
        groupedMatches,
        unlockedTabs,
        isTournamentComplete
    };
};
