import React from 'react';
import Navbar from '../../components/common/Navibar';
import { Loader2, Printer, Calendar, CheckCircle } from 'lucide-react';
import { useMyGame } from '../../hooks/useMyGame';

const MyGame = () => {
    const { user, predictions, loading, handlePrint } = useMyGame();

    const getStageName = (stage) => {
        const stages = {
            0: "1ª Rodada (Fase de Grupos)",
            1: "2ª Rodada (Fase de Grupos)",
            2: "3ª Rodada (Fase de Grupos)",
            3: "32-avos de Final",
            4: "Oitavas de Final",
            5: "Quartas de Final",
            6: "Semifinais",
            7: "Terceiro Lugar",
            8: "Final"
        };
        return stages[stage] || "Outros";
    };

    const groupedPredictions = (predictions || []).reduce((groups, pred) => {
        const stage = pred.match?.stage ?? 'unknown';
        if (!groups[stage]) {
            groups[stage] = [];
        }
        groups[stage].push(pred);
        return groups;
    }, {});

    const sortedStages = Object.keys(groupedPredictions).sort((a, b) => Number(a) - Number(b));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!predictions || predictions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h2 className="text-xl font-semibold text-gray-700">Nenhum palpite encontrado.</h2>
                    <p className="text-gray-500">Você ainda não salvou seu jogo.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col print:bg-white print:min-h-0">
            <div className="print:hidden">
                <Navbar />
            </div>

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 pt-24 print:pt-4 print:px-0 print:max-w-none">
                <div className="flex items-center justify-between mb-8 print:hidden">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Meu Jogo</h1>
                        <p className="text-gray-500 mt-1">Confira seus palpites salvos.</p>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                    >
                        <Printer size={20} />
                        Imprimir
                    </button>
                </div>

                <div className="hidden print:block mb-6 text-center border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Bolão - Meus Palpites</h1>
                    <p className="text-gray-600">Participante: <span className="font-semibold">{user?.name}</span></p>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>

                {!predictions || predictions.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
                        <p className="text-gray-500 font-medium">Nenhum palpite encontrado.</p>
                        <p className="text-gray-400 text-sm mt-1">Você ainda não salvou seu jogo.</p>
                    </div>
                ) : (
                    <div className="space-y-10 print:space-y-4">
                        {sortedStages.map((stageKey) => (
                            <div key={stageKey} className="space-y-4 print:space-y-2">
                                {/* Stage Header */}
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-black text-blue-900 uppercase tracking-wider">
                                        {getStageName(Number(stageKey))}
                                    </h2>
                                    <div className="flex-grow h-px bg-blue-100"></div>
                                </div>

                                {/* Web View - Cards Layout (Hidden in Print) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden text-sm">
                                    {groupedPredictions[stageKey].map((pred) => {
                                        const match = pred.match;
                                        if (!match) return null;

                                        return (
                                            <div key={pred.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-200 transition-colors">
                                                <div className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(match.matchDate).toLocaleDateString()}
                                                    <span className="mx-1">•</span>
                                                    {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {pred.pointsGained > 0 && (
                                                        <span className="ml-auto bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                                                            <CheckCircle size={10} />
                                                            +{pred.pointsGained} pts
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between gap-2">
                                                    {/* Home */}
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

                                                    {/* Score */}
                                                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                                        <span className="font-bold text-lg text-gray-900 w-6 text-center">{pred.homeTeamScore}</span>
                                                        <span className="text-gray-400 text-xs">x</span>
                                                        <span className="font-bold text-lg text-gray-900 w-6 text-center">{pred.awayTeamScore}</span>
                                                    </div>

                                                    {/* Away */}
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

                                                {/* Real Score Badge (if match finished) */}
                                                {match.status === 2 && (
                                                    <div className="mt-3 pt-3 border-t border-gray-50 flex justify-center items-center gap-2 text-[10px] text-gray-400 font-medium italic">
                                                        Placar real: {match.homeTeamScore} - {match.awayTeamScore}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Optimized Print View - Compact List (Only visible in Print) */}
                                <div className="hidden print:grid print:grid-cols-2 lg:print:grid-cols-3 print:gap-x-6 print:gap-y-0 text-[8px] leading-tight">
                                    {groupedPredictions[stageKey].map((pred) => {
                                        const match = pred.match;
                                        const homeName = match?.homeTeam?.name || pred.homeTeam?.name || 'TBD';
                                        const awayName = match?.awayTeam?.name || pred.awayTeam?.name || 'TBD';
                                        return (
                                            <div key={pred.id} className="flex items-center justify-between border-b border-gray-100 py-0.5 overflow-hidden">
                                                <span className="truncate w-[40%] text-right pr-1 font-medium">{homeName}</span>
                                                <span className={`w-[20%] text-center font-bold border-x border-gray-100 px-1 mx-1 ${pred.pointsGained > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50'}`}>
                                                    {pred.homeTeamScore} x {pred.awayTeamScore}
                                                </span>
                                                <span className="truncate w-[40%] text-left pl-1 font-medium">{awayName}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Signature Field - Only visible in Print */}
                <div className="hidden print:block mt-6 pt-4 border-t border-gray-400 break-inside-avoid">
                    <div className="flex justify-between items-end">
                        <div className="text-[10px] text-gray-600">
                            <p>Data de emissão: {new Date().toLocaleString()}</p>
                            <p>Sistema de Bolão - {predictions.length} palpites registrados</p>
                        </div>
                        <div className="text-center">
                            <div className="w-48 h-px bg-black mb-1"></div>
                            <p className="font-semibold text-[10px] text-gray-900">Assinatura do Participante</p>
                            <p className="text-[10px] text-gray-600">{user?.name}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyGame;