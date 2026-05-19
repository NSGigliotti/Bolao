import React from 'react';
import { Trophy, Save, Loader2, Calendar, AlertCircle, ChevronRight, Check } from 'lucide-react';
import Navbar from '../../components/common/Navibar';
import { useGameMake } from '../../hooks/useGameMake';
import { getMatchLabel, getTeamDescription } from '../../utils/matchLabels';

const GameMake = () => {
    const {
        matches,
        loading,
        submitting,
        predictions,
        activeTab,
        simulatedTeams,
        savingMatches,
        savedMatches,
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

        const isKnockout = match.stage >= 3;
        const matchLabel = isKnockout ? getMatchLabel(match.id, activeTab) : null;

        return (
            <div key={match.id} className={`p-5 rounded-2xl border transition-all relative group shadow-sm hover:shadow-md flex flex-col gap-4 bg-white ${headerLabel ? 'border-t-4 border-t-yellow-400' : 'border-gray-100'}`}>
                
                {/* Status Indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {savingMatches[match.id] && (
                        <div className="flex items-center gap-1 text-blue-500 animate-pulse">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span className="text-[10px] font-bold uppercase">Salvando</span>
                        </div>
                    )}
                    {!savingMatches[match.id] && savedMatches[match.id] && (
                        <div className="flex items-center gap-1 text-green-500">
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase">Salvo</span>
                        </div>
                    )}
                </div>

                {/* Header: Label and Date */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        {headerLabel && (
                            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-[9px] font-black rounded-full uppercase tracking-widest self-start">
                                {headerLabel}
                            </span>
                        )}
                        {isKnockout && !headerLabel && (
                            <span className="px-2.5 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase tracking-wider self-start flex items-center gap-1 shadow-sm">
                                <Hash size={8} /> {matchLabel}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar size={12} className={isKnockout ? 'text-indigo-400' : ''} />
                        <span className="text-[10px] font-bold">
                            {new Date(match.matchDate).toLocaleDateString().slice(0, 5)} {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>

                {/* Teams and Score Grid */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-2 min-w-0">
                        <div className="relative">
                            {homeTeam && homeTeam.flagUrl ? (
                                <img src={homeTeam.flagUrl} alt={homeTeam.name} className="w-14 h-10 object-cover rounded-md shadow-sm border border-gray-100" />
                            ) : (
                                <div className="w-14 h-10 bg-indigo-50 border border-indigo-100 rounded-md flex items-center justify-center">
                                    <Trophy size={18} className="text-indigo-200" />
                                </div>
                            )}
                        </div>
                        <span className={`text-xs font-black text-center leading-tight truncate w-full ${!homeTeam ? 'text-indigo-400 italic text-[10px]' : 'text-gray-800'}`}>
                            {homeTeam ? homeTeam.name : getTeamDescription(match.id, 'home')}
                        </span>
                    </div>

                    {/* Score / Inputs */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                className={`w-12 h-12 text-center font-black text-xl border-2 rounded-xl outline-none transition-all shadow-sm ${!homeTeam || !awayTeam
                                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                                    : (isKnockout && predictions[match.id]?.home === predictions[match.id]?.away && predictions[match.id]?.home !== '' && predictions[match.id]?.home !== undefined)
                                        ? 'border-red-400 bg-red-50 text-red-600 focus:ring-red-100'
                                        : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                                    }`}
                                value={predictions[match.id]?.home ?? ''}
                                onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                                onBlur={(e) => handleBlur(match.id, 'home', e.target.value)}
                                disabled={!homeTeam || !awayTeam}
                            />
                            <span className="text-gray-200 font-black text-xl">×</span>
                            <input
                                type="number"
                                min="0"
                                className={`w-12 h-12 text-center font-black text-xl border-2 rounded-xl outline-none transition-all shadow-sm ${!homeTeam || !awayTeam
                                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                                    : (isKnockout && predictions[match.id]?.home === predictions[match.id]?.away && predictions[match.id]?.home !== '' && predictions[match.id]?.home !== undefined)
                                        ? 'border-red-400 bg-red-50 text-red-600 focus:ring-red-100'
                                        : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                                    }`}
                                value={predictions[match.id]?.away ?? ''}
                                onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                                onBlur={(e) => handleBlur(match.id, 'away', e.target.value)}
                                disabled={!homeTeam || !awayTeam}
                            />
                        </div>
                        {isKnockout && predictions[match.id]?.home === predictions[match.id]?.away && predictions[match.id]?.home !== '' && predictions[match.id]?.home !== undefined && (
                            <span className="text-[9px] text-red-500 font-black uppercase tracking-widest flex items-center gap-1 animate-bounce">
                                <AlertCircle size={10} /> Empate não permitido
                            </span>
                        )}
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2 min-w-0">
                        <div className="relative">
                            {awayTeam && awayTeam.flagUrl ? (
                                <img src={awayTeam.flagUrl} alt={awayTeam.name} className="w-14 h-10 object-cover rounded-md shadow-sm border border-gray-100" />
                            ) : (
                                <div className="w-14 h-10 bg-indigo-50 border border-indigo-100 rounded-md flex items-center justify-center">
                                    <Trophy size={18} className="text-indigo-200" />
                                </div>
                            )}
                        </div>
                        <span className={`text-xs font-black text-center leading-tight truncate w-full ${!awayTeam ? 'text-indigo-400 italic text-[10px]' : 'text-gray-800'}`}>
                            {awayTeam ? awayTeam.name : getTeamDescription(match.id, 'away')}
                        </span>
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
                        title={!isTournamentComplete ? "Preencha todos os jogos para finalizar" : "Finalizar Palpites"}
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Finalizar Palpites
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