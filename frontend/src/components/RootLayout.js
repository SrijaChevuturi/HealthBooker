import React from 'react';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';
import { Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div>
      <Navbar />
      <div style={{ minHeight: "80vh" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
