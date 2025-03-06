import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faBars, faTimes, faBox, faTruck, faUsers, faExchangeAlt, faFileAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/logo.png";
import './HomePage.scss';

const HomePage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
