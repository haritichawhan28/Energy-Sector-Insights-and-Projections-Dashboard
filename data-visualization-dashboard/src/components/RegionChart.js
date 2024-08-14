// src/components/RegionChart.js
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/region"); // Adjust URL if needed
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
              },
              {
                label: "Likelihood",
                data: likelihood,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
              },
              {
                label: "Relevance",
                data: relevance,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
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
  }, []);

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
          text: "Region and Year",
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

  // Add a headline and import styles
  return (
    <div className="chart-container">
      <h2 className="chart-title">Regional Metrics Overview</h2>
      <p className="chart-subtitle">
        Comparative analysis of intensity, likelihood, and relevance by region
      </p>
      <Bar data={data} options={chartOptions} />
    </div>
  );
};

export default RegionChart;
