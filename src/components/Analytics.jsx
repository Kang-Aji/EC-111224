import React from 'react';
import { format } from 'date-fns';

const Analytics = ({ data, loading, error }) => {
  if (loading) return <div className="analytics loading">Loading analytics...</div>;
  if (error) return <div className="analytics error">Failed to load analytics</div>;

  return (
    <div className="analytics">
      <h3>Real-time Analytics</h3>
      <div className="stats">
        <div>Total Articles: {data.totalArticles}</div>
        <div>Active Departments: {data.activeDepartments}</div>
        <div>Featured Officials: {data.featuredOfficials}</div>
        <div className="last-update">
          Last updated: {format(new Date(data.lastUpdate), 'PPp')}
        </div>
      </div>
    </div>
  );
};

export default Analytics;