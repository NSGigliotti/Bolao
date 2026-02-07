import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../services/api';
import toast from 'react-hot-toast';

export const useMyGame = () => {
    const { user } = useAuthContext();
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            fetchUserPredictions();
        } else if (!user) {
            setLoading(false);
        }
    }, [user]);

    const fetchUserPredictions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.GET_MATCHES_BY_USER, {
                method: 'POST',
                headers: {
                    'bypass-tunnel-reminder': 'true',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user.id)
            });

            if (!response.ok) throw new Error('Falha ao carregar palpites');

            const data = await response.json();
            setPredictions(data);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar seus palpites.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return {
        user,
        predictions,
        loading,
        handlePrint
    };
};
