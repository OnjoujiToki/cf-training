import React, { useState } from 'react';

function HandleInput({ onHandleSubmit }) {
  const [handle, setHandle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onHandleSubmit(handle);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="Enter Codeforces Handle"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default HandleInput;
