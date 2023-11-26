import React, { useState } from 'react';

function Training() {
  const [problemName, setProblemName] = useState('');
  const [problemURL, setProblemURL] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the problem submission logic here
    console.log('Adding problem:', problemName, problemURL);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Problem Name:
        <input 
          type="text" 
          value={problemName} 
          onChange={(e) => setProblemName(e.target.value)} 
          required 
        />
      </label>
      <label>
        Problem URL:
        <input 
          type="url" 
          value={problemURL} 
          onChange={(e) => setProblemURL(e.target.value)} 
          required 
        />
      </label>
      <button type="submit">Add Problem</button>
    </form>
  );
}

export default Training;