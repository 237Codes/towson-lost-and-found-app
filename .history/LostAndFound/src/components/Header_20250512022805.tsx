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
    <header className="sticky top-0 z-50 w-full border-b-2 border-b-[#cc9900] bg-black px-8 py-4 capitalize text-white">
      <div className="container flex h-12 items-left justify-between space-x-4 relative">
        <div className="flex space-x-4">
          <TowsonLogo />
        </div>

        {isLoggedIn && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Nav />
          </div>
        )}

        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-end space-x-4">
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
