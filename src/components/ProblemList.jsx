import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Problem from './Problem';

import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  arrayRemove,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase'; // Adjust the import path
import './componentsCSS/Problem.css';
function ProblemList({ problems, showTags, listName, onDelete, planId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 50;

  const [userHandles, setUserHandles] = useState([]);
  const [planDetails, setPlanDetails] = useState(null);
  const fetchSubmissionsForHandle = async (handle) => {
    // Placeholder function. Replace with actual logic to fetch submissions.
    return []; // Return an array of submission objects.
  };
  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (planId) {
        const planRef = doc(db, 'plans', planId);
        const planSnap = await getDoc(planRef);
        if (planSnap.exists()) {
          setPlanDetails(planSnap.data());
        }
      }
    };
    fetchPlanDetails();
  }, [planId]);

  const fetchSubmissions = async () => {
    // Assuming you have a way to fetch submissions
    // This is a simplified example
    for (const handle of userHandles) {
      const submissions = await fetchSubmissionsForHandle(handle);
      // checkSolvedProblems(submissions);
    }
    console.log();
  };

  fetchSubmissions();

  useEffect(() => {
    // Fetch user handles
    if (planDetails) {
      const fetchUserHandles = async () => {
        if (auth.currentUser) {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists() && userDocSnap.data().handles) {
            setUserHandles(userDocSnap.data().handles);
          }
        }
      };
      fetchUserHandles();
    }
  }, [planDetails]);
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const [localProblems, setLocalProblems] = useState(problems); // Local state to manage problems

  const currentProblems = problems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );
  const handleAddProblem = async () => {
    const problemKey = prompt('Enter the problem key:');
    if (problemKey) {
      const problemRef = doc(db, 'problems', problemKey);
      const problemSnap = await getDoc(problemRef);

      if (problemSnap.exists()) {
        const newProblem = problemSnap.data();
        setLocalProblems([...localProblems, newProblem]); // Add new problem to the local state
        console.log('successfully added problem');
      } else {
        console.log('Problem not found');
      }
    }
  };
  useEffect(() => {
    setLocalProblems(problems); // Update local state when problems prop changes
  }, [problems]);
  // Change page

  return (
    <div className="problem-list-container">
      <h2>{listName}</h2>

      <TransitionGroup className="problem-list">
        {currentProblems.map((problem) => (
          <CSSTransition
            key={
              problem.id ? problem.id : `${problem.contestId}${problem.index}`
            }
            timeout={300}
            classNames="problem-list">
            <Problem
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
