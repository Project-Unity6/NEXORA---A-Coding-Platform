import React from 'react';

export default function DifficultyBadge({ difficulty }) {
  const diff = (difficulty || 'easy').toLowerCase();
  
  let className = 'diff-easy';
  let label = 'Easy';
  
  if (diff === 'medium') {
    className = 'diff-medium';
    label = 'Medium';
  } else if (diff === 'hard') {
    className = 'diff-hard';
    label = 'Hard';
  }

  return (
    <span className={`difficulty ${className}`}>
      {label}
    </span>
  );
}
