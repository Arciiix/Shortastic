"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
//Choose between SQLite (stored locally) and MongoDB (stored in cloud) here
//import { getTheURL, createTheURL } from "./sqlite";
const mongodb_1 = require("./mongodb");
const log_1 = require("./log");
const app = express_1.default();
const PORT = process.env.PORT || 5434; //DEV
//DEV
//Risky and only during development
const cors = require("cors");
app.use(cors());
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join("build")));
const appRoutes = ["/", "/summary", "/404"];
app.post("/api/createShortenedLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.short || !req.body.full) {
        log_1.log(`Error while creating link: noParams`, true);
        return res.send({ ok: false, error: "noParams" });
    }
    /*
    Old version:
    const urlRegExp = new RegExp(
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g
    );
    */
    const urlRegExp = new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/){1}[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g);
    const ipRegExp = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;
    //Validate the full url (or ip)
    if (!urlRegExp.test(req.body.full) && !ipRegExp.test(req.body.full)) {
        log_1.log(`Error while creating link: fullUrlIsntValid (${req.body.full})`, true);
        return res.send({ ok: false, error: "fullUrlIsntValid" });
    }
    //Validate the alias (shortcut)
    if (!new RegExp(/^[a-zA-Z0-9]+$/g).test(req.body.short)) {
        log_1.log(`Error while creating link: shortcutIsntValid (${req.body.short})`, true);
        return res.send({ ok: false, error: "shortcutIsntValid" });
    }
    //Check if the alias (shortcut) for the link already exist
    let rows = yield mongodb_1.getTheURL(req.body.short);
    if (rows.length !== 0) {
        log_1.log(`Error while creating link: alreadyExist (${req.body.short})`, true);
        return res.send({ ok: false, error: "alreadyExist" });
    }
    else {
        yield mongodb_1.createTheURL(req.body.short, req.body.full);
        return res.send({ ok: true });
    }
}));
app.all(appRoutes, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
});
app.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let shortenedLink = yield mongodb_1.getTheURL(req.params.id);
    if (shortenedLink.length === 1) {
        let fullLink = shortenedLink[0].fullLink;
        res.redirect(fullLink);
    }
    else {
        res.redirect("/404");
    }
}));
const server = app.listen(PORT, () => {
    log_1.log(`Server is listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map