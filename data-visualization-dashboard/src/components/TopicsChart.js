import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../App.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TopicsChart = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    endYear: "",
    topics: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    swot: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/filterdata",
          {
            params: filters,
          }
        );
        const responseData = response.data;

        if (Array.isArray(responseData)) {
          const labels = responseData.map((item) => item.topic);
          const intensity = responseData.map((item) => item.intensity);

          setData({
            labels,
            datasets: [
              {
                label: "Intensity",
                data: intensity,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError("Data is not in expected format.");
        }
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chart-container">
      <h2 className="chart-title">Topic Intensity Distribution</h2>
      <p className="chart-subtitle">
        Distribution of intensity across various topics
      </p>
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
      <Pie data={data} />
    </div>
  );
};

export default TopicsChart;
