import React from 'react';
import MatchCard from './MatchCard';

const MatchGrid = ({ title, matches }) => {
    if (!matches || matches.length === 0) return null;

    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </div>
        </div>
    );
};

export default MatchGrid;
