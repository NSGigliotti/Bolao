import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navibar';
import { Loader2, Calendar, AlertCircle, Scale, Trophy, Hash } from 'lucide-react';
import { API_ENDPOINTS } from '../../services/api';
import { useAuthContext } from '../../contexts/AuthContext';
import { getMatchLabel as getKnockoutLabel, getTeamDescription } from '../../utils/matchLabels';

const GamesPage = () => {
    const { userId } = useParams();
    const location = useLocation();
    const userName = location.state?.userName || 'Usuário';
    const { user } = useAuthContext();

    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isComparing, setIsComparing] = useState(false);
    const [myPredictions, setMyPredictions] = useState({});
    const [loadingCompare, setLoadingCompare] = useState(false);

    const getStageName = (stage) => {
        const stages = {
            0: "1ª Rodada (Fase de Grupos)",
            1: "2ª Rodada (Fase de Grupos)",
            2: "3ª Rodada (Fase de Grupos)",
            3: "Segunda fase",
            4: "Oitavas de Final",
            5: "Quartas de Final",
            6: "Semifinais",
            7: "Terceiro Lugar",
            8: "Final"
        };
        return stages[stage] || "Outros";
    };

    const groupedPredictions = predictions.reduce((groups, pred) => {
        const stage = pred.match?.stage ?? 'unknown';
        if (!groups[stage]) {
            groups[stage] = [];
        }
        groups[stage].push(pred);
        return groups;
    }, {});

    // Sort stages by their enum value
    const sortedStages = Object.keys(groupedPredictions).sort((a, b) => Number(a) - Number(b));

    useEffect(() => {
        const fetchUserGames = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.GET_MATCHES_BY_USER, {
                    method: 'POST',
                    headers: {
                        'bypass-tunnel-reminder': 'true',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userId)
                });

                if (!response.ok) {
                    throw new Error('Não foi possível carregar os jogos deste usuário');
                }

                const data = await response.json();
                setPredictions(data);
                setError(null);
            } catch (err) {
                console.error('Erro ao buscar jogos do usuário:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserGames();
        }
    }, [userId]);

    const handleCompareToggle = async () => {
        if (!isComparing && Object.keys(myPredictions).length === 0 && user?.id) {
            try {
                setLoadingCompare(true);
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

                if (response.ok) {
                    const data = await response.json();
                    const myPredsMap = {};
                    data.forEach(pred => {
                        myPredsMap[pred.matchId] = pred;
                    });
                    setMyPredictions(myPredsMap);
                }
            } catch (err) {
                console.error('Erro ao buscar meus jogos para comparação:', err);
            } finally {
                setLoadingCompare(false);
            }
        }
        setIsComparing(!isComparing);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">Ops! Algo deu errado.</h2>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    // Only show compare button if logged in and not viewing own profile
    const showCompareButton = user && user.id && user.id !== userId;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 pt-24">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Jogos de {userName}</h1>
                        <p className="text-gray-500 mt-1">Confira a jornada de palpites deste participante organizada por etapas.</p>
                    </div>
                    {showCompareButton && (
                        <button
                            onClick={handleCompareToggle}
                            disabled={loadingCompare}
                            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-xl transition-all ${
                                isComparing 
                                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
                                : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
                            }`}
                        >
                            {loadingCompare ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
                            {isComparing ? 'Ocultar Comparação' : 'Comparar com os meus'}
                        </button>
                    )}
                </div>

                {!predictions || predictions.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
                        <p className="text-gray-500 font-medium">Nenhum palpite encontrado para este usuário.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {sortedStages.map((stageKey) => (
                            <div key={stageKey} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-black text-indigo-900 uppercase tracking-wider">
                                        {getStageName(Number(stageKey))}
                                    </h2>
                                    <div className="flex-grow h-px bg-indigo-100"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    {groupedPredictions[stageKey].map((pred) => {
                                        const match = pred.match;
                                        if (!match) return null;
                                        
                                        const myPred = myPredictions[match.id];
                                        const isKnockout = match.stage >= 3;
                                        const displayLabel = isKnockout ? getKnockoutLabel(match.id) : null;

                                        return (
                                            <div key={pred.id} className={`p-4 rounded-xl border transition-all shadow-sm hover:shadow-md ${
                                                isKnockout 
                                                ? 'bg-gradient-to-br from-white to-indigo-50 border-indigo-100 hover:border-indigo-300' 
                                                : 'bg-white border-gray-200 hover:border-indigo-200'
                                            }`}>
                                                <div className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-2">
                                                    <Calendar size={12} className={isKnockout ? 'text-indigo-400' : ''} />
                                                    <span className={isKnockout ? 'text-indigo-900 font-bold' : ''}>
                                                        {new Date(match.matchDate).toLocaleDateString()}
                                                    </span>
                                                    <span className="mx-1 opacity-30">•</span>
                                                    <span className={isKnockout ? 'text-indigo-900 font-bold' : ''}>
                                                        {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>

                                                    {isKnockout && (
                                                        <span className="ml-2 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded uppercase tracking-wider flex items-center gap-0.5">
                                                            <Hash size={8} /> {displayLabel}
                                                        </span>
                                                    )}

                                                    {pred.pointsGained > 0 && (
                                                        <span className="ml-auto bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm" title={`Pontos de ${userName}`}>
                                                            +{pred.pointsGained} pts
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                                                    {/* User's Team Left */}
                                                    <div className="flex flex-col items-center gap-1.5 min-w-0">
                                                        {(match.homeTeam?.flagUrl || pred.homeTeam?.flagUrl) ? (
                                                            <img src={match.homeTeam?.flagUrl || pred.homeTeam?.flagUrl} alt="" className="w-10 h-7 object-cover rounded shadow-sm border border-gray-100" />
                                                        ) : isKnockout ? (
                                                            <div className="w-10 h-7 bg-indigo-50 border border-indigo-100 rounded flex items-center justify-center">
                                                                <Trophy size={14} className="text-indigo-200" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-7 bg-gray-50 rounded"></div>
                                                        )}
                                                        <span className={`text-[10px] md:text-xs font-black text-center leading-tight truncate w-full ${!match.homeTeam && !pred.homeTeam && isKnockout ? 'text-indigo-400 italic' : 'text-gray-700'}`}>
                                                            {match.homeTeam ? match.homeTeam.name : (pred.homeTeam ? pred.homeTeam.name : (isKnockout ? getTeamDescription(match.id, 'home') : 'TBD'))}
                                                        </span>
                                                    </div>

                                                    {/* User's Score Center */}
                                                    <div className="flex flex-col items-center">
                                                        {isComparing && <span className="text-[9px] text-gray-400 font-black mb-1 uppercase tracking-widest">{userName.split(' ')[0]}</span>}
                                                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                                                            <span className="font-black text-xl text-gray-900 w-6 text-center">{pred.homeTeamScore}</span>
                                                            <span className="text-gray-300 font-black text-xs">×</span>
                                                            <span className="font-black text-xl text-gray-900 w-6 text-center">{pred.awayTeamScore}</span>
                                                        </div>
                                                    </div>

                                                    {/* User's Team Right */}
                                                    <div className="flex flex-col items-center gap-1.5 min-w-0">
                                                        {(match.awayTeam?.flagUrl || pred.awayTeam?.flagUrl) ? (
                                                            <img src={match.awayTeam?.flagUrl || pred.awayTeam?.flagUrl} alt="" className="w-10 h-7 object-cover rounded shadow-sm border border-gray-100" />
                                                        ) : isKnockout ? (
                                                            <div className="w-10 h-7 bg-indigo-50 border border-indigo-100 rounded flex items-center justify-center">
                                                                <Trophy size={14} className="text-indigo-200" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-7 bg-gray-50 rounded"></div>
                                                        )}
                                                        <span className={`text-[10px] md:text-xs font-black text-center leading-tight truncate w-full ${!match.awayTeam && !pred.awayTeam && isKnockout ? 'text-indigo-400 italic' : 'text-gray-700'}`}>
                                                            {match.awayTeam ? match.awayTeam.name : (pred.awayTeam ? pred.awayTeam.name : (isKnockout ? getTeamDescription(match.id, 'away') : 'TBD'))}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* My Prediction (Comparison) */}
                                                {isComparing && (
                                                    <div className="mt-4 pt-4 border-t border-dashed border-gray-100">
                                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 opacity-80">
                                                            {/* My Team Left */}
                                                            <div className="flex flex-col items-center gap-1 min-w-0">
                                                                {(myPred?.homeTeam?.flagUrl || match.homeTeam?.flagUrl) ? (
                                                                    <img src={myPred?.homeTeam?.flagUrl || match.homeTeam?.flagUrl} alt="" className="w-8 h-6 object-cover rounded-sm shadow-sm border border-indigo-50" />
                                                                ) : (
                                                                    <div className="w-8 h-6 bg-gray-50 rounded-sm"></div>
                                                                )}
                                                                <span className="text-[9px] font-bold text-indigo-900 text-center truncate w-full">
                                                                    {myPred?.homeTeam ? myPred.homeTeam.name : (match.homeTeam ? match.homeTeam.name : 'TBD')}
                                                                </span>
                                                            </div>

                                                            {/* My Score Center */}
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[9px] text-indigo-500 font-black mb-1 uppercase tracking-widest">Você</span>
                                                                {myPred ? (
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-600 text-white rounded-lg shadow-md">
                                                                        <span className="font-black text-sm w-4 text-center">{myPred.homeTeamScore}</span>
                                                                        <span className="text-indigo-300 font-black text-[10px]">×</span>
                                                                        <span className="font-black text-sm w-4 text-center">{myPred.awayTeamScore}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="px-2 py-1 bg-gray-50 rounded text-[9px] text-gray-400 font-bold border border-gray-100 uppercase">Sem palpite</div>
                                                                )}
                                                            </div>

                                                            {/* My Team Right */}
                                                            <div className="flex flex-col items-center gap-1 min-w-0 relative">
                                                                {(myPred?.awayTeam?.flagUrl || match.awayTeam?.flagUrl) ? (
                                                                    <img src={myPred?.awayTeam?.flagUrl || match.awayTeam?.flagUrl} alt="" className="w-8 h-6 object-cover rounded-sm shadow-sm border border-indigo-50" />
                                                                ) : (
                                                                    <div className="w-8 h-6 bg-gray-50 rounded-sm"></div>
                                                                )}
                                                                <span className="text-[9px] font-bold text-indigo-900 text-center truncate w-full">
                                                                    {myPred?.awayTeam ? myPred.awayTeam.name : (match.awayTeam ? match.awayTeam.name : 'TBD')}
                                                                </span>
                                                                {myPred?.pointsGained > 0 && (
                                                                    <span className="absolute -top-6 -right-2 bg-indigo-600 text-white px-1.5 py-0.5 rounded-full text-[8px] font-black shadow-sm">
                                                                        +{myPred.pointsGained}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Real Score Badge (if match finished) */}
                                                {match.status === 2 && (
                                                    <div className="mt-3 pt-3 border-t border-gray-50 flex justify-center text-[10px] text-gray-400 font-medium italic">
                                                        Placar real: {match.homeTeamScore} - {match.awayTeamScore}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default GamesPage;