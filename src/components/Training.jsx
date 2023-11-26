import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function Training() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const q = query(collection(db, "plans"), where("private", "==", false));
        const querySnapshot = await getDocs(q);
        const fetchedPlans = [];
        querySnapshot.forEach((doc) => {
          fetchedPlans.push({ id: doc.id, ...doc.data() });
        });
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanClick = (planId) => {
    navigate(`/plan/${planId}`); // Navigate to plan detail page
  };

  return (
    <div>
      <h2>Public Training Plans</h2>
      <ListGroup>
        {plans.map((plan) => (
          <ListGroupItem key={plan.id} tag="button" action onClick={() => handlePlanClick(plan.id)}>
            Plan by Author ID: {plan.author_name}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}

export default Training;
