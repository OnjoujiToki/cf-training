import React, { useState, useEffect } from 'react';
import Login from './misc/Login';
import Register from './misc/Register';
import UserDashboard from './DashboardComponents/UserDashboard';

import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Dashboard() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe; // Cleanup subscription
  }, []);
  const handleToggle = () => {
    setIsRegister(!isRegister);
  };
  console.log('isLoggedIn:', isLoggedIn);
  console.log(auth.currentUser?.uid);
  return isLoggedIn ? (
    <UserDashboard />
  ) : (
    <div>
      {isRegister ? <Register /> : <Login onRegisterClick={handleToggle} />}
    </div>
  );
}

export default Dashboard;
