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

// Home Section Component
const Home = () => (
    <section id="home" className="min-h-[calc(100vh-120px)] flex flex-col md:flex-row items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-inner m-4">
        {/* Conteúdo de texto - Lado esquerdo em telas médias e maiores */}
        <div className="w-full md:w-1/2 text-center md:text-left md:px-8 mb-8 md:mb-0">
            <p className="text-lg text-gray-600 mb-2 font-open-sans">Olá, eu sou a</p>
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-gray-900 leading-tight mb-4">Becca Carvalho!</h1>
            <h2 className="text-2xl md:text-3xl font-montserrat font-medium text-[#5A6B5B] mb-6">
                Gastrônoma e Desenvolvedora Front-end
            </h2>
            <p className="text-base text-gray-700 leading-relaxed mb-4 font-open-sans">
                Da Gastronomia à TI: Uma Jornada de Crescimento e Adaptação.
            </p>
            <p className="text-base text-gray-700 leading-relaxed mb-10 font-open-sans">
                Bem-vindo ao meu portfólio.
            </p>
            <button className="bg-[#d2bfdf] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-[#b8a5c3] transition-all duration-300 transform hover:scale-105 font-montserrat">
                Ver Projetos
            </button>
        </div>
        {/* Conteúdo da imagem - Lado direito em telas médias e maiores */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
            <img
                src="public/img/Perfil (2).png" // Caminho para a imagem na pasta public/img
                alt="Foto de Perfil de Rebeca Carvalho com elementos gráficos"
                className="w-full max-w-sm h-auto object-contain"
            />
        </div>
    </section>
);

// About Section Component
const About = ({ setCurrentPage }) => { // Recebendo setCurrentPage como prop
    const journeyRef = useRef(null); // Ref para a seção da jornada

    const scrollToJourney = () => {
        if (journeyRef.current) {
            journeyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            {/* Primeira parte: Sobre Mim com imagem de fundo */}
            <section id="about" className="relative flex flex-col items-center justify-center text-center p-8 md:p-16 bg-cover bg-center rounded-lg shadow-md m-4"
                style={{ backgroundImage: `url('img/Confeitaria (6).jpg')` }}> {/* Caminho para a imagem na pasta public/img */}
                <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div> {/* Overlay escuro */}
                <div className="relative z-10 max-w-4xl mx-auto text-white">
                    <h2 className="text-4xl font-montserrat font-bold mb-4">Sobre Mim</h2>
                    <p className="text-lg leading-relaxed mb-8 italic font-open-sans">
                        Meu objetivo é provar que carreiras não são lineares — e que é possível transformar paixões aparentemente distantes em uma trajetória única.
                    </p>
                    <p className="text-lg leading-relaxed mb-4 font-open-sans">
                        A busca pelo crescimento e aprendizado contínuo me guia. Sou alguém focado no crescimento, aberto a novas experiências e culturas, e determinado a construir uma carreira sólida e diversificada. Minha transição de carreira foi motivada pelo desejo de buscar novos conhecimentos e aplicá-los de forma prática e eficiente. Com uma personalidade centrada e paciente, enxergo o mundo com curiosidade e sempre busco soluções criativas para os desafios que encontro.
                    </p>
                    <p className="text-lg leading-relaxed mb-8 font-open-sans">
                        Minhas principais áreas de interesse são tecnologia, desenvolvimento pessoal e idiomas. Além disso, tenho uma paixão por aprender sobre diferentes culturas e cozinhas, o que reflete no meu desejo de viajar e explorar a comunicação intercultural.
                    </p>

                    <button
                        onClick={scrollToJourney} // Adiciona a função de rolagem ao clique
                        className="bg-[#d2bfdf] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-[#b8a5c3] transition-all duration-300 transform hover:scale-105 font-montserrat">
                        Leia mais
                    </button>
                </div>
            </section>

            {/* Segunda parte: Minha Jornada Profissional sem imagem de fundo, com boxes e imagens alternadas */}
            <section ref={journeyRef} id="journey" className="p-8 md:p-16 bg-gray-50 rounded-lg shadow-md m-4">
                <h3 className="text-4xl font-montserrat font-bold text-gray-800 mb-8 text-center">Minha Jornada Profissional</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-10 text-center max-w-3xl mx-auto font-open-sans">
                    Da gastronomia à tecnologia: um caminho de adaptação e inovação.
                </p>

                {/* Bloco 1: Texto à esquerda, Imagem à direita */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 max-w-6xl mx-auto">
                    <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                        <p className="text-gray-700 leading-relaxed font-open-sans">
                            Minha trajetória profissional começou na gastronomia, onde inicialmente busquei uma carreira sólida,
                            especialmente na confeitaria. Além disso, comecei a dar aulas de culinária, tanto individuais quanto para pequenos grupos,
                            adaptando o nível de dificuldade à expertise de cada aluno. Meu foco era aperfeiçoar técnicas e oferecer experiências culinárias sofisticadas,
                            valorizando a conexão entre as pessoas através da comida. No entanto, percebi a necessidade de explorar novos caminhos e expandir meus horizontes.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                        <img
                            src="img/Aula (1).png" // Caminho para a imagem na pasta public/img
                            alt="Imagem relacionada à gastronomia"
                            className="w-full max-w-xs h-auto object-contain rounded-full border-4 border-gray-200 shadow-lg"
                        />
                    </div>
                </div>

                {/* Bloco 2: Imagem à esquerda, Texto à direita */}
                <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-8 mb-12 max-w-6xl mx-auto">
                    <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                        <p className="text-gray-700 leading-relaxed font-open-sans">
                            Ao migrar para a área de tecnologia, desenvolvi habilidades em desenvolvimento de software e web design,
                            aliando minha criatividade e persistência à lógica e inovação que a TI proporciona.
                            Essa mudança me permitiu enxergar desafios sob uma nova perspectiva e adaptar-me a um cenário dinâmico e repleto de oportunidades.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                        <img
                            src="img/Programacao.jpg" // Caminho para a imagem na pasta public/img
                            alt="Ambiente de desenvolvimento de software"
                            className="w-full max-w-xs h-auto object-contain rounded-full border-4 border-gray-200 shadow-lg"
                        />
                    </div>
                </div>

                {/* Bloco 3: Texto centralizado ou ocupando duas colunas, sem imagem direta ao lado */}
                <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-center font-open-sans">
                        Meus pontos fortes incluem persistência, criatividade e uma notável capacidade de adaptação, qualidades que aplico na resolução de problemas de forma inovadora.
                        Minha habilidade de comunicação e paciência são fundamentais para colaborar e a liderar equipes com eficácia.
                        Como uma pessoa reflexiva, dedico tempo para analisar cuidadosamente as opções, garantindo decisões assertivas e bem fundamentadas, o que me permite evitar erros e alcançar resultados sólidos.
                    </p>
                </div>

                {/* Nova seção de CTA */}
                <div className="mt-20 pt-16 border-t border-gray-200 text-center max-w-3xl mx-auto">
                    <p className="text-xl italic text-gray-700 mb-8 font-open-sans">
                        Quer saber mais sobre minha jornada? Vamos conversar!
                    </p>
                    <button
                        onClick={() => setCurrentPage('contact')} // Navega para a aba de contato
                        className="bg-[#d2bfdf] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-[#b8a5c3] transition-all duration-300 transform hover:scale-105 font-montserrat"
                    >
                        Vamos Conversar!
                    </button>
                </div>
            </section>
        </>
    );
};