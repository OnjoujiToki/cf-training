import React from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import CompleteProblems from "./components/CompleteProblems";
import "./styles/styles.css";
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import Training from './components/Training';



function App({ signOut, user }) {
  return (
    <>
      <NavBar />
     
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect from / to /home */}
        <Route path="/home" element={<Dashboard />} /> 
        <Route path="/problem" element={<CompleteProblems />} />
        <Route path="/training" element={<Training />} />
        {/* other routes as needed */}
      </Routes>
    </>
  );
}

export default App;