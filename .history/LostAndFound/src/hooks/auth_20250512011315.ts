export function isAuthenticated() {
  return !!(localStorage.getItem('user') || sessionStorage.getItem('user'));
}
