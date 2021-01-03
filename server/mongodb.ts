import { log } from "./log";
import mongoose from "mongoose";

//Connecting to the database
if (!process.env.MONGO_URI) {
  log(
    `There is no URL to the MongoDB database server in the environment variables!`,
    true
  );
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    log(`Connected to the database successfully`);
  })
  .catch((err) => {
    log(`Error while connecting to the database: ${err}`, true);
  });

//Create model
let URLSchema = new mongoose.Schema({
  shortenedLink: String,
  fullLink: String,
  accountId: Number,
  isProtected: Boolean,
  password: String,
});
let URLModel = mongoose.model("urls", URLSchema);

function getTheURL(short: string): Promise<any> {
  return new Promise((resolve, reject) => {
    URLModel.find({ shortenedLink: short }, (err, rows) => {
      if (err) {
        log(`Error while getting data from the database: ${err}`, true);
        resolve(false);
      } else {
        resolve(rows);
      }
    });
  });
}

function createTheURL(short: string, full: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let URL = new URLModel({ shortenedLink: short, fullLink: full });
    URL.save((err) => {
      if (err) {
        log(`Error while inserting into the database: ${err}`, true);
        resolve();
      } else {
        log(`Added new link to the database`);
        resolve();
      }
    });
  });
}

export { getTheURL, createTheURL };
