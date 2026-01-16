import React, { useState } from 'react';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Lado Esquerdo: Logo e Links Principais */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="ml-2 text-xl font-bold text-gray-900">Bolao</span>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Dashboard</a>
              <a href="/projetos" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Meu Bolao</a>
            </div>
          </div>

          {/* Lado Direito: Ações de Usuário */}
          <div className="hidden md:flex md:items-center">
            {user ? (
              <div className="relative ml-3">
                {/* Botão do Perfil (Dropdown) */}
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                  </div>
                  <img
                    className="h-9 w-9 rounded-full object-cover border-2 border-indigo-100"
                    src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + user.name}
                    alt="Foto de perfil"
                  />
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Desktop */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={16} className="mr-2" /> Meu Perfil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-2" /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/auth" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Entrar</a>
                <a href="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Começar agora
                </a>
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
            <a href="/dashboard" className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50">Dashboard</a>
            <a href="/projetos" className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50">Projetos</a>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-full" src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + user.name} alt="" />
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