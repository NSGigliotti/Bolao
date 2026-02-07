import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '../pages/home/Home';
import NotFound from '../pages/not-found/NotFound';
import NotFoundPage from '../components/common/NotFoundPage';
import AuthPage from '../pages/auth/AuthPage';
import GameMake from '../pages/gamemake/GameMake';
import MyGame from '../pages/mygame/MyGame';
import GrupsPage from '../pages/grups/Grups';
import RankPage from '../pages/Rank/RankPage';
import GamesPage from '../pages/games/Games';
import { useAuthContext } from '../contexts/AuthContext';
const UserTournamentRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) return null; // Or a loader

  // Helper to check if user has already made their game
  const hasGameMake = user && (user.GameMake === 'true' || user.gamemake === 'true' || user.GameMake === true || user.gamemake === true);

  return hasGameMake ? <MyGame /> : <GameMake />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/gamemake' element={<UserTournamentRoute />} />
        <Route path='/mygame' element={<UserTournamentRoute />} />
        <Route path='/grups' element={<GrupsPage />} />
        <Route path='/rank' element={<RankPage />} />
        <Route path='/user-games/:userId' element={<GamesPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;