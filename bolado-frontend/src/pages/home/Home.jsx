import React, { useState, useMemo } from 'react';
import { Trophy, Loader2, AlertCircle, ChevronLeft, ChevronRight, Pencil, Save, X } from 'lucide-react';
import Navbar from '../../components/common/Navibar';
import MatchGrid from '../../components/common/MatchGrid';
import MatchCard from '../../components/common/MatchCard';
import { useHome } from '../../hooks/useHome';
import { useGrups } from '../../hooks/useGrups';
import { useMatchCard } from '../../hooks/useMatchCard';

const HomePage = () => {
    const { stageGroups, loading: loadingHome, error } = useHome();
    const { groups, loading: loadingGroups } = useGrups();
    const [activePhase, setActivePhase] = useState('Grupos');
    const [activeRound, setActiveRound] = useState(1);

    const phases = [
        { id: 'Grupos', label: 'Grupos' },
        { id: '32-avos', label: '32-avos' },
        { id: 'Oitavas', label: 'Oitavas' },
        { id: 'Quartas', label: 'Quartas' },
        { id: 'Semi', label: 'Semi' },
        { id: 'Final', label: 'Final' }
    ];

    const rounds = [
        { id: 1, label: '1ª RODADA' },
        { id: 2, label: '2ª RODADA' },
        { id: 3, label: '3ª RODADA' }
    ];

    const loading = loadingHome || loadingGroups;

    const calculateEfficiency = (points, gamesPlayed) => {
        if (!gamesPlayed) return '0';
        return ((points / (gamesPlayed * 3)) * 100).toFixed(0);
    };

    const formatMatchDate = (dateStr) => {
        const date = new Date(dateStr);
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const dayOfWeek = days[date.getDay()];
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return {
            formatted: `${day}/${month}`,
            dayOfWeek,
            time: `${hours}:${minutes}`
        };
    };

    // Sub-component for individual match items with admin editing capability
    const GroupMatchItem = ({ match }) => {
        const {
            isAdmin,
            isEditing,
            setIsEditing,
            homeScore,
            setHomeScore,
            awayScore,
            setAwayScore,
            loading,
            handleSave,
            handleCancel
        } = useMatchCard(match);

        const { formatted, dayOfWeek, time } = formatMatchDate(match.matchDate);

        return (
            <div className="py-6 px-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-all rounded-xl relative group/item">
                {/* Admin Pencil Icon */}
                {isAdmin && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute right-2 top-2 p-2 rounded-full bg-blue-50 text-blue-600 opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 transition-all hover:bg-blue-100 shadow-sm"
                        title="Editar resultado"
                    >
                        <Pencil size={12} className="lg:w-[14px] lg:h-[14px]" />
                    </button>
                )}

                {/* Match Header: Time and Venue (Stadium removed per user request) */}
                <div className="text-center mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        {formatted} • {dayOfWeek} • {time}
                    </span>
                </div>

                <div className="flex items-center justify-center gap-4">
                    {/* Home Team */}
                    <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1 min-w-0">
                        <span className="text-[12px] sm:text-[14px] font-black text-gray-900 uppercase italic tracking-tighter truncate text-right">
                            {match.homeTeam?.name || 'A definir'}
                        </span>
                        <img
                            src={match.homeTeam?.flagUrl || ''}
                            alt=""
                            className="w-8 h-5 sm:w-10 sm:h-6 object-cover rounded-[2px] shadow-sm border border-gray-100 shrink-0"
                        />
                    </div>

                    {/* Score / Edit Inputs */}
                    <div className="flex items-center justify-center min-w-[80px]">
                        {isEditing ? (
                            <div className="flex items-center gap-1.5">
                                <input
                                    type="number"
                                    value={homeScore}
                                    onChange={(e) => setHomeScore(e.target.value)}
                                    className="w-8 h-8 text-center font-black bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-gray-300 font-bold text-xs uppercase tracking-tighter">X</span>
                                <input
                                    type="number"
                                    value={awayScore}
                                    onChange={(e) => setAwayScore(e.target.value)}
                                    className="w-8 h-8 text-center font-black bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="flex flex-col gap-1 ml-1 scale-75">
                                    <button onClick={handleSave} disabled={loading} className="text-green-600 hover:text-green-700">
                                        <Save size={16} />
                                    </button>
                                    <button onClick={handleCancel} className="text-red-500 hover:text-red-600">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {match.homeTeamScore !== null ? (
                                    <>
                                        <span className="text-2xl font-black text-gray-900">{match.homeTeamScore}</span>
                                        <span className="text-gray-300 font-bold text-xs">X</span>
                                        <span className="text-2xl font-black text-gray-900">{match.awayTeamScore}</span>
                                    </>
                                ) : (
                                    <div className="px-3 py-1 bg-gray-50 rounded text-gray-300 font-black text-sm italic border border-gray-100">X</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <img
                            src={match.awayTeam?.flagUrl || ''}
                            alt=""
                            className="w-8 h-5 sm:w-10 sm:h-6 object-cover rounded-[2px] shadow-sm border border-gray-100 shrink-0"
                        />
                        <span className="text-[12px] sm:text-[14px] font-black text-gray-900 uppercase italic tracking-tighter truncate">
                            {match.awayTeam?.name || 'A definir'}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const filteredStageGroups = useMemo(() => {
        if (!stageGroups) return [];

        return stageGroups.filter(sg => {
            const name = sg.stageName.toLowerCase();
            switch (activePhase) {
                case 'Grupos':
                    const isGroupStage = name.includes('fase de grupos') || name.includes('group stage');
                    if (!isGroupStage) return false;

                    if (activeRound === 1) return name.includes('1ª') || name.includes('round 1');
                    if (activeRound === 2) return name.includes('2ª') || name.includes('round 2');
                    if (activeRound === 3) return name.includes('3ª') || name.includes('round 3');
                    return true;
                case '32-avos':
                    return name.includes('32-avos');
                case 'Oitavas':
                    return name.includes('oitavas');
                case 'Quartas':
                    return name.includes('quartas');
                case 'Semi':
                    return name.includes('semi');
                case 'Final':
                    return (name.includes('final') || name.includes('terceiro')) && !name.includes('oitavas') && !name.includes('quartas') && !name.includes('32-avos');
                default:
                    return true;
            }
        });
    }, [stageGroups, activePhase, activeRound]);

    // Unified Group Block Component with local state for individual navigation
    const GroupBlock = ({ group, stageGroups }) => {
        const [localRound, setLocalRound] = useState(1);

        // Find the stageGroup that corresponds to the active round for this group
        const groupStageGroup = stageGroups.find(sg => {
            const name = sg.stageName.toLowerCase();
            const isGroupStage = name.includes('fase de grupos') || name.includes('group stage');
            if (!isGroupStage) return false;

            if (localRound === 1) return name.includes('1ª') || name.includes('round 1');
            if (localRound === 2) return name.includes('2ª') || name.includes('round 2');
            if (localRound === 3) return name.includes('3ª') || name.includes('round 3');
            return true;
        });

        const groupMatches = groupStageGroup?.matchs.filter(m =>
            (m.homeTeam?.group === group.groupName || m.homeTeam?.Group === group.groupName)
        ) || [];

        return (
            <div key={group.groupName} className="mb-12 lg:mb-24 last:mb-0">
                {/* Group Title */}
                <div className="flex items-center gap-3 mb-6 lg:mb-8 border-b-2 border-gray-900 pb-2 w-fit pr-12">
                    <h2 className="text-2xl lg:text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Grupo {group.groupName.split(' ')[1] || group.groupName}</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                    {/* Standings (Left - 7 cols) */}
                    <div className="lg:col-span-7 flex flex-col">
                        <div className="bg-gray-50/50 border-y border-gray-100 mb-4 px-2">
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest py-2 block">Classificação</span>
                        </div>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr className="bg-white border-b-2 border-gray-50">
                                        <th className="px-1 py-3 lg:py-4 font-black text-gray-400 uppercase text-[10px] w-8">Pos</th>
                                        <th className="px-2 py-3 lg:py-4 font-black text-gray-400 uppercase text-[10px]">Seleção</th>
                                        <th className="px-2 py-3 lg:py-4 font-black text-gray-900 text-center w-10 bg-gray-50/50">P</th>
                                        <th className="px-2 py-3 lg:py-4 font-bold text-gray-400 text-center w-8">J</th>
                                        <th className="px-2 py-3 lg:py-4 font-bold text-gray-400 text-center w-8">V</th>
                                        <th className="px-2 py-3 lg:py-4 font-bold text-gray-400 text-center w-8">E</th>
                                        <th className="px-2 py-3 lg:py-4 font-bold text-gray-400 text-center w-8">D</th>
                                        <th className="px-2 py-3 lg:py-4 font-bold text-gray-400 text-center w-8">GP</th>
                                        <th className="px-2 py-3 lg:py-4 font-bold text-gray-400 text-center w-8">GC</th>
                                        <th className="px-2 py-3 lg:py-4 font-black text-gray-900 text-center w-10 bg-gray-50/50">SG</th>
                                        <th className="px-2 py-3 lg:py-4 font-bold text-gray-400 text-center w-12 text-[9px]">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {group.teams.map((team, idx) => (
                                        <tr key={team.id} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="px-1 py-4 text-center">
                                                <div className="flex items-center justify-center relative h-full">
                                                    {idx < 2 && <div className="absolute left-0 w-[4px] h-5 bg-blue-600 rounded-sm"></div>}
                                                    <span className={`text-[14px] font-black ${idx < 2 ? 'text-blue-600' : 'text-gray-400'}`}>{idx + 1}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={team.flagUrl} alt="" className="w-6 h-4 object-cover rounded-sm shadow-sm border border-gray-100" />
                                                    <span className="font-extrabold text-gray-900 uppercase tracking-tight text-[13px]">{team.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-4 text-center font-black text-[15px] text-gray-900 bg-gray-50/40">{team.points}</td>
                                            <td className="px-2 py-4 text-center text-gray-600 font-medium">{team.gamesPlayed}</td>
                                            <td className="px-2 py-4 text-center text-gray-500">{team.wins}</td>
                                            <td className="px-2 py-4 text-center text-gray-500">{team.draws}</td>
                                            <td className="px-2 py-4 text-center text-gray-500">{team.losses}</td>
                                            <td className="px-2 py-4 text-center text-gray-500">{team.goalsFor || 0}</td>
                                            <td className="px-2 py-4 text-center text-gray-500">{team.goalsAgainst || 0}</td>
                                            <td className={`px-2 py-4 text-center font-black text-[13px] bg-gray-50/20 ${team.goalDifference > 0 ? 'text-emerald-600' : team.goalDifference < 0 ? 'text-rose-500' : 'text-gray-400'}`}>
                                                {team.goalDifference}
                                            </td>
                                            <td className="px-2 py-4 text-center text-gray-400 font-black text-[10px] italic">
                                                {calculateEfficiency(team.points, team.gamesPlayed)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Matches (Right - 5 cols) */}
                    <div className="lg:col-span-5 lg:border-l border-gray-100 lg:pl-10">
                        {/* Compact Round Navigator */}
                        <div className="flex items-center justify-between border-y border-gray-100 py-3 mb-6 bg-white sticky top-0 z-20">
                            <button
                                onClick={() => setLocalRound(Math.max(1, localRound - 1))}
                                disabled={localRound === 1}
                                className="text-gray-300 hover:text-emerald-500 disabled:opacity-20 transition-all p-1"
                            >
                                <ChevronLeft size={28} strokeWidth={2.5} />
                            </button>
                            <span className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">
                                {localRound}ª RODADA
                            </span>
                            <button
                                onClick={() => setLocalRound(Math.min(3, localRound + 1))}
                                disabled={localRound === 3}
                                className="text-gray-300 hover:text-emerald-500 disabled:opacity-20 transition-all p-1"
                            >
                                <ChevronRight size={28} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Match List for this Group and Round */}
                        <div className="space-y-1">
                            {groupMatches.length > 0 ? groupMatches.map((match) => (
                                <GroupMatchItem key={match.id} match={match} />
                            )) : (
                                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest italic">Nenhuma partida nesta rodada</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="w-full">
                <Navbar />
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
                            Bolao <span className="text-blue-600">Gigliotti</span>
                        </h1>
                        <p className="text-gray-400 mt-2 font-bold tracking-tight uppercase text-xs">Tabela e Jogos da Copa do Mundo 2026</p>
                    </div>

                    <nav className="flex items-center bg-gray-100 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
                        {phases.map((phase) => (
                            <button
                                key={phase.id}
                                onClick={() => {
                                    setActivePhase(phase.id);
                                    if (phase.id !== 'Grupos') setActiveRound(1);
                                }}
                                className={`px-8 py-3 rounded-lg text-xs font-black uppercase transition-all duration-200 whitespace-nowrap tracking-widest ${activePhase === phase.id
                                    ? 'bg-white text-blue-600 shadow-md'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                    }`}
                            >
                                {phase.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 gap-6">
                        <Loader2 className="animate-spin text-blue-600 w-12 h-12 stroke-[3]" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm animate-pulse">Sincronizando dados...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-2xl flex items-center gap-4 mt-12">
                        <AlertCircle className="w-8 h-8" />
                        <span className="font-bold">Não foi possível conectar ao servidor. Verifique se o backend está rodando.</span>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {activePhase === 'Grupos' ? (
                            <div className="space-y-4">
                                {groups.map(group => (
                                    <GroupBlock key={group.groupName} group={group} stageGroups={stageGroups} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {filteredStageGroups.map((stageGroup, index) => (
                                    <MatchGrid
                                        key={index}
                                        title={stageGroup.stageName}
                                        matches={stageGroup.matchs}
                                    />
                                ))}
                            </div>
                        )}

                        {filteredStageGroups.length === 0 && (
                            <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <Trophy className="mx-auto w-16 h-16 text-gray-200 mb-6" />
                                <p className="text-gray-400 text-xl font-black uppercase tracking-tighter italic">Nenhuma partida encontrada nesta fase.</p>
                                <button
                                    onClick={() => {
                                        setActivePhase('Grupos');
                                        setActiveRound(1);
                                    }}
                                    className="mt-8 px-6 py-3 bg-blue-600 text-white font-black rounded-xl uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    Voltar para 1ª Rodada
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;