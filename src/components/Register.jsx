import React, { useState } from 'react';
import '../styles/Register.css'; // Import the Register.css file
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // You can add any post-registration logic here
    } catch (error) {
      console.error('Error in user registration: ', error);
      // Handle the error and provide feedback to the user
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('The email address is already in use by another account.');
          break;
        case 'auth/invalid-email':
          alert('The email address is not valid.');
          break;
        case 'auth/operation-not-allowed':
          alert('Email/password accounts are not enabled.');
          break;
        case 'auth/weak-password':
          alert('The password is not strong enough.');
          break;
        default:
          alert('An unknown error occurred.');
      }
    }
  };

  return (
    <div>
      <button className="back-button" onClick={() => navigate(-1)}>
        &#8592;
      </button>

      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="register-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="register-input"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
