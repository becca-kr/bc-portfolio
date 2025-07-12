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

// Projects Section Component (with Image Generation)
const Projects = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to generate image using Imagen API
    const generateImage = async () => {
        if (!prompt.trim()) {
            setError('Por favor, insira um prompt para gerar a imagem.');
            return;
        }
        setLoading(true);
        setImageUrl('');
        setError('');

        try {
            const payload = { instances: { prompt: prompt }, parameters: { "sampleCount": 1 } };
            const apiKey = ""; // Canvas will automatically provide this
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
                const generatedImageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
                setImageUrl(generatedImageUrl);
            } else {
                setError('Falha ao gerar imagem. Resposta inesperada do servidor.');
                console.error('API Response:', result);
            }
        } catch (err) {
            setError('Erro ao conectar com a API de geração de imagem. Tente novamente.');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Example projects data - personalize with your own projects
    const techProjectsData = [
        {
            id: 1,
            title: 'Projeto Portfólio',
            description: 'Um site de portfólio pessoal construído com React e Tailwind CSS, aplicando princípios de design Japandi.',
            image: 'img/projeto (1).jpeg', // Caminho para a imagem na pasta public/img
            link: 'https://github.com/becca-kr/bc-portifolio', // Link atualizado para o Projeto 1
            technologies: ['React', 'Tailwind CSS', 'JavaScript'],
        },
        {
            id: 2,
            title: 'Aplicação de Gerenciamento de Tarefas',
            description: 'Uma aplicação web para organizar e gerenciar tarefas diárias, com funcionalidades de arrastar e soltar.',
            image: 'img/projeto (2).jpeg', // Caminho para a imagem na pasta public/img
            link: '#',
            technologies: ['Vue.js', 'Node.js', 'MongoDB'],
        },
        {
            id: 3,
            title: 'Criação de Banco de Dados em TypeScript', // Título atualizado
            description: 'Projeto de backend focado na criação e gerenciamento de banco de dados utilizando TypeScript.', // Descrição atualizada
            image: 'img/projeto (3).jpeg', // Caminho para a imagem na pasta public/img
            link: 'https://github.com/becca-kr/Projeto-React-Backend', // Link atualizado para o Projeto 3
            technologies: ['TypeScript', 'Node.js', 'SQL/NoSQL'], // Tecnologias atualizadas
        },
    ];

    // Gastronomy gallery data - personalize with your own images
    const gastronomyImages = [
        { id: 1, src: 'img/Confeitaria (4).jpg', alt: 'Doce Fino de Confeitaria Artística' },
        { id: 2, src: 'img/Aula (2).png', alt: 'Bolo Decorado com Pasta Americana' },
        { id: 3, src: 'img/Aula (6).png', alt: 'Sobremesa Francesa Clássica' },
        { id: 4, src: 'img/Aula (20).jpg', alt: 'Mesa de Doces Finos' },
        { id: 5, src: 'img/Aula (22).jpg', alt: 'Prato Gourmet Empratado' },
        { id: 6, src: 'img/Confeitaria (2).jpg', alt: 'Variedade de Doces para Eventos' },
    ];

    return (
        <section id="projects" className="p-8 md:p-16 bg-white rounded-lg shadow-md m-4">
            <h2 className="text-4xl font-montserrat font-bold text-gray-800 mb-4 text-center">Meus Projetos</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-10 text-center max-w-3xl mx-auto font-open-sans">
                Caminho em direção a um futuro com propósito, diversidade e a constante busca pelo conhecimento e adaptação.
            </p>

            {/* Seção de Projetos de Tecnologia */}
            <h3 className="text-3xl font-montserrat font-bold text-gray-800 mb-8 text-center mt-12">Projetos de Tecnologia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {techProjectsData.map((project) => (
                    <div key={project.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                        <img src={project.image} alt={project.title} className="w-full h-52 object-cover" />
                        <div className="p-6">
                            <h3 className="text-2xl font-montserrat font-semibold text-gray-800 mb-2">{project.title}</h3>
                            <p className="text-gray-700 mb-4 font-open-sans">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.map((tech, index) => (
                                    <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full font-open-sans">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors duration-300 font-montserrat"
                            >
                                Ver Projeto
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Seção da Galeria de Gastronomia */}
            <h3 className="text-3xl font-montserrat font-bold text-gray-800 mb-8 text-center mt-20 pt-16 border-t border-gray-200">Galeria de Gastronomia</h3>
            <p className="text-lg text-gray-700 mb-10 text-center max-w-3xl mx-auto font-open-sans">
                Aqui você pode ver um pouco do meu trabalho e paixão pela confeitaria artística e francesa.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {gastronomyImages.map((image) => (
                    <div key={image.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-64 object-cover"
                            // Fallback para imagem caso o URL não carregue
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/E0E0E0/374151?text=Imagem+Nao+Encontrada`; }}
                        />
                        <div className="p-4">
                            <p className="text-gray-700 text-center font-medium font-open-sans">{image.alt}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Generation Section */}
            <div className="mt-20 pt-16 border-t border-gray-200 text-center max-w-3xl mx-auto">
                <h3 className="text-3xl font-montserrat font-bold text-gray-800 mb-6">Gerador de Imagens (AI)</h3>
                <p className="text-lg text-gray-700 mb-6 font-open-sans">
                    Experimente gerar uma imagem usando inteligência artificial. Descreva o que você gostaria de ver!
                </p>
                <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A6B5B] mb-4 text-gray-800 font-open-sans" // Nova cor oliva
                    rows="4"
                    placeholder="Descreva a imagem que você quer gerar (ex: 'uma floresta de bambu minimalista com névoa e luz suave')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
                <button
                    onClick={generateImage}
                    className="bg-[#5A6B5B] text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-gray-800 transition-all duration-300 font-montserrat" // Nova cor oliva
                    disabled={loading}
                >
                    {loading ? 'Gerando...' : 'Gerar Imagem'}
                </button>

                {error && <p className="text-red-600 mt-4 font-open-sans">{error}</p>}

                {imageUrl && (
                    <div className="mt-8">
                        <h4 className="text-xl font-montserrat font-semibold text-gray-800 mb-4">Imagem Gerada:</h4>
                        <img src={imageUrl} alt="Imagem Gerada por IA" className="max-w-full h-auto rounded-lg shadow-lg mx-auto border border-gray-200" />
                    </div>
                )}
            </div>
        </section>
    );
};