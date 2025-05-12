import { useEffect, useState } from "react";
import Nav from "./Nav";
import TowsonLogo from "./TowsonLogo";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // ✅ track if auth is checked

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user") || sessionStorage.getItem("user");
      setIsLoggedIn(!!user);
      setAuthChecked(true); // ✅ ready to render
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
    window.location.href = "/";
  };

  if (!authChecked) return null; // ✅ prevents flash

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white border-b-2 border-yellow-500">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/images/towson-logo.svg"
            alt="Towson Logo"
            className="h-8 w-auto"
          />
        </div>

        {/* Center: Navigation */}
        <nav className="flex space-x-6 font-medium">
          <a href="/feed" className="hover:text-yellow-400">Browse Feed</a>
          <a href="/buildings" className="hover:text-yellow-400">Buildings</a>
          <a href="/report-lost" className="hover:text-yellow-400">Report Lost</a>
          <a href="/report-found" className="hover:text-yellow-400">Report Found</a>
          <a href="/contact" className="hover:text-yellow-400">Contact</a>
        </nav>

        {/* Right: Logout */}
        <div>
          <button
            onClick={handleLogout}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-sm px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
