import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import StudentsList from './pages/StudentsList';
import './App.css';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/students', label: 'Students', icon: <Users size={18} /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <GraduationCap size={28} />
        <h1>StudentHub</h1>
      </div>
      <div className="nav-links">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentsList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
