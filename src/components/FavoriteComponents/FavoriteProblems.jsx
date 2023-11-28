import React, { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase'; // Adjust import path as needed
import { doc, getDoc } from 'firebase/firestore';
import ProblemList from '../ProblemList';

function FavoriteProblems() {
  const [favoriteProblems, setFavoriteProblems] = useState([]);
  const [showTags] = useState(true); // Assuming you always want to show tags

  useEffect(() => {
    let isSubscribed = true;

    const fetchFavoriteProblems = async () => {
      if (auth.currentUser && isSubscribed) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().fav) {
          const problemKeys = userDocSnap.data().fav;
          const problems = await fetchProblemsByKeys(problemKeys);
          if (isSubscribed) {
            setFavoriteProblems(problems);
          }
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchFavoriteProblems();
      } else if (isSubscribed) {
        setFavoriteProblems([]);
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  const fetchProblemsByKeys = async (problemKeys) => {
    const problems = [];

    for (const key of problemKeys) {
      const problemRef = doc(db, 'problems', key);
      const problemSnap = await getDoc(problemRef);

      if (problemSnap.exists()) {
        const problemData = problemSnap.data();
        problems.push({
          id: key,
          name: problemData.name,
          rating: problemData.rating,
          tags: problemData.tags, // Assuming each problem has a 'tags' field
        });
      }
    }

    return problems;
  };
  return (
    <div>
      <ProblemList
        problems={favoriteProblems}
        showTags={true}
        listName="Favorite Problems"
      />
    </div>
  );
}

export default FavoriteProblems;
