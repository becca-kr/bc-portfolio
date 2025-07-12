import React, { useState, useEffect, useRef } from 'react'; // Importar useRef
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Header Component
const Header = ({ setCurrentPage, userId }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar o menu suspenso

    const navItems = [
        { name: 'Início', id: 'home' },
        { name: 'Sobre Mim', id: 'about' },
        { name: 'Projetos', id: 'projects' },
        { name: 'Currículo', id: 'resume' },
        { name: 'Contato', id: 'contact' },
    ];

    const handleNavLinkClick = (id) => {
        setCurrentPage(id);
        setIsMenuOpen(false); // Fecha o menu após clicar em um item
    };

    return (
        <header className="bg-white shadow-sm py-6 px-4 md:px-8 sticky top-0 z-50 rounded-b-lg">
            <nav className="max-w-6xl mx-auto flex items-center justify-between flex-wrap">
                {/* Logo */}
                <a href="#home" className="logo flex-shrink-0" onClick={() => handleNavLinkClick('home')}>
                    <img src="img/Logo (1).png" alt="Logo Becca Carvalho" className="h-10 md:h-12 object-contain" />
                </a>

                {/* Botão do Hambúrguer (visível apenas em telas pequenas) */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#5A6B5B] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5A6B5B]"
                    aria-label="Toggle menu"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Links de Navegação (escondidos em telas pequenas, visíveis em telas médias+) */}
                <ul className="hidden md:flex flex-wrap justify-center md:space-x-8 space-x-4">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button
                                className="text-gray-600 hover:text-[#5A6B5B] font-medium transition-colors duration-300 px-3 py-2 rounded-md font-open-sans"
                                onClick={() => handleNavLinkClick(item.id)}
                            >
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Menu Suspenso (visível apenas em telas pequenas quando aberto) */}
                {isMenuOpen && (
                    <div className="md:hidden w-full mt-4 bg-white rounded-lg shadow-lg py-2">
                        <ul className="flex flex-col items-center space-y-2">
                            {navItems.map((item) => (
                                <li key={item.id} className="w-full text-center">
                                    <button
                                        className="block w-full py-2 px-4 text-gray-800 hover:bg-gray-100 hover:text-[#5A6B5B] font-open-sans"
                                        onClick={() => handleNavLinkClick(item.id)}
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {userId && (
                    <div className="hidden md:block text-sm text-gray-500 ml-4 font-open-sans"> {/* Escondido em mobile */}
                        ID do Usuário: <span className="font-mono text-gray-700">{userId}</span>
                    </div>
                )}
            </nav>
        </header>
    );
};