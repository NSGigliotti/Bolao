import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../services/api';
import toast from 'react-hot-toast';

export const useMatchCard = (match) => {
    const { user } = useAuthContext();
    const isAdmin = user?.IsAdmin === "True" || user?.IsAdmin === true || user?.role === 'Admin';

    const [isEditing, setIsEditing] = useState(false);
    const [homeScore, setHomeScore] = useState(match.homeTeamScore ?? 0);
    const [awayScore, setAwayScore] = useState(match.awayTeamScore ?? 0);
    const [loading, setLoading] = useState(false);

    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const getTeamAbbr = (team) => {
        if (!team) return 'TBD';
        return team.abbreviation || team.Abbreviation || 'TBD';
    };

    const getFlag = (team) => {
        if (!team || !team.flagUrl) return null;
        return team.flagUrl;
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.UPDATE_RESULT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    machID: match.id || match.Id,
                    homeTeamScore: parseInt(homeScore),
                    awayTeamScore: parseInt(awayScore)
                })
            });

            if (!response.ok) throw new Error('Falha ao atualizar resultado');

            toast.success('Resultado atualizado com sucesso!', {
                duration: 3000,
                position: 'top-center',
            });
            setIsEditing(false);
            // Optionally force refresh but localized state update shows instant feedback
            match.homeTeamScore = parseInt(homeScore);
            match.awayTeamScore = parseInt(awayScore);
            match.status = 2; // Assume finished
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return {
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
    };
};
