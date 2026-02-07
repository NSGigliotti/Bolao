import React from 'react';
import { Trophy, Save, Loader2, Calendar, AlertCircle, ChevronRight } from 'lucide-react';
import Navbar from '../../components/common/Navibar';
import { useGameMake } from '../../hooks/useGameMake';

const GameMake = () => {
    const {
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
    } = useGameMake();

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
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    className={`w-10 h-10 md:w-12 md:h-12 text-center font-bold text-lg border-2 rounded-lg outline-none transition-all ${!homeTeam || !awayTeam
                                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                        : (match.stage >= 3 && predictions[match.id]?.home === predictions[match.id]?.away && predictions[match.id]?.home !== '' && predictions[match.id]?.home !== undefined)
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                        }`}
                                    value={predictions[match.id]?.home ?? ''}
                                    onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                                    onBlur={(e) => handleBlur(match.id, 'home', e.target.value)}
                                    disabled={!homeTeam || !awayTeam}
                                />
                                <span className="text-gray-300 font-bold">×</span>
                                <input
                                    type="number"
                                    min="0"
                                    className={`w-10 h-10 md:w-12 md:h-12 text-center font-bold text-lg border-2 rounded-lg outline-none transition-all ${!homeTeam || !awayTeam
                                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                        : (match.stage >= 3 && predictions[match.id]?.home === predictions[match.id]?.away && predictions[match.id]?.home !== '' && predictions[match.id]?.home !== undefined)
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                        }`}
                                    value={predictions[match.id]?.away ?? ''}
                                    onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                                    onBlur={(e) => handleBlur(match.id, 'away', e.target.value)}
                                    disabled={!homeTeam || !awayTeam}
                                />
                            </div>
                            {match.stage >= 3 && predictions[match.id]?.home === predictions[match.id]?.away && predictions[match.id]?.home !== '' && predictions[match.id]?.home !== undefined && (
                                <span className="text-[10px] text-red-500 font-bold uppercase tracking-tight flex items-center gap-1">
                                    <AlertCircle size={10} /> Empate não permitido
                                </span>
                            )}
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
                <div className="space-y-8">
                    {activeTab === 'Groups' ? (
                        [0, 1, 2].map(stage => {
                            const stageMatches = groupedMatches['Groups'].filter(m => m.stage === stage);
                            if (stageMatches.length === 0) return null;

                            return (
                                <div key={stage} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">
                                            {stage + 1}ª Rodada
                                        </h2>
                                        <div className="flex-grow h-px bg-gray-200"></div>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {stageMatches.map(match => renderMatch(match))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
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

                    {/* Next Stage Button */}
                    {activeTab !== 'Final' && (
                        <div className="flex justify-center pt-8 pb-12">
                            <button
                                onClick={() => {
                                    const currentIndex = tabs.indexOf(activeTab);
                                    if (currentIndex < tabs.length - 1) {
                                        const nextTab = tabs[currentIndex + 1];
                                        if (unlockedTabs.includes(nextTab)) {
                                            setActiveTab(nextTab);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }
                                }}
                                disabled={!unlockedTabs.includes(tabs[tabs.indexOf(activeTab) + 1])}
                                className={`flex items-center gap-2 px-8 py-4 font-bold rounded-2xl shadow-xl transition-all active:scale-95 ${!unlockedTabs.includes(tabs[tabs.indexOf(activeTab) + 1])
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200'
                                    }`}
                            >
                                Próxima Etapa
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default GameMake;