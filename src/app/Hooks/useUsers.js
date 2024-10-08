// hooks/useUsers.js
import { useQuery } from '@tanstack/react-query';

const fetchUsers = async () => {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  console.log(data); // Log the fetched data to inspect it
  return data;
};

export const useUsers = () => {
  return useQuery(['users'], fetchUsers);
};
