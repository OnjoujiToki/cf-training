import React from 'react';

function HandleManager({ handles, newHandle, setNewHandle, addHandle }) {
  return (
    <div>
      <div>
        <input
          type="text"
          value={newHandle}
          onChange={(e) => setNewHandle(e.target.value)}
          placeholder="Add Codeforces handle"
        />
        <button onClick={addHandle}>Add Handle</button>
      </div>
      <div>
        <h3>Codeforces Handles:</h3>
        <ul>
          {handles.map((handle, index) => (
            <li key={index}>{handle}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HandleManager;