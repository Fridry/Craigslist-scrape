const mongoose = require("mongoose");

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

async function connectToMongoose() {
  await mongoose.connect(
    `mongodb+srv://${user}:${password}@scraping-things.mdicc.mongodb.net/scrape?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  console.log("Connected👨‍💻");
}

module.exports = connectToMongoose;
