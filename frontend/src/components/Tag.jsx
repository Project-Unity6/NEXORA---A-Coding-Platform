import React from 'react';

export default function Tag({ children }) {
  // Format tag name from snake_case or hyphen-case to Title Case nicely
  const formatTag = (text) => {
    if (!text) return '';
    return text
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className="tag">
      {formatTag(children)}
    </span>
  );
}
