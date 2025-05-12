// src/utils/auth.ts
import { useState } from "react";

let subscribers: (() => void)[] = [];

export const notifyAuthChange = () => subscribers.forEach((fn) => fn());

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(!!(localStorage.getItem("user") || sessionStorage.getItem("user")));

  useState(() => {
    const fn = () => setLoggedIn(!!(localStorage.getItem("user") || sessionStorage.getItem("user")));
    subscribers.push(fn);
    return () => {
      subscribers = subscribers.filter((s) => s !== fn);
    };
  });

  return loggedIn;
};
