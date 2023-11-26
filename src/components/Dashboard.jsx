import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function Dashboard() {
  const [isRegister, setIsRegister] = useState(false);

  const handleToggle = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div>
      {isRegister ? <Register /> : <Login onRegisterClick={handleToggle} />}
    </div>
  );
}

export default Dashboard;