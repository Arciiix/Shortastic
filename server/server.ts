import express from "express";
import bodyParser from "body-parser";
import path from "path";

//Choose between SQLite (stored locally) and MongoDB (stored in cloud) here
//import { getTheURL, createTheURL } from "./sqlite";
import { getTheURL, createTheURL } from "./mongodb";
import { log } from "./log";

const app = express();
const PORT = process.env.PORT || 5434; //DEV

//DEV
//Risky and only during development
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join("build")));

const appRoutes = ["/", "/summary", "/404"];

app.post("/api/createShortenedLink", async (req, res) => {
  if (!req.body.short || !req.body.full) {
    log(`Error while creating link: noParams`, true);
    return res.send({ ok: false, error: "noParams" });
  }

  /*
  Old version:
  const urlRegExp = new RegExp(
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g
  );
  */
  const urlRegExp = new RegExp(
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/){1}[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g
  );

  const ipRegExp = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;

  //Validate the full url (or ip)
  if (!urlRegExp.test(req.body.full) && !ipRegExp.test(req.body.full)) {
    log(`Error while creating link: fullUrlIsntValid (${req.body.full})`, true);
    return res.send({ ok: false, error: "fullUrlIsntValid" });
  }

  //Validate the alias (shortcut)
  if (!new RegExp(/^[a-zA-Z0-9]+$/g).test(req.body.short)) {
    log(
      `Error while creating link: shortcutIsntValid (${req.body.short})`,
      true
    );
    return res.send({ ok: false, error: "shortcutIsntValid" });
  }

  //Check if the alias (shortcut) for the link already exist
  let rows = await getTheURL(req.body.short);
  if (rows.length !== 0) {
    log(`Error while creating link: alreadyExist (${req.body.short})`, true);
    return res.send({ ok: false, error: "alreadyExist" });
  } else {
    await createTheURL(req.body.short, req.body.full);
    return res.send({ ok: true });
  }
});

app.all(appRoutes, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get(
  "/:id",
  async (req, res): Promise<void> => {
    let shortenedLink = await getTheURL(req.params.id);

    if (shortenedLink.length === 1) {
      let fullLink: string = shortenedLink[0].fullLink;
      res.redirect(fullLink);
    } else {
      res.redirect("/404");
    }
  }
);

const server = app.listen(PORT, () => {
  log(`Server is listening on port ${PORT}`);
});
