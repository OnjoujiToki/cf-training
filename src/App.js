import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import CompleteProblems from "./components/CompleteProblems";
import "./styles/styles.css";
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import Training from './components/TrainingComponents/Training';
import PlanDetail from './components/TrainingComponents/PlanDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreatePlan from './components/TrainingComponents/CreatePlan';
import FavoriteProblems from './components/FavoriteComponents/FavoriteProblems';
import SettingsPage from './components/UserDropDown/SettingsPage';




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe; // Cleanup subscription
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} onSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/problem" element={<CompleteProblems />} />
        <Route path="/training" element={<Training />} />
        <Route path="/plan/:planId" element={<PlanDetail />} />
        <Route path="/create-plan" element={<CreatePlan />} />
        <Route path="/favorite" element={<FavoriteProblems/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        {/* other routes as needed */}
      </Routes>
    </>
  );
}

export default App;