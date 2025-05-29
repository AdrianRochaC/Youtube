import { useLocation, Link } from 'react-router-dom';
import './style.css';

function Menu() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="menu-bottom">
      <Link to="/" className={`menu-item ${isActive('/') ? 'active' : ''}`}>
        <span>Inicio</span>
      </Link>
      <Link to="/likes" className={`menu-item ${isActive('/likes') ? 'active' : ''}`}>
        <span>Likes</span>
      </Link>
      <Link to="/usuarios" className={`menu-item ${isActive('/usuarios') ? 'active' : ''}`}>
        <span>Usuarios</span>
      </Link>
      <Link to="/admin" className={`menu-item ${isActive('/admin') ? 'active' : ''}`}>
        <span>Admin</span>
      </Link>
    </nav>
  );
}

export default Menu;
