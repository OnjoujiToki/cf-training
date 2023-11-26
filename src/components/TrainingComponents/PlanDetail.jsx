import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import ProblemList from "../ProblemList";

function PlanDetail() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [problemDetails, setProblemDetails] = useState([]);

  useEffect(() => {
    const fetchPlan = async () => {
      // Fetch the plan
      const planRef = doc(db, "plans", planId);
      const planSnap = await getDoc(planRef);
      if (!planSnap.exists()) {
        console.log("No such plan!");
        return;
      }

      const planData = planSnap.data();
      setPlan(planData);

    
      const fetchedProblems = await Promise.all(
        planData.problems.map(async (problemKey) => {
          const response = await fetch(`https://codeforces.com/api/problemset.problems?tags=${problemKey}`);
          const data = await response.json();
          return data.result.problems[0]; // Assuming each key returns a single problem
        })
       
      );

      setProblemDetails(fetchedProblems);
     
    };

    fetchPlan();
  }, [planId]);

  if (!plan) return <div>Loading...</div>;
  console.log(problemDetails);
  return (
    <div className="plan-detail-container">
      <h2>Plan: {plan.name}</h2>
      <ProblemList problems={problemDetails} showTags={true} />
    </div>
  );
}

export default PlanDetail;
