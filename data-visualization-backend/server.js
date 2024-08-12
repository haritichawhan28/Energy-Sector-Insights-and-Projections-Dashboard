import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://haritichawhan:root@cluster0.astnd.mongodb.net/DashBoard?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const dataSchema = new mongoose.Schema({
  intensity: Number,
  likelihood: Number,
  relevance: Number,
  year: Number,
  country: String,
  topics: [String],
  region: String,
  city: String,
  sector: String,
  topic: String,
  insight: String,
  url: String,
  impact: String,
  added: String,
  published: String,
  pestle: String,
  source: String,
  title: String,
});

const DataModel = mongoose.model("Data", dataSchema);

// Route to get data for Multi-Line Chart or Area Chart
app.get("/api/linechart", async (req, res) => {
  try {
    const {
      endYear,
      topics,
      sector,
      region,
      pestle,
      source,
      swot,
      country,
      city,
    } = req.query;

    const query = {};
    if (endYear) query.year = { $lte: parseInt(endYear) };
    if (topics) query.topics = { $in: topics.split(",") };
    if (sector) query.sector = sector;
    if (region) query.region = region;
    if (pestle) query.pestle = pestle;
    if (source) query.source = source;
    if (swot) query.swot = swot;
    if (country) query.country = country;
    if (city) query.city = city;

    const data = await DataModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$year",
          intensity: { $avg: "$intensity" },
          likelihood: { $avg: "$likelihood" },
          relevance: { $avg: "$relevance" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedData = data.map((item) => ({
      year: item._id,
      intensity: item.intensity,
      likelihood: item.likelihood,
      relevance: item.relevance,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get data for Timeline or Heatmap
app.get("/api/timeline", async (req, res) => {
  try {
    const {
      endYear,
      topics,
      sector,
      region,
      pestle,
      source,
      swot,
      country,
      city,
    } = req.query;

    const query = {};
    if (endYear) query.year = { $lte: parseInt(endYear) };
    if (topics) query.topics = { $in: topics.split(",") };
    if (sector) query.sector = sector;
    if (region) query.region = region;
    if (pestle) query.pestle = pestle;
    if (source) query.source = source;
    if (swot) query.swot = swot;
    if (country) query.country = country;
    if (city) query.city = city;

    const data = await DataModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
          totalIntensity: { $sum: "$intensity" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedData = data.map((item) => ({
      year: item._id,
      count: item.count,
      totalIntensity: item.totalIntensity,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get data for Choropleth Map or Bubble Map
app.get("/api/geodata", async (req, res) => {
  try {
    const {
      endYear,
      topics,
      sector,
      region,
      pestle,
      source,
      swot,
      country,
      city,
    } = req.query;

    const query = {};
    if (endYear) query.year = { $lte: parseInt(endYear) };
    if (topics) query.topics = { $in: topics.split(",") };
    if (sector) query.sector = sector;
    if (region) query.region = region;
    if (pestle) query.pestle = pestle;
    if (source) query.source = source;
    if (swot) query.swot = swot;
    if (country) query.country = country;
    if (city) query.city = city;

    const data = await DataModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: { country: "$country", region: "$region", city: "$city" },
          intensity: { $avg: "$intensity" },
          likelihood: { $avg: "$likelihood" },
          relevance: { $avg: "$relevance" },
        },
      },
      { $sort: { "_id.country": 1, "_id.region": 1, "_id.city": 1 } },
    ]);

    const formattedData = data.map((item) => ({
      country: item._id.country,
      region: item._id.region,
      city: item._id.city,
      intensity: item.intensity,
      likelihood: item.likelihood,
      relevance: item.relevance,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get data for Sunburst Chart or Treemap
app.get("/api/topics", async (req, res) => {
  try {
    const {
      endYear,
      topics,
      sector,
      region,
      pestle,
      source,
      swot,
      country,
      city,
    } = req.query;

    const query = {};
    if (endYear) query.year = { $lte: parseInt(endYear) };
    if (topics) query.topics = { $in: topics.split(",") };
    if (sector) query.sector = sector;
    if (region) query.region = region;
    if (pestle) query.pestle = pestle;
    if (source) query.source = source;
    if (swot) query.swot = swot;
    if (country) query.country = country;
    if (city) query.city = city;

    const data = await DataModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$topic",
          intensity: { $avg: "$intensity" },
          likelihood: { $avg: "$likelihood" },
          relevance: { $avg: "$relevance" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedData = data.map((item) => ({
      topic: item._id,
      intensity: item.intensity,
      likelihood: item.likelihood,
      relevance: item.relevance,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get data for Stacked Bar Chart or Grouped Bar Chart
app.get("/api/region", async (req, res) => {
  try {
    const {
      endYear,
      topics,
      sector,
      region,
      pestle,
      source,
      swot,
      country,
      city,
    } = req.query;

    const query = {};
    if (endYear) query.year = { $lte: parseInt(endYear) };
    if (topics) query.topics = { $in: topics.split(",") };
    if (sector) query.sector = sector;
    if (region) query.region = region;
    if (pestle) query.pestle = pestle;
    if (source) query.source = source;
    if (swot) query.swot = swot;
    if (country) query.country = country;
    if (city) query.city = city;

    const data = await DataModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: { region: "$region", year: "$year" },
          intensity: { $sum: "$intensity" },
          likelihood: { $sum: "$likelihood" },
          relevance: { $sum: "$relevance" },
        },
      },
      { $sort: { "_id.region": 1, "_id.year": 1 } },
    ]);

    const formattedData = data.reduce((acc, item) => {
      const key = `${item._id.region}-${item._id.year}`;
      acc[key] = {
        region: item._id.region,
        year: item._id.year,
        intensity: item.intensity,
        likelihood: item.likelihood,
        relevance: item.relevance,
      };
      return acc;
    }, {});

    res.json(Object.values(formattedData));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get data for Scatter Plot (City)
app.get("/api/city", async (req, res) => {
  try {
    const {
      endYear,
      topics,
      sector,
      region,
      pestle,
      source,
      swot,
      country,
      city,
    } = req.query;

    const query = {};
    if (endYear) query.year = { $lte: parseInt(endYear) };
    if (topics) query.topics = { $in: topics.split(",") };
    if (sector) query.sector = sector;
    if (region) query.region = region;
    if (pestle) query.pestle = pestle;
    if (source) query.source = source;
    if (swot) query.swot = swot;
    if (country) query.country = country;
    if (city) query.city = city;

    const data = await DataModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$city",
          intensity: { $avg: "$intensity" },
          likelihood: { $avg: "$likelihood" },
          relevance: { $avg: "$relevance" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedData = data.map((item) => ({
      city: item._id,
      intensity: item.intensity,
      likelihood: item.likelihood,
      relevance: item.relevance,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
