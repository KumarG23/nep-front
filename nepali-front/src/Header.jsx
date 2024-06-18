import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa'; // Add react-icons for the hamburger icon
import Logo from './assets/logo.webp';
import './Header.css'; // Import custom CSS for additional styling

const Header = () => {

  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);
  const closeMenu = () => setExpanded(false);



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
          <FaBars /> {/* Use the FaBars icon for the hamburger menu */}
        </Navbar.Toggle>
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Home</Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Login</Nav.Link>
            <Nav.Link as={Link} to="/profile" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Profile</Nav.Link>
            <Nav.Link as={Link} to="/product" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Shop</Nav.Link>
            <Nav.Link as={Link} to="/cart" className="nav-item nav-link" id="navitem" onClick={closeMenu}>Cart</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

