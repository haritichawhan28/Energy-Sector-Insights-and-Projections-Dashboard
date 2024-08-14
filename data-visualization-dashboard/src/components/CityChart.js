import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const CityChart = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/city");
        const responseData = response.data;

        if (Array.isArray(responseData)) {
          const labels = responseData.map((item) => item.city);
          const intensity = responseData.map((item) => ({
            x: item.intensity,
            y: item.likelihood,
          }));
          const relevance = responseData.map((item) => ({
            x: item.intensity,
            y: item.relevance,
          }));

          setData({
            labels,
            datasets: [
              {
                label: "Intensity vs Likelihood",
                data: intensity,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
              },
              {
                label: "Intensity vs Relevance",
                data: relevance,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
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
            return `${label}: (${value.x}, ${value.y})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Intensity",
        },
      },
      y: {
        title: {
          display: true,
          text: "Likelihood / Relevance",
        },
      },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chart-container">
      <h2 className="chart-title">City Intensity vs Likelihood/Relevance</h2>
      <p className="chart-subtitle">
        A comparison of intensity with likelihood and relevance across cities
      </p>
      <Scatter data={data} options={chartOptions} />
    </div>
  );
};

export default CityChart;
