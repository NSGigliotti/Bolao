
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Save, Loader2, Calendar, AlertCircle, ChevronRight } from 'lucide-react';
import Navbar from '../../components/common/Navibar';
import { API_ENDPOINTS } from '../../services/api';
import { useAuthContext } from '../../contexts/AuthContext';
import { simulateKnockout } from '../../utils/bracketUtils';
import toast from 'react-hot-toast';

const GameMake = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthContext();
    const [matches, setMatches] = useState([]); // Flat list of all matches
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [predictions, setPredictions] = useState({});
    const [activeTab, setActiveTab] = useState('Groups');

    // Knockout simulation state
    const [simulatedTeams, setSimulatedTeams] = useState({}); // MatchID -> { home, away }

    useEffect(() => {
        fetchMatches();
    }, []);

    // Recalculate bracket whenever predictions change
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

            // Should be a flat list of matches for the utility to work easier?
            // The API returns grouped by stage (List<MatchDto>).
            // We need to flatten it for the utility or adapt the utility.
            // Let's flatten it here for local processing.
            let flatMatches = [];
            if (Array.isArray(data)) {
                // Check if data is already flat or grouped
                // API GetAllMaches returns List<MatchDto> where MatchDto has StageName and Matchs (List<MatchModel>)
                if (data.length > 0 && data[0].matchs) {
                    data.forEach(group => {
                        if (group.matchs) flatMatches.push(...group.matchs);
                    });
                } else {
                    // Assume flat list if no 'matchs' property found
                    flatMatches = data;
                }
            }
            // Sort by date or ID
            flatMatches.sort((a, b) => a.id - b.id);

            console.log("Loaded matches:", flatMatches.length);
            setMatches(flatMatches);
        } catch (error) {
            console.error("Erro ao buscar jogos:", error);
            toast.error("Erro ao carregar os jogos.");
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (matchId, team, value) => {
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
            if (pred && pred.home !== undefined && pred.away !== undefined) {
                // Determine teams: if original is null, use simulated
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
                toast.success("Palpites salvos com sucesso!");
                updateUser({ GameMake: true }); // Update user context locally
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

    // Group matches for display
    const groupedMatches = useMemo(() => {
        const groups = {
            'Groups': [],
            'Round of 32': [],
            'Round of 16': [],
            'Quarter-finals': [],
            'Semi-finals': [],
            'Final': [] // Includes 3rd Place
        };

        matches.forEach(match => {
            // Stage Enum mapping:
            // 0-2: Group
            // 3: Round of 32
            // 4: Round of 16
            // 5: Quarter
            // 6: Semi
            // 7: 3rd Place
            // 8: Final
            if (match.stage <= 2) groups['Groups'].push(match);
            else if (match.stage === 3) groups['Round of 32'].push(match);
            else if (match.stage === 4) groups['Round of 16'].push(match);
            else if (match.stage === 5) groups['Quarter-finals'].push(match);
            else if (match.stage === 6) groups['Semi-finals'].push(match);
            else groups['Final'].push(match);
        });
        return groups;
    }, [matches]);

    // Helper to check if a stage is complete (all matches have predictions)
    const isStageComplete = (stageName) => {
        const stageMatches = groupedMatches[stageName];
        if (!stageMatches || stageMatches.length === 0) return false;

        // Check if every match in the stage has a full prediction
        return stageMatches.every(m => {
            const pred = predictions[m.id];
            return pred && pred.home !== undefined && pred.home !== '' && pred.away !== undefined && pred.away !== '';
        });
    };

    // Determine unlocked tabs based on completion
    // Groups -> Round of 32 -> Round of 16 -> Quarter -> Semi -> Final
    const unlockedTabs = useMemo(() => {
        const tabs = ['Groups'];
        if (isStageComplete('Groups')) tabs.push('Round of 32');
        if (isStageComplete('Groups') && isStageComplete('Round of 32')) tabs.push('Round of 16');
        if (isStageComplete('Groups') && isStageComplete('Round of 32') && isStageComplete('Round of 16')) tabs.push('Quarter-finals');
        if (isStageComplete('Groups') && isStageComplete('Round of 32') && isStageComplete('Round of 16') && isStageComplete('Quarter-finals')) tabs.push('Semi-finals');
        if (isStageComplete('Groups') && isStageComplete('Round of 32') && isStageComplete('Round of 16') && isStageComplete('Quarter-finals') && isStageComplete('Semi-finals')) tabs.push('Final');
        return tabs;
    }, [predictions, groupedMatches]);

    const renderMatch = (match) => {
        // Overlay simulated teams if original are missing
        const sim = simulatedTeams[match.id];
        const homeTeam = match.homeTeam || (sim ? sim.homeTeam : null);
        const awayTeam = match.awayTeam || (sim ? sim.awayTeam : null);

        // Custom Header for Final/3rd Place
        let headerLabel = null;
        if (activeTab === 'Final') {
            if (match.stage === 8 || match.id === 104) headerLabel = "Grande Final";
            else if (match.stage === 7 || match.id === 103) headerLabel = "Disputa de 3º Lugar";
        }

        return (
            <div key={match.id} className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${headerLabel ? 'border-t-4 border-t-yellow-400' : ''}`}>
                {headerLabel && (
                    <div className="mb-4 text-center">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase tracking-wider">
                            {headerLabel}
                        </span>
                    </div>
                )}
                <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div className="text-xs text-gray-400 font-medium md:flex-col text-center md:text-left md:w-20">
                        {new Date(match.matchDate).toLocaleDateString().slice(0, 5)}
                        <span className="hidden md:block">{new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="flex-1 flex items-center justify-center gap-4 w-full">
                        {/* Home */}
                        <div className="flex-1 flex items-center justify-end gap-3 text-right">
                            <span className="font-bold text-gray-800 text-sm md:text-base leading-tight">
                                {homeTeam ? homeTeam.name : 'A Definir'}
                            </span>
                            {homeTeam && homeTeam.flagUrl ? (
                                <img src={homeTeam.flagUrl} alt={homeTeam.name} className="w-8 h-6 object-cover rounded shadow-sm" />
                            ) : (
                                <div className="w-8 h-6 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-300">?</div>
                            )}
                        </div>

                        {/* Score */}
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                className={`w-10 h-10 md:w-12 md:h-12 text-center font-bold text-lg border-2 rounded-lg outline-none transition-all ${!homeTeam || !awayTeam
                                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                    }`}
                                value={predictions[match.id]?.home ?? ''}
                                onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                                disabled={!homeTeam || !awayTeam}
                            />
                            <span className="text-gray-300 font-bold">×</span>
                            <input
                                type="number"
                                min="0"
                                className={`w-10 h-10 md:w-12 md:h-12 text-center font-bold text-lg border-2 rounded-lg outline-none transition-all ${!homeTeam || !awayTeam
                                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                    }`}
                                value={predictions[match.id]?.away ?? ''}
                                onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                                disabled={!homeTeam || !awayTeam}
                            />
                        </div>

                        {/* Away */}
                        <div className="flex-1 flex items-center justify-start gap-3 text-left">
                            {awayTeam && awayTeam.flagUrl ? (
                                <img src={awayTeam.flagUrl} alt={awayTeam.name} className="w-8 h-6 object-cover rounded shadow-sm" />
                            ) : (
                                <div className="w-8 h-6 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-300">?</div>
                            )}
                            <span className="font-bold text-gray-800 text-sm md:text-base leading-tight">
                                {awayTeam ? awayTeam.name : 'A Definir'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Check if tournament is 100% complete (all matches predicted)
    const isTournamentComplete = useMemo(() => {
        if (matches.length === 0) return false;
        return matches.every(m => {
            const pred = predictions[m.id];
            return pred && pred.home !== undefined && pred.home !== '' && pred.away !== undefined && pred.away !== '';
        });
    }, [matches, predictions]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    const tabs = ['Groups', 'Round of 32', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'Final'];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 pt-24">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Simulador da Copa</h1>
                        <p className="text-gray-500 mt-1">Preencha os resultados e veja a progressão do torneio.</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !isTournamentComplete}
                        className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all active:scale-95 ${submitting || !isTournamentComplete
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        title={!isTournamentComplete ? "Preencha todos os jogos para salvar" : "Salvar Jogo"}
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Salvar Jogo
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto gap-2 pb-4 mb-4 scrollbar-hide">
                    {tabs.map(tab => {
                        const isLocked = !unlockedTabs.includes(tab);
                        return (
                            <button
                                key={tab}
                                onClick={() => !isLocked && setActiveTab(tab)}
                                disabled={isLocked}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : isLocked
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {isLocked && <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Match List */}
                <div className="space-y-4">
                    {activeTab === 'Groups' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* We could group by Group A, B, C here too if we wanted */}
                            {groupedMatches['Groups'].map(match => renderMatch(match))}
                        </div>
                    )}
                    {activeTab !== 'Groups' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {groupedMatches[activeTab].length > 0 ? (
                                groupedMatches[activeTab].map(match => renderMatch(match))
                            ) : (
                                <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                                    Nenhum jogo nesta fase ainda.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default GameMake;