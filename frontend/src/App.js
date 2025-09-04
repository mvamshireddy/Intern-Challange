import React from "react";
import AppRoutes from "./route";
import Navbar from "./components/Navbar"; // 👈 Import the Navbar
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  // 👇 Logic to hide Navbar on login/signup pages
  const showNavbar = !['/login', '/signup'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;