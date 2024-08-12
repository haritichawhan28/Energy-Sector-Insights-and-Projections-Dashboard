import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid, Paper } from "@mui/material";
import LineChart from "./LineChart"; // Import the LineChart component

const Dashboard = () => {
  const [lineChartData, setLineChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/linechart"); // Adjust URL as needed
        const data = response.data;

        if (data && Array.isArray(data)) {
          const labels = data.map((item) => item.year);
          const intensity = data.map((item) => item.intensity);
          const likelihood = data.map((item) => item.likelihood);
          const relevance = data.map((item) => item.relevance);

          setLineChartData({
            labels,
            datasets: [
              {
                label: "Intensity",
                data: intensity,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
              },
              {
                label: "Likelihood",
                data: likelihood,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
              },
              {
                label: "Relevance",
                data: relevance,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
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
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <LineChart data={lineChartData} options={chartOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
