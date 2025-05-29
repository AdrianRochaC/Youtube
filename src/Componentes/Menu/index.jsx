import { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import './style.css';

function Menu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`c-menu ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="menu-header">
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
        {!isCollapsed && <h2 className="menu-title">YouTube</h2>}
      </div>

      <div className="menu-items">
        <Link to="/" className={`menu-item ${isActive('/') ? 'active' : ''}`}>
          {!isCollapsed && <span className="menu-text">Inicio</span>}
        </Link>

        <Link to="/likes" className={`menu-item ${isActive('/likes') ? 'active' : ''}`}>
          {!isCollapsed && <span className="menu-text">Likes</span>}
        </Link>

        <Link to="/usuarios" className={`menu-item ${isActive('/usuarios') ? 'active' : ''}`}>
          {!isCollapsed && <span className="menu-text">Usuarios</span>}
        </Link>
      </div>
    </nav>
  );
}

export default Menu;