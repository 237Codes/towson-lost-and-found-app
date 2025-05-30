import { useEffect, useState } from "react";
import Nav from "./Nav";
import TowsonLogo from "./TowsonLogo";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Keep login state in sync with storage
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user") || sessionStorage.getItem("user");
      setIsLoggedIn(!!user);
    };

    checkAuth(); // check immediately on mount

    const interval = setInterval(checkAuth, 500); // check every 500ms

    // Optionally listen for `storage` events too (multi-tab support)
    const handleStorage = () => checkAuth();
    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    setIsLoggedIn(false); // instantly update UI
    window.location.href = "/"; // redirect after logout
  };

  if (!isLoggedIn) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-b-[#cc9900] bg-black px-8 py-4 capitalize text-white">
      <div className="container flex h-12 items-center justify-between space-x-4">
        <div className="flex space-x-4">
          <TowsonLogo />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Nav />
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-end space-x-4">
          <button
            onClick={handleLogout}
            className="rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
