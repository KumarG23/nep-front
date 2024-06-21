import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Spinner } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import Logo from './assets/logo.svg';
import './Header.css';
import { AuthContext } from './AuthContext'; // Adjust the path if necessary

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const { user, loading } = useContext(AuthContext); // Get loading from context

  const handleToggle = () => setExpanded(!expanded);
  const closeMenu = () => setExpanded(false);

  useEffect(() => {
    console.log('Current user:', user); // Log the user details to the console
  }, [user]); // Re-run effect when `user` changes

  return (
    <Navbar expand="md" expanded={expanded} className="navbar-light sticky-top nav-bar" style={{ height: '100px' }}>
      <Container className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img src={Logo} alt="Logo" className="rounded float-start" id="logo" />
            <span id="title">Nepali Threads</span>
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="navbar-nav" onClick={handleToggle}>
          <FaBars />
        </Navbar.Toggle>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Navbar.Collapse id="navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Home</Nav.Link>
              <Nav.Link as={Link} to="/login" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Login</Nav.Link>
              <Nav.Link as={Link} to="/profile" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Profile</Nav.Link>
              <Nav.Link as={Link} to="/product" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Shop</Nav.Link>
              <Nav.Link as={Link} to="/cart" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Cart</Nav.Link>
              {user && (user.username === 'nepadmin23' || user.username === 'tarahadmin') && (
                <Nav.Link as={Link} to="/admin" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Admin</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;


