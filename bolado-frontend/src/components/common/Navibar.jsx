import React from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavbar } from '../../hooks/useNavbar';

const Navbar = () => {
  const { user, isMobileMenuOpen, setIsMobileMenuOpen, handleLogout, hasGameMake, navigate } = useNavbar();

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Lado Esquerdo: Logo e Links Principais */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="ml-2 text-xl font-bold text-gray-900">Bolao</span>
            </div>
            <div className="ml-6 flex items-center">
              <a href="/grups" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Grupos</a>
              <a href="/rank" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Ranking</a>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {user && (
                hasGameMake ? (
                  <a href="/mygame" className="text-blue-600 hover:text-blue-700 font-semibold px-3 py-2 text-sm bg-blue-50 rounded-lg transition-colors">
                    Meu Jogo
                  </a>
                ) : (
                  <a href="/gamemake" className="text-blue-600 hover:text-blue-700 font-semibold px-3 py-2 text-sm bg-blue-50 rounded-lg transition-colors">
                    Fazer Jogo
                  </a>
                )
              )}
            </div>
          </div>

          {/* Lado Direito: Ações de Usuário */}
          <div className="hidden md:flex md:items-center">
            {user ? (
              <div className="flex items-center ml-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/auth" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Entrar</a>
                {/* <a href="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Começar agora
                </a> */}
              </div>
            )}
          </div>

          {/* Botão Mobile (Hambúrguer) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Aberto */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            <a href="/grups" className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50">Grupos</a>
            <a href="/rank" className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50">Ranking</a>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center">
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-red-600 bg-red-50"
                >
                  Desconectar
                </button>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <a href="/auth" className="block w-full text-center px-4 py-2 text-base font-medium text-gray-700">Entrar</a>
                <a href="/signup" className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md text-base font-medium">Cadastrar</a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;