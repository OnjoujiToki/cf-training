import React, { useState, useEffect, useContext } from 'react';
import { ListGroup, ListGroupItem, Card, CardHeader, CardBody, Container, Row, Col } from 'reactstrap';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import {auth} from '../config/firebase';

function Training() {
  const [publicPlans, setPublicPlans] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();
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
        // Fetch public plans
        const publicPlansQuery = query(collection(db, "plans"), where("private", "==", false));
        const publicPlansSnapshot = await getDocs(publicPlansQuery);
        const fetchedPublicPlans = [];
        publicPlansSnapshot.forEach((doc) => {
          fetchedPublicPlans.push({ id: doc.id, ...doc.data() });
        });
        setPublicPlans(fetchedPublicPlans);

        // Fetch user-specific plans if user is logged in
        if (currentUser) {
          // const userDocRef = doc(db, "users", currentUser.uid);
          const userDocRef = doc(db, "users", "2JKFYqGxS12SfkiqN3Pq");
          const userDocSnap = await getDoc(userDocRef);
          console.log(userDocSnap.data().plan);
          if (userDocSnap.exists() && userDocSnap.data().plan) {
            const userPlansPromises = userDocSnap.data().plan.map((planId) => {
              console.log(planId);
              return getDoc(doc(db, "plans", planId));
            });
            /*
            const userPlansSnapshots = await Promise.all(userPlansPromises);
            const fetchedUserPlans = userPlansSnapshots.map((snap, index) => {
              return { id: snap.id, ...snap.data() }; // Assuming the plan has a name property
            });
            setUserPlans(fetchedUserPlans);*/
          }
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
            <CardHeader className="bg-light">
              <h3>My Training Plans</h3>
            </CardHeader>
            <CardBody>
              <ListGroup flush>
                {userPlans.map((planId, index) => (
                  <ListGroupItem key={index} tag="button" action onClick={() => handlePlanClick(planId)}>
                    Plan {index + 1}
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
