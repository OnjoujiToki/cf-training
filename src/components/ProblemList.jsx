import React, { useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Problem from "./Problem";

function ProblemList({ problems, showTags, listName, onDelete}) {
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 50;

  // Get current problems
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  // Change page
  const paginate = (pageNumber, event) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
    console.log("current page is " + pageNumber);
  };

  return (
    <div className="problem-list-container">
      <h2>{listName}</h2>
      <TransitionGroup className="problem-list">
        {currentProblems.map((problem) => (
          <CSSTransition
          // if problem has attribute "id", just use , otherwise add contestId and index
            key={problem.id ? problem.id : `${problem.contestId}${problem.index}`}

            timeout={300}
            classNames="problem-list"
          >
            <Problem
              key={problem.id ? problem.id : `${problem.contestId}${problem.index}`}
              problem={problem}
              isSolved={false /* logic to determine if solved */}
              showTags={showTags}
              onDelete={onDelete}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
     
    </div>
  );
}



export default ProblemList;
