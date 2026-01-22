import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../services/api';

export const useHome = () => {
    const [stageGroups, setStageGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.GET_MATCHES);
                if (!response.ok) throw new Error('Erro na rede');
                const data = await response.json();

                // Debug logging
                console.log('API Response:', data);
                console.log('First stage group:', data[0]);
                console.log('Total stage groups:', data.length);

                setStageGroups(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao buscar jogos:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    return {
        stageGroups,
        loading,
        error
    };
};
