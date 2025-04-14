import './App.css';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <nav className="navbar">
        <FaBars className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
      </nav>

      {menuOpen && (
        <div className="side-menu">
          <p>Contenido del menú</p>
        </div>
      )}
    </div>
  );
}

export default App;