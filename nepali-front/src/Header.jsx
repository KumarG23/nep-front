import { Link } from 'react-router-dom';
import Logo from './assets/logo.webp';
import {Button, Container, Navbar, Modal} from 'react-bootstrap';

import React from 'react'

export const Header = () => {
  return (
    <Navbar id='navbar' className='navbar navbar-expand-md navbar-light sticky-top nav-bar' style={{ height: '100px' }}>
        <div id='navcontainer' className='container d-flex flex-row'>
        <img src={Logo} alt='Logo' className='rounded float-start' id='logo'/>
        <span className='mx-auto' id='title'>Nepali Threads</span>
        <div className='navbar-nav'>
        <Link to='/' className='nav-item nav-link' id='navitem'>Home</Link>
        <Link to='/login' className='nav-item nav-link' id='navitem'>Login</Link>
        <Link to='/profile' className='nav-item nav-link' id='navitem'>Profile</Link>
        <Link to='/product' className='nav-item nav-link' id='navitem'>Shop</Link>
        <Link to='/cart' className='nav-item nav-link' id='navitem'>Cart</Link>
        </div>
        </div>
    </Navbar>
  )
}

export default Header