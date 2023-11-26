import React from 'react';

function SolveCount({ totalProblemsSolved, updateProblemCount }) {
  return (
    <div>
      <h3>Total Problems Solved: {totalProblemsSolved}</h3>
      <button onClick={updateProblemCount}>Update Problem Count</button>
    </div>
  );
}

export default SolveCount;