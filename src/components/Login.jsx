import React, { useState } from 'react';
import '../styles/Login.css'; // Import the Login.css file

function Login({ onRegisterClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

  };

  return (
    <form onSubmit={handleSubmit} className='login-form'>
      <h2>Login</h2>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username"
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password"
        required 
      />
      <button type="submit">Login</button>
      <button type="button" onClick={onRegisterClick}>Register</button>
    </form>
  );
}

export default Login;