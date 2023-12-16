const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});   // iski help se jo existing deta hoga wo delete ho jaayega 
  initData.data = initData.data.map((obj)=>({
    ...obj, owner:"65794ee72ca311d535f56b79", 
  }));
  await Listing.insertMany(initData.data);  // iski help se jo data.js file se data import hua hai wo database me insert ho jaayega
  console.log("data was initialized");
  
};

initDB()
// ab hum sabse pahle cd karke init folder me jaayenge then nodemon index.js karne pe pura data database me insert ho jaayega  

// iske baad hum app.js me index route create karenge , then hum views create karenge usme listings naam se folder create karenge then usme index.ejs naam se file create karenge 


