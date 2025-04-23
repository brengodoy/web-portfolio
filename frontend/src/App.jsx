import './App.css';
import { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NumberDetector from './NumberDetector';
import EmotionsDetector from './EmotionsDetector';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.classList.contains('menu-icon')
      ) {
        setMenuOpen(false);
        setProjectsOpen(false);
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  

  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <FaBars className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
        </nav>

        {/* Menú lateral */}
        {menuOpen && (
          <div className="side-menu" ref={menuRef}>
            <ul>
              <li onClick={() => setProjectsOpen(!projectsOpen)}>
                Projects <FaChevronRight className="arrow-icon" />
              </li>
              <li>
              <Link to="/about-me">About Me</Link>
              </li>
              <li>Let’s Connect</li>
            </ul>

            {projectsOpen && (
              <div className="sub-menu">
                <ul>
                  <li>
                    <Link to="/number-detector">Number Detector</Link>
                  </li>
                  <li>
                    <Link to="/emotion-detector">Emotions Detector</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Rutas */}
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <h1>Hey, I'm Brenda.</h1>
                <p>
                  💻🧠 I'm a Systems Engineer focused on Machine Learning. I love
                  learning new things and building projects that blend technology,
                  creativity, and logic. On this site, you’ll find my projects, my
                  learning journey, and a bit of everything I’m passionate about in
                  the tech world.
                </p>
                <p>
                  🚀 I’m constantly growing, eager to develop professionally and
                  contribute through smart, meaningful solutions.
                </p>
                <p>
                  👉 Feel free to explore the Projects section, where I share what
                  I’ve been building — and what’s coming next!
                </p>
              </main>
            }
          />
          <Route path="/number-detector" element={<NumberDetector />} />
          <Route path="/emotion-detector" element={<EmotionsDetector />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
