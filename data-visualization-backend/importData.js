import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Connect to MongoDB Cloud
mongoose.connect(
  "mongodb+srv://haritichawhan:root@cluster0.astnd.mongodb.net/DashBoard?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define the schema according to your JSON data
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

// Function to read JSON file and import data
const importData = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const filePath = path.join(__dirname, "data", "jsondata.json"); // Path to your JSON file
    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    const formattedData = jsonData.map((item) => ({
      intensity: item.intensity,
      likelihood: item.likelihood,
      relevance: item.relevance,
      year: item.start_year ? parseInt(item.start_year) : null, // Handle missing year
      country: item.country,
      topics: [item.topic], // Change to handle multiple topics if needed
      region: item.region,
      city: item.city || "", // Handle missing city
      sector: item.sector,
      topic: item.topic,
      insight: item.insight,
      url: item.url,
      impact: item.impact || "", // Handle missing impact
      added: item.added,
      published: item.published,
      pestle: item.pestle,
      source: item.source,
      title: item.title,
    }));

    await DataModel.insertMany(formattedData);
    console.log("Data imported successfully!");
  } catch (error) {
    console.error("Error importing data:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

importData();
