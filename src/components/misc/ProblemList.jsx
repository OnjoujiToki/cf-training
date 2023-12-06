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
import { db, auth } from '../../config/firebase'; // Adjust the import path
import '../componentsCSS/Problem.css';

function ProblemList({ problems, showTags, listName, onDelete, planId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 50;
  const [userHandles, setUserHandles] = useState([]);
  const [planDetails, setPlanDetails] = useState(null);
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const [localProblems, setLocalProblems] = useState(problems); // Local state to manage problems

  const currentProblems = problems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  useEffect(() => {
    const fetchUserHandles = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserHandles(userData.handles || []);
          } else {
            console.log('User document not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserHandles();
  }, []);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (planId) {
        const planRef = doc(db, 'plans', planId);
        const planSnap = await getDoc(planRef);
        if (planSnap.exists()) {
          setPlanDetails(planSnap.data());
          console.log(planSnap.data());
        }
      }
    };
    fetchPlanDetails();
  }, [planId]);

  useEffect(() => {
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

  const fetchSubmissionsForHandle = async (handle) => {
    // Placeholder function.
    // In a real scenario, you would fetch this data from an external API or backend.
    return []; // Return an array of submission objects.
  };

  useEffect(() => {
    const fetchSubmissionsAndCheckSolved = async () => {
      const allSolvedProblems = new Set();
      for (const handle of userHandles) {
        const submissions = await fetchSubmissionsForHandle(handle);
        submissions.forEach((submission) => {
          if (submission.verdict === 'OK') {
            allSolvedProblems.add(
              `${submission.problem.contestId}${submission.problem.index}`
            );
          }
        });
      }
      // Update the local problems state
      const updatedProblems = localProblems.map((problem) => ({
        ...problem,
        isSolved: allSolvedProblems.has(
          problem.id ? problem.id : `${problem.contestId}${problem.index}`
        ),
      }));
      setLocalProblems(updatedProblems);
    };

    if (userHandles.length > 0 && planDetails) {
      fetchSubmissionsAndCheckSolved();
    }
  }, [userHandles, planDetails, localProblems]);

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
