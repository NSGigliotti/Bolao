import React from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { useMatchCard } from '../../hooks/useMatchCard';

const MatchCard = ({ match }) => {
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
        formatTime,
        getTeamAbbr,
        getFlag
    } = useMatchCard(match);

    // Helper for Group display
    const groupName = match.homeTeam?.group || match.homeTeam?.Group || '-';

    // Status check for live/finished
    const isFinished = match.status === 'Finished' || match.status === 2;

    return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-2 relative group">

            {/* Admin Edit Button */}
            {isAdmin && !isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -top-2 -right-2 bg-blue-50 p-1.5 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-sm z-10 border border-blue-100"
                    title="Editar Resultado"
                >
                    <Pencil size={14} />
                </button>
            )}

            {/* Left: Group and Time */}
            <div className="flex items-center gap-3 w-24">
                {/* Group Badge */}
                <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold text-xs shrink-0" title={`Grupo ${groupName}`}>
                    {groupName}
                </div>
                {/* Time */}
                <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">
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
                                value={homeScore}
                                onChange={(e) => setHomeScore(e.target.value)}
                                className="w-8 h-8 text-center text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <span className="text-gray-400 text-xs">x</span>
                            <input
                                type="number"
                                value={awayScore}
                                onChange={(e) => setAwayScore(e.target.value)}
                                className="w-8 h-8 text-center text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <div className="flex gap-1 ml-2">
                                <button onClick={handleSave} disabled={loading} className="text-green-600 hover:text-green-700">
                                    <Save size={16} />
                                </button>
                                <button onClick={() => setIsEditing(false)} className="text-red-500 hover:text-red-600">
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