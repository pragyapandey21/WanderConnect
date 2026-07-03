const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Destination = require("../models/Destination");

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};
const destinations = [
  {
    name: "Mumbai",
    state: "Maharashtra",
    country: "India",

    image:
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1200",

    heroImage:
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1200",

    latitude: 19.076,
    longitude: 72.8777,

    categories: ["City", "Nightlife", "Heritage"],

    shortDescription:
      "Mumbai is India's financial capital, famous for Marine Drive, Bollywood, and street food.",

    bestTimeToVisit: "October to February",

    estimatedBudget: "₹10,000 - ₹18,000",

    rating: 4.8,
    travelers: 312,
open: 200,
hotels: 90,
events: 25,
    mapTop: 355,
mapLeft: 75,
pinColor: "#22d3ee",

    trending: true,
  },

  {
    name: "Goa",
    state: "Goa",
    country: "India",

    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",

    heroImage:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",

    latitude: 15.2993,
    longitude: 74.124,

    categories: ["Beach", "Nightlife"],

    shortDescription:
      "Goa is India's beach paradise known for its nightlife, water sports, and Portuguese heritage.",

    bestTimeToVisit: "November to February",

    estimatedBudget: "₹12,000 - ₹20,000",

    rating: 4.9,
    travelers: 124,
open: 86,
hotels: 45,
events: 12,
    mapTop: 365,
mapLeft: 95,
pinColor: "#ec4899",

    trending: true,
  },
];
const importData = async () => {
  try {
    await connectDB();

    // Remove old destinations
    await Destination.deleteMany();

    // Insert new destinations
    await Destination.insertMany(destinations);

    console.log("✅ Destinations Imported Successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

importData();


