import React, { useState, useEffect, useContext } from 'react';
import { ListGroup, ListGroupItem, Card, CardHeader, CardBody, Container, Row, Col, Button} from 'reactstrap';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import {auth} from '../config/firebase';

function Training() {
  const [publicPlans, setPublicPlans] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();
  const handleNewPlan = () => {
    navigate('/create-plan'); 
  };
  const fetchUserPlans = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists() && userDocSnap.data().plans) {
        const userPlansPromises = userDocSnap.data().plans.map(planId => getDoc(doc(db, "plans", planId)));
        const userPlansSnapshots = await Promise.all(userPlansPromises);
        return userPlansSnapshots.map(snap => ({ id: snap.id, ...snap.data() }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching user plans:", error);
      return [];
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe; // Cleanup subscription
  }, []);
  const currentUser = auth.currentUser;
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const publicPlansQuery = query(collection(db, "plans"), where("private", "==", false));
        const publicPlansSnapshot = await getDocs(publicPlansQuery);
        const fetchedPublicPlans = [];
        publicPlansSnapshot.forEach((doc) => {
          fetchedPublicPlans.push({ id: doc.id, ...doc.data() });
        });
        setPublicPlans(fetchedPublicPlans);
        if (currentUser) {
          const userPlans = await fetchUserPlans(currentUser.uid);
          
          setUserPlans(userPlans);
          
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, [currentUser]);

  const handlePlanClick = (planId) => {
    navigate(`/plan/${planId}`);
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={6}>
          <Card>
            <CardHeader className="bg-light">
              <h3>Public Training Plans</h3>
            </CardHeader>
            <CardBody>
              <ListGroup flush>
                {publicPlans.map((plan) => (
                  <ListGroupItem key={plan.id} tag="button" action onClick={() => handlePlanClick(plan.id)}>
                    {plan.name}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
          <CardHeader className="bg-light d-flex justify-content-between align-items-center">
             <h3>My Training Plans</h3>
              <Button color="primary" onClick={handleNewPlan}>Add New Plan</Button>
            </CardHeader>
            <CardBody>
              <ListGroup flush>
                {userPlans.map((plan) => (
                  <ListGroupItem key={plan.id} tag="button" action onClick={() => handlePlanClick(plan.id)}>
                    {plan.name}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Training;
