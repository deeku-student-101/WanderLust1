require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to Atlas");
}

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "69f8c65772672e65f4a4e2cb",
  }));

  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

main()
  .then(() => initDB())
  .catch((err) => console.log(err));