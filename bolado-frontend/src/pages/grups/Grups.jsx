import React from 'react';
import Navbar from '../../components/common/Navibar';
import { Loader2, Plus, Minus } from 'lucide-react';
import { useGrups } from '../../hooks/useGrups';
import { API_ENDPOINTS } from '../../services/api';
import toast from 'react-hot-toast';

const GrupsPage = () => {
    const { groups, loading, refresh } = useGrups();


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    const calculateEfficiency = (points, gamesPlayed) => {
        if (!gamesPlayed) return '0';
        return ((points / (gamesPlayed * 3)) * 100).toFixed(0);
    };

    const handleUpdateCards = async (teamId, typeCard, quantity) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.ADD_CARDS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    idTeam: teamId,
                    typeCard: typeCard,
                    Quantity: quantity
                })
            });
            if (!response.ok) throw new Error('Falha ao atualizar cartões');
            toast.success('Cartões atualizados com sucesso');
            refresh();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar cartões');
        }
    };

    // =========================================================================
    // The backend SortByFifaCriteria already returns teams in the correct
    // FIFA tiebreaker order (host-nation priority, H2H, GD, GF, fair play,
    // FIFA ranking). We trust that order and do NOT re-sort on the frontend.
    // =========================================================================

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 pt-24">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">TABELA</h1>
                    <p className="text-xl text-gray-400 mt-2 font-light">Fase de Grupos</p>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {groups.map((group, index) => (
                        <div key={group.groupName} className="flex flex-col">
                            {/* Group Header */}
                            <div className="flex items-center gap-3 mb-4 bg-gray-900 p-3 rounded-t-lg">
                                <span className="bg-blue-600 text-white text-xs font-black px-2 py-0.5 rounded">GRUPO</span>
                                <h3 className="text-xl font-bold text-white uppercase tracking-widest">{group.groupName}</h3>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto border border-gray-100 rounded-b-lg shadow-sm">
                                <table className="w-full text-[13px] text-left border-collapse bg-white">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="px-4 py-3 font-semibold text-gray-400 uppercase text-[10px] w-12 text-center">Classificação</th>
                                            <th className="px-4 py-3 font-semibold text-gray-400 uppercase text-[10px]">Seleção</th>
                                            <th className="px-3 py-3 font-bold text-gray-900 text-center w-12 bg-gray-50/80">P</th>
                                            <th className="px-3 py-3 font-medium text-gray-500 text-center w-10">J</th>
                                            <th className="px-3 py-3 font-medium text-gray-500 text-center w-10">V</th>
                                            <th className="px-3 py-3 font-medium text-gray-500 text-center w-10">E</th>
                                            <th className="px-3 py-3 font-medium text-gray-500 text-center w-10">D</th>
                                            <th className="px-3 py-3 font-medium text-gray-500 text-center w-10 hidden sm:table-cell">GP</th>
                                            <th className="px-3 py-3 font-medium text-gray-500 text-center w-10 hidden sm:table-cell">GC</th>
                                            <th className="px-3 py-3 font-medium text-gray-500 text-center w-12 hidden sm:table-cell">SG</th>
                                            <th className="px-2 py-3 font-medium text-gray-500 text-center w-8">
                                                <div className="w-3 h-4 bg-yellow-400 mx-auto rounded-[1px] shadow-sm" title="Cartões Amarelos"></div>
                                            </th>
                                            <th className="px-2 py-3 font-medium text-gray-500 text-center w-8">
                                                <div className="w-3 h-4 bg-red-500 mx-auto rounded-[1px] shadow-sm" title="Cartões Vermelhos"></div>
                                            </th>
                                            <th className="px-3 py-3 font-medium text-gray-500 text-center w-12 hidden md:table-cell">%</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {group.teams.map((team, teamIndex) => (
                                            <tr key={team.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="relative px-4 py-3 text-center">
                                                    {/* Qualification Indicator */}
                                                    {teamIndex < 2 && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 h-full"></div>
                                                    )}
                                                    <span className={`font-black text-sm ${teamIndex < 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {teamIndex + 1}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {team.flagUrl ? (
                                                            <img src={team.flagUrl} alt="" className="w-6 h-4 object-cover rounded-[1px] shadow-sm border border-gray-100" />
                                                        ) : (
                                                            <div className="w-6 h-4 bg-gray-100 rounded-[1px]"></div>
                                                        )}
                                                        <span className="font-bold text-gray-800 text-sm tracking-tight group-hover:text-blue-700 transition-colors uppercase">
                                                            {team.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 text-center font-black text-gray-900 bg-gray-50/30">{team.points}</td>
                                                <td className="px-3 py-3 text-center text-gray-600 font-medium">{team.gamesPlayed}</td>
                                                <td className="px-3 py-3 text-center text-gray-600">{team.wins}</td>
                                                <td className="px-3 py-3 text-center text-gray-600">{team.draws}</td>
                                                <td className="px-3 py-3 text-center text-gray-600">{team.losses}</td>
                                                <td className="px-3 py-3 text-center text-gray-600 hidden sm:table-cell">{team.goalsFor}</td>
                                                <td className="px-3 py-3 text-center text-gray-600 hidden sm:table-cell">{team.goalsAgainst}</td>
                                                <td className={`px-3 py-3 text-center font-bold hidden sm:table-cell ${team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                                                </td>
                                                {/* Yellow Cards */}
                                                <td className="px-2 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button 
                                                            onClick={() => handleUpdateCards(team.id, 1, -1)} 
                                                            className="w-5 h-5 flex items-center justify-center rounded bg-gray-200 hover:bg-red-400 hover:text-white text-gray-600 transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-gray-500 font-bold min-w-[16px] text-center">{team.yellowCards || 0}</span>
                                                        <button 
                                                            onClick={() => handleUpdateCards(team.id, 1, 1)} 
                                                            className="w-5 h-5 flex items-center justify-center rounded bg-gray-200 hover:bg-green-500 hover:text-white text-gray-600 transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                {/* Red Cards */}
                                                <td className="px-2 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button 
                                                            onClick={() => handleUpdateCards(team.id, 2, -1)} 
                                                            className="w-5 h-5 flex items-center justify-center rounded bg-gray-200 hover:bg-red-400 hover:text-white text-gray-600 transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-red-600 font-bold min-w-[16px] text-center">{team.redCards || 0}</span>
                                                        <button 
                                                            onClick={() => handleUpdateCards(team.id, 2, 1)} 
                                                            className="w-5 h-5 flex items-center justify-center rounded bg-gray-200 hover:bg-green-500 hover:text-white text-gray-600 transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 text-center text-gray-400 text-[11px] hidden md:table-cell font-medium tracking-tighter">
                                                    {calculateEfficiency(team.points, team.gamesPlayed)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Legend - Only after the first group or at bottom if needed */}
                            {index === 0 && (
                                <div className="mt-3 flex flex-wrap items-center gap-6 px-1">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Fase de Mata-Mata</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-3 bg-yellow-400 rounded-[1px]"></div>
                                            <span className="text-[10px] text-gray-400 font-medium">Amarelos</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-3 bg-red-500 rounded-[1px]"></div>
                                            <span className="text-[10px] text-gray-400 font-medium">Vermelhos</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default GrupsPage;