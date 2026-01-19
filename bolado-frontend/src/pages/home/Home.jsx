import React, { useEffect, useState } from 'react';
import { Trophy, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../../components/common/Navibar';
import MatchGrid from '../../components/common/MatchGrid';
import { API_ENDPOINTS } from '../../services/api';

const HomePage = () => {
    const [stageGroups, setStageGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.GET_MATCHES);
                if (!response.ok) throw new Error('Erro na rede');
                const data = await response.json();

                // Debug logging
                console.log('API Response:', data);
                console.log('First stage group:', data[0]);
                console.log('Total stage groups:', data.length);

                setStageGroups(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao buscar jogos:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="w-full">
                <Navbar />
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Calendário da Copa</h1>
                        <p className="text-gray-500 mt-1">Bolao Gigliotti Copa 2026.</p>
                    </div>
                    <Trophy className="text-yellow-500 w-10 h-10" />
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
                        <p className="text-gray-500 font-medium">Carregando partidas...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
                        <AlertCircle />
                        <span>Não foi possível conectar ao servidor (localhost:8080). Verifique se o backend está rodando.</span>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {stageGroups.map((stageGroup, index) => (
                            <MatchGrid
                                key={index}
                                title={stageGroup.stageName}
                                matches={stageGroup.matchs}
                            />
                        ))}

                        {stageGroups.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-lg">Nenhuma partida encontrada no banco de dados.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;