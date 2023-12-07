import React, { useState } from 'react';
import {
  doc,
  setDoc,
  collection,
  getDoc,
  arrayUnion,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

function CreatePlan() {
  const [planName, setPlanName] = useState('');
  const [problemIds, setProblemIds] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [afterContestId, setAfterContestId] = useState('');
  const [numberOfProblems, setNumberOfProblems] = useState('');
  const [excludeSolved, setExcludeSolved] = useState(false);

  const fetchProblemsFromCodeforces = async () => {
    try {
      const response = await fetch(
        `https://codeforces.com/api/problemset.problems`
      );
      const data = await response.json();
      if (data.status !== 'OK') {
        throw new Error('Failed to fetch problems from Codeforces');
      }
      return data.result.problems.filter(
        (problem) =>
          problem.rating >= minRating &&
          problem.rating <= maxRating &&
          problem.contestId > afterContestId
      );
    } catch (error) {
      console.error('Error fetching problems from Codeforces:', error);
      return [];
    }
  };
  const fetchSolvedProblemsForHandles = async (handles) => {
    const solvedProblems = new Set();
    for (const handle of handles) {
      try {
        const response = await fetch(
          `https://codeforces.com/api/user.status?handle=${handle}`
        );
        const data = await response.json();
        if (data.status !== 'OK') {
          throw new Error('Failed to fetch data for handle: ' + handle);
        }
        data.result.forEach((submission) => {
          if (submission.verdict === 'OK') {
            const problemId = `${submission.problem.contestId}${submission.problem.index}`;
            solvedProblems.add(problemId);
          }
        });
      } catch (error) {
        console.error('Error fetching problems for handle:', handle, error);
      }
    }
    return solvedProblems;
  };

  const pickRandomProblems = (problems, count) => {
    const shuffled = problems.sort(() => 0.5 - Math.random());
    return shuffled
      .slice(0, count)
      .map((problem) => `${problem.contestId}${problem.index}`);
  };

  const handleSavePlan = async () => {
    if (!planName) {
      alert('Please fill in the plan name.');
      return;
    }
    let validProblems = [];
    if (problemIds) {
      const problemsArray = problemIds.split(',').map((id) => id.trim());

      for (const problemId of problemsArray) {
        const problemRef = doc(db, 'problems', problemId);
        const problemSnap = await getDoc(problemRef);

        if (problemSnap.exists()) {
          validProblems.push(problemId);
        }
      }
    }

    if (minRating && maxRating && afterContestId && numberOfProblems) {
      let problemsFromCodeforces = await fetchProblemsFromCodeforces();
      let solvedProblems = new Set();

      if (excludeSolved && auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().handles) {
          solvedProblems = await fetchSolvedProblemsForHandles(
            userDocSnap.data().handles
          );
          problemsFromCodeforces = problemsFromCodeforces.filter(
            (problem) =>
              !solvedProblems.has(`${problem.contestId}${problem.index}`)
          );
        }
      }

      let randomProblems = pickRandomProblems(
        problemsFromCodeforces,
        numberOfProblems
      );

      // If the number of random problems is less than required, fetch additional problems
      while (
        randomProblems.length < numberOfProblems &&
        problemsFromCodeforces.length > 0
      ) {
        const additionalProblems = pickRandomProblems(
          problemsFromCodeforces,
          numberOfProblems - randomProblems.length
        );
        randomProblems = [...randomProblems, ...additionalProblems];
      }

      validProblems = [...validProblems, ...randomProblems];
    }

    const planData = {
      name: planName,
      problems: validProblems,
      private: isPrivate,
      author_id: auth.currentUser ? auth.currentUser.uid : 'anonymous',
      author_name: auth.currentUser
        ? auth.currentUser.displayName || 'Anonymous'
        : 'Anonymous',
      created_at: serverTimestamp(),
    };

    const newPlanRef = doc(collection(db, 'plans'));
    await setDoc(newPlanRef, planData);

    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        plans: arrayUnion(newPlanRef.id),
      });
    }

    alert('Plan saved successfully!');
  };

  return (
    <div className="create-plan-container" style={{ padding: '20px' }}>
      <Card>
        <CardBody>
          <Form className="create-plan-form">
            <h2 style={{ textAlign: 'center' }}>Create a New Training Plan</h2>
            <FormGroup>
              <Label for="planName">Plan Name</Label>
              <Input
                type="text"
                name="planName"
                id="planName"
                placeholder="Enter plan name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="problemIds">Problem IDs</Label>
              <Input
                type="text"
                name="problemIds"
                id="problemIds"
                placeholder="e.g., 1001, 1002, 1003"
                value={problemIds}
                onChange={(e) => setProblemIds(e.target.value)}
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                Private Plan
              </Label>
            </FormGroup>
            <FormGroup>
              <Label for="minRating">Minimum Rating</Label>
              <Input
                type="number"
                name="minRating"
                id="minRating"
                placeholder="Enter minimum rating"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="maxRating">Maximum Rating</Label>
              <Input
                type="number"
                name="maxRating"
                id="maxRating"
                placeholder="Enter maximum rating"
                value={maxRating}
                onChange={(e) => setMaxRating(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="afterContestId">After Contest ID</Label>
              <Input
                type="number"
                name="afterContestId"
                id="afterContestId"
                placeholder="Enter contest ID"
                value={afterContestId}
                onChange={(e) => setAfterContestId(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="numberOfProblems">Number of Problems</Label>
              <Input
                type="number"
                name="numberOfProblems"
                id="numberOfProblems"
                placeholder="Enter number of problems"
                value={numberOfProblems}
                onChange={(e) => setNumberOfProblems(e.target.value)}
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={excludeSolved}
                  onChange={(e) => setExcludeSolved(e.target.checked)}
                />
                Exclude problems I've solved
              </Label>
            </FormGroup>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button color="primary" size="lg" onClick={handleSavePlan}>
                Save Plan
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

export default CreatePlan;
