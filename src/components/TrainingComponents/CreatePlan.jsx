import React, { useState } from 'react';
import { doc, setDoc, collection, getDoc} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

function CreatePlan() {
  const [planName, setPlanName] = useState('');
  const [problemIds, setProblemIds] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSavePlan = async () => {
    if (!planName || !problemIds) {
      alert('Please fill all the fields.');
      return;
    }

    const problemsArray = problemIds.split(',').map(id => id.trim());
    const validProblems = [];

    for (const problemId of problemsArray) {
      const problemRef = doc(db, "problems", problemId);
      const problemSnap = await getDoc(problemRef);

      if (problemSnap.exists()) {
        validProblems.push(problemId);
      }
    }

    const planData = {
      name: planName,
      problems: validProblems,
      private: isPrivate,
      author_id: auth.currentUser ? auth.currentUser.uid : "anonymous",
      author_name: auth.currentUser ? (auth.currentUser.displayName || 'Anonymous') : "Anonymous",
    };

    const newPlanRef = doc(collection(db, 'plans'));
    await setDoc(newPlanRef, planData);
    alert('Plan saved successfully!');
  };

  return (
    <div>
      <Form>
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
            placeholder="Enter problem IDs separated by commas"
            value={problemIds}
            onChange={(e) => setProblemIds(e.target.value)}
          />
          <FormText>Example: 173E, 1976E, 1976D</FormText>
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
        <Button onClick={handleSavePlan}>Save Plan</Button>
      </Form>
    </div>
  );
}

export default CreatePlan;
