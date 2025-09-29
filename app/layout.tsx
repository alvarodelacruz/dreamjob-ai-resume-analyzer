import React from 'react';
import './globals.css'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex flex-col bg-pattern">
                    <header className="bg-gradient-to-r from-[#FF5733] via-[#E64A2E] to-[#a31900] text-white py-6 px-4 shadow-lg relative overflow-hidden">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex justify-center items-center relative">
                                <div className="flex items-center space-x-4 hover:transform hover:scale-105 transition-all duration-300">
                                    {/* Maletín con animación y brillo */}
                                    <div className="relative group">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            strokeWidth={1.5} 
                                            stroke="currentColor" 
                                            className="w-14 h-14 transform transition-transform duration-300 group-hover:rotate-6"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" 
                                            />
                                        </svg>
                                        {/* Efecto de brillo mejorado */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300 blur-sm"></div>
                                    </div>

                                    {/* Texto con efecto de escala */}
                                    <div className="flex items-baseline space-x-1">
                                        <span className="text-4xl font-bold tracking-tight text-white drop-shadow-lg transition-all duration-300 hover:text-white/90 hover:scale-105">
                                            DreamJob
                                        </span>
                                        <span className="text-4xl font-bold tracking-tight text-white/90 drop-shadow-lg transition-all duration-300 hover:text-white hover:scale-105">
                                            .ai
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="flex-grow container mx-auto px-4 py-8">
                        {children}
                    </main>
                    <footer className="bg-[#2A2A2A] text-white py-6 px-4">
                        <div className="max-w-6xl mx-auto text-center">
                            <p>&copy; {new Date().getFullYear()} Dreamjob.ai - Tu asistente de CV inteligente</p>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    );
};

export default Layout;