import React from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { useMatchCard } from '../../hooks/useMatchCard';

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

    // Letter to Number mapping for Knockout phases (Handles A=1, B=2... Q=17...)
    const letterToNumber = (val) => {
        if (!val || val === '-') return '-';
        const str = val.toString().trim();
        
        // If it's a single letter, map A->1, B->2, etc.
        if (str.length === 1) {
            const code = str.toUpperCase().charCodeAt(0);
            if (code >= 65 && code <= 90) return (code - 64).toString();
        }
        
        // If it already contains numbers (e.g., "17" or "R32-17"), extract the number
        const match = str.match(/\d+/);
        if (match) return match[0];

        return str;
    };

    const getMatchLabel = () => {
        if (!stageName || stageName.toLowerCase().includes('fase de grupos')) {
            return rawGroupName;
        }

        const lowerStage = stageName.toLowerCase();
        
        // Always use matchIndex for knockout stages to ensure sequential 1-16 numbering
        const num = matchIndex || '-';

        if (lowerStage.includes('segunda fase') || lowerStage.includes('32-avos')) {
            return `Décima Sextas de Final ${num}`;
        }
        if (lowerStage.includes('oitavas')) {
            return `Oitavas de Final ${num}`;
        }
        if (lowerStage.includes('quartas')) {
            return `Quartas de Final ${num}`;
        }
        if (lowerStage.includes('semi')) {
            return `Semifinal ${num}`;
        }
        if (lowerStage.includes('final')) {
            return "Final";
        }

        return `${stageName} ${num}`;
    };

    const displayLabel = getMatchLabel();
    const isKnockout = stageName && !stageName.toLowerCase().includes('fase de grupos');

    // Status check for live/finished
    const isFinished = match.status === 'Finished' || match.status === 2;

    return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-2 relative group">

            {/* Admin Edit Button */}
            {isAdmin && !isEditing && match.homeTeam && match.awayTeam && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -top-2 -right-2 bg-blue-50 p-1.5 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-sm z-10 border border-blue-100"
                    title="Editar Resultado"
                >
                    <Pencil size={14} />
                </button>
            )}

            {/* Left: Phase/Group and Time */}
            <div className={`flex flex-col gap-1 ${isKnockout ? 'min-w-[120px]' : 'w-24'}`}>
                {/* Badge */}
                <div 
                    className={`flex items-center justify-center font-bold bg-gray-100 text-gray-600 shadow-sm ${
                        isKnockout 
                        ? 'px-2 py-1 rounded text-[9px] uppercase tracking-tighter text-center leading-tight' 
                        : 'w-8 h-8 rounded-full text-xs'
                    }`}
                    title={displayLabel}
                >
                    {displayLabel}
                </div>
                {/* Time */}
                <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">
                    {formatTime(match.matchDate)}
                </span>
            </div>

            {/* Middle: Teams and Score */}
            <div className="flex items-center justify-center flex-1 gap-4">
                {/* Home Team */}
                <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
                    <span className="text-sm font-bold text-gray-900 truncate">
                        {getTeamAbbr(match.homeTeam)}
                    </span>
                    {getFlag(match.homeTeam) && (
                        <img
                            src={getFlag(match.homeTeam)}
                            alt={getTeamAbbr(match.homeTeam)}
                            className="w-8 h-6 object-cover rounded shadow-sm"
                        />
                    )}
                </div>

                {/* Score or Inputs */}
                <div className="flex items-center justify-center min-w-[60px] font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded">
                    {isEditing ? (
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
                                className="w-8 h-8 text-center text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <span className="text-gray-400 text-xs">x</span>
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
                                className="w-8 h-8 text-center text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <div className="flex gap-1 ml-2">
                                <button onClick={handleSave} disabled={loading} className="text-green-600 hover:text-green-700">
                                    <Save size={16} />
                                </button>
                                <button onClick={handleCancel} className="text-red-500 hover:text-red-600">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        isFinished || match.status === 2 || (match.homeTeamScore !== null) ? (
                            <span className="text-lg tracking-widest">{homeScore} <span className="text-gray-400 text-sm">x</span> {awayScore}</span>
                        ) : (
                            <span className="text-sm text-gray-400">vs</span>
                        )
                    )}
                </div>

                {/* Away Team */}
                <div className="flex items-center justify-start gap-2 flex-1 min-w-0">
                    {getFlag(match.awayTeam) && (
                        <img
                            src={getFlag(match.awayTeam)}
                            alt={getTeamAbbr(match.awayTeam)}
                            className="w-8 h-6 object-cover rounded shadow-sm"
                        />
                    )}
                    <span className="text-sm font-bold text-gray-900 truncate">
                        {getTeamAbbr(match.awayTeam)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MatchCard;