const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

const PORT = 8080;

app.use(express.json());
app.use(express.static("public"));
app.use("/upload", express.static(path.join(__dirname, "upload")))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});