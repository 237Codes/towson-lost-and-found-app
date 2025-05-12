/**
 * Auth Utilities
 * --------------
 * Provides reactive authentication state management via a custom hook.
 * - `notifyAuthChange`: triggers all subscribed components to re-check auth state.
 * - `useAuthStatus`: returns current login status and updates reactively on auth changes.
 */

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
