import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import Navbar from '../../components/common/Navibar';
import { Trophy, Medal, User, Loader2, AlertCircle, Flashlight } from 'lucide-react';
import { API_ENDPOINTS } from '../../services/api';

const RankPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthContext();
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.GET_RANKING);
                if (!response.ok) throw new Error('Não foi possível carregar o ranking');

                const data = await response.json();

                // Process ranking to handle ties
                // Expected data: array of { name: string, score: number }
                // Sorted by score in descending order
                const sortedData = data.sort((a, b) => b.score - a.score);

                let currentRank = 1;
                const processedRanking = sortedData.map((user, index) => {
                    if (index > 0 && user.score < sortedData[index - 1].score) {
                        currentRank = index + 1;
                    }
                    return { ...user, position: currentRank };
                });

                setRanking(processedRanking);
                setError(null);
            } catch (err) {
                console.error('Erro ao buscar ranking:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);


    const getRankIcon = (position, isLast) => {
        if (isLast && position > 3) return <Flashlight className="text-blue-500 animate-pulse" size={24} />;

        switch (position) {
            case 1: return (
                <div className="flex items-center gap-1 justify-center">
                    <Trophy className="text-yellow-500" size={24} />
                    <span className="text-yellow-600 font-black">1</span>
                </div>
            );
            case 2: return <Medal className="text-slate-400" size={24} />;
            case 3: return <Medal className="text-amber-700" size={24} />;
            default: return isLast ? <Flashlight className="text-blue-500 animate-pulse" size={24} /> : position;
        }
    };

    const getRowStyle = (position, isLast) => {
        if (isLast && position > 3) return "bg-blue-50 border-blue-100 hover:bg-blue-100";
        switch (position) {
            case 1: return "bg-yellow-50 border-yellow-100";
            case 2: return "bg-slate-50 border-slate-100";
            case 3: return "bg-orange-50 border-orange-100";
            default: return "bg-white border-gray-100 hover:bg-gray-50";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                            Ranking de <span className="text-indigo-600">Palpites</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Acompanhe quem está liderando a jornada rumo ao título de campeão dos palpites.
                            Cada ponto conta na disputa pela glória!
                        </p>
                    </div>


                    {/* Prize Pool Summary */}
                    <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 mb-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-500 p-3 rounded-xl">
                                <Trophy className="text-yellow-300" size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Distribuição de Prêmios</h2>
                                <p className="text-indigo-100 text-sm">Regra: 1º (70%) | 2º (20%) | 3º (10%)</p>
                            </div>
                        </div>
                        <div className="text-3xl font-black flex items-baseline gap-1">
                            <span>100%</span>
                            <span className="text-sm font-normal text-indigo-200">do prêmio</span>
                        </div>
                    </div>

                    {/* Ranking List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center py-20">
                                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Carregando classificação...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center py-20 px-4 text-center">
                                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Ops! Algo deu errado</h3>
                                <p className="text-gray-600">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        ) : ranking.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-20 text-center">
                                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                                    <User className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">Nenhum usuário encontrado.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(() => {
                                    const PRIZE_PERCENTAGES = [0.70, 0.20, 0.10];
                                    const TOTAL_PRIZE_POOL = 1000; // Valor configurável do prêmio total

                                    const groups = [];
                                    ranking.forEach(user => {
                                        const lastGroup = groups[groups.length - 1];
                                        if (lastGroup && lastGroup.position === user.position) {
                                            lastGroup.users.push(user);
                                        } else {
                                            groups.push({
                                                position: user.position,
                                                score: user.score,
                                                users: [user],
                                                isLast: user.position === ranking[ranking.length - 1]?.position
                                            });
                                        }
                                    });

                                    // Calculate prizes using Dense Ranking (1, 1, 2, 3)
                                    // Group 1 (1st score) gets PRIZE_PERCENTAGES[0] / count
                                    // Group 2 (2nd score) gets PRIZE_PERCENTAGES[1] / count
                                    // Group 3 (3rd score) gets PRIZE_PERCENTAGES[2] / count
                                    const groupsWithPrizes = groups.map((group, index) => {
                                        let prizePercentage = 0;
                                        if (index < PRIZE_PERCENTAGES.length) {
                                            prizePercentage = PRIZE_PERCENTAGES[index] / group.users.length;
                                        }
                                        return { ...group, prizePercentage };
                                    });

                                    return groupsWithPrizes.map((group, gIndex) => (
                                        <div
                                            key={gIndex}
                                            className={`rounded-2xl shadow-sm border p-6 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 ${getRowStyle(group.position, group.isLast)}`}
                                        >
                                            {/* Position (Left) */}
                                            <div className="flex items-center justify-center min-w-[80px] border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-6 text-center">
                                                <div className="flex justify-center items-center font-black text-2xl text-gray-700">
                                                    {getRankIcon(group.position, group.isLast)}
                                                </div>
                                            </div>

                                            {/* Users List (Center) */}
                                            <div className="flex-grow w-full">
                                                <div className="grid grid-cols-1 gap-4">
                                                    {group.users.map((user, uIndex) => (
                                                        <div key={user.id || uIndex} className="flex items-center group">
                                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-sm transition-transform group-hover:scale-110 ${group.position === 1 ? 'bg-yellow-400' :
                                                                group.position === 2 ? 'bg-slate-400' :
                                                                    group.position === 3 ? 'bg-amber-700' :
                                                                        group.isLast ? 'bg-blue-400' : 'bg-indigo-400'
                                                                }`}>
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-grow">
                                                                <div
                                                                    className="text-sm font-bold text-gray-900 leading-tight hover:text-indigo-600 cursor-pointer transition-colors inline-block"
                                                                    onClick={() => {
                                                                        const isCurrentUser = currentUser && (currentUser.id === user.id);
                                                                        navigate(isCurrentUser ? '/mygame' : `/user-games/${user.id}`, { state: { userName: user.name } });
                                                                    }}
                                                                >
                                                                    {user.name}
                                                                </div>
                                                                {(group.prizePercentage > 0 || group.isLast) && (
                                                                    <div className={`text-[10px] font-medium flex items-center mt-0.5 uppercase tracking-tighter ${group.isLast && group.position > 3 ? 'text-blue-600' : 'text-gray-500'
                                                                        }`}>
                                                                        {group.prizePercentage > 0 ? (
                                                                            <span className="text-green-600 font-bold">
                                                                                Prêmio: {(group.prizePercentage * 100).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%
                                                                                {group.users.length > 1 && <span className="text-[8px] ml-1 text-gray-400">(Dividido)</span>}
                                                                            </span>
                                                                        ) : group.isLast ? 'Lanterna 🔦' : ''}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Points (Right) */}
                                            <div className="flex flex-col items-center justify-center min-w-[100px] border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6 text-center">
                                                <div className="font-mono font-black text-3xl text-indigo-600 leading-none">
                                                    {group.score}
                                                </div>
                                                <div className="text-[10px] uppercase font-bold text-indigo-300 mt-1">pontos</div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 text-center text-gray-400 text-sm">
                        <p>A pontuação é atualizada em tempo real após cada partida finalizada.</p>
                        <p className="mt-1">Regras: Placar exato = 3 pts | Vencedor/Empate = 1 pt</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RankPage;