import React from 'react';
import Navbar from '../../components/common/Navibar';
import { Loader2, Printer, Calendar } from 'lucide-react';
import { useMyGame } from '../../hooks/useMyGame';

const MyGame = () => {
    const { user, predictions, loading, handlePrint } = useMyGame();

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4 text-sm">
                    {predictions.map((pred) => {
                        const match = pred.match;
                        if (!match) return null;

                        return (
                            <div key={pred.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm print:shadow-none print:border-gray-300 break-inside-avoid">
                                <div className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(match.matchDate).toLocaleDateString()}
                                    <span className="mx-1">•</span>
                                    {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded border border-gray-100 print:border-gray-300">
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
                            </div>
                        );
                    })}
                </div>

                {/* Signature Field - Only visible in Print */}
                <div className="hidden print:block mt-12 pt-8 border-t-2 border-gray-300 break-inside-avoid">
                    <div className="flex justify-between items-end">
                        <div className="text-sm text-gray-500">
                            <p>Data de emissão: {new Date().toLocaleString()}</p>
                            <p>Sistema de Bolão</p>
                        </div>
                        <div className="text-center">
                            <div className="w-64 h-px bg-black mb-2"></div>
                            <p className="font-medium text-gray-900">Assinatura do Participante</p>
                            <p className="text-sm text-gray-500">{user?.name}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyGame;