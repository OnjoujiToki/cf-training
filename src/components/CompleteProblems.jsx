import React, { useState, useEffect } from 'react';
import ProblemList from './ProblemList';
import Pagination from './Pagination';
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
// import './App.css';
import LoadingComponent from './misc/LoadingComponents';

const ALL_PROBLEMS_URL =
  'https://codeforces.com/api/problemset.problems?lang=en';

function CompleteProblems() {
  const [userHandle, setUserHandle] = useState('');
  const [problems, setProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage, setProblemsPerPage] = useState(50);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTags, setShowTags] = useState(true);
  const toggleTagsVisibility = () => {
    setShowTags(!showTags);
  };
  useEffect(() => {
    setIsLoaded(false);
    fetch(ALL_PROBLEMS_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          setProblems(data.result.problems);
          setIsLoaded(true);
        }
      });
    setIsLoaded(true);
  }, [userHandle]);

  const totalPages = Math.ceil(problems.length / problemsPerPage);

  // Calculate the current problems to display
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );
  if (!isLoaded) {
    return <LoadingComponent />;
  }
  return (
    <div className="Home">
      <button onClick={toggleTagsVisibility}>
        {showTags ? 'Hide All Tags' : 'Show All Tags'}
      </button>
      {isLoaded && (
        <ProblemList
          problems={currentProblems}
          showTags={showTags}
          listName={'Codeforces Problem'}
        />
      )}
      {isLoaded && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPerPageChange={(newPerPage) => {
            setProblemsPerPage(newPerPage);
            setCurrentPage(1); // Reset to page 1 when problemsPerPage changes
          }}
        />
      )}
    </div>
  );
}

export default CompleteProblems;
