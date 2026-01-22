import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useNavbar = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const hasGameMake = user && (user.GameMake === 'true' || user.gamemake === 'true' || user.GameMake === true || user.gamemake === true);

    return {
        user,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        handleLogout,
        hasGameMake,
        navigate
    };
};
