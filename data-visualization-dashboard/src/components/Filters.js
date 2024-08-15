import React from "react";
import "../App.css";

const Filters = ({ filters, handleFilterChange }) => {
  return (
    <div className="filters-container">
      <label>
        End Year:
        <input
          type="text"
          name="endYear"
          value={filters.endYear}
          onChange={handleFilterChange}
        />
      </label>
      <label>
        Topics:
        <input
          type="text"
          name="topics"
          value={filters.topics}
          onChange={handleFilterChange}
        />
      </label>
      <label>
        Region:
        <input
          type="text"
          name="region"
          value={filters.region}
          onChange={handleFilterChange}
        />
      </label>
      {/* Add more filters as needed */}
    </div>
  );
};

export default Filters;
