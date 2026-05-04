import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ links }) => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">Menu</div>
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`p-3 rounded hover:bg-gray-700 transition ${location.pathname === link.path ? 'bg-gray-700 font-semibold' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;