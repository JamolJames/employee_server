const cors = require("cors");
const express = require("express");
const employeesRoute = require("./routes/employees.router");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/employees", employeesRoute);

module.exports = app;
