import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid, Paper } from "@mui/material";
import LineChart from "./LineChart"; // Import the LineChart component
import TimelineChart from "./TimelineChart"; // Import the TimelineChart component
//import GeoMap from "./GeoMap"; // Import the GeoMap component
import TopicsChart from "./TopicsChart"; // Import the TopicsChart component
import RegionChart from "./RegionChart"; // Import the RegionChart component
import CityChart from "./CityChart"; // Import the CityChart component

const Dashboard = () => {
  const [lineChartData, setLineChartData] = useState({});
  const [timelineChartData, setTimelineChartData] = useState({});
  const [geoData, setGeoData] = useState({});
  const [topicsData, setTopicsData] = useState({});
  const [regionData, setRegionData] = useState({});
  const [cityData, setCityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Line Chart Data
        const lineChartResponse = await axios.get(
          "http://localhost:5000/api/linechart"
        );
        const lineChartData = lineChartResponse.data;

        if (lineChartData && Array.isArray(lineChartData)) {
          const labels = lineChartData.map((item) => item.year);
          const intensity = lineChartData.map((item) => item.intensity);
          const likelihood = lineChartData.map((item) => item.likelihood);
          const relevance = lineChartData.map((item) => item.relevance);

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
          setError("Line chart data is not in expected format.");
        }

        // Fetch Timeline Chart Data
        const timelineResponse = await axios.get(
          "http://localhost:5000/api/timeline"
        );
        const timelineData = timelineResponse.data;

        if (timelineData && Array.isArray(timelineData)) {
          const labels = timelineData.map((item) => item.year);
          const count = timelineData.map((item) => item.count);
          const totalIntensity = timelineData.map(
            (item) => item.totalIntensity
          );

          setTimelineChartData({
            labels,
            datasets: [
              {
                label: "Count",
                data: count,
                borderColor: "rgba(255, 159, 64, 1)",
                backgroundColor: "rgba(255, 159, 64, 0.2)",
              },
              {
                label: "Total Intensity",
                data: totalIntensity,
                borderColor: "rgba(153, 102, 255, 1)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
              },
            ],
          });
        } else {
          setError("Timeline chart data is not in expected format.");
        }

        // Fetch Geo Map Data
        const geoResponse = await axios.get(
          "http://localhost:5000/api/geodata"
        );
        const geoData = geoResponse.data;

        if (geoData && Array.isArray(geoData)) {
          setGeoData({
            // Process geoData as needed for GeoMap component
            features: geoData.features, // Example field
          });
        } else {
          setError("Geo map data is not in expected format.");
        }

        // Fetch Topics Chart Data
        // const topicsResponse = await axios.get(
        //   "http://localhost:5000/api/topics"
        // );
        // const topicsData = topicsResponse.data;

        // if (topicsData && Array.isArray(topicsData)) {
        //   const labels = topicsData.map((item) => item.topic);
        //   const values = topicsData.map((item) => item.value);

        //   setTopicsData({
        //     labels,
        //     datasets: [
        //       {
        //         label: "Topics",
        //         data: values,
        //         borderColor: "rgba(255, 205, 86, 1)",
        //         backgroundColor: "rgba(255, 205, 86, 0.2)",
        //       },
        //     ],
        //   });
        // } else {
        //   setError("Topics chart data is not in expected format.");
        // }

        // Fetch Region Chart Data
        const regionResponse = await axios.get(
          "http://localhost:5000/api/region"
        );
        const regionData = regionResponse.data;

        if (regionData && Array.isArray(regionData)) {
          const labels = regionData.map((item) => item.region);
          const values = regionData.map((item) => item.value);

          setRegionData({
            labels,
            datasets: [
              {
                label: "Region",
                data: values,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },
            ],
          });
        } else {
          setError("Region chart data is not in expected format.");
        }

        // Fetch City Chart Data
        const cityResponse = await axios.get("http://localhost:5000/api/city");
        const cityData = cityResponse.data;

        if (cityData && Array.isArray(cityData)) {
          const labels = cityData.map((item) => item.city);
          const values = cityData.map((item) => item.value);

          setCityData({
            labels,
            datasets: [
              {
                label: "City",
                data: values,
                borderColor: "rgba(153, 102, 255, 1)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
              },
            ],
          });
        } else {
          setError("City chart data is not in expected format.");
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
        <Grid item xs={12}>
          <Paper>
            <TimelineChart data={timelineChartData} options={chartOptions} />
          </Paper>
        </Grid>
        {/* <Grid item xs={12}>
          <Paper>
            <GeoMap data={geoData} />
          </Paper>
        </Grid> */}
        <Grid item xs={12}>
          <Paper>
            <TopicsChart data={topicsData} options={chartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <RegionChart data={regionData} options={chartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <CityChart data={cityData} options={chartOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
