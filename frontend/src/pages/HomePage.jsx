import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faBars, faTimes, faBox, faTruck, faUsers, faExchangeAlt, faFileAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/logo.png";
import './HomePage.scss';
import notification from '../components/Notifica/notification';

const HomePage = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isSessionExpired = () => {
        const loginTime = localStorage.getItem("loginTime");
        const sessionDuration = 3 * 60 * 60 * 1000;// 3 horas em milissegundos;       // 60000  1 minuto

        // Verifica se o loginTime existe e calcula a diferença de tempo
        if (loginTime) {
            const currentTime = Date.now();
            const timeElapsed = currentTime - parseInt(loginTime);

            // Se o tempo passado for maior do que a duração da sessão, expira a sessão
            return timeElapsed > sessionDuration;
        }
        return true;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || isSessionExpired()) {
            setNotificationMessage('Pela segurança da sua empresa, pedimos que lhe seja solicitado a reautenticação');
            setShowNotification(true);
            localStorage.removeItem("token");
            localStorage.removeItem("loginTime");
            navigate("/login");
        }
    }, [navigate]);

    const closeNotification = () => {
        setShowNotification(false);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const handleOverlayClick = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        if (window.location.pathname === "/") {
            navigate("/dashboard");
        }
    }, [navigate]);

    return (
        <div className="dashboard__container">
            {showNotification && (
                <Notification
                    message={notificationMessage}
                    type="warning" // Pode ser 'success', 'error' ou 'warning'
                    onClose={closeNotification}
                />
            )}
            <div
                className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}
                onClick={handleOverlayClick}
            />
            <aside className={`dashboard__sidebar ${isMenuOpen ? 'active' : ''}`}>
                <button
                    className="menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                </button>
                <div className="dashboard__logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <nav className="dashboard__nav">
                    <button onClick={() => handleNavigation("/dashboard")}>
                        <FontAwesomeIcon icon={faChartPie} style={{ color: '#4361ee' }} /> Dashboard
                    </button>
                    <button onClick={() => handleNavigation("/produtos")}>
                        <FontAwesomeIcon icon={faBox} style={{ color: '#2ed573' }} /> Produtos
                    </button>
                    <button onClick={() => handleNavigation("/fornecedores")}>
                        <FontAwesomeIcon icon={faTruck} style={{ color: '#ff7f50' }} /> Fornecedores
                    </button>
                    <button onClick={() => handleNavigation("/funcionarios")}>
                        <FontAwesomeIcon icon={faUsers} style={{ color: '#9b59b6' }} /> Funcionários
                    </button>
                    <button onClick={() => handleNavigation("/movimentacoes")}>
                        <FontAwesomeIcon icon={faExchangeAlt} style={{ color: '#3498db' }} /> Movimentações
                    </button>
                    <button onClick={() => handleNavigation("/relatorios")}>
                        <FontAwesomeIcon icon={faFileAlt} style={{ color: '#f1c40f' }} /> Relatórios
                    </button>
                    <button onClick={() => handleNavigation("/configuracoes")}>
                        <FontAwesomeIcon icon={faCog} style={{ color: '#95a5a6' }} /> Configurações
                    </button>
                </nav>
                <div className="line"></div>
                <div className="version">v1.0.0</div>
            </aside>

            <div className="section__dashboard">
                <Outlet />
            </div>
        </div>
    );
};

export default HomePage;
