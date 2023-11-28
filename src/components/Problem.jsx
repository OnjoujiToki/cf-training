import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarFilled, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { doc, updateDoc, arrayUnion, setDoc, getDoc, arrayRemove} from 'firebase/firestore';
import { db, auth } from '../config/firebase'; // Adjust the import path
import './componentsCSS/Problem.css';



const getDifficultyColor = (rating) => {
  if (rating >= 2400) return "red";
  if (rating >= 2200) return "orange";
  if (rating >= 1900) return "purple";
  if (rating >= 1600) return "blue";
  if (rating >= 1400) return "cyan";
  if (rating >= 1200) return "green";
  return "gray"; // Less than 1200
};
const Problem = ({ problem, isSolved, showTags, onDelete }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const difficultyColor = getDifficultyColor(problem.rating);
  const problemIdentifier = problem.id ? problem.id : `${problem.contestId}${problem.index}`;
  const problemUrl = `https://codeforces.com/problemset/problem/${problem.id ? problem.id.slice(0, -1) : problem.contestId}/${problem.id ? problem.id.slice(-1) : problem.index}`;
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(problem.id);
  };
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userFavorites = userDocSnap.data().fav || [];
          setIsFavorite(userFavorites.includes(problemIdentifier));
        }
      }
    };

    checkIfFavorite();
  }, [problemIdentifier]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevent the link from navigating
    if (!auth.currentUser) {
      alert('Please log in to save favorites');
      return;
    }
  
    const userDocRef = doc(db, "users", auth.currentUser.uid);
  
    if (isFavorite) {
      // Remove from favorites
      await updateDoc(userDocRef, {
        fav: arrayRemove(problemIdentifier)
      });
    } else {
      // Add to favorites
      await updateDoc(userDocRef, {
        fav: arrayUnion(problemIdentifier)
      });
    }
  
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div className="problem-container">
      <div className={`problem ${isSolved ? "solved" : ""}`} style={{ borderColor: difficultyColor }}>
        {onDelete && (
          <FontAwesomeIcon
            icon={faTrashAlt}
            className="delete-icon"
            onClick={handleDelete}
            title="Delete Problem"
          />
        )}
        <a href={problemUrl} target="_blank" rel="noopener noreferrer" className="problem-link">
          <div className="problem-details">
            <div className="problem-info">
              <FontAwesomeIcon
                icon={isFavorite ? faStarFilled : faStarRegular}
                className="favorite-icon"
                onClick={handleFavoriteClick}
                style={{ color: isFavorite ? 'pink' : 'lightgray' }}
              />
              <span className="problem-id">{problemIdentifier}</span>
              <span className="problem-name">{problem.name}</span>
            </div>
            <span className="problem-rating" style={{ color: difficultyColor }}>
              {problem.rating}
            </span>
          </div>
          {showTags && problem.tags && (
            <div className="problem-tags">
              {problem.tags.map((tag, index) => (
                <span key={index} className="problem-tag">{tag}</span>
              ))}
            </div>
          )}
        </a>
      </div>
    </div>
  );

};

export default Problem;