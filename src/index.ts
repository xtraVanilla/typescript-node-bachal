import express from "express";
import bodyParser from "body-parser";
import { UserRoutes, LibrarianRoutes } from "./routes";
import * as dynamoose from "dynamoose";
const app = express();
const PORT = 3000;

dynamoose.aws.sdk.config.update({
  accessKeyId: "AKID",
  secretAccessKey: "SECRET",
  region: "us-east-1",
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("dist/public"));

app.use("/librarian", LibrarianRoutes);
app.use("/user", UserRoutes);

app.listen(PORT, () => {
  console.log(`infuse mini app listening at http://localhost:${PORT}/app`);
});
