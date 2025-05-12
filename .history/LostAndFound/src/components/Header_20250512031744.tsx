import { useEffect, useState } from "react";
import Nav from "./Nav";
import TowsonLogo from "./TowsonLogo";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user") || sessionStorage.getItem("user");
      setIsLoggedIn(!!user);
      setAuthChecked(true);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 500);
    window.addEventListener("storage", checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/home";
  };

  if (!authChecked) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white border-b-2 border-yellow-500">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <TowsonLogo />

        {/* Center Nav */}
        {isLoggedIn && (
          <nav className="hidden md:flex space-x-6 font-medium">
            <Nav />
          </nav>
        )}

        {/* Logout Button */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-sm px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
