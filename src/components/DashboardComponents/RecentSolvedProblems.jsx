import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

function RecentSolvedProblems({ recentProblems }) {
  return (
    <div>
      <h3>Recent Solved Problems</h3>
      <ListGroup>
        {recentProblems.map((problem, index) => (
          <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
            <span className="problem-name">{problem.name} (ID: {problem.problemId})</span>
            <span className="badge badge-primary badge-pill">{problem.handle}</span>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}

export default RecentSolvedProblems;
