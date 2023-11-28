import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc} from "firebase/firestore";
import { db, auth} from "../../config/firebase";
import ProblemList from "../ProblemList";
import "../componentsCSS/PlanDetailCSS.css"
function PlanDetail() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [problemDetails, setProblemDetails] = useState([]);
  const handleProblemDelete = async (problemId) => {
    try {
      const updatedProblems = plan.problems.filter(pId => pId !== problemId);
      await updateDoc(doc(db, "plans", planId), { problems: updatedProblems });
      setPlan({ ...plan, problems: updatedProblems });
      setProblemDetails(problemDetails.filter(p => p.id !== problemId));
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };


  const handleAddProblem = async () => {
    const problemKey = prompt("Enter the problem key:");
    if (problemKey) {
      const problemRef = doc(db, "problems", problemKey);
      const problemSnap = await getDoc(problemRef);

      if (problemSnap.exists()) {
        const newProblem = problemSnap.data();
        const updatedProblems = [...plan.problems, problemKey]; // Add new problem key to array
        await updateDoc(doc(db, "plans", planId), { problems: updatedProblems });

        setPlan({ ...plan, problems: updatedProblems });
        setProblemDetails([...problemDetails, newProblem]); // Add new problem data to state
      } else {
        console.log("Problem not found");
      }
    }
  };

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
          
            return problemSnap.data();
          } else {
            console.log("ERROR getting the problem rom the database")
           }
        })
      );
      console.log("fetchedProblems", fetchedProblems);
      setProblemDetails(fetchedProblems);
    };

    fetchPlan();
  }, [planId]);

  if (!plan) return <div>Loading...</div>;
  
  const isAuthor = auth.currentUser && plan.author_id === auth.currentUser.uid;

  return (
    <div className="plan-detail-container">
      <div className="plan-header">
        {isAuthor && (
          <div className="add-problem-container">
            <button onClick={handleAddProblem} className="add-problem-button">
              Add New Problem
            </button>
          </div>
        )}
      </div>
      <ProblemList
        plan={planId}
        listName={plan.name}
        problems={problemDetails} 
        showTags={true} 
        onDelete={isAuthor ? handleProblemDelete : undefined} 
      />
    </div>
  );
}

export default PlanDetail;
