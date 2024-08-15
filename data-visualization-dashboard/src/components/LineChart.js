import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Filters from "./Filters"; // Import Filters component

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
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
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(
          `http://localhost:5000/api/filterdata?${queryParams}`
        );
        const responseData = response.data;

        if (Array.isArray(responseData)) {
          const labels = responseData.map((item) => item.year);
          const intensity = responseData.map((item) => item.intensity);
          const likelihood = responseData.map((item) => item.likelihood);
          const relevance = responseData.map((item) => item.relevance);

          setData({
            labels,
            datasets: [
              {
                label: "Intensity",
                data: intensity,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
              },
              {
                label: "Likelihood",
                data: likelihood,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true,
              },
              {
                label: "Relevance",
                data: relevance,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
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
          text: "Year",
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chart-container">
      <h2 className="chart-title">
        Yearly Trends of Intensity, Likelihood, and Relevance
      </h2>
      <p className="chart-subtitle">
        Analyze the change in metrics over the years
      </p>
      <Filters filters={filters} handleFilterChange={handleFilterChange} />
      <Line data={data} options={chartOptions} />
    </div>
  );
};

export default LineChart;
