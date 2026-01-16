import React, { useState } from 'react';
import { Lock, Mail, User, Phone, LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import Navbar from '../../components/common/Navibar';
import Input from '../../components/common/Input'; // Importa o componente novo
import { useAuth } from '../../hooks/useAuth';

const AuthPage = () => {
    const { isLogin, formData, loading, handleChange, toggleMode, handleSubmit } = useAuth();
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <header><Navbar /></header>

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all">
                    <div className="flex flex-col items-center mb-8">
                        <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 mb-4">
                            <LogIn className="text-white" size={28} />
                        </div>
                        <h2 className="text-2xl font-bold">{isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <Input label="Nome Completo" name="nome" icon={<User />} value={formData.nome} onChange={handleChange} placeholder="Seu nome" />
                                <Input label="Telefone" name="telefone" type="tel" icon={<Phone />} value={formData.telefone} onChange={handleChange} placeholder="(+351) 9..." />
                            </>
                        )}

                        <Input label="E-mail" name="email" type="email" icon={<Mail />} value={formData.email} onChange={handleChange} placeholder="exemplo@mail.com" />

                        <div className="relative">
                            <Input label="Senha" name="senha" type={showPass ? "text" : "password"} icon={<Lock />} value={formData.senha} onChange={handleChange} placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-gray-400 hover:text-blue-500">
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {!isLogin && (
                            <Input label="Confirmar Senha" name="confirmarSenha" type="password" icon={<Lock />} value={formData.confirmarSenha} onChange={handleChange} placeholder="••••••••" />
                        )}

                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transform active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Entrar' : 'Registar')}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        {isLogin ? 'Ainda não é membro?' : 'Já tem uma conta?'}
                        <button onClick={toggleMode} className="ml-1.5 font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            {isLogin ? 'Registe-se agora' : 'Faça login'}
                        </button>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AuthPage;