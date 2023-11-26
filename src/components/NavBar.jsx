import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function NavBar() {
  return (
    <nav className="navbar">
      {/* Navigation items here */}
      <Link to="/">Home</Link>
      <Link to="/problem">Problem</Link>
      <Link to= "/contest"> Contest</Link>
      <Link to= "/training"> Training</Link>
      {/* Add other navigation links or buttons as needed */}
    </nav>
  );
}

export default NavBar;