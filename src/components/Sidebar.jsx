import React from 'react';

const Sidebar = ({ trendingOfficials, loading, error }) => {
  if (loading) return <div className="sidebar loading">Loading trending officials...</div>;
  if (error) return <div className="sidebar error">Failed to load trending officials</div>;

  return (
    <div className="sidebar">
      <h3>Trending Officials</h3>
      <ul>
        {trendingOfficials.map(official => (
          <li key={official.name}>
            <span>{official.name}</span>
            <span>{official.mentionsCount} mentions</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;