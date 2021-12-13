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
  const html = `<html><body><div><h2>Infuse Mini App</h2><h2>Reverse Message Form</h2><h3>reversed string: ${reversedStr}</h3></div></body></html>`;
  return res.send(html);
});

app.listen(PORT, () => {
  console.log(`infuse mini app listening at http://localhost:${PORT}/app`);
});
