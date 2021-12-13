import express, { Request } from "express";
import path from "path";
import bodyParser from "body-parser";
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("dist/public"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.redirect("/app");
});

app.get("/app", (req, res) => {
  res.render("index");
});

app.post("/data", (req: Request, res) => {
  const reversedStr = req.body.message.split("").reverse().join("");
  res.send({ message: reversedStr });
});

app.listen(PORT, () => {
  console.log(`infuse mini app listening at http://localhost:${PORT}/app`);
});
