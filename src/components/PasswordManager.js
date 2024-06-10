// src/components/PasswordManager.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faTrash, faPlus, faPen, faCopy, faSearch } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useSpring, animated } from '@react-spring/web';

const PasswordManager = () => {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const passwordsCollectionRef = collection(db, 'passwords');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(passwordsCollectionRef);
      setPasswords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  const handleAddPassword = async (e) => {
    e.preventDefault();
    await addDoc(passwordsCollectionRef, { website, username, password });
    setWebsite('');
    setUsername('');
    setPassword('');
    const data = await getDocs(passwordsCollectionRef);
    setPasswords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDeletePassword = async (id) => {
    const passwordDoc = doc(db, 'passwords', id);
    await deleteDoc(passwordDoc);
    setPasswords(passwords.filter((password) => password.id !== id));
  };

  const handleTogglePassword = (id) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 120, friction: 14 },
  });

  const itemAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 120, friction: 14 },
  });

  const filteredPasswords = passwords.filter((password) =>
    password.website.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 flex flex-col items-center py-10">
      <animated.div style={formAnimation} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Password Manager</h2>
        <form className="mb-6" onSubmit={handleAddPassword}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type={showPassword['new'] ? 'text' : 'password'}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword['new'] ? faEye : faEyeSlash}
              className="ml-2 text-gray-500 cursor-pointer"
              onClick={() => handleTogglePassword('new')}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            >
              Add Password
              <FontAwesomeIcon icon={faPlus} className="ml-2" />
            </button>
          </div>
        </form>
      </animated.div>

      <div className="w-full max-w-3xl mt-10">
        <div className="bg-gray-200 p-4 rounded-lg shadow-inner">
          <div className="mb-4 flex items-center">
            <FontAwesomeIcon icon={faSearch} className="text-gray-500 mr-2" />
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Search by website"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Saved Passwords</h3>
          <ul>
            {filteredPasswords.map((password) => (
              <animated.li
                key={password.id}
                style={itemAnimation}
                className="flex items-center justify-between p-2 bg-white mb-2 rounded-lg shadow-sm"
              >
                <div>
                  <span className="font-bold text-gray-700">{password.website}</span>
                  <span className="ml-4 text-gray-500">{password.username}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCopy}
                    className="text-gray-500 mr-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125"
                    onClick={() => handleCopy(password.username)}
                  />
                  <FontAwesomeIcon
                    icon={faCopy}
                    className="text-gray-500 mr-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125"
                    onClick={() => handleCopy(password.password)}
                  />
                  <FontAwesomeIcon
                    icon={showPassword[password.id] ? faEye : faEyeSlash}
                    className="text-gray-500 mr-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125"
                    onClick={() => handleTogglePassword(password.id)}
                  />
                  <FontAwesomeIcon
                    icon={faPen}
                    className="text-blue-500 mr-2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125"
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125"
                    onClick={() => handleDeletePassword(password.id)}
                  />
                </div>
                {showPassword[password.id] && (
                  <span className="ml-4 text-gray-500">{password.password}</span>
                )}
              </animated.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordManager;
