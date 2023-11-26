import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

function NavBar({ isLoggedIn }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Additional logic after sign out if needed
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Navbar color="light" light expand="md" className="navbar-custom">
      <NavbarBrand href="/" className="mb-0 h1">Codeforces Problems</NavbarBrand>
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink to="/" tag={Link}>Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/problem" tag={Link}>Problem</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/contest" tag={Link}>Contest</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/training" tag={Link}>Training</NavLink>
        </NavItem>
      </Nav>
      <Nav navbar>
        {isLoggedIn ? (
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              {auth.currentUser.displayName || 'Nickname'}
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem tag={Link} to="/settings">Settings</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavItem>
            <NavLink to="/login" tag={Link}>Sign In</NavLink>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
}

export default NavBar;
