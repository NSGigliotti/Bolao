import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navibar';
import { Loader2, Calendar, AlertCircle, Scale } from 'lucide-react';
import { API_ENDPOINTS } from '../../services/api';
import { useAuthContext } from '../../contexts/AuthContext';

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

                                        return (
                                            <div key={pred.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-200 transition-colors">
                                                <div className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(match.matchDate).toLocaleDateString()}
                                                    <span className="mx-1">•</span>
                                                    {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {pred.pointsGained > 0 && (
                                                        <span className="ml-auto bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold" title={`Pontos de ${userName}`}>
                                                            +{pred.pointsGained} pts
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    {/* User's Prediction */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex-1 flex items-center justify-end gap-2 text-right">
                                                            <span className="font-bold text-gray-800 text-sm leading-tight">
                                                                {match.homeTeam ? match.homeTeam.name : (pred.homeTeam ? pred.homeTeam.name : 'TBD')}
                                                            </span>
                                                            {(match.homeTeam?.flagUrl || pred.homeTeam?.flagUrl) ? (
                                                                <img src={match.homeTeam?.flagUrl || pred.homeTeam?.flagUrl} alt="" className="w-6 h-4 object-cover rounded shadow-sm" />
                                                            ) : (
                                                                <div className="w-6 h-4 bg-gray-100 rounded"></div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col items-center">
                                                            {isComparing && <span className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wider">{userName.split(' ')[0]}</span>}
                                                            <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                                                <span className="font-bold text-lg text-gray-900 w-6 text-center">{pred.homeTeamScore}</span>
                                                                <span className="text-gray-400 text-xs">x</span>
                                                                <span className="font-bold text-lg text-gray-900 w-6 text-center">{pred.awayTeamScore}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 flex items-center justify-start gap-2 text-left">
                                                            {(match.awayTeam?.flagUrl || pred.awayTeam?.flagUrl) ? (
                                                                <img src={match.awayTeam?.flagUrl || pred.awayTeam?.flagUrl} alt="" className="w-6 h-4 object-cover rounded shadow-sm" />
                                                            ) : (
                                                                <div className="w-6 h-4 bg-gray-100 rounded"></div>
                                                            )}
                                                            <span className="font-bold text-gray-800 text-sm leading-tight">
                                                                {match.awayTeam ? match.awayTeam.name : (pred.awayTeam ? pred.awayTeam.name : 'TBD')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* My Prediction (Comparison) */}
                                                    {isComparing && (
                                                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-dashed border-gray-100 mt-1">
                                                            <div className="flex-1 flex items-center justify-end gap-2 text-right opacity-80">
                                                                {myPred && (
                                                                    <>
                                                                        <span className="font-bold text-indigo-800 text-sm leading-tight">
                                                                            {myPred.homeTeam ? myPred.homeTeam.name : (match.homeTeam ? match.homeTeam.name : 'TBD')}
                                                                        </span>
                                                                        {(myPred.homeTeam?.flagUrl || match.homeTeam?.flagUrl) ? (
                                                                            <img src={myPred.homeTeam?.flagUrl || match.homeTeam?.flagUrl} alt="" className="w-6 h-4 object-cover rounded shadow-sm" />
                                                                        ) : (
                                                                            <div className="w-6 h-4 bg-gray-100 rounded"></div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[10px] text-indigo-500 font-bold mb-1 uppercase tracking-wider">Você</span>
                                                                {myPred ? (
                                                                    <div className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
                                                                        <span className="font-bold text-lg text-indigo-900 w-6 text-center">{myPred.homeTeamScore}</span>
                                                                        <span className="text-indigo-400 text-xs">x</span>
                                                                        <span className="font-bold text-lg text-indigo-900 w-6 text-center">{myPred.awayTeamScore}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-400">
                                                                        Sem palpite
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="flex-1 flex items-center justify-start gap-2 text-left opacity-80">
                                                                {myPred && (
                                                                    <>
                                                                        {(myPred.awayTeam?.flagUrl || match.awayTeam?.flagUrl) ? (
                                                                            <img src={myPred.awayTeam?.flagUrl || match.awayTeam?.flagUrl} alt="" className="w-6 h-4 object-cover rounded shadow-sm" />
                                                                        ) : (
                                                                            <div className="w-6 h-4 bg-gray-100 rounded"></div>
                                                                        )}
                                                                        <span className="font-bold text-indigo-800 text-sm leading-tight">
                                                                            {myPred.awayTeam ? myPred.awayTeam.name : (match.awayTeam ? match.awayTeam.name : 'TBD')}
                                                                        </span>
                                                                        {myPred.pointsGained > 0 && (
                                                                            <span className="ml-auto bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold" title="Seus pontos">
                                                                                +{myPred.pointsGained} pts
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

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