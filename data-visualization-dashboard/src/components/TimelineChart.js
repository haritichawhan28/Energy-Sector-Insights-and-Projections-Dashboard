// src/components/TimelineChart.js
import React, { useEffect, useState } from "react";
import axios from "axios";
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

const TimelineChart = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/timeline"); // Adjust URL if needed
        const responseData = response.data;

        if (Array.isArray(responseData)) {
          const labels = responseData.map((item) => item.year);
          const count = responseData.map((item) => item.count);
          const totalIntensity = responseData.map(
            (item) => item.totalIntensity
          );

          setData({
            labels,
            datasets: [
              {
                label: "Count",
                data: count,
                borderColor: "rgba(255, 159, 64, 1)",
                backgroundColor: "rgba(255, 159, 64, 0.2)",
                fill: true,
              },
              {
                label: "Total Intensity",
                data: totalIntensity,
                borderColor: "rgba(153, 102, 255, 1)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
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
    <div>
      <Line data={data} options={chartOptions} />
    </div>
  );
};

export default TimelineChart;
