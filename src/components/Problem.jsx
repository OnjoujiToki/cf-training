import { React, useState } from "react";

const getDifficultyColor = (rating) => {
  if (rating >= 2400) return "red";
  if (rating >= 2200) return "orange";
  if (rating >= 1900) return "purple";
  if (rating >= 1600) return "blue";
  if (rating >= 1400) return "cyan";
  if (rating >= 1200) return "green";
  return "gray"; // Less than 1200
};

const Problem = ({ problem, isSolved, showTags }) => {
  const difficultyColor = getDifficultyColor(problem.rating);
  const problemUrl = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;

  return (
    <a
      href={problemUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="problem-link"
    >
      <div
        className={`problem ${isSolved ? "solved" : ""}`}
        style={{ borderColor: difficultyColor }}
      >
        <div className="problem-details">
          <div className="problem-info">
            <span className="problem-id">{`${problem.contestId}${problem.index}`}</span>
            <span className="problem-name">{problem.name}</span>
          </div>
          <span className="problem-rating" style={{ color: difficultyColor }}>
            {problem.rating}
          </span>
        </div>
        {showTags && (
          <div className="problem-tags">
            {problem.tags.map((tag, index) => (
              <span key={index} className="problem-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );

};

export default Problem;
