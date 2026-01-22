import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '../pages/home/Home';
import NotFound from '../pages/not-found/NotFound';
import NotFoundPage from '../components/common/NotFoundPage';
import AuthPage from '../pages/auth/AuthPage';
import GameMake from '../pages/gamemake/GameMake';
import MyGame from '../pages/mygame/MyGame';
import GrupsPage from '../pages/grups/Grups';
import RankPage from '../pages/Rank/RankPage';


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/gamemake' element={<GameMake />} />
        <Route path='/mygame' element={<MyGame />} />
        <Route path='/grups' element={<GrupsPage />} />
        <Route path='/rank' element={<RankPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;