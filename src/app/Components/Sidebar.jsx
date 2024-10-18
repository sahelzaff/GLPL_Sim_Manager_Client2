// Sidebar.jsx
import React from 'react';
import Image from 'next/image'; // Assuming you're using Next.js for image optimization
import assets from '../../../public/assets/assets';
import { useRouter } from 'next/navigation';

const Sidebar = ({ activeMenu, onMenuClick }) => {
  const menuItems = ['Home', 'Users', 'Settings', 'Logout'];
  const router = useRouter(); // Hook to navigate between pages

  const handleMenuClick = (item) => {
    if (item === 'Logout') {
      // Clear the authentication token from localStorage
      localStorage.removeItem('authToken');

      // Redirect to the login page
      router.push('/login'); // Change to the correct path of your login page
    } else {
      onMenuClick(item); // Call the passed down onMenuClick for other items
    }
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-gray-800 text-white p-4 overflow-y-auto">
      <div className="flex flex-col items-center mb-4">
        <Image src={`/${assets.glpl_logo}`} width={100} height={100} alt="GLPL Logo" />
        <h2 className="text-xl font-bold ml-2">GLPL Sim Manager</h2>
      </div>
      <ul>
        {menuItems.map((item) => (
          <li key={item}>
            <button
              onClick={() => handleMenuClick(item)} // Call the new handleMenuClick
              className={`block w-full text-left p-2 rounded hover:bg-glpl-red ${
                activeMenu === item ? 'bg-glpl-red' : ''
              }`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
