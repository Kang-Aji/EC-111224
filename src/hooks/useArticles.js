import { useState, useEffect, useCallback } from 'react';

export const useArticles = (filters, searchTerm) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/articles');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let data = await response.json();
      
      // Validate and sanitize the data
      data = data.map(article => ({
        ...article,
        date: article.date || new Date().toISOString(),
        officials: Array.isArray(article.officials) ? article.officials : 
                  (typeof article.officials === 'string' ? article.officials.split(',') : []),
        title: article.title || 'Untitled Article',
        content: article.content || 'No content available',
        department: article.department || 'Unspecified'
      }));
      
      // Apply filters
      let filteredData = data;
      
      if (filters.official) {
        filteredData = filteredData.filter(article => 
          article.officials.some(official => 
            official.toLowerCase().includes(filters.official.toLowerCase())
          )
        );
      }
      
      if (filters.department) {
        filteredData = filteredData.filter(article => 
          article.department.toLowerCase() === filters.department.toLowerCase()
        );
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredData = filteredData.filter(article =>
          article.title.toLowerCase().includes(term) ||
          article.content.toLowerCase().includes(term)
        );
      }
      
      setArticles(filteredData);
      setError(null);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return [articles, setArticles, { loading, error }];
};