import { useEffect, useState } from "react";
import BuildingsDropdown from "./BuildingsDropdown";

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  if (!isLoggedIn) return null;

  return (
    <nav className="flex flex-wrap items-center gap-4 text-lg font-medium text-white">
      <a href="/feed" className="hover:text-[#cc9900]">
        Browse Feed
      </a>
      <BuildingsDropdown />
      <a href="/report-lost" className="hover:text-[#cc9900]">
        Report Lost
      </a>
      <a href="/report-found" className="hover:text-[#cc9900]">
        Report Found
      </a>
      <a href="/contact" className="hover:text-[#cc9900]">
        Contact
      </a>
    </nav>
  );
};

export default Nav;
