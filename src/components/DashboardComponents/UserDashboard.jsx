import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from 'reactstrap';
import RecentSolvedProblems from './RecentSolvedProblems';
import SolveCount from './SolveCount';
import HandleManager from './HandleManager';
import { auth, db } from '../../config/firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import LoadingComponent from '../misc/LoadingComponents';

function UserDashboard() {
  const [handles, setHandles] = useState([]);
  const [newHandle, setNewHandle] = useState('');
  const [recentProblems, setRecentProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchProblemDetails = async (problemId) => {
    const problemRef = doc(db, 'problems', problemId);
    try {
      const problemSnap = await getDoc(problemRef);
      return problemSnap.exists() ? problemSnap.data() : null;
    } catch (error) {
      console.error('Error fetching problem details:', error);
      return null;
    }
  };

  const fetchRecentSolvedProblems = async (handles) => {
    try {
      const allPromises = handles.map((handle) =>
        fetchTenProblemsForHandle(handle)
      );
      const allResults = await Promise.all(allPromises);

      let recentSolvedProblems = [];
      for (const userSubmissions of allResults) {
        for (const submission of userSubmissions) {
          if (submission.verdict === 'OK') {
            const problemId = `${submission.problem.contestId}${submission.problem.index}`;
            const problemDetails = await fetchProblemDetails(problemId);
            if (problemDetails) {
              recentSolvedProblems.push({
                problemId,
                name: submission.problem.name,
                rating: problemDetails.rating,
                tags: problemDetails.tags,
                solvedAt: submission.creationTimeSeconds,
                handle: submission.author.members[0].handle,
              });
            }
          }
        }
      }

      recentSolvedProblems.sort((a, b) => b.solvedAt - a.solvedAt);
      return recentSolvedProblems.slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent solved problems:', error);
      return [];
    }
  };

  useEffect(() => {
    updateRecentProblems(); // Fetch recent problems on component mount
  }, []); // The empty array ensures this runs once when the component mounts
  useEffect(() => {
    if (handles.length > 0) {
      updateRecentProblems();
    }
  }, [handles]); // useEffect will run when 'handles' changes

  const updateRecentProblems = async () => {
    const recentSolved = await fetchRecentSolvedProblems(handles);
    setRecentProblems(recentSolved);
  };

  const fetchProblemsForHandle = async (handle) => {
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.status?handle=${handle}`
      );
      const data = await response.json();
      if (data.status !== 'OK') {
        throw new Error('Failed to fetch data');
      }
      return data.result;
    } catch (error) {
      console.error('Error fetching problems for handle:', handle, error);
      return [];
    }
  };
  const fetchTenProblemsForHandle = async (handle) => {
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`
      );
      const data = await response.json();
      if (data.status !== 'OK') {
        throw new Error('Failed to fetch data');
      }
      return data.result;
    } catch (error) {
      console.error('Error fetching problems for handle:', handle, error);
      return [];
    }
  };

  const aggregateProblemsForAllHandles = async (handles) => {
    try {
      const allPromises = handles.map((handle) =>
        fetchProblemsForHandle(handle)
      );
      const allResults = await Promise.all(allPromises);

      const solvedProblems = new Set();
      allResults.forEach((userSubmissions) => {
        userSubmissions.forEach((submission) => {
          if (submission.verdict === 'OK') {
            const problemId = `${submission.problem.contestId}${submission.problem.index}`;
            solvedProblems.add(problemId);
          }
        });
      });

      return solvedProblems.size;
    } catch (error) {
      console.error('Error aggregating problems:', error);
      return 0;
    }
  };

  const aggregateTenProblemsForAllHandles = async (handles) => {
    try {
      const allPromises = handles.map((handle) =>
        fetchTenProblemsForHandle(handle)
      );
      const allResults = await Promise.all(allPromises);

      const solvedProblems = new Set();
      allResults.forEach((userSubmissions) => {
        userSubmissions.forEach((submission) => {
          if (submission.verdict === 'OK') {
            const problemId = `${submission.problem.contestId}${submission.problem.index}`;
            solvedProblems.add(problemId);
          }
        });
      });

      return solvedProblems.size;
    } catch (error) {
      console.error('Error aggregating problems:', error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchUserHandlesAndSolveCount = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setHandles(userData.handles || []);

            // Check if solveCount is present in the database
            if ('solveCount' in userData) {
              setTotalProblemsSolved(userData.solveCount);
            } else {
              // If solveCount is not present, calculate it, update the database, and set it in the state
              const count = await aggregateProblemsForAllHandles(
                userData.handles || []
              );
              setTotalProblemsSolved(count);
              await updateDoc(userDocRef, {
                solveCount: count,
              });
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserHandlesAndSolveCount();
  }, []);

  const isHandleValid = async (handle) => {
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.info?handles=${handle}`
      );
      const data = await response.json();
      return data.status === 'OK';
    } catch (error) {
      console.error('Error fetching data from Codeforces:', error);
      return false; // If an error occurs, assume the handle is not valid
    }
  };
  const addHandle = async (newHandle) => {
    if (!newHandle) {
      alert('Please enter a handle');
      return;
    }

    if (!auth.currentUser) {
      alert('No user logged in');
      return;
    }
    console.log('Adding handle:', newHandle);
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // User exists, update the handles array
      await updateDoc(userDocRef, {
        handles: arrayUnion(newHandle),
      });
    } else {
      // User does not exist, create the document with initial fields
      await setDoc(userDocRef, {
        handles: [newHandle],
        // Add other necessary fields with default or empty values
        name: auth.currentUser.displayName || 'Anonymous',
        email: auth.currentUser.email || '',
        // Add any other fields you deem necessary for a new user
      });
    }

    // Update local handles state
    setHandles((prevHandles) => [...prevHandles, newHandle]);

    alert('Handle added successfully');
    setNewHandle(''); // Clear the input field after adding
  };

  const [totalProblemsSolved, setTotalProblemsSolved] = useState(0);

  const updateTotalProblemsSolved = async () => {
    const count = await aggregateProblemsForAllHandles(handles);
    setTotalProblemsSolved(count);

    // Update the solveCount in the user's document
    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
          solveCount: count, // This will create the field if it doesn't exist
        });
      } catch (error) {
        console.error('Error updating solve count:', error);
      }
    }
  };

  const deleteHandle = async (handleToDelete) => {
    if (!auth.currentUser) {
      alert('No user logged in');
      return;
    }

    try {
      // Update Firestore
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        handles: handles.filter((handle) => handle !== handleToDelete),
      });

      // Update local state
      setHandles((currentHandles) =>
        currentHandles.filter((handle) => handle !== handleToDelete)
      );

      alert('Handle removed successfully');
    } catch (error) {
      console.error('Error removing handle:', error);
      alert('Failed to remove handle');
    }
  };

  return (
    <Container fluid>
      <h2 className="my-4">User Dashboard</h2>
      <Row>
        <Col md={6}>
          <HandleManager
            handles={handles}
            newHandle={newHandle}
            setNewHandle={setNewHandle}
            addHandle={addHandle}
            deleteHandle={deleteHandle}
          />
        </Col>
        <Col md={6}>
          <SolveCount
            totalProblemsSolved={totalProblemsSolved}
            updateProblemCount={updateTotalProblemsSolved}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        {' '}
        {/* Centering the row */}
        <Col md={8}>
          {' '}
          {/* Adjusted column size for a more centered look */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle tag="h5">Recent Solved Problems</CardTitle>
            </CardHeader>
            <CardBody>
              <RecentSolvedProblems recentProblems={recentProblems} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserDashboard;
