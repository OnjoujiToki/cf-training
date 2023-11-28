import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase'; // Adjust import path as needed
import { doc, getDoc } from 'firebase/firestore';
function NavBar({ isLoggedIn }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchUserName = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().name || 'No name'); // Replace 'name' with the field name in your database
        }
      }
    };

    fetchUserName();
  }, [isLoggedIn]);

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
      <NavbarBrand href="/" className="mb-0 h1">
        Codeforces Problems
      </NavbarBrand>
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink to="/" tag={Link}>
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/problem" tag={Link}>
            Problem
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/contest" tag={Link}>
            Contest
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/training" tag={Link}>
            Training
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/favorite" tag={Link}>
            ❤️Favorite
          </NavLink>
        </NavItem>
      </Nav>
      <Nav navbar>
        {isLoggedIn ? (
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>{userName || 'Nickname'}</DropdownToggle>
            <DropdownMenu end>
              <DropdownItem tag={Link} to="/settings">
                Settings
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavItem>
            <NavLink to="/login" tag={Link}>
              Sign In
            </NavLink>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
}

export default NavBar;
