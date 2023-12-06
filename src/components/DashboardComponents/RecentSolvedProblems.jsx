import React from 'react';
import Problem from '../misc/Problem'; // Import the Problem component

function RecentSolvedProblems({ recentProblems }) {
  return (
    <div>
      {recentProblems.map((problem, index) => (
        <Problem
          key={index}
          problem={{
            id: problem.problemId,
            name: problem.name,
            rating: problem.rating,
            tags: problem.tags,
          }}
          isSolved={false}
          showTags={true}
        />
      ))}
    </div>
  );
}

export default RecentSolvedProblems;
