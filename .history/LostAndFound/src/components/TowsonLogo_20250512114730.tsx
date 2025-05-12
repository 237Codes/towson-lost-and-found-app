/**
 * TowsonLogo Component
 * --------------------
 * Displays the Towson University logo with a dynamic link.
 * - Redirects to /feed if user is logged in, otherwise to homepage (/).
 * - Checks authentication state on mount from local/session storage.
 */

import { useEffect, useState } from "react";

const TowsonLogo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <a href={isLoggedIn ? "/feed" : "/"} className="block">
      <img
        src="/images/towson-logo.png"
        alt="Towson University Logo"
        className="h-14 w-auto object-contain"
      />
    </a>
  );
};

export default TowsonLogo;
