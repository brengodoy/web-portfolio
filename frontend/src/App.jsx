import './App.css';
import { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NumberDetector from './NumberDetector';
import EmotionsDetector from './EmotionsDetector';
import AboutMe from './AboutMe';
import LetsConnect from './LetsConnect';
import { motion, AnimatePresence } from "framer-motion";


function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const menuRef = useRef(null);
  const subMenuRef = useRef(null);

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

  const handleMenuItemClick = () => {
    setMenuOpen(false);  // Cierra el menú cuando se hace clic en cualquier ítem
  };
  

  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <FaBars className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
        </nav>

        {/* Menú lateral */}
        <div className={`side-menu ${menuOpen ? "active" : ""}`} ref={menuRef}>
            <ul>
              <li>
                <Link to="/" onClick={handleMenuItemClick}>🌸 Home</Link>
              </li>
              <li onClick={() => setProjectsOpen(!projectsOpen)} className="projects-item">
              Projects <FaChevronRight className="arrow-icon" />
              <AnimatePresence>
                {projectsOpen && (
                  <motion.div
                    className="sub-menu"
                    ref={subMenuRef}
                    initial={{ x: -200 }}
                    animate={{ x: 0 }}
                    exit={{ x: -200 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ul>
                      <li><Link to="/number-detector" onClick={handleMenuItemClick}>Number Detector</Link></li>
                      <li><Link to="/emotion-detector" onClick={handleMenuItemClick}>Emotion Detector</Link></li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
              </li>
              <li>
              <Link to="/about-me" onClick={handleMenuItemClick}>About Me</Link>
              </li>
              <li>
              <Link to="/lets-connect" onClick={handleMenuItemClick}>Let’s Connect</Link>
              </li>
            </ul>
          </div>

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
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/lets-connect" element={<LetsConnect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
