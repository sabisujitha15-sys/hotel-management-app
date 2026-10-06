import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">🌴 Thynk Unlimited Stays</Link>
    </header>
  );
}
