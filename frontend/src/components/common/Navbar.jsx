import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-indigo-600">EzQurbani</div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Hello, {user.name}</span>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;