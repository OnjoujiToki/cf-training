import React from 'react';

function RecentSolvedProblems({ recentProblems }) {
  return (
    <div>
      <h3>Recent Solved Problems:</h3>
      <ul>
        {recentProblems.map((problem, index) => (
          <li key={index}>
            {problem.name} (ID: {problem.problemId}) by {problem.handle}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentSolvedProblems;