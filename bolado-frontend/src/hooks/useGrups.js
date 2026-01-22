import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../services/api';
import toast from 'react-hot-toast';

export const useGrups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.GET_GROUPS);
            if (!response.ok) throw new Error('Falha ao carregar grupos');
            const data = await response.json();
            setGroups(data);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar a classificação dos grupos.");
        } finally {
            setLoading(false);
        }
    };

    return {
        groups,
        loading
    };
};
