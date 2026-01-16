import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
                <h2 className="mt-6 text-3xl font-bold text-gray-900">Página não encontrada</h2>
                <p className="mt-2 text-sm text-gray-600">Oops! A página que você está procurando não existe.</p>
                <div className="mt-5">
                    <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
                        Voltar para o início
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
