// src/components/Login.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/password-manager');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Login</h2>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">Email</label>
            <div className="flex items-center border-b border-gray-300 py-2">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-500" />
              <input
                type="email"
                id="email"
                className="appearance-none bg-transparent border-none w-full text-gray-700 leading-tight focus:outline-none"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700" htmlFor="password">Password</label>
            <div className="flex items-center border-b border-gray-300 py-2">
              <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-500" />
              <input
                type="password"
                id="password"
                className="appearance-none bg-transparent border-none w-full text-gray-700 leading-tight focus:outline-none"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
