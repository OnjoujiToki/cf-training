import React, { useState } from 'react';
import '../styles/Login.css'; // Import the Login.css file
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function Login({ onRegisterClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      // Attempt to sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      // Redirect or perform further actions after successful login
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Handle errors here, such as displaying a notification to the user
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log('Google Auth User:', user);
      // Redirect or perform further actions
    } catch (error) {
      console.error('Error with Google login:', error.message);
      // Handle errors here
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className='login-form'>
      <h2>Login</h2>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
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
      <button type="button" onClick={handleGoogleLogin} className="google-login-btn">
  Log in with Google
</button>

    </form>
  );
}

export default Login;