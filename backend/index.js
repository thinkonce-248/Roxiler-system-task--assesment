const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const { dbInit } = require("./controllers/InitialController");
const { listTransactions } = require("./controllers/InitialController");
const { getStatistics } = require("./controllers/InitialController");
const { getBarChart } = require("./controllers/InitialController");
const { getPieChart } = require("./controllers/InitialController");
const { getCombinedData } = require("./controllers/InitialController");
const connection = require("./config/db.config");

const PORT = process.env.PORT || 4000;
const app = express();

//middelwares
app.use(bodyParser.json());
app.use(cors());

//DB connection
connection();

//routes
app.get("/api/init", dbInit);
app.get("/api/transactions", listTransactions);
app.get("/api/statistics", getStatistics);
app.get("/api/bar-chart", getBarChart);
app.get("/api/pie-chart", getPieChart);
app.get("/api/combined-data", getCombinedData);

app.listen(PORT, () => {
  console.log(`Server started on PORT :${PORT}`);
});
