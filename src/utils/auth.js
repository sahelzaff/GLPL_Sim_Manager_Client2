export const isAuthenticated = async () => {
  // Here you check for the token or session data in cookies or localStorage
  const token = localStorage.getItem('authToken'); // Or from cookies
  return !!token; // If token exists, return true; otherwise, return false
};
