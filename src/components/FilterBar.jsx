import React from 'react';

const FilterBar = ({ onFilterChange }) => (
  <div className="filter-bar">
    <select onChange={(e) => onFilterChange('department', e.target.value)}>
      <option value="">All Departments</option>
      <option value="Executive">Executive</option>
      <option value="Treasury">Treasury</option>
      <option value="State">State</option>
      <option value="Transportation">Transportation</option>
      <option value="Senate">Senate</option>
      <option value="House">House</option>
    </select>
    <select onChange={(e) => onFilterChange('official', e.target.value)}>
      <option value="">All Officials</option>
      <option value="Joe Biden">Joe Biden</option>
      <option value="Janet Yellen">Janet Yellen</option>
      <option value="Antony Blinken">Antony Blinken</option>
      <option value="Pete Buttigieg">Pete Buttigieg</option>
      <option value="John Fetterman">John Fetterman</option>
      <option value="Bob Casey">Bob Casey</option>
      <option value="Brian Fitzpatrick">Brian Fitzpatrick</option>
      <option value="Matt Cartwright">Matt Cartwright</option>
    </select>
  </div>
)

export default FilterBar;