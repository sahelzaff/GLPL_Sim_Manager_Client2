'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState(''); // Change from email to username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState('');

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true); // Set loading state

    // Sending username and password to the API for authentication
    const res = await fetch('http://192.168.45.130:5021/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // Send username instead of email
    });

    if (res.ok) {
      const data = await res.json();

      // Save the authentication token in localStorage or cookies
      localStorage.setItem('authToken', data.token);

      // Redirect to the home/dashboard page or wherever you need
      router.push('/');
    } else {
      const errorData = await res.json();
      setError(errorData.error || 'Invalid credentials');
    }
  };

  return (

    <div className="flex items-center justify-center h-screen w-full">

      <div class="max-w-md relative flex flex-col p-4 rounded-md text-black bg-white shadow-lg py-10 px-10  ">
        <div class="text-2xl font-bold font-poppins mb-2 text-[#1e0e4b] text-center"><span class="text-glpl-red">GLPL Sim Manager</span></div>
        <div class="text-sm font-normal mb-4 text-center text-[#1e0e4b]">Log in to your account</div>
        <form class="flex flex-col gap-3" onSubmit={handleLogin}>
          <div class="block relative">
            <label for="username" class="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">Username</label>
            <input type="text" id="username" value={username}
              onChange={(e) => setUsername(e.target.value)} class="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0" />

          </div>
          <div class="block relative">
            <label for="password" class="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">Password</label>
            <input type="password" id="password" value={password}
              onChange={(e) => setPassword(e.target.value)} class="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0" />

          </div>
          <div>
          <div className="text-red-500">{error && <p>{error}</p>}</div>

          </div>
          <button type="submit" class="bg-glpl-red font-poppins font-semibold w-max m-auto px-6 py-2 rounded text-white text-sm ">Submit</button>

        </form>
        {/* <div class="text-sm text-center mt-[1.6rem]">Don’t have an account yet? <a class="text-sm text-[#7747ff]" href="#">Sign up for free!</a></div> */}
      </div>
    </div>

  );
};

export default Login;
