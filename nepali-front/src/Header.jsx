import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa'; // Add react-icons for the hamburger icon
import Logo from './assets/logo.webp';
import './Header.css'; // Import custom CSS for additional styling

const Header = () => {
  return (
    <Navbar expand="md" className="navbar-light sticky-top nav-bar" style={{ height: '100px' }}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={Logo} alt="Logo" className="rounded float-start" id="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav">
          <FaBars /> {/* Use the FaBars icon for the hamburger menu */}
        </Navbar.Toggle>
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/" className="nav-item nav-link" id="navitem">Home</Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-item nav-link" id="navitem">Login</Nav.Link>
            <Nav.Link as={Link} to="/profile" className="nav-item nav-link" id="navitem">Profile</Nav.Link>
            <Nav.Link as={Link} to="/product" className="nav-item nav-link" id="navitem">Shop</Nav.Link>
            <Nav.Link as={Link} to="/cart" className="nav-item nav-link" id="navitem">Cart</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
