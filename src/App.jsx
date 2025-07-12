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

// Resume Section Component
const Resume = () => (
    <section id="resume" className="p-8 md:p-16 bg-gray-50 rounded-lg shadow-md m-4">
        <h2 className="text-4xl font-montserrat font-bold text-gray-800 mb-8 text-center">Currículo</h2>
        <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 mb-8 font-open-sans">
                Você pode visualizar meu currículo online ou fazer o download em formato PDF.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
                <a
                    href="https://www.canva.com/design/DAGWdMtUCdU/uKLwMeAm5UyUC8woPVCNUg/view?utm_content=DAGWdMtUCdU&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h39a762bc4b" // Link do Canva para o currículo
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#d2bfdf] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-[#b8a5c3] transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-montserrat" // Aplicado o estilo do botão "Ver Projetos"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Visualizar Online
                </a>
                <a
                    href="/path/to/your/Curriculo_Rebeca_Carvalho.pdf" // Substitua pelo caminho real do seu arquivo PDF se for hospedar diretamente
                    download="Curriculo_Rebeca_Carvalho.pdf"
                    className="bg-gray-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-[#5A6B5B] transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-montserrat" // Mantido o verde oliva para o download, mas você pode mudar para o roxo se preferir
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                </a>
            </div>
            {/* Opcional: Adicione um iframe para incorporar o PDF diretamente na página
                Para isso, você precisaria hospedar o PDF em um local acessível publicamente e usar o link aqui.
            */}
            {/* <div className="mt-12 w-full max-w-4xl mx-auto h-[80vh] border border-gray-300 rounded-lg shadow-md">
                <iframe src="LINK_DO_SEU_CURRICULO_PDF_AQUI" className="w-full h-200" title="Visualizador de Currículo"></iframe>
            </div> */}
        </div>
    </section>
);

// Contact Section Component
const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState(''); // 'success', 'error', 'sending'
    const [loading, setLoading] = useState(false); // Define loading state for Contact component

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submission starts
        setStatus('sending');

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            setStatus('error');
            setLoading(false); // Set loading to false on error
            setTimeout(() => setStatus(''), 3000); // Clear status after 3 seconds
            return;
        }

        // In a real application, you would send this data to a backend service
        // (e.g., using Fetch API to a serverless function, EmailJS, Formspree, etc.)
        // For this example, we'll just simulate a successful submission.
        console.log('Formulário enviado:', formData);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Reset form and show success message
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus('success');
        setLoading(false); // Set loading to false after successful submission
        setTimeout(() => setStatus(''), 3000); // Clear status after 3 seconds
    };

    return (
        <section id="contact" className="p-8 md:p-16 bg-white rounded-lg shadow-md m-4">
            <h2 className="text-4xl font-montserrat font-bold text-gray-800 mb-8 text-center">Entre em Contato</h2>
            <p className="text-lg text-gray-700 mb-8 text-center font-open-sans max-w-3xl mx-auto">
                Acredito que conhecimentos diversos ampliam nossa capacidade de inovar. Por isso, sigo ensinando enquanto aprendo! <br/> Vamos conversar?! Preencha o formulário abaixo ou me encontre nas redes sociais!
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
                {/* Formulário de Contato - Lado esquerdo */}
                <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-6 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 font-open-sans">Seu nome completo aqui</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#5A6B5B] font-open-sans"
                            placeholder="Digite seu nome completo"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 font-open-sans">Seu e-mail aqui*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#5A6B5B] font-open-sans"
                            placeholder="Digite seu e-mail válido"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2 font-open-sans">Sua mensagem aqui*</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#5A6B5B] font-open-sans"
                            placeholder="Escreva sua mensagem aqui"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-gray-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-[#5A6B5B] transition-all duration-300 w-full font-montserrat"
                        disabled={loading}
                    >
                        {loading ? 'Enviando...' : 'Enviar mensagem agora'}
                    </button>

                    {status === 'success' && (
                        <p className="text-green-600 text-center mt-4 font-open-sans">Mensagem enviada com sucesso!</p>
                    )}
                    {status === 'error' && (
                        <p className="text-red-600 text-center mt-4 font-open-sans">Por favor, preencha todos os campos obrigatórios.</p>
                    )}
                </form>

                {/* Imagem - Lado direito */}
                <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                    <img
                        src="img/Programacao.jpg" // Caminho para a imagem na pasta public/img
                        alt="Imagem de contato"
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>
            </div>

            {/* Redes Sociais - Abaixo do formulário e imagem */}
            <div className="mt-12 text-center">
                <h3 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">Me Encontre nas Redes Sociais</h3>
                <div className="flex justify-center space-x-6">
                    {/* Ícones de redes sociais - substitua os links */}
                    <a href="https://linkedin.com/in/becccac/" target="_blank" rel="noopener noreferrer" className="text-[#d2bfdf] hover:text-[#5A6B5B] transition-colors duration-300">
                        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <a href="https://github.com/becca-kr" target="_blank" rel="noopener noreferrer" className="text-[#d2bfdf] hover:text-[#5A6B5B] transition-colors duration-300">
                        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.799 8.207 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.334-1.756-1.334-1.756-1.09-.745.083-.73.083-.73 1.205.086 1.838 1.238 1.838 1.238 1.07 1.835 2.809 1.305 3.492.998.108-.775.419-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.382 1.235-3.22-.12-.3-.53-1.52.11-3.175 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.4 3.003-.404 1.02.004 2.046.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.64 1.655.23 2.875.12 3.175.77.838 1.235 1.91 1.235 3.22 0 4.61-2.806 5.625-5.474 5.922.43.37.81 1.096.81 2.222 0 1.606-.015 2.897-.015 3.28 0 .318.21.69.825.577C20.565 21.799 24 17.302 24 12c0-6.627-5.373-12-12-12z" clipRule="evenodd" />
                        </svg>
                    </a>
                    {/* Adicionado o ícone do Instagram */}
                    <a href="https://instagram.com/beccac.kr" target="_blank" rel="noopener noreferrer" className="text-[#d2bfdf] hover:text-[#5A6B5B] transition-colors duration-300">
                        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 0C8.74 0 8.333.01 7.043.072 5.754.134 4.846.368 4.04.755 3.229 1.141 2.525 1.76 1.897 2.389s-1.248 1.328-1.634 2.139c-.387.807-.62 1.715-.683 3.006C.01 8.333 0 8.74 0 12s.01 3.667.072 4.957c.062 1.29.296 2.201.683 3.006.387.811 1.092 1.439 1.72 2.068.629.63 1.339 1.139 2.15 1.526.807.387 1.715.62 3.006.683C8.333 23.99 8.74 24 12 24s3.667-.01 4.957-.072c1.29-.062 2.201-.296 3.006-.683.811-.387 1.439-1.092 2.068-1.72.63-.629 1.139-1.339 1.526-2.15.387-.807.62-1.715.683-3.006C23.99 15.667 24 15.26 24 12s-.01-3.667-.072-4.957c-.062-1.29-.296-2.201-.683-3.006-.387-.811-1.092-1.439-1.72-2.068-.629-.63-1.339-1.139-2.15-1.526C18.771.368 17.863.134 16.574.072 15.26 0 14.846 0 12 0zm0 2.16c3.2 0 3.585.016 4.859.077 1.17.055 1.805.249 2.227.425.695.286 1.226.742 1.714 1.23.49.488.945 1.019 1.23 1.714.176.422.37 1.052.425 2.227.061 1.274.077 1.659.077 4.859s-.016 3.585-.077 4.859c-.055 1.17-.249 1.805-.425 2.227-.286.695-.742 1.226-1.23 1.714-.488.49-1.019.945-1.714 1.23-.422.176-1.052.37-2.227.425-1.274.061-1.659.077-4.859.077s-3.585-.016-4.859-.077c-1.17-.055-1.805-.249-2.227-.425-.695-.286-1.226-.742-1.714-1.23-.49-.488-.945-1.019-1.23-1.714-.176-.422-.37-1.052-.425-2.227-.061-1.274-.077-1.659-.077-4.859s.016-3.585.077-4.859c.055-1.17.249-1.805.425-2.227.286-.695.742-1.226 1.23-1.714.488-.49 1.019-.945 1.714-1.23.422-.176 1.052-.37 2.227-.425C8.415 2.16 8.8 2.16 12 2.16zm0 3.635c-3.462 0-6.264 2.802-6.264 6.264s2.802 6.264 6.264 6.264 6.264-2.802 6.264-6.264-2.802-6.264-6.264-6.264zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.964-10.406c-.846 0-1.48.634-1.48 1.48s.634 1.48 1.48 1.48 1.48-.634 1.48-1.48-.634-1.48-1.48-1.48z" clipRule="evenodd" />
                        </svg>
                    </a>
                    {/* Adicione mais ícones conforme necessário (Behance, Twitter, etc.) */}
                </div>
            </div>
        </section>
    );
};

// Footer Component
const Footer = () => (
    <footer className="bg-gray-800 text-white py-6 px-4 text-center rounded-t-lg mt-4">
        <p>&copy; {new Date().getFullYear()} REBECA CARVALHO. Todos os direitos reservados.</p>
    </footer>
);