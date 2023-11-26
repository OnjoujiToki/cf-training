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
          // First, try to fetch the problem from the database
          const problemRef = doc(db, "problems", problemKey);
          const problemSnap = await getDoc(problemRef);

          if (problemSnap.exists()) {
            // Problem found in the database
            console.log("Problem found in the database");
            console.log(problemSnap.data());
            return problemSnap.data();
          } else {
            console.log("ERROR getting the problem rom the database")
           }
        })
      );

      setProblemDetails(fetchedProblems);
    };

    fetchPlan();
  }, [planId]);

  if (!plan) return <div>Loading...</div>;
  
  return (
    <div className="plan-detail-container">
    
      <ProblemList problems={problemDetails} showTags={true} listName={plan.name} />
    </div>
  );
}

export default PlanDetail;
