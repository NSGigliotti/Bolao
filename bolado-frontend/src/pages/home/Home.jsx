import React, { useState } from 'react';
import { Menu, X, Trophy, Users, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/common/Navibar';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="w-full">
                <Navbar />
            </header>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Dashboard</h1>
                    <p className="mt-4 text-gray-600">Seu conteúdo agora tem espaço para respirar.</p>
                </div>
            </main>
        </div>
    );
};
export default HomePage;