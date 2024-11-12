import { useState, useEffect, useCallback } from 'react';

export const useTrendingOfficials = () => {
  const [trendingOfficials, setTrendingOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/trending');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trending officials');
      }
      
      const data = await response.json();
      setTrendingOfficials(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching trending officials:', err);
      setTrendingOfficials([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return [trendingOfficials, setTrendingOfficials, { loading, error }];
};