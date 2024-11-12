import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ArticleCard = ({ article }) => {
  if (!article) return null;

  const formatDate = (dateString) => {
    try {
      // Ensure we have a valid date string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date unavailable';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date unavailable';
    }
  };

  const handleArticleClick = (e) => {
    if (!article.url) {
      e.preventDefault();
      return;
    }
    const url = article.url.startsWith('http') ? article.url : `https://${article.url}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="article-card">
      <h2>
        <a 
          href={article.url} 
          onClick={handleArticleClick}
          className="article-title"
          target="_blank" 
          rel="noopener noreferrer"
        >
          {article.title || 'Untitled Article'}
        </a>
      </h2>
      <p>{article.content || 'No content available'}</p>
      <div className="meta">
        <span>Department: {article.department || 'Unspecified'}</span>
        <span>Officials: {Array.isArray(article.officials) ? article.officials.join(', ') : 'Unspecified'}</span>
        <span>Published: {formatDate(article.date)}</span>
        {article.source && <span>Source: {article.source}</span>}
      </div>
    </div>
  );
};

export default ArticleCard;