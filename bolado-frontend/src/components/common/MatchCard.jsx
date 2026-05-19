import React from 'react';
import { Pencil, Save, X, Trophy, Hash, Calendar } from 'lucide-react';
import { useMatchCard } from '../../hooks/useMatchCard';
import { getMatchLabel as getKnockoutLabel, getTeamDescription } from '../../utils/matchLabels';

const MatchCard = ({ match, onUpdate, stageName, matchIndex }) => {
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
        handleCancel,
        formatTime,
        getTeamAbbr,
        getFlag
    } = useMatchCard(match, onUpdate);

    // Helper for Group display
    const rawGroupName = match.homeTeam?.group || match.homeTeam?.Group || '-';

    const getMatchLabel = () => {
        const isKnockout = stageName && !stageName.toLowerCase().includes('fase de grupos');
        
        if (isKnockout && match.id >= 73) {
            return `Jogo ${match.id}`;
        }

        if (!stageName || stageName.toLowerCase().includes('fase de grupos')) {
            return rawGroupName;
        }

        return stageName;
    };

    const displayLabel = getMatchLabel();
    const isKnockout = stageName && !stageName.toLowerCase().includes('fase de grupos');

    // Get Team Names/Descriptions
    const homeTeamName = match.homeTeam ? getTeamAbbr(match.homeTeam) : (isKnockout ? getTeamDescription(match.id, 'home') : 'A Definir');
    const awayTeamName = match.awayTeam ? getTeamAbbr(match.awayTeam) : (isKnockout ? getTeamDescription(match.id, 'away') : 'A Definir');

    // Status check for live/finished
    const isFinished = match.status === 'Finished' || match.status === 2;

    return (
        <div className={`p-4 rounded-2xl border transition-all relative group shadow-sm hover:shadow-md ${
            isKnockout 
            ? 'bg-gradient-to-br from-white to-indigo-50 border-indigo-100 shadow-indigo-100/50' 
            : 'bg-white border-gray-100'
        }`}>

            {/* Admin Edit Button */}
            {isAdmin && !isEditing && match.homeTeam && match.awayTeam && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -top-2 -right-2 bg-white p-1.5 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-lg z-10 border border-blue-100"
                    title="Editar Resultado"
                >
                    <Pencil size={14} />
                </button>
            )}

            {/* Top Row: Info and Date */}
            <div className="flex items-center justify-between mb-4">
                <div 
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider shadow-sm ${
                        isKnockout 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-500'
                    }`}
                >
                    <Hash size={10} className="opacity-70" />
                    {displayLabel}
                </div>
                
                <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar size={12} className={isKnockout ? 'text-indigo-400' : ''} />
                    <span className="text-[10px] font-bold">
                        {formatTime(match.matchDate)}
                    </span>
                </div>
            </div>

            {/* Teams and Score Row */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 min-w-0">
                    <div className="relative">
                        {getFlag(match.homeTeam) ? (
                            <img
                                src={getFlag(match.homeTeam)}
                                alt={homeTeamName}
                                className="w-12 h-9 object-cover rounded-md shadow-sm border border-gray-100"
                            />
                        ) : (
                            <div className="w-12 h-9 bg-gray-50 border border-dashed border-gray-200 rounded-md flex items-center justify-center">
                                <Trophy size={16} className="text-gray-200" />
                            </div>
                        )}
                    </div>
                    <span className={`text-[11px] md:text-xs font-black text-center leading-tight truncate w-full ${!match.homeTeam && isKnockout ? 'text-indigo-400 italic' : 'text-gray-700'}`}>
                        {homeTeamName}
                    </span>
                </div>

                {/* Score / Inputs */}
                <div className="flex flex-col items-center justify-center px-2">
                    <div className={`flex items-center justify-center min-w-[70px] font-black rounded-xl py-2 px-3 shadow-inner ${
                        isEditing ? 'bg-white border-2 border-blue-500' : 'bg-gray-50 text-gray-800'
                    }`}>
                        {isEditing ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={homeScore}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (!isNaN(val) && val >= 0) setHomeScore(val);
                                            else if (e.target.value === "") setHomeScore("");
                                        }}
                                        className="w-10 h-10 text-center text-lg border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <span className="text-gray-300">×</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={awayScore}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (!isNaN(val) && val >= 0) setAwayScore(val);
                                            else if (e.target.value === "") setAwayScore("");
                                        }}
                                        className="w-10 h-10 text-center text-lg border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex justify-center gap-2">
                                    <button onClick={handleSave} disabled={loading} className="p-1 bg-green-500 text-white rounded-md hover:bg-green-600 shadow-sm">
                                        <Save size={14} />
                                    </button>
                                    <button onClick={handleCancel} className="p-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            isFinished || match.status === 2 || (match.homeTeamScore !== null) ? (
                                <span className="text-xl tracking-[0.2em]">{homeScore} <span className="text-gray-300 text-sm">×</span> {awayScore}</span>
                            ) : (
                                <span className="text-xs uppercase text-gray-400 tracking-widest">vs</span>
                            )
                        )}
                    </div>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-2 min-w-0">
                    <div className="relative">
                        {getFlag(match.awayTeam) ? (
                            <img
                                src={getFlag(match.awayTeam)}
                                alt={awayTeamName}
                                className="w-12 h-9 object-cover rounded-md shadow-sm border border-gray-100"
                            />
                        ) : (
                            <div className="w-12 h-9 bg-gray-50 border border-dashed border-gray-200 rounded-md flex items-center justify-center">
                                <Trophy size={16} className="text-gray-200" />
                            </div>
                        )}
                    </div>
                    <span className={`text-[11px] md:text-xs font-black text-center leading-tight truncate w-full ${!match.awayTeam && isKnockout ? 'text-indigo-400 italic' : 'text-gray-700'}`}>
                        {awayTeamName}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MatchCard;