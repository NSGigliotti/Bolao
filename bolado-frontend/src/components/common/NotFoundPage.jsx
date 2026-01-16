import React from 'react';
import LeslieNielsenImage from '../../assets/8yj69c1qdi471.jpg';

const NotFoundPage = () => {
    return (

        <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#0b1120] text-white overflow-hidden m-0 p-0">

            <div className="text-center w-full max-w-4xl px-4 flex flex-col items-center justify-center">

                <h1 className="text-7xl md:text-9xl font-black tracking-tighter opacity-90 leading-none">
                    404
                </h1>
                <p className="text-xl md:text-2xl font-light mb-4 tracking-wide text-blue-100">
                    PAGE NOT FOUND
                </p>

                <div className="relative inline-block mb-6 group">
                    <img
                        src={LeslieNielsenImage}
                        alt="Leslie Nielsen 404"
                        className="w-auto max-w-full max-h-[50vh] object-contain rounded-lg shadow-2xl border-4 border-[#1e293b] transform transition-transform group-hover:scale-105"
                    />
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <p className="text-gray-400 text-sm md:text-lg max-w-md mx-auto italic leading-tight">
                        "Ops! Parece que você caiu em uma página que não existe. Talvez seja melhor apontar sua bússola para outra direção?"
                    </p>

                    <a
                        href="/"
                        className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-full font-bold text-md transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] uppercase tracking-widest"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;