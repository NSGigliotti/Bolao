import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../services/api';
import toast from 'react-hot-toast';

export const useGrups = () => {
    const [groups, setGroups] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const [groupsRes, matchesRes] = await Promise.all([
                fetch(API_ENDPOINTS.GET_GROUPS),
                fetch(API_ENDPOINTS.GET_MATCHES)
            ]);
            
            if (!groupsRes.ok || !matchesRes.ok) throw new Error('Falha ao carregar dados');
            
            const groupsData = await groupsRes.json();
            const matchesData = await matchesRes.json();
            
            // matchesData is an array of Stage groups: [{ stageName: "...", matchs: [...] }, ...]
            // We need a flat list of group stage matches
            const flatMatches = matchesData
                .filter(stage => stage.stageName.includes('Fase de Grupos') || stage.stageName.includes('Rodada'))
                .flatMap(stage => stage.matchs);

            setGroups(groupsData);
            setMatches(flatMatches);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar os dados dos grupos.");
        } finally {
            setLoading(false);
        }
    };

    return {
        groups,
        matches,
        loading,
        refresh: fetchGroups
    };
};
