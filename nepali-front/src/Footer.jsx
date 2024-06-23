import React from 'react';
import nepaliFlag from './assets/nepalFlag.png';

export const Footer = () => {
  return (
    <footer>
      <p id='threads'>© 2024 Nepali Threads</p>
      <p id='threads'>Site created by Neal Sharma</p>
      <a href='https://www.linkedin.com/in/neal-sharma23' target='_blank' rel='noopener noreferrer' id='linked'>LinkedIn Profile</a>
      <img className='flag' src={nepaliFlag} alt='Nepali Flag' />
    </footer>
  );
};
