import React from 'react';
import Navbar from '../../components/common/Navibar';
import { Loader2 } from 'lucide-react';
import { useGrups } from '../../hooks/useGrups';

const GrupsPage = () => {
    const { groups, loading } = useGrups();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 pt-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Classificação</h1>
                    <p className="text-gray-500 mt-1">Acompanhe a situação de cada grupo.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.groupName} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h3 className="font-bold text-gray-800">Grupo {group.groupName}</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
                                        <tr>
                                            <th className="px-3 py-2 w-8 text-center">#</th>
                                            <th className="px-3 py-2">Seleção</th>
                                            <th className="px-2 py-2 text-center" title="Pontos">P</th>
                                            <th className="px-2 py-2 text-center hidden sm:table-cell" title="Jogos">J</th>
                                            <th className="px-2 py-2 text-center hidden sm:table-cell" title="Vitórias">V</th>
                                            <th className="px-2 py-2 text-center hidden sm:table-cell" title="Empates">E</th>
                                            <th className="px-2 py-2 text-center hidden sm:table-cell" title="Derrotas">D</th>
                                            <th className="px-2 py-2 text-center" title="Saldo de Gols">SG</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {group.teams.map((team, index) => (
                                            <tr key={team.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className={`px-3 py-2 text-center font-medium ${index < 2 ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {index + 1}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        {team.flagUrl ? (
                                                            <img src={team.flagUrl} alt="" className="w-5 h-3.5 object-cover rounded shadow-sm" />
                                                        ) : (
                                                            <div className="w-5 h-3.5 bg-gray-200 rounded"></div>
                                                        )}
                                                        <span className="font-medium text-gray-900 truncate max-w-[100px]">{team.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2 text-center font-bold text-gray-900">{team.points}</td>
                                                <td className="px-2 py-2 text-center text-gray-500 hidden sm:table-cell">{team.gamesPlayed}</td>
                                                <td className="px-2 py-2 text-center text-gray-500 hidden sm:table-cell">{team.wins}</td>
                                                <td className="px-2 py-2 text-center text-gray-500 hidden sm:table-cell">{team.draws}</td>
                                                <td className="px-2 py-2 text-center text-gray-500 hidden sm:table-cell">{team.losses}</td>
                                                <td className="px-2 py-2 text-center text-gray-600 font-medium">{team.goalDifference}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default GrupsPage;