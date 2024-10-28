import React from 'react';

const Header = ({ navLink = 'Admin Login'}) => {
  return (
    <header>
      <nav className="fixed top-0 w-full bg-gray-100 py-5 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="navbar-header">
            <p className="text-lg font-semibold">RESULT MANAGEMENT</p>
          </div>
          <ul className="flex space-x-6">
            <li className="nav-item">
             {/* Conditional rendering for 'Admin Login' or 'Home' */}
              {navLink === 'Admin Login' ? (
                <a className="text-gray-800 hover:text-blue-500 transition-colors duration-300" href="/admin">
                  {navLink}
                </a>
              ) : (
                <a className="text-gray-800 hover:text-blue-500" href="/">
                  {navLink}
                </a>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
