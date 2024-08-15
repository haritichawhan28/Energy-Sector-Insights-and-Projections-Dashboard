import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RegionChart = () => {
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

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(
          `http://localhost:5000/api/filterdata?${queryParams}`
        );
        const responseData = response.data;

        if (Array.isArray(responseData)) {
          const labels = responseData.map(
            (item) => `${item.region} (${item.year})`
          );
          const intensity = responseData.map((item) => item.intensity);
          const likelihood = responseData.map((item) => item.likelihood);
          const relevance = responseData.map((item) => item.relevance);

          setData({
            labels,
            datasets: [
              {
                label: "Intensity",
                data: intensity,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
              },
              {
                label: "Likelihood",
                data: likelihood,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
              },
              {
                label: "Relevance",
                data: relevance,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
              },
            ],
          });
        } else {
          setError("Data is not in the expected format.");
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Region (Year)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="chart-container">
      <h2 className="chart-title">
        Regional Distribution of Intensity, Likelihood, and Relevance
      </h2>
      <p className="chart-subtitle">Compare metrics across different regions</p>
      <div className="filters">
        <input
          type="text"
          name="region"
          placeholder="Region"
          value={filters.region}
          onChange={handleChange}
        />
        <input
          type="number"
          name="endYear"
          placeholder="End Year"
          value={filters.endYear}
          onChange={handleChange}
        />
        {/* Add other filters as needed */}
      </div>
      <Bar data={data} options={chartOptions} />
    </div>
  );
};

export default RegionChart;
