const cors = require("cors")
const express = require("express")
const employeesRoute = require("./router")
// const departmnetRoute = require("./")

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api", employeesRoute)

module.exports = app
