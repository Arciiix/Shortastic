import express from "express";
import bodyParser from "body-parser";

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.db", (err) => {
  if (err) {
    return log(`Couldn't connect to the database: ${err}`, true);
  } else {
    log(`Connected to the database successfully`);
  }
});

const app = express();
const PORT = process.env.PORT || 5434; //DEV

app.use(bodyParser.urlencoded({ extended: true }));

const appRoutes = ["/", "/summary"];

app.post("/api/createShortenedLink", (req, res) => {
  if (!req.body.short || !req.body.full) {
    return res.sendStatus(400);
  }

  const urlRegExp = new RegExp(
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g
  );

  const ipRegExp = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;

  //Validate the full url (or ip)
  if (!urlRegExp.test(req.body.full) && !ipRegExp.test(req.body.full)) {
    return res.sendStatus(400);
  }

  //Validate the alias (shortcut)
  if (!new RegExp(/^[-a-zA-Z0-9()@:%_\+.~#//=]+$/g).test(req.body.short)) {
    return res.sendStatus(400);
  }

  res.sendStatus(200);

  console.log(req.body);
});

app.all(appRoutes, (req, res) => {
  //DEV TODO: Send the React app
  res.send("DEV TODO");
});

function log(message: string, isError?: boolean): void {
  let parsedDate = new Date().toLocaleString(); //Parse the date into one of the available formats (e.g. yyyy-MM-dd HH:mm:ss)
  if (isError) {
    console.error(`[ERROR] [${parsedDate}] ${message}`);
  } else {
    console.log(`[INFO] [${parsedDate}] ${message}`);
  }
}

const server = app.listen(PORT, () => {
  log(`Server is listening on port ${PORT}`);
});
