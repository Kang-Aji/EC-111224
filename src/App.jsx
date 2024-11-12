import React, { useState, useCallback, useMemo } from 'react';
import ArticleCard from './components/ArticleCard';
import FilterBar from './components/FilterBar';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import Analytics from './components/Analytics';
import { useSocket } from './hooks/useSocket';
import { useArticles } from './hooks/useArticles';
import { useTrendingOfficials } from './hooks/useTrendingOfficials';
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    official: '',
    department: '',
    keyword: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [analyticsData, setAnalyticsData] = useState({
    totalArticles: 0,
    activeDepartments: 0,
    featuredOfficials: 0,
    lastUpdate: new Date(),
  });
  
  const [articles, setArticles, articlesState] = useArticles(filters, searchTerm);
  const [trendingOfficials, setTrendingOfficials, trendingState] = useTrendingOfficials();
  
  const handleNewArticles = useCallback((newArticles) => {
    setArticles(prevArticles => [...newArticles, ...prevArticles]);
  }, []);
  
  const handleTrendingUpdate = useCallback((newTrending) => {
    setTrendingOfficials(newTrending);
  }, []);

  const handleAnalyticsUpdate = useCallback((newAnalytics) => {
    setAnalyticsData(typeof newAnalytics === 'function' ? newAnalytics(analyticsData) : newAnalytics);
  }, [analyticsData]);
  
  useSocket(handleNewArticles, handleTrendingUpdate, handleAnalyticsUpdate);

  const handleFilterChange = useCallback((filterName, filterValue) => {
    setFilters(prev => ({ ...prev, [filterName]: filterValue }));
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const isOfficialMatch = !filters.official || article.officials.includes(filters.official);
      const isDepartmentMatch = !filters.department || article.department === filters.department;
      const isKeywordMatch = !searchTerm || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase());

      return isOfficialMatch && isDepartmentMatch && isKeywordMatch;
    });
  }, [articles, filters, searchTerm]);

  return (
    <div className="app">
      <header>
        <h1>US Government News</h1>
        <SearchBar onSearchChange={handleSearchChange} />
      </header>
      <main>
        <FilterBar onFilterChange={handleFilterChange} />
        <div className="content">
          <div className="main-feed">
            {articlesState.error ? (
              <div className="error">Error loading articles: {articlesState.error}</div>
            ) : articlesState.loading ? (
              <div className="loading">Loading articles...</div>
            ) : filteredArticles.length === 0 ? (
              <div className="no-results">No articles found</div>
            ) : (
              filteredArticles.map(article => (
                <ArticleCard key={article.url} article={article} />
              ))
            )}
          </div>
          <aside>
            <Sidebar 
              trendingOfficials={trendingOfficials} 
              loading={trendingState.loading}
              error={trendingState.error}
            />
            <Analytics 
              data={analyticsData}
              loading={false}
              error={null}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;