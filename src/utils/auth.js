export const isAuthenticated = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    const response = await fetch('http://192.168.45.129:5021/api/verify-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.message === 'Token is valid';
    }

    return false;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};
